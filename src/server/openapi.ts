// OpenAPI 3.0.3 Specification for OM Polymer Web API

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "OM Polymer Web API",
    version: "1.0.0",
    description: "Production-grade ASP.NET Core Web API backend for OM Polymer. Designed with EF Core Database First, JWT Bearer Authentication, and rate-limiting policies.",
    contact: {
      name: "OM Polymer IT Engineering",
      email: "inquiry@ompolymer.com"
    }
  },
  servers: [
    {
      url: "/api",
      description: "Live Server Instance"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your Bearer JWT token received from POST /api/admin/auth/login"
      }
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Success" },
          data: { type: "object" },
          errors: { type: "array", items: { type: "string" }, nullable: true }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@ompolymer.com" },
          password: { type: "string", format: "password", example: "Admin@123" }
        }
      },
      ProductCreateRequest: {
        type: "object",
        required: ["productName", "slug", "categoryId"],
        properties: {
          productName: { type: "string", example: "High-Density Polyethylene (HDPE) PN16 Industrial Pipe" },
          slug: { type: "string", example: "hdpe-pn16-industrial-pipe" },
          categoryId: { type: "integer", example: 1 },
          shortDescription: { type: "string", example: "High-tensile PE100 grade pipes for water and industrial slurry conveyance." },
          fullDescription: { type: "string", example: "Manufactured from 100% virgin PE100 resin with superior hydrostatic strength." },
          specifications: { type: "string", example: "Standard: ISO 4427; Pressure: PN16; Size: 20mm-630mm" },
          mainImageUrl: { type: "string", example: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800" },
          isFeatured: { type: "boolean", example: true },
          additionalImages: {
            type: "array",
            items: { type: "string" },
            example: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"]
          }
        }
      },
      RequirementCreateRequest: {
        type: "object",
        required: ["fullName", "email", "phoneNumber", "requirementDescription"],
        properties: {
          fullName: { type: "string", example: "Anil Ambani" },
          companyName: { type: "string", example: "Reliance Polytech Corp" },
          email: { type: "string", format: "email", example: "a.ambani@polytech.com" },
          phoneNumber: { type: "string", example: "+919876543210" },
          productOfInterest: { type: "string", example: "HDPE PN16 Pipes" },
          quantity: { type: "string", example: "2,000 meters" },
          requirementDescription: { type: "string", example: "Need quote for drinking water transmission project." },
          city: { type: "string", example: "Ahmedabad" },
          state: { type: "string", example: "Gujarat" }
        }
      },
      BlogCreateRequest: {
        type: "object",
        required: ["title", "slug", "content"],
        properties: {
          title: { type: "string", example: "Innovations in Recycled Polyolefin Blends" },
          slug: { type: "string", example: "innovations-in-recycled-polyolefin-blends" },
          blogCategoryId: { type: "integer", example: 1 },
          shortDescription: { type: "string", example: "Technical overview of circular compounding methods." },
          content: { type: "string", example: "<p>Compounding advancements have allowed 40% PCR with zero yield drop.</p>" },
          featuredImageUrl: { type: "string", example: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" },
          author: { type: "string", example: "Dr. M. Patel" },
          metaTitle: { type: "string", example: "Polymer Blends Research" },
          metaDescription: { type: "string", example: "PCR compounding breakthroughs" },
          isPublished: { type: "boolean", example: true }
        }
      },
      TestimonialCreateRequest: {
        type: "object",
        required: ["displayName", "reviewText", "rating"],
        properties: {
          displayName: { type: "string", example: "Sunil Mittal" },
          companyOrDesignation: { type: "string", example: "Managing Director, InfraCor" },
          reviewText: { type: "string", example: "Exceptional pipe quality and timely dispatch." },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          isApproved: { type: "boolean", example: true },
          isPublished: { type: "boolean", example: true }
        }
      },
      CompanySettingsUpdateRequest: {
        type: "object",
        required: ["companyName"],
        properties: {
          companyName: { type: "string", example: "OM Polymer Industries" },
          description: { type: "string", example: "Premier manufacturer of polymeric pipes and masterbatches." },
          yearsOfExperience: { type: "integer", example: 13 },
          aboutContent: { type: "string", example: "Founded in 2011 with ISO 9001 certification." },
          address: { type: "string", example: "G.I.D.C., Ahmedabad, Gujarat, India" },
          emailContact: { type: "string", example: "contact@ompolymer.com" },
          phoneContact: { type: "string", example: "+91 79 4002 9180" },
          whatsAppNumber: { type: "string", example: "+919876543210" },
          socialFacebook: { type: "string", example: "https://facebook.com/ompolymer" },
          socialLinkedIn: { type: "string", example: "https://linkedin.com/company/ompolymer" },
          socialInstagram: { type: "string", example: "https://instagram.com/ompolymer" }
        }
      }
    }
  },
  paths: {
    "/company": {
      get: {
        summary: "Get Configurable Company Information",
        description: "Returns company description, 13 years experience, addresses, contacts, and WhatsApp link.",
        tags: ["Company"],
        responses: {
          "200": { description: "Successful response" }
        }
      }
    },
    "/contact/whatsapp-url": {
      get: {
        summary: "Generate Encoded WhatsApp Chat URL",
        description: "Returns wa.me click-to-chat URL with optional product-specific inquiry message.",
        tags: ["Company"],
        parameters: [
          { name: "productSlug", in: "query", schema: { type: "string" }, description: "Optional slug for product inquiry" },
          { name: "message", in: "query", schema: { type: "string" }, description: "Optional custom message" }
        ],
        responses: {
          "200": { description: "WhatsApp URL generated" }
        }
      }
    },
    "/admin/company": {
      put: {
        summary: "Update Company Settings",
        description: "Admin updates company phone, address, experience, and socials.",
        tags: ["Admin - Company"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CompanySettingsUpdateRequest" } } }
        },
        responses: {
          "200": { description: "Company settings updated" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/products": {
      get: {
        summary: "List Active Products (Paginated)",
        description: "Returns paginated list of active products with category filtering and text search.",
        tags: ["Products"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Paginated product collection" }
        }
      }
    },
    "/products/featured": {
      get: {
        summary: "Get Featured Products",
        description: "Returns products flagged with isFeatured = true for homepage spotlight.",
        tags: ["Products"],
        responses: {
          "200": { description: "Featured products list" }
        }
      }
    },
    "/products/categories": {
      get: {
        summary: "Get Product Categories",
        description: "List all active product categories.",
        tags: ["Products"],
        responses: {
          "200": { description: "Categories list" }
        }
      }
    },
    "/products/slug/{slug}": {
      get: {
        summary: "Get Product by Slug",
        description: "Find active product by unique slug with all gallery images.",
        tags: ["Products"],
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Product details" },
          "404": { description: "Not found" }
        }
      }
    },
    "/admin/products": {
      post: {
        summary: "Create New Product",
        description: "Admin endpoint to create product with slug uniqueness enforcement.",
        tags: ["Admin - Products"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductCreateRequest" } } }
        },
        responses: {
          "201": { description: "Product created" },
          "409": { description: "Duplicate slug conflict" }
        }
      }
    },
    "/admin/products/{id}/status": {
      patch: {
        summary: "Toggle Product Active Status",
        description: "Activates or deactivates product from public storefront without deletion.",
        tags: ["Admin - Products"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Status changed" } }
      }
    },
    "/admin/products/{id}": {
      delete: {
        summary: "Delete Product",
        tags: ["Admin - Products"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Deleted" } }
      }
    },
    "/blogs": {
      get: {
        summary: "Get Published Blogs",
        description: "Returns published articles (drafts filtered out) with pagination.",
        tags: ["Blogs"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "Blog articles list" } }
      }
    },
    "/blogs/{slug}": {
      get: {
        summary: "Get Blog by Slug",
        tags: ["Blogs"],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Blog details" }, "404": { description: "Not found" } }
      }
    },
    "/admin/blogs": {
      post: {
        summary: "Create Blog Post",
        tags: ["Admin - Blogs"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BlogCreateRequest" } } }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/admin/blogs/{id}/publish": {
      patch: {
        summary: "Publish Blog Article",
        tags: ["Admin - Blogs"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Published" } }
      }
    },
    "/requirements": {
      post: {
        summary: "Submit Client Requirement / RFQ",
        description: "Public lead submission form. Protected by rate limiting (max 2/min per IP) and strict regex validation.",
        tags: ["Client Requirements"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RequirementCreateRequest" } } }
        },
        responses: {
          "200": { description: "Submission accepted" },
          "400": { description: "Validation failure" },
          "429": { description: "Rate limit exceeded" }
        }
      }
    },
    "/admin/requirements": {
      get: {
        summary: "List Client Submissions",
        description: "Admin view of all customer leads with internal remarks and status workflow.",
        tags: ["Admin - Requirements"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "Requirements list" } }
      }
    },
    "/admin/requirements/{id}/status": {
      patch: {
        summary: "Update Requirement Status & Remarks",
        tags: ["Admin - Requirements"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["New", "Contacted", "In Progress", "Completed", "Rejected"] },
                  adminRemarks: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Updated" } }
      }
    },
    "/testimonials": {
      get: {
        summary: "Get Approved & Published Testimonials",
        tags: ["Testimonials"],
        responses: { "200": { description: "Testimonials list" } }
      }
    },
    "/admin/testimonials": {
      get: {
        summary: "Admin View All Testimonials",
        tags: ["Admin - Testimonials"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "All testimonials" } }
      },
      post: {
        summary: "Create Testimonial",
        tags: ["Admin - Testimonials"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TestimonialCreateRequest" } } }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/admin/auth/login": {
      post: {
        summary: "Admin Login (JWT Issuance)",
        description: "Authenticates admin credentials (email/password). Rate limited to 5 attempts/min. Returns Bearer token.",
        tags: ["Admin - Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          "200": { description: "Authenticated with JWT" },
          "401": { description: "Invalid credentials" },
          "429": { description: "Too many login attempts" }
        }
      }
    },
    "/admin/auth/forgot-password": {
      post: {
        summary: "Request Password Reset Token",
        description: "Dispatches cryptographically generated single-use reset token. Rate limited to 3 attempts/5 min per IP. Returns generic response to prevent account enumeration.",
        tags: ["Admin - Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email", example: "admin@ompolymer.com" } }
              }
            }
          }
        },
        responses: {
          "200": { description: "Reset email dispatched (generic message)" },
          "429": { description: "Rate limit exceeded" }
        }
      }
    },
    "/admin/auth/reset-password": {
      post: {
        summary: "Execute Password Reset",
        description: "Validates SHA-256 token hash and expiration, resets password via BCrypt, and invalidates all user reset tokens.",
        tags: ["Admin - Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "token", "newPassword", "confirmPassword"],
                properties: {
                  email: { type: "string", format: "email" },
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                  confirmPassword: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Password reset successful" },
          "400": { description: "Token invalid, expired, or mismatch" }
        }
      }
    },
    "/admin/auth/change-password": {
      post: {
        summary: "Change Password (Authenticated)",
        tags: ["Admin - Auth"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword", "confirmPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 8 },
                  confirmPassword: { type: "string", minLength: 8 }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Password changed successfully" } }
      }
    },
    "/admin/users": {
      get: {
        summary: "List Administrators (Paginated)",
        description: "Search and filter administrator accounts by role, status, and name/email.",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
          { name: "role", in: "query", schema: { type: "string", enum: ["All", "SuperAdmin", "Admin"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["All", "Active", "Inactive"] } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { "200": { description: "Admin users list (password hashes excluded)" } }
      },
      post: {
        summary: "Create Administrator",
        description: "Creates admin user, prevents duplicate email, and hashes password using BCrypt.",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  role: { type: "string", enum: ["SuperAdmin", "Admin"], default: "Admin" },
                  profileImageUrl: { type: "string" },
                  isActive: { type: "boolean", default: true }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Created" },
          "409": { description: "Duplicate email address" }
        }
      }
    },
    "/admin/users/{id}": {
      get: {
        summary: "Get Administrator by ID",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Administrator details" }, "404": { description: "Not found" } }
      },
      put: {
        summary: "Update Administrator",
        description: "Updates admin details. Prevents demoting or deactivating the last active SuperAdmin.",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Updated" }, "400": { description: "Validation failure or guard violation" } }
      },
      delete: {
        summary: "Soft-Delete Administrator",
        description: "Soft deletes admin user. Prevents deleting the last active SuperAdmin.",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Soft deleted" } }
      }
    },
    "/admin/users/{id}/status": {
      patch: {
        summary: "Activate or Deactivate Administrator",
        tags: ["Admin - Users"],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isActive"],
                properties: { isActive: { type: "boolean" } }
              }
            }
          }
        },
        responses: { "200": { description: "Status toggled" } }
      }
    },
    "/admin/auth/verify": {
      get: {
        summary: "Verify Active JWT Token",
        tags: ["Admin - Auth"],
        security: [{ BearerAuth: [] }],
        responses: { "200": { description: "Token valid" }, "401": { description: "Invalid token" } }
      }
    },
    "/uploads/image": {
      post: {
        summary: "Upload Image",
        description: "Uploads physical image to server via UploadImageRequest DTO (multipart/form-data) and returns relative URL path.",
        tags: ["Media Uploads"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary", description: "Image binary payload (JPEG, PNG, WEBP max 5MB)" },
                  category: { type: "string", default: "products", description: "Storage subfolder category (products, blogs, admins, company)" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Image uploaded and stored with relative URL" },
          "400": { description: "Invalid file type, size exceeded, or unsafe path" }
        }
      },
      delete: {
        summary: "Delete Image",
        tags: ["Media Uploads"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["relativePath"],
                properties: { relativePath: { type: "string", example: "/uploads/products/sample.webp" } }
              }
            }
          }
        },
        responses: { "200": { description: "Physical image deleted" } }
      }
    },
    "/admin/logs": {
      get: {
        summary: "Retrieve Live System & Host Logs",
        description: "Streams dynamic structured logs from the physical host /logs folder with severity, file, and keyword search filters.",
        tags: ["System Logs"],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "filename", in: "query", schema: { type: "string", default: "ompolymer-api.log" } },
          { name: "level", in: "query", schema: { type: "string", enum: ["ALL", "INF", "WRN", "ERR", "SEC"], default: "ALL" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 150 } }
        ],
        responses: { "200": { description: "Dynamic log entries array" } }
      }
    },
    "/admin/logs/clear": {
      post: {
        summary: "Rotate and Clear Log File",
        tags: ["System Logs"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { filename: { type: "string", default: "ompolymer-api.log" } }
              }
            }
          }
        },
        responses: { "200": { description: "Log rotated and cleared" } }
      }
    }
  }
};
