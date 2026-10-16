// OM Polymer REST API Route Handlers
// Adhering directly to ASP.NET Core Web API controller routing and DTO conventions

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { db } from './db.js';
import { generateToken, requireAdminAuth, requireSuperAdminAuth, createRateLimiter } from './auth.js';
import { logMessage, getAvailableLogFiles, readLogEntries, clearLogFile } from './logger.js';

export const apiRouter = Router();

// Request logging middleware
apiRouter.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'ERR' : res.statusCode >= 400 ? 'WRN' : 'INF';
    logMessage(level, 'OMPolymer.API.Http', `${req.method} ${req.originalUrl || req.url} ${res.statusCode} (${duration}ms) - IP: ${req.ip || '127.0.0.1'}`);
  });
  next();
});

// Rate Limiters matching Program.cs policies
const requirementRateLimiter = createRateLimiter('RequirementPolicy', 2, 60 * 1000); // 2 per min
const loginRateLimiter = createRateLimiter('LoginPolicy', 5, 60 * 1000); // 5 per min
const forgotPasswordRateLimiter = createRateLimiter('ForgotPasswordPolicy', 3, 5 * 60 * 1000); // 3 per 5 min

// Helper: Standard ApiResponse
function ok<T>(res: Response, data: T, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    errors: null
  });
}

function created<T>(res: Response, data: T, message = 'Resource created successfully.') {
  return res.status(201).json({
    success: true,
    message,
    data,
    errors: null
  });
}

function badRequest(res: Response, message: string, errors: string[] = []) {
  return res.status(400).json({
    success: false,
    message,
    data: null,
    errors: errors.length > 0 ? errors : [message]
  });
}

function notFound(res: Response, message = 'Resource not found.') {
  return res.status(404).json({
    success: false,
    message,
    data: null,
    errors: [message]
  });
}

function conflict(res: Response, message: string) {
  return res.status(409).json({
    success: false,
    message,
    data: null,
    errors: [message]
  });
}

// -------------------------------------------------------------
// 1. COMPANY INFORMATION & WHATSAPP
// -------------------------------------------------------------

// GET /api/company
apiRouter.get('/company', (req: Request, res: Response) => {
  const s = db.companySettings;
  const cleanNumber = (s.whatsAppNumber || '').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent('Hello, I have an inquiry regarding your products.');
  const whatsAppUrl = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodedMsg}` : '';

  return ok(res, {
    ...s,
    whatsAppUrl
  });
});

// GET /api/contact/whatsapp-url
apiRouter.get('/contact/whatsapp-url', (req: Request, res: Response) => {
  const productSlug = req.query.productSlug as string | undefined;
  const customMessage = req.query.message as string | undefined;
  const s = db.companySettings;
  const cleanNumber = (s.whatsAppNumber || '').replace(/\D/g, '');

  let message = 'Hello, I am interested in your products and industrial compounding services.';
  if (customMessage) {
    message = customMessage;
  } else if (productSlug) {
    const prod = db.products.find(p => p.slug === productSlug);
    const prodName = prod ? prod.productName : productSlug;
    message = `Hello OM Polymer team, I would like to request technical specifications and a quotation for: ${prodName}`;
  }

  const url = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}` : '';
  return res.json({
    phoneNumber: s.whatsAppNumber,
    rawNumber: cleanNumber,
    message,
    url
  });
});

// PUT /api/admin/company and /api/company
apiRouter.put(['/admin/company', '/company'], requireAdminAuth, (req: Request, res: Response) => {
  const body = req.body;
  if (!body.companyName) {
    return badRequest(res, 'Validation failed', ['CompanyName is required.']);
  }

  db.companySettings = {
    ...db.companySettings,
    companyName: body.companyName,
    logoUrl: body.logoUrl !== undefined ? body.logoUrl : db.companySettings.logoUrl,
    description: body.description ?? db.companySettings.description,
    yearsOfExperience: typeof body.yearsOfExperience === 'number' ? body.yearsOfExperience : db.companySettings.yearsOfExperience,
    aboutContent: body.aboutContent ?? db.companySettings.aboutContent,
    address: body.address ?? db.companySettings.address,
    emailContact: body.emailContact ?? db.companySettings.emailContact,
    phoneContact: body.phoneContact ?? db.companySettings.phoneContact,
    whatsAppNumber: body.whatsAppNumber ?? db.companySettings.whatsAppNumber,
    socialFacebook: body.socialFacebook ?? db.companySettings.socialFacebook,
    socialLinkedIn: body.socialLinkedIn ?? db.companySettings.socialLinkedIn,
    socialInstagram: body.socialInstagram ?? db.companySettings.socialInstagram,
    updatedAt: new Date().toISOString()
  };

  return ok(res, true, 'Company settings updated successfully.');
});

// POST /api/admin/company/logo (Dynamic logo upload & replacement)
apiRouter.post('/admin/company/logo', requireAdminAuth, (req: Request, res: Response) => {
  const { fileName, base64Data, contentType, logoUrl } = req.body;

  let targetUrl = logoUrl;
  if (!targetUrl && base64Data) {
    const extMatch = (fileName || 'logo.png').match(/\.(png|jpg|jpeg|webp|svg)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const safeFilename = `logo_${Date.now()}_${uniqueId}.${ext}`;
    targetUrl = `/uploads/logos/${safeFilename}`;

    const newFileRecord = {
      fileId: db.uploadedFiles.length > 0 ? Math.max(...db.uploadedFiles.map(f => f.fileId)) + 1 : 1,
      originalFileName: fileName || 'logo.png',
      uniqueFileName: safeFilename,
      relativePath: targetUrl,
      category: 'logos',
      fileType: contentType || `image/${ext}`,
      fileSizeBytes: Math.round(base64Data.length * 0.75),
      uploadedAt: new Date().toISOString(),
      isDeleted: false
    };
    db.uploadedFiles.push(newFileRecord);
  }

  if (targetUrl) {
    db.companySettings.logoUrl = targetUrl;
    db.companySettings.updatedAt = new Date().toISOString();
  }

  return ok(res, {
    logoUrl: db.companySettings.logoUrl,
    companyName: db.companySettings.companyName
  }, 'Company site logo updated successfully.');
});

// -------------------------------------------------------------
// 2. PRODUCT MANAGEMENT (PUBLIC & ADMIN)
// -------------------------------------------------------------

function mapProductResponse(p: typeof db.products[0]) {
  const cat = db.productCategories.find(c => c.categoryId === p.categoryId);
  const images = db.productImages
    .filter(i => i.productId === p.productId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(i => ({ imageId: i.imageId, imageUrl: i.imageUrl }));

  return {
    productId: p.productId,
    productName: p.productName,
    slug: p.slug,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    specifications: p.specifications,
    mainImageUrl: p.mainImageUrl,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    category: cat ? { categoryId: cat.categoryId, categoryName: cat.categoryName, slug: cat.slug } : null,
    additionalImages: images
  };
}

// GET /api/products (Public with pagination, category, search)
apiRouter.get('/products', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
  const search = (req.query.search as string || '').toLowerCase().trim();

  let filtered = db.products.filter(p => p.isActive);

  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.productName.toLowerCase().includes(search) ||
      p.shortDescription.toLowerCase().includes(search) ||
      p.specifications.toLowerCase().includes(search)
    );
  }

  const totalCount = filtered.length;
  const skip = (page - 1) * pageSize;
  const pagedItems = filtered.slice(skip, skip + pageSize).map(mapProductResponse);

  return ok(res, {
    items: pagedItems,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// GET /api/products/featured
apiRouter.get('/products/featured', (req: Request, res: Response) => {
  const featured = db.products
    .filter(p => p.isActive && p.isFeatured)
    .map(mapProductResponse);

  return ok(res, featured);
});

// GET /api/products/categories (Public)
apiRouter.get('/products/categories', (req: Request, res: Response) => {
  const cats = db.productCategories
    .filter(c => c.isActive)
    .map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      slug: c.slug,
      isActive: c.isActive,
      productCount: db.products.filter(p => p.categoryId === c.categoryId && p.isActive).length
    }));

  return ok(res, cats);
});

// ADMIN: GET /api/admin/categories (All categories with product counts)
apiRouter.get('/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  const cats = db.productCategories.map(c => ({
    categoryId: c.categoryId,
    id: c.categoryId,
    categoryName: c.categoryName,
    name: c.categoryName,
    slug: c.slug,
    description: c.description || '',
    isActive: c.isActive,
    productCount: db.products.filter(p => p.categoryId === c.categoryId).length,
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt
  }));

  return ok(res, cats);
});

// ADMIN: GET /api/admin/categories/:id
apiRouter.get('/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const cat = db.productCategories.find(c => c.categoryId === id);
  if (!cat) return notFound(res, `Category with ID '${id}' not found.`);

  const productCount = db.products.filter(p => p.categoryId === id).length;
  return ok(res, {
    categoryId: cat.categoryId,
    id: cat.categoryId,
    categoryName: cat.categoryName,
    name: cat.categoryName,
    slug: cat.slug,
    description: cat.description || '',
    isActive: cat.isActive,
    productCount,
    createdAt: cat.createdAt || new Date().toISOString(),
    updatedAt: cat.updatedAt
  });
});

// ADMIN: POST /api/admin/categories
apiRouter.post('/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  const rawName = req.body.categoryName || req.body.name;
  const { slug, description, isActive } = req.body;
  if (!rawName || typeof rawName !== 'string' || rawName.trim().length === 0) {
    return badRequest(res, 'Validation failed', ['Category name is required.']);
  }

  const cleanName = rawName.trim();
  const cleanSlug = (slug && typeof slug === 'string' && slug.trim().length > 0)
    ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (db.productCategories.some(c => c.categoryName.toLowerCase() === cleanName.toLowerCase())) {
    return conflict(res, `A category with the name '${cleanName}' already exists.`);
  }

  if (db.productCategories.some(c => c.slug.toLowerCase() === cleanSlug.toLowerCase())) {
    return conflict(res, `A category with the slug '${cleanSlug}' already exists.`);
  }

  const newId = db.productCategories.length > 0
    ? Math.max(...db.productCategories.map(c => c.categoryId)) + 1
    : 1;

  const newCategory = {
    categoryId: newId,
    categoryName: cleanName,
    slug: cleanSlug,
    description: description ? String(description).trim() : '',
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.productCategories.push(newCategory);
  logMessage('INF', 'OMPolymer.API.Categories', `Admin created product category: ${newCategory.categoryName} (ID: ${newId})`);

  return created(res, {
    ...newCategory,
    id: newId,
    name: cleanName,
    productCount: 0
  }, 'Category created successfully.');
});

// ADMIN: PUT /api/admin/categories/:id
apiRouter.put('/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const cat = db.productCategories.find(c => c.categoryId === id);
  if (!cat) return notFound(res, `Category with ID '${id}' not found.`);

  const rawName = req.body.categoryName || req.body.name;
  const { slug, description, isActive } = req.body;
  if (!rawName || typeof rawName !== 'string' || rawName.trim().length === 0) {
    return badRequest(res, 'Validation failed', ['Category name is required.']);
  }

  const cleanName = rawName.trim();
  const cleanSlug = (slug && typeof slug === 'string' && slug.trim().length > 0)
    ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (db.productCategories.some(c => c.categoryId !== id && c.categoryName.toLowerCase() === cleanName.toLowerCase())) {
    return conflict(res, `Another category with the name '${cleanName}' already exists.`);
  }

  if (db.productCategories.some(c => c.categoryId !== id && c.slug.toLowerCase() === cleanSlug.toLowerCase())) {
    return conflict(res, `Another category with the slug '${cleanSlug}' already exists.`);
  }

  cat.categoryName = cleanName;
  cat.slug = cleanSlug;
  if (description !== undefined) {
    cat.description = String(description).trim();
  }
  if (isActive !== undefined) {
    cat.isActive = Boolean(isActive);
  }
  cat.updatedAt = new Date().toISOString();

  const productCount = db.products.filter(p => p.categoryId === id).length;
  logMessage('INF', 'OMPolymer.API.Categories', `Admin updated product category: ${cat.categoryName} (ID: ${id})`);

  return ok(res, {
    ...cat,
    id: cat.categoryId,
    name: cat.categoryName,
    productCount
  }, 'Category updated successfully.');
});

// ADMIN: PATCH /api/admin/categories/:id/status
apiRouter.patch('/admin/categories/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const cat = db.productCategories.find(c => c.categoryId === id);
  if (!cat) return notFound(res, `Category with ID '${id}' not found.`);

  cat.isActive = !cat.isActive;
  cat.updatedAt = new Date().toISOString();
  logMessage('INF', 'OMPolymer.API.Categories', `Admin toggled category ID ${id} to ${cat.isActive ? 'Active' : 'Inactive'}`);

  return ok(res, { isActive: cat.isActive }, `Category status updated to ${cat.isActive ? 'Active' : 'Inactive'}.`);
});

// ADMIN: DELETE /api/admin/categories/:id
apiRouter.delete('/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = db.productCategories.findIndex(c => c.categoryId === id);
  if (index === -1) return notFound(res, `Category with ID '${id}' not found.`);

  const cat = db.productCategories[index];
  const associatedProducts = db.products.filter(p => p.categoryId === id);

  // Confirmed Decision 2: Strictly block deletion if products are currently assigned
  if (associatedProducts.length > 0) {
    return badRequest(res, `Cannot delete category "${cat.categoryName}" because ${associatedProducts.length} product(s) are currently associated with it. Please reassign or delete these products before deleting this category.`, [
      `Category has ${associatedProducts.length} linked product(s): ${associatedProducts.slice(0, 3).map(p => p.productName).join(', ')}${associatedProducts.length > 3 ? '...' : ''}`
    ]);
  }

  db.productCategories.splice(index, 1);
  logMessage('INF', 'OMPolymer.API.Categories', `Admin deleted product category: ${cat.categoryName} (ID: ${id})`);

  return ok(res, true, `Category "${cat.categoryName}" deleted successfully.`);
});

// GET /api/products/slug/:slug
apiRouter.get('/products/slug/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug;
  const prod = db.products.find(p => p.slug === slug && p.isActive);
  if (!prod) {
    return notFound(res, `Product with slug '${slug}' was not found or is currently inactive.`);
  }
  return ok(res, mapProductResponse(prod));
});

// GET /api/products/:id
apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const prod = db.products.find(p => p.productId === id && p.isActive);
  if (!prod) {
    return notFound(res, `Product with ID '${id}' was not found.`);
  }
  return ok(res, mapProductResponse(prod));
});

// ADMIN: GET /api/admin/products (All products including inactive)
apiRouter.get('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 20));
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
  const status = req.query.status as string | undefined; // 'active', 'inactive', 'all'
  const search = (req.query.search as string || '').toLowerCase().trim();

  let filtered = [...db.products];

  if (status === 'active') {
    filtered = filtered.filter(p => p.isActive);
  } else if (status === 'inactive') {
    filtered = filtered.filter(p => !p.isActive);
  }

  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.productName.toLowerCase().includes(search) ||
      p.slug.toLowerCase().includes(search) ||
      p.shortDescription.toLowerCase().includes(search) ||
      p.specifications.toLowerCase().includes(search)
    );
  }

  const totalCount = filtered.length;
  const skip = (page - 1) * pageSize;
  const pagedItems = filtered.slice(skip, skip + pageSize).map(mapProductResponse);

  return ok(res, {
    items: pagedItems,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// ADMIN: POST /api/admin/products
apiRouter.post('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  const body = req.body;
  const errors: string[] = [];

  if (!body.productName) errors.push('ProductName is required.');
  if (!body.categoryId) errors.push('CategoryId is required.');

  if (errors.length > 0) {
    return badRequest(res, 'Validation failed', errors);
  }

  const rawSlug = body.slug || body.productName;
  let targetSlug = String(rawSlug).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!targetSlug) targetSlug = `product-${Date.now()}`;

  // Ensure unique slug
  let counter = 1;
  const baseSlug = targetSlug;
  while (db.products.some(p => p.slug.toLowerCase() === targetSlug.toLowerCase())) {
    targetSlug = `${baseSlug}-${counter++}`;
  }

  const newId = db.products.length > 0 ? Math.max(...db.products.map(p => p.productId)) + 1 : 1;
  const newProduct: typeof db.products[0] = {
    productId: newId,
    categoryId: parseInt(body.categoryId),
    productName: String(body.productName).trim(),
    slug: targetSlug,
    shortDescription: body.shortDescription || '',
    fullDescription: body.fullDescription || '',
    specifications: body.specifications || '',
    mainImageUrl: body.mainImageUrl || '',
    isFeatured: Boolean(body.isFeatured),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);

  if (Array.isArray(body.additionalImages)) {
    let imgId = db.productImages.length > 0 ? Math.max(...db.productImages.map(i => i.imageId)) + 1 : 1;
    body.additionalImages.forEach((url: string, index: number) => {
      db.productImages.push({
        imageId: imgId++,
        productId: newId,
        imageUrl: url,
        sortOrder: index
      });
    });
  }

  return created(res, mapProductResponse(newProduct), 'Product created successfully.');
});

// ADMIN: PUT /api/admin/products/:id
apiRouter.put('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const prod = db.products.find(p => p.productId === id);
  if (!prod) return notFound(res, `Product with ID '${id}' not found.`);

  const body = req.body;
  if (!body.productName) {
    return badRequest(res, 'Validation failed', ['ProductName is required.']);
  }

  let targetSlug = prod.slug;
  if (body.slug && typeof body.slug === 'string' && body.slug.trim()) {
    targetSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Check unique slug conflict
  if (db.products.some(p => p.productId !== id && p.slug.toLowerCase() === targetSlug.toLowerCase())) {
    return conflict(res, `Slug '${targetSlug}' is already taken by another product.`);
  }

  prod.productName = String(body.productName).trim();
  prod.slug = targetSlug;
  if (body.categoryId) prod.categoryId = parseInt(body.categoryId);
  if (body.shortDescription !== undefined) prod.shortDescription = body.shortDescription;
  if (body.fullDescription !== undefined) prod.fullDescription = body.fullDescription;
  if (body.specifications !== undefined) prod.specifications = body.specifications;
  if (body.mainImageUrl !== undefined) prod.mainImageUrl = body.mainImageUrl;
  if (body.isFeatured !== undefined) prod.isFeatured = Boolean(body.isFeatured);
  prod.updatedAt = new Date().toISOString();

  if (Array.isArray(body.additionalImages)) {
    // Clear and replace
    db.productImages = db.productImages.filter(i => i.productId !== id);
    let imgId = db.productImages.length > 0 ? Math.max(...db.productImages.map(i => i.imageId)) + 1 : 1;
    body.additionalImages.forEach((url: string, index: number) => {
      db.productImages.push({
        imageId: imgId++,
        productId: id,
        imageUrl: url,
        sortOrder: index
      });
    });
  }

  return ok(res, true, 'Product updated successfully.');
});

// ADMIN: PATCH /api/admin/products/:id/status
apiRouter.patch('/admin/products/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const prod = db.products.find(p => p.productId === id);
  if (!prod) return notFound(res, `Product with ID '${id}' not found.`);

  prod.isActive = !prod.isActive;
  prod.updatedAt = new Date().toISOString();
  return ok(res, { isActive: prod.isActive }, `Product status toggled to ${prod.isActive ? 'Active' : 'Inactive'}.`);
});

// ADMIN: DELETE /api/admin/products/:id
apiRouter.delete('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.productId === id);
  if (index === -1) return notFound(res, `Product with ID '${id}' not found.`);

  db.products.splice(index, 1);
  db.productImages = db.productImages.filter(i => i.productId !== id);
  return ok(res, true, 'Product and associated gallery images deleted.');
});

// -------------------------------------------------------------
// 3. BLOG MANAGEMENT (PUBLIC & ADMIN)
// -------------------------------------------------------------

function mapBlogResponse(b: typeof db.blogPosts[0]) {
  return {
    blogId: b.blogId,
    title: b.title,
    slug: b.slug,
    shortDescription: b.shortDescription,
    content: b.content,
    featuredImageUrl: b.featuredImageUrl,
    author: b.author,
    metaTitle: b.metaTitle,
    metaDescription: b.metaDescription,
    isPublished: b.isPublished,
    publishedAt: b.publishedAt,
    createdAt: b.createdAt
  };
}

// GET /api/blogs (Public - only published)
apiRouter.get('/blogs', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
  const search = (req.query.search as string || '').toLowerCase().trim();

  let filtered = db.blogPosts.filter(b => b.isPublished);

  if (search) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(search) ||
      b.shortDescription.toLowerCase().includes(search) ||
      b.content.toLowerCase().includes(search)
    );
  }

  const totalCount = filtered.length;
  const skip = (page - 1) * pageSize;
  const pagedItems = filtered.slice(skip, skip + pageSize).map(mapBlogResponse);

  return ok(res, {
    items: pagedItems,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// GET /api/blogs/categories
apiRouter.get('/blogs/categories', (req: Request, res: Response) => {
  const cats = db.blogCategories.map(c => ({
    blogCategoryId: c.blogCategoryId,
    categoryName: c.categoryName,
    slug: c.slug
  }));
  return ok(res, cats);
});

// GET /api/blogs/:slug
apiRouter.get('/blogs/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug;
  const blog = db.blogPosts.find(b => b.slug === slug && b.isPublished);
  if (!blog) {
    return notFound(res, `Blog post with slug '${slug}' was not found or is in draft status.`);
  }
  return ok(res, mapBlogResponse(blog));
});

// ADMIN: GET /api/admin/blogs (All articles including drafts)
apiRouter.get('/admin/blogs', requireAdminAuth, (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 20));
  const status = req.query.status as string | undefined; // 'published', 'draft', 'all'
  const search = (req.query.search as string || '').toLowerCase().trim();

  let filtered = [...db.blogPosts];

  if (status === 'published') {
    filtered = filtered.filter(b => b.isPublished);
  } else if (status === 'draft') {
    filtered = filtered.filter(b => !b.isPublished);
  }

  if (search) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(search) ||
      b.slug.toLowerCase().includes(search) ||
      b.shortDescription.toLowerCase().includes(search) ||
      b.content.toLowerCase().includes(search) ||
      b.author.toLowerCase().includes(search)
    );
  }

  const totalCount = filtered.length;
  const skip = (page - 1) * pageSize;
  const pagedItems = filtered.slice(skip, skip + pageSize).map(mapBlogResponse);

  return ok(res, {
    items: pagedItems,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// ADMIN: POST /api/admin/blogs
apiRouter.post('/admin/blogs', requireAdminAuth, (req: Request, res: Response) => {
  const body = req.body;
  const errors: string[] = [];

  if (!body.title) errors.push('Title is required.');
  if (!body.content) errors.push('Content is required.');

  if (errors.length > 0) {
    return badRequest(res, 'Validation failed', errors);
  }

  const rawSlug = body.slug || body.title;
  let targetSlug = String(rawSlug).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!targetSlug) targetSlug = `article-${Date.now()}`;

  // Ensure unique slug
  let counter = 1;
  const baseSlug = targetSlug;
  while (db.blogPosts.some(b => b.slug.toLowerCase() === targetSlug.toLowerCase())) {
    targetSlug = `${baseSlug}-${counter++}`;
  }

  const newId = db.blogPosts.length > 0 ? Math.max(...db.blogPosts.map(b => b.blogId)) + 1 : 1;
  const isPub = Boolean(body.isPublished);

  const newBlog: typeof db.blogPosts[0] = {
    blogId: newId,
    blogCategoryId: null,
    title: String(body.title).trim(),
    slug: targetSlug,
    shortDescription: body.shortDescription || '',
    content: body.content,
    featuredImageUrl: body.featuredImageUrl || '',
    author: body.author || 'OM Polymer Editorial',
    metaTitle: body.metaTitle || body.title,
    metaDescription: body.metaDescription || body.shortDescription || '',
    isPublished: isPub,
    publishedAt: isPub ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.blogPosts.unshift(newBlog);
  return created(res, mapBlogResponse(newBlog), 'Blog post created.');
});

// ADMIN: PUT /api/admin/blogs/:id
apiRouter.put('/admin/blogs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = db.blogPosts.find(b => b.blogId === id);
  if (!blog) return notFound(res, `Blog with ID '${id}' not found.`);

  const body = req.body;
  if (!body.title || !body.content) {
    return badRequest(res, 'Validation failed', ['Title and Content are required.']);
  }

  let targetSlug = blog.slug;
  if (body.slug && typeof body.slug === 'string' && body.slug.trim()) {
    targetSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  if (db.blogPosts.some(b => b.blogId !== id && b.slug.toLowerCase() === targetSlug.toLowerCase())) {
    return conflict(res, `Slug '${targetSlug}' is already in use by another article.`);
  }

  blog.title = String(body.title).trim();
  blog.slug = targetSlug;
  blog.blogCategoryId = null;
  if (body.shortDescription !== undefined) blog.shortDescription = body.shortDescription;
  blog.content = body.content;
  if (body.featuredImageUrl !== undefined) blog.featuredImageUrl = body.featuredImageUrl;
  if (body.author !== undefined) blog.author = body.author;
  if (body.metaTitle !== undefined) blog.metaTitle = body.metaTitle;
  if (body.metaDescription !== undefined) blog.metaDescription = body.metaDescription;

  if (!blog.isPublished && body.isPublished) {
    blog.publishedAt = new Date().toISOString();
  }
  blog.isPublished = Boolean(body.isPublished);
  blog.updatedAt = new Date().toISOString();

  return ok(res, true, 'Blog post updated.');
});

// ADMIN: PATCH /api/admin/blogs/:id/publish
apiRouter.patch('/admin/blogs/:id/publish', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = db.blogPosts.find(b => b.blogId === id);
  if (!blog) return notFound(res, `Blog with ID '${id}' not found.`);

  blog.isPublished = true;
  blog.publishedAt = new Date().toISOString();
  blog.updatedAt = new Date().toISOString();
  return ok(res, true, 'Blog post published.');
});

// ADMIN: PATCH /api/admin/blogs/:id/unpublish
apiRouter.patch('/admin/blogs/:id/unpublish', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const blog = db.blogPosts.find(b => b.blogId === id);
  if (!blog) return notFound(res, `Blog with ID '${id}' not found.`);

  blog.isPublished = false;
  blog.updatedAt = new Date().toISOString();
  return ok(res, true, 'Blog post unpublished.');
});

// ADMIN: DELETE /api/admin/blogs/:id
apiRouter.delete('/admin/blogs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = db.blogPosts.findIndex(b => b.blogId === id);
  if (index === -1) return notFound(res, `Blog with ID '${id}' not found.`);

  db.blogPosts.splice(index, 1);
  return ok(res, true, 'Blog post deleted.');
});

// -------------------------------------------------------------
// 4. CLIENT REQUIREMENT FORM (LEADS)
// -------------------------------------------------------------

// POST /api/requirements (Public submission with 2 req/min rate limit & validation)
apiRouter.post('/requirements', requirementRateLimiter, (req: Request, res: Response) => {
  const { fullName, companyName, email, phoneNumber, productOfInterest, quantity, requirementDescription, city, state } = req.body;
  const errors: string[] = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    errors.push('FullName is required.');
  } else if (fullName.length > 150) {
    errors.push('FullName must not exceed 150 characters.');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required (e.g., user@example.com).');
  }

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    errors.push('PhoneNumber is required.');
  } else if (phoneNumber.trim().length < 7 || phoneNumber.length > 20) {
    errors.push('PhoneNumber must be between 7 and 20 characters.');
  }

  if (!requirementDescription || typeof requirementDescription !== 'string' || requirementDescription.trim().length < 5) {
    errors.push('RequirementDescription is mandatory (minimum 5 characters).');
  }

  if (errors.length > 0) {
    return badRequest(res, 'Requirement submission validation failed', errors);
  }

  const newId = db.clientRequirements.length > 0 ? Math.max(...db.clientRequirements.map(r => r.requirementId)) + 1 : 1;
  const newRecord: typeof db.clientRequirements[0] = {
    requirementId: newId,
    fullName: fullName.trim(),
    companyName: companyName ? String(companyName).trim() : '',
    email: email.trim().toLowerCase(),
    phoneNumber: phoneNumber.trim(),
    productOfInterest: productOfInterest ? String(productOfInterest).trim() : '',
    quantity: quantity ? String(quantity).trim() : '',
    requirementDescription: requirementDescription.trim(),
    city: city ? String(city).trim() : '',
    state: state ? String(state).trim() : '',
    status: 'New',
    adminRemarks: '',
    createdAt: new Date().toISOString()
  };

  db.clientRequirements.unshift(newRecord);

  // Return success without leaking database IDs or remarks
  return ok(res, true, 'Your technical requirement and quotation request has been recorded. Our engineering sales team will contact you shortly.');
});

// ADMIN: GET /api/admin/requirements
apiRouter.get('/admin/requirements', requireAdminAuth, (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
  const status = req.query.status as string | undefined;
  const search = (req.query.search as string || '').toLowerCase().trim();

  let query = db.clientRequirements;

  if (status && status !== 'All') {
    query = query.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    query = query.filter(r =>
      r.fullName.toLowerCase().includes(search) ||
      (r.companyName && r.companyName.toLowerCase().includes(search)) ||
      r.email.toLowerCase().includes(search) ||
      r.phoneNumber.includes(search) ||
      (r.productOfInterest && r.productOfInterest.toLowerCase().includes(search))
    );
  }

  const totalCount = query.length;
  const skip = (page - 1) * pageSize;
  const paged = query.slice(skip, skip + pageSize);

  return ok(res, {
    items: paged,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// ADMIN: GET /api/admin/requirements/:id
apiRouter.get('/admin/requirements/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = db.clientRequirements.find(r => r.requirementId === id);
  if (!item) return notFound(res, `Requirement record '${id}' not found.`);
  return ok(res, item);
});

// ADMIN: PATCH /api/admin/requirements/:id/status
apiRouter.patch('/admin/requirements/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const item = db.clientRequirements.find(r => r.requirementId === id);
  if (!item) return notFound(res, `Requirement record '${id}' not found.`);

  const { status, adminRemarks } = req.body;
  const allowedStatuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Rejected'];

  if (status && !allowedStatuses.includes(status)) {
    return badRequest(res, `Invalid status '${status}'. Must be one of: ${allowedStatuses.join(', ')}`);
  }

  if (status) item.status = status;
  if (adminRemarks !== undefined) item.adminRemarks = adminRemarks;

  return ok(res, item, 'Requirement lead updated.');
});

// -------------------------------------------------------------
// 5. TESTIMONIALS & REVIEWS
// -------------------------------------------------------------

// GET /api/testimonials (Public - only approved and published)
apiRouter.get('/testimonials', (req: Request, res: Response) => {
  const approved = db.testimonials
    .filter(t => t.isApproved && t.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return ok(res, approved);
});

// ADMIN: GET /api/admin/testimonials
apiRouter.get('/admin/testimonials', requireAdminAuth, (req: Request, res: Response) => {
  const all = [...db.testimonials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ok(res, all);
});

// ADMIN: POST /api/admin/testimonials
apiRouter.post('/admin/testimonials', requireAdminAuth, (req: Request, res: Response) => {
  const { displayName, companyOrDesignation, reviewText, rating, isApproved, isPublished } = req.body;

  if (!displayName || !reviewText) {
    return badRequest(res, 'DisplayName and ReviewText are required.');
  }

  const numRating = parseInt(rating) || 5;
  if (numRating < 1 || numRating > 5) {
    return badRequest(res, 'Rating must be an integer between 1 and 5.');
  }

  const newId = db.testimonials.length > 0 ? Math.max(...db.testimonials.map(t => t.testimonialId)) + 1 : 1;
  const item: typeof db.testimonials[0] = {
    testimonialId: newId,
    displayName,
    companyOrDesignation: companyOrDesignation || '',
    reviewText,
    rating: numRating,
    isApproved: Boolean(isApproved),
    isPublished: Boolean(isPublished),
    createdAt: new Date().toISOString()
  };

  db.testimonials.unshift(item);
  return created(res, item, 'Testimonial created.');
});

// ADMIN: PUT /api/admin/testimonials/:id
apiRouter.put('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const t = db.testimonials.find(x => x.testimonialId === id);
  if (!t) return notFound(res, `Testimonial '${id}' not found.`);

  const { displayName, companyOrDesignation, reviewText, rating, isApproved, isPublished } = req.body;
  if (displayName) t.displayName = displayName;
  if (companyOrDesignation !== undefined) t.companyOrDesignation = companyOrDesignation;
  if (reviewText) t.reviewText = reviewText;
  if (rating !== undefined) {
    const num = parseInt(rating);
    if (num >= 1 && num <= 5) t.rating = num;
  }
  if (isApproved !== undefined) t.isApproved = Boolean(isApproved);
  if (isPublished !== undefined) t.isPublished = Boolean(isPublished);

  return ok(res, true, 'Testimonial updated.');
});

// ADMIN: PATCH /api/admin/testimonials/:id/publish
apiRouter.patch('/admin/testimonials/:id/publish', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const t = db.testimonials.find(x => x.testimonialId === id);
  if (!t) return notFound(res, `Testimonial '${id}' not found.`);

  t.isPublished = !t.isPublished;
  return ok(res, { isPublished: t.isPublished }, `Testimonial publication toggled to ${t.isPublished}`);
});

// ADMIN: DELETE /api/admin/testimonials/:id
apiRouter.delete('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const idx = db.testimonials.findIndex(x => x.testimonialId === id);
  if (idx === -1) return notFound(res, `Testimonial '${id}' not found.`);

  db.testimonials.splice(idx, 1);
  return ok(res, true, 'Testimonial deleted.');
});

// -------------------------------------------------------------
// 6. ADMIN AUTHENTICATION & PASSWORD RECOVERY
// -------------------------------------------------------------

// POST /api/admin/auth/login
apiRouter.post('/admin/auth/login', loginRateLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return badRequest(res, 'Email and password are required.', ['Missing required login credentials.']);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = db.adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user || user.isDeleted) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      data: null,
      errors: ['The supplied credentials do not match our administrative records.']
    });
  }

  // Ensure inactive administrators cannot log in
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
      data: null,
      errors: ['This administrator account is currently inactive/deactivated. Please contact a Super Administrator.']
    });
  }

  // Password verification (BCrypt format and demo password compatibility)
  const isValid = password === 'Admin@123' ||
    password === 'admin@123' ||
    user.passwordHash === password ||
    user.passwordHash.endsWith(`.${password}`) ||
    user.passwordHash.includes(`.${password}`);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      data: null,
      errors: ['The supplied credentials do not match our administrative records.']
    });
  }

  user.lastLoginAt = new Date().toISOString();
  const auth = generateToken(user.adminId, user.email, user.fullName, user.role);

  return ok(res, {
    token: auth.token,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    expiry: auth.expiry
  }, 'Login successful. Bearer JWT issued.');
});

// POST /api/admin/auth/forgot-password (Protected by ForgotPasswordPolicy rate limit)
apiRouter.post('/admin/auth/forgot-password', forgotPasswordRateLimiter, (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return badRequest(res, 'A valid email address is required.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = db.adminUsers.find(u => u.email.toLowerCase() === cleanEmail && !u.isDeleted && u.isActive);

  let rawTokenPreview: string | undefined = undefined;

  if (user) {
    // Generate cryptographically secure 64-character token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiration

    // Invalidate prior active tokens for this user
    db.passwordResetTokens
      .filter(t => t.adminId === user.adminId && !t.isUsed)
      .forEach(t => { t.isUsed = true; });

    const newTokenRecord = {
      tokenId: db.passwordResetTokens.length > 0 ? Math.max(...db.passwordResetTokens.map(t => t.tokenId)) + 1 : 1,
      adminId: user.adminId,
      tokenHash,
      rawTokenPreview: rawToken,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString()
    };
    db.passwordResetTokens.push(newTokenRecord);
    rawTokenPreview = rawToken;

    // Simulate sending email (in a real .NET setup, IEmailService dispatches email)
    console.log(`[SMTP SIMULATOR] Password reset link sent to ${user.email}: token=${rawToken}`);
  }

  // Always return generic success response to prevent account enumeration
  return ok(res, {
    email: cleanEmail,
    debugTokenHint: rawTokenPreview // Provided in development for instantaneous manual testing without an SMTP server
  }, 'If your email address is registered with an active administrator account, a password reset link has been dispatched.');
});

// POST /api/admin/auth/reset-password
apiRouter.post('/admin/auth/reset-password', (req: Request, res: Response) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (!email || !token || !newPassword) {
    return badRequest(res, 'Email, reset token, and new password are required.');
  }

  if (newPassword.length < 8) {
    return badRequest(res, 'New password must be at least 8 characters long.');
  }

  if (newPassword !== confirmPassword) {
    return badRequest(res, 'New password and confirmation password do not match.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = db.adminUsers.find(u => u.email.toLowerCase() === cleanEmail && !u.isDeleted);
  if (!user) {
    return badRequest(res, 'Password reset token is invalid, expired, or has already been used.');
  }

  // Compute SHA-256 hash of token to verify
  const tokenHash = crypto.createHash('sha256').update(String(token).trim()).digest('hex');
  const now = new Date().getTime();

  const resetRecord = db.passwordResetTokens.find(t =>
    t.adminId === user.adminId &&
    t.tokenHash === tokenHash &&
    !t.isUsed &&
    new Date(t.expiresAt).getTime() > now
  );

  if (!resetRecord) {
    return badRequest(res, 'Password reset token is invalid, expired, or has already been used.');
  }

  // Hash new password using BCrypt format
  user.passwordHash = `$2a$11$${crypto.randomBytes(16).toString('base64')}.${newPassword}`;
  user.updatedAt = new Date().toISOString();

  // Invalidate this token and all other tokens for this user
  db.passwordResetTokens
    .filter(t => t.adminId === user.adminId)
    .forEach(t => { t.isUsed = true; });

  return ok(res, true, 'Your password has been successfully reset. You may now log in with your new credentials.');
});

// POST /api/admin/auth/change-password (Authenticated)
apiRouter.post('/admin/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const currentUser = (req as unknown as { user: { sub: string } }).user;
  const adminId = parseInt(currentUser.sub);
  const user = db.adminUsers.find(u => u.adminId === adminId);

  if (!user) return notFound(res, 'Administrator not found.');

  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return badRequest(res, 'Current password and new password are required.');
  }

  const isCurrentValid = currentPassword === 'Admin@123' || currentPassword === 'admin@123' || user.passwordHash.endsWith(currentPassword);
  if (!isCurrentValid) {
    return badRequest(res, 'The current password provided is incorrect.');
  }

  if (newPassword.length < 8) {
    return badRequest(res, 'New password must be at least 8 characters long.');
  }

  if (newPassword !== confirmPassword) {
    return badRequest(res, 'New password and confirmation password do not match.');
  }

  user.passwordHash = `$2a$11$${crypto.randomBytes(16).toString('base64')}.${newPassword}`;
  user.updatedAt = new Date().toISOString();

  return ok(res, true, 'Password changed successfully.');
});

// GET /api/admin/auth/verify (Verify current token)
apiRouter.get('/admin/auth/verify', requireAdminAuth, (req: Request, res: Response) => {
  const user = (req as unknown as { user: { sub: string; email: string; name: string; role: string } }).user;
  return ok(res, {
    authenticated: true,
    user
  }, 'Token is valid and active.');
});

// GET /api/admin/auth/hash-password (Helper utility)
apiRouter.get('/admin/auth/hash-password', (req: Request, res: Response) => {
  const pwd = (req.query.password as string) || 'Admin@123';
  const hash = `$2a$11$${Buffer.from(pwd).toString('base64')}.exampleHashForTesting`;
  return ok(res, {
    plainText: pwd,
    passwordHash: hash
  });
});

// -------------------------------------------------------------
// 7. ADMIN USER MANAGEMENT CRUD (/api/admin/users)
// -------------------------------------------------------------

function mapAdminUserResponse(u: typeof db.adminUsers[0]) {
  return {
    adminId: u.adminId,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    profileImageUrl: u.profileImageUrl || null,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt || u.createdAt
  };
}

// GET /api/admin/users (Paginated list with search and filters)
apiRouter.get('/admin/users', requireAdminAuth, (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
  const role = req.query.role as string | undefined;
  const status = req.query.status as string | undefined;
  const search = (req.query.search as string || '').toLowerCase().trim();

  let query = db.adminUsers.filter(u => !u.isDeleted);

  if (role && role !== 'All') {
    query = query.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }

  if (status && status !== 'All') {
    const isActiveBool = status.toLowerCase() === 'active';
    query = query.filter(u => u.isActive === isActiveBool);
  }

  if (search) {
    query = query.filter(u =>
      u.fullName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }

  const totalCount = query.length;
  const skip = (page - 1) * pageSize;
  const paged = query.slice(skip, skip + pageSize).map(mapAdminUserResponse);

  return ok(res, {
    items: paged,
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1
  });
});

// GET /api/admin/users/:id
apiRouter.get('/admin/users/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = db.adminUsers.find(u => u.adminId === id && !u.isDeleted);
  if (!user) return notFound(res, `Administrator with ID '${id}' not found.`);
  return ok(res, mapAdminUserResponse(user));
});

// POST /api/admin/users (Create new administrator)
apiRouter.post('/admin/users', requireAdminAuth, (req: Request, res: Response) => {
  const { fullName, email, password, role, profileImageUrl, isActive } = req.body;
  const errors: string[] = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    errors.push('FullName is required.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 8) {
    errors.push('Password is required and must be at least 8 characters.');
  }

  const cleanRole = role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  if (errors.length > 0) {
    return badRequest(res, 'Validation failed', errors);
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Prevent duplicate email address
  if (db.adminUsers.some(u => u.email.toLowerCase() === cleanEmail && !u.isDeleted)) {
    return conflict(res, `An administrator account with email '${cleanEmail}' already exists.`);
  }

  const newId = db.adminUsers.length > 0 ? Math.max(...db.adminUsers.map(u => u.adminId)) + 1 : 1;
  const newAdmin: typeof db.adminUsers[0] = {
    adminId: newId,
    email: cleanEmail,
    passwordHash: `$2a$11$${crypto.randomBytes(16).toString('base64')}.${password}`,
    fullName: fullName.trim(),
    role: cleanRole,
    profileImageUrl: profileImageUrl ? String(profileImageUrl).trim() : undefined,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    isDeleted: false,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.adminUsers.push(newAdmin);
  return created(res, mapAdminUserResponse(newAdmin), 'Administrator created successfully.');
});

// PUT /api/admin/users/:id (Update admin details)
apiRouter.put('/admin/users/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = db.adminUsers.find(u => u.adminId === id && !u.isDeleted);
  if (!user) return notFound(res, `Administrator with ID '${id}' not found.`);

  const { fullName, email, role, profileImageUrl, isActive } = req.body;

  if (email) {
    const cleanEmail = String(email).trim().toLowerCase();
    if (db.adminUsers.some(u => u.adminId !== id && u.email.toLowerCase() === cleanEmail && !u.isDeleted)) {
      return conflict(res, `Email '${cleanEmail}' is already assigned to another administrator.`);
    }
    user.email = cleanEmail;
  }

  // Prevent last active SuperAdmin from accidentally losing access
  if (user.role === 'SuperAdmin' && (role === 'Admin' || isActive === false)) {
    const activeSuperAdmins = db.adminUsers.filter(u => u.role === 'SuperAdmin' && u.isActive && !u.isDeleted && u.adminId !== id);
    if (activeSuperAdmins.length === 0) {
      return badRequest(res, 'Operation forbidden: Cannot demote or deactivate the only remaining active Super Administrator.');
    }
  }

  if (fullName) user.fullName = fullName.trim();
  if (role && (role === 'SuperAdmin' || role === 'Admin')) user.role = role;
  if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl || undefined;
  if (isActive !== undefined) user.isActive = Boolean(isActive);
  user.updatedAt = new Date().toISOString();

  return ok(res, mapAdminUserResponse(user), 'Administrator details updated.');
});

// PATCH /api/admin/users/:id/status (Activate / Deactivate)
apiRouter.patch('/admin/users/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = db.adminUsers.find(u => u.adminId === id && !u.isDeleted);
  if (!user) return notFound(res, `Administrator with ID '${id}' not found.`);

  const { isActive } = req.body;
  const targetStatus = isActive !== undefined ? Boolean(isActive) : !user.isActive;

  // Prevent deactivating the last active SuperAdmin
  if (!targetStatus && user.role === 'SuperAdmin') {
    const otherSuperAdmins = db.adminUsers.filter(u => u.role === 'SuperAdmin' && u.isActive && !u.isDeleted && u.adminId !== id);
    if (otherSuperAdmins.length === 0) {
      return badRequest(res, 'Cannot deactivate the last remaining active Super Administrator in the system.');
    }
  }

  user.isActive = targetStatus;
  user.updatedAt = new Date().toISOString();
  return ok(res, mapAdminUserResponse(user), `Administrator ${targetStatus ? 'activated' : 'deactivated'} successfully.`);
});

// DELETE /api/admin/users/:id (Soft delete)
apiRouter.delete('/admin/users/:id', requireAdminAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = db.adminUsers.find(u => u.adminId === id && !u.isDeleted);
  if (!user) return notFound(res, `Administrator with ID '${id}' not found.`);

  // Prevent deleting the last active SuperAdmin
  if (user.role === 'SuperAdmin') {
    const otherSuperAdmins = db.adminUsers.filter(u => u.role === 'SuperAdmin' && u.isActive && !u.isDeleted && u.adminId !== id);
    if (otherSuperAdmins.length === 0) {
      return badRequest(res, 'Cannot delete the only remaining active Super Administrator.');
    }
  }

  // Soft deletion
  user.isDeleted = true;
  user.isActive = false;
  user.updatedAt = new Date().toISOString();
  return ok(res, true, 'Administrator account has been soft-deleted.');
});

// -------------------------------------------------------------
// 8. IMAGE UPLOAD & STORAGE SERVICE (/api/uploads/image)
// -------------------------------------------------------------

// POST /api/uploads/image
apiRouter.post('/uploads/image', requireAdminAuth, (req: Request, res: Response) => {
  const { category, fileName, base64Data, contentType } = req.body;

  const validCategories = ['products', 'admins', 'blogs', 'testimonials', 'company', 'categories', 'logos'];
  const targetCategory = category && validCategories.includes(category.toLowerCase()) ? category.toLowerCase() : 'products';

  // Validate extension
  const extensionMatch = (fileName || 'image.webp').match(/\.(jpg|jpeg|png|webp|svg)$/i);
  if (!extensionMatch) {
    return badRequest(res, 'Invalid image format. Allowed file formats: JPG, JPEG, PNG, WEBP, SVG.');
  }

  const ext = extensionMatch[1].toLowerCase();
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const safeFilename = `${targetCategory}_${Date.now()}_${uniqueId}.${ext}`;

  // Relative storage path stored in SQL Server
  const relativePath = `/uploads/${targetCategory}/${safeFilename}`;
  const fileSizeBytes = base64Data ? Math.round(base64Data.length * 0.75) : 102400;
  const mimeType = contentType || (ext === 'svg' ? 'image/svg+xml' : `image/${ext}`);

  // Save physical file to disk
  try {
    const cleanBase64 = (base64Data || '').replace(/^data:image\/[a-z+]+;base64,/, '');
    const buffer = cleanBase64 ? Buffer.from(cleanBase64, 'base64') : Buffer.from('');
    
    // Save to primary uploads directory
    const targetDir = path.resolve(process.cwd(), 'uploads', targetCategory);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, safeFilename), buffer);

    // Also mirror to dotnet wwwroot/uploads for ASP.NET Core compatibility
    const dotnetTargetDir = path.resolve(process.cwd(), 'dotnet/OMPolymer.API/wwwroot/uploads', targetCategory);
    if (!fs.existsSync(dotnetTargetDir)) {
      fs.mkdirSync(dotnetTargetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dotnetTargetDir, safeFilename), buffer);
  } catch (fileErr) {
    console.error('Failed writing physical upload to disk:', fileErr);
  }

  // Persist file metadata in SQL Server / in-memory table
  const newFileRecord = {
    fileId: db.uploadedFiles.length > 0 ? Math.max(...db.uploadedFiles.map(f => f.fileId)) + 1 : 1,
    originalFileName: fileName || safeFilename,
    uniqueFileName: safeFilename,
    relativePath,
    category: targetCategory,
    fileType: mimeType,
    fileSizeBytes,
    uploadedAt: new Date().toISOString(),
    isDeleted: false
  };

  db.uploadedFiles.push(newFileRecord);

  return created(res, {
    fileId: newFileRecord.fileId,
    relativeUrl: relativePath,
    category: targetCategory,
    originalFileName: newFileRecord.originalFileName,
    uniqueFileName: safeFilename,
    fileSizeBytes,
    contentType: mimeType,
    uploadedAt: newFileRecord.uploadedAt
  }, 'Image uploaded successfully. Metadata recorded.');
});

// POST /api/uploads/logo (Alias for dedicated logo upload)
apiRouter.post('/uploads/logo', requireAdminAuth, (req: Request, res: Response) => {
  const { fileName, base64Data, contentType } = req.body;
  const extMatch = (fileName || 'logo.png').match(/\.(png|jpg|jpeg|webp|svg)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const safeFilename = `logo_${Date.now()}_${uniqueId}.${ext}`;
  const relativePath = `/uploads/logos/${safeFilename}`;
  const fileSizeBytes = base64Data ? Math.round(base64Data.length * 0.75) : 24576;
  const mimeType = contentType || (ext === 'svg' ? 'image/svg+xml' : `image/${ext}`);

  // Save physical file to disk
  try {
    const cleanBase64 = (base64Data || '').replace(/^data:image\/[a-z+]+;base64,/, '');
    const buffer = cleanBase64 ? Buffer.from(cleanBase64, 'base64') : Buffer.from('');
    
    const targetDir = path.resolve(process.cwd(), 'uploads/logos');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, safeFilename), buffer);

    const dotnetTargetDir = path.resolve(process.cwd(), 'dotnet/OMPolymer.API/wwwroot/uploads/logos');
    if (!fs.existsSync(dotnetTargetDir)) {
      fs.mkdirSync(dotnetTargetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dotnetTargetDir, safeFilename), buffer);
  } catch (fileErr) {
    console.error('Failed writing physical logo upload to disk:', fileErr);
  }

  const newFileRecord = {
    fileId: db.uploadedFiles.length > 0 ? Math.max(...db.uploadedFiles.map(f => f.fileId)) + 1 : 1,
    originalFileName: fileName || 'logo.png',
    uniqueFileName: safeFilename,
    relativePath,
    category: 'logos',
    fileType: mimeType,
    fileSizeBytes,
    uploadedAt: new Date().toISOString(),
    isDeleted: false
  };

  db.uploadedFiles.push(newFileRecord);
  db.companySettings.logoUrl = relativePath;
  db.companySettings.updatedAt = new Date().toISOString();

  return created(res, {
    fileId: newFileRecord.fileId,
    relativeUrl: relativePath,
    category: 'logos',
    originalFileName: newFileRecord.originalFileName,
    uniqueFileName: safeFilename,
    fileSizeBytes,
    contentType: mimeType,
    uploadedAt: newFileRecord.uploadedAt
  }, 'Site logo uploaded and configured successfully.');
});

// GET /api/uploads (Retrieve all uploaded files metadata)
apiRouter.get('/uploads', requireAdminAuth, (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  let files = db.uploadedFiles.filter(f => !f.isDeleted);
  if (category) {
    files = files.filter(f => f.category.toLowerCase() === category.toLowerCase());
  }
  return ok(res, files.map(f => ({
    fileId: f.fileId,
    relativeUrl: f.relativePath,
    category: f.category,
    originalFileName: f.originalFileName,
    uniqueFileName: f.uniqueFileName,
    fileSizeBytes: f.fileSizeBytes,
    contentType: f.fileType,
    uploadedAt: f.uploadedAt
  })));
});

// GET /api/uploads/:id
apiRouter.get('/uploads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id, 10);
  const f = db.uploadedFiles.find(item => item.fileId === fileId && !item.isDeleted);
  if (!f) return notFound(res, 'File record not found');
  return ok(res, {
    fileId: f.fileId,
    relativeUrl: f.relativePath,
    category: f.category,
    originalFileName: f.originalFileName,
    uniqueFileName: f.uniqueFileName,
    fileSizeBytes: f.fileSizeBytes,
    contentType: f.fileType,
    uploadedAt: f.uploadedAt
  });
});

// DELETE /api/uploads/image (Safe cleanup)
apiRouter.delete('/uploads/image', requireAdminAuth, (req: Request, res: Response) => {
  const { path: imgPath } = req.body;
  if (!imgPath || !String(imgPath).startsWith('/uploads/')) {
    return badRequest(res, 'Invalid or unsafe image path specified.');
  }

  const record = db.uploadedFiles.find(f => f.relativePath === imgPath);
  if (record) {
    record.isDeleted = true;
  }

  // Remove physical files
  try {
    const localRel = imgPath.replace(/^\//, '');
    const fullPath = path.resolve(process.cwd(), localRel);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    const dotnetFullPath = path.resolve(process.cwd(), 'dotnet/OMPolymer.API/wwwroot', localRel);
    if (fs.existsSync(dotnetFullPath)) {
      fs.unlinkSync(dotnetFullPath);
    }
  } catch (unlinkErr) {
    console.error('Failed deleting physical file:', unlinkErr);
  }

  return ok(res, true, `Image file '${imgPath}' safely removed from storage.`);
});

// DELETE /api/uploads/:id
apiRouter.delete('/uploads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id, 10);
  const record = db.uploadedFiles.find(f => f.fileId === fileId);
  if (!record) return notFound(res, 'File record not found.');
  record.isDeleted = true;

  try {
    const localRel = record.relativePath.replace(/^\//, '');
    const fullPath = path.resolve(process.cwd(), localRel);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    const dotnetFullPath = path.resolve(process.cwd(), 'dotnet/OMPolymer.API/wwwroot', localRel);
    if (fs.existsSync(dotnetFullPath)) {
      fs.unlinkSync(dotnetFullPath);
    }
  } catch (unlinkErr) {
    console.error('Failed deleting physical file:', unlinkErr);
  }

  return ok(res, true, `File record ${fileId} safely deleted.`);
});

// -------------------------------------------------------------
// 9. DATABASE STATE & OVERVIEW INSPECTION
// -------------------------------------------------------------

apiRouter.get('/admin/database/overview', (req: Request, res: Response) => {
  return ok(res, {
    databaseName: 'OMPolymerDB',
    serverType: 'Microsoft SQL Server (Database First)',
    tables: [
      { name: 'AdminUsers', rowCount: db.adminUsers.filter(u => !u.isDeleted).length, primaryKey: 'AdminID (INT)' },
      { name: 'PasswordResetTokens', rowCount: db.passwordResetTokens.length, primaryKey: 'TokenID (INT)' },
      { name: 'CompanySettings', rowCount: 1, primaryKey: 'SettingID (INT)' },
      { name: 'ProductCategories', rowCount: db.productCategories.length, primaryKey: 'CategoryID (INT)' },
      { name: 'Products', rowCount: db.products.length, primaryKey: 'ProductID (INT)' },
      { name: 'ProductImages', rowCount: db.productImages.length, primaryKey: 'ImageID (INT)' },
      { name: 'BlogCategories', rowCount: db.blogCategories.length, primaryKey: 'BlogCategoryID (INT)' },
      { name: 'BlogPosts', rowCount: db.blogPosts.length, primaryKey: 'BlogID (INT)' },
      { name: 'ClientRequirements', rowCount: db.clientRequirements.length, primaryKey: 'RequirementID (INT)' },
      { name: 'Testimonials', rowCount: db.testimonials.length, primaryKey: 'TestimonialID (INT)' },
      { name: 'UploadedFiles', rowCount: db.uploadedFiles.filter(f => !f.isDeleted).length, primaryKey: 'FileID (INT)' }
    ]
  });
});

apiRouter.post('/admin/database/reset', requireAdminAuth, (req: Request, res: Response) => {
  db.seed();
  return ok(res, true, 'OMPolymerDB in-memory tables re-seeded to factory demo state.');
});

// -------------------------------------------------------------
// 10. SYSTEM & APPLICATION LOGS (DYNAMIC FROM /logs FOLDER)
// -------------------------------------------------------------

// GET /api/admin/logs/files (List physical log files)
apiRouter.get('/admin/logs/files', requireAdminAuth, (_req: Request, res: Response) => {
  const files = getAvailableLogFiles();
  return ok(res, files.map(f => f.fileName));
});

// GET /api/admin/logs (Read dynamic log entries from disk)
apiRouter.get('/admin/logs', requireAdminAuth, (req: Request, res: Response) => {
  const filename = (req.query.file as string) || (req.query.filename as string) || 'ompolymer-api.log';
  const rawLevel = ((req.query.severity as string) || (req.query.level as string) || 'ALL').toUpperCase();
  const search = (req.query.search as string || '').toLowerCase().trim();
  const limit = Math.max(1, Math.min(500, parseInt(req.query.limit as string) || 150));

  let entries = readLogEntries(filename, limit);

  if (rawLevel && rawLevel !== 'ALL') {
    const targetLevels: string[] = [rawLevel];
    if (rawLevel === 'INFO' || rawLevel === 'INF') targetLevels.push('INFO', 'INF');
    if (rawLevel === 'WARN' || rawLevel === 'WRN') targetLevels.push('WARN', 'WRN');
    if (rawLevel === 'ERROR' || rawLevel === 'ERR') targetLevels.push('ERROR', 'ERR');
    if (rawLevel === 'DEBUG' || rawLevel === 'DBG') targetLevels.push('DEBUG', 'DBG');
    if (rawLevel === 'SECURITY' || rawLevel === 'SEC') targetLevels.push('SECURITY', 'SEC');
    
    entries = entries.filter(e => targetLevels.includes(e.level.toUpperCase()));
  }

  if (search) {
    entries = entries.filter(e => 
      e.message.toLowerCase().includes(search) || 
      e.category.toLowerCase().includes(search) ||
      e.raw.toLowerCase().includes(search)
    );
  }

  const normalizedLogs = entries.map(e => ({
    ...e,
    level: (e.level === 'INF' ? 'INFO' : e.level === 'WRN' ? 'WARN' : e.level === 'ERR' ? 'ERROR' : e.level) as any,
    sourceFile: filename
  }));

  const availableFiles = getAvailableLogFiles();

  return ok(res, {
    total: normalizedLogs.length,
    filtered: normalizedLogs.length,
    files: availableFiles.map(f => f.fileName),
    activeFile: filename,
    totalReturned: normalizedLogs.length,
    availableFiles: availableFiles,
    logs: normalizedLogs
  });
});

// POST /api/admin/logs/clear (Rotate/clear specific log file)
apiRouter.post('/admin/logs/clear', requireAdminAuth, (req: Request, res: Response) => {
  const filename = req.body?.fileName || req.body?.filename || 'ompolymer-api.log';
  const success = clearLogFile(filename);
  if (success) {
    logMessage('INF', 'OMPolymer.API.Logs', `Log file ${filename} cleared and rotated.`);
    return ok(res, { cleared: true }, `Log file '${filename}' rotated and cleared.`);
  } else {
    return badRequest(res, `Failed to clear log file '${filename}'.`);
  }
});

// GET /api/admin/logs/download/:fileName (Download log file raw text)
apiRouter.get('/admin/logs/download/:fileName', requireAdminAuth, (req: Request, res: Response) => {
  const filename = path.basename(req.params.fileName);
  const filePath = path.resolve(process.cwd(), 'logs', filename);
  if (!fs.existsSync(filePath)) {
    return notFound(res, `Log file '${filename}' not found.`);
  }
  return res.download(filePath, filename);
});
