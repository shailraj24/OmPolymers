// In-Memory Database for OM Polymer REST API Engine
// Mirroring the SQL Server tables and relationships

export interface AdminUserRecord {
  adminId: number;
  email: string;
  passwordHash: string; // BCrypt hash format
  fullName: string;
  role: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PasswordResetTokenRecord {
  tokenId: number;
  adminId: number;
  tokenHash: string; // SHA-256 hash of raw token
  rawTokenPreview?: string; // Stored in dev/demo mode for test convenience
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface CompanySettingRecord {
  settingId: number;
  companyName: string;
  description: string;
  yearsOfExperience: number;
  aboutContent: string;
  address: string;
  emailContact: string;
  phoneContact: string;
  whatsAppNumber: string;
  socialFacebook: string;
  socialLinkedIn: string;
  socialInstagram: string;
  updatedAt: string;
}

export interface ProductCategoryRecord {
  categoryId: number;
  categoryName: string;
  slug: string;
  isActive: boolean;
}

export interface ProductImageRecord {
  imageId: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
}

export interface ProductRecord {
  productId: number;
  categoryId: number;
  productName: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  specifications: string;
  mainImageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryRecord {
  blogCategoryId: number;
  categoryName: string;
  slug: string;
}

export interface BlogPostRecord {
  blogId: number;
  blogCategoryId: number | null;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequirementRecord {
  requirementId: number;
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber: string;
  productOfInterest?: string;
  quantity?: string;
  requirementDescription: string;
  city?: string;
  state?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Rejected';
  adminRemarks?: string;
  createdAt: string;
}

export interface TestimonialRecord {
  testimonialId: number;
  displayName: string;
  companyOrDesignation?: string;
  reviewText: string;
  rating: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}

class Database {
  adminUsers: AdminUserRecord[] = [];
  companySettings: CompanySettingRecord = {
    settingId: 1,
    companyName: 'OM Polymer',
    description: 'Leading manufacturer and exporter of high-grade engineering polymers, HDPE piping systems, masterbatches, and PVC compounds.',
    yearsOfExperience: 13,
    aboutContent: 'Established in 2011, OM Polymer has grown from a specialized compounding facility into an international benchmark for extrusion-grade resins, pressure pipes, and customized polymeric additives with over 13 years of technical excellence.',
    address: 'Plot 48/B, Industrial Area Phase II, G.I.D.C., Ahmedabad, Gujarat 382445, India',
    emailContact: 'inquiry@ompolymer.com',
    phoneContact: '+91 79 4002 9180',
    whatsAppNumber: '+919876543210',
    socialFacebook: 'https://facebook.com/ompolymer',
    socialLinkedIn: 'https://linkedin.com/company/om-polymer-industries',
    socialInstagram: 'https://instagram.com/ompolymer',
    updatedAt: new Date().toISOString()
  };
  productCategories: ProductCategoryRecord[] = [];
  products: ProductRecord[] = [];
  productImages: ProductImageRecord[] = [];
  blogCategories: BlogCategoryRecord[] = [];
  blogPosts: BlogPostRecord[] = [];
  clientRequirements: ClientRequirementRecord[] = [];
  testimonials: TestimonialRecord[] = [];
  passwordResetTokens: PasswordResetTokenRecord[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    // 1. Admin Users (Password: Admin@123)
    this.adminUsers = [
      {
        adminId: 1,
        email: 'admin@ompolymer.com',
        // Standard BCrypt representation of "Admin@123"
        passwordHash: '$2a$11$q9iU6Kx1s18.261L51k7AOP9R.jJ4d0Qh39iWv6n/4JbY7a0t4s1q',
        fullName: 'Executive Super Administrator',
        role: 'SuperAdmin',
        profileImageUrl: '/uploads/admins/superadmin_avatar.webp',
        isActive: true,
        isDeleted: false,
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z'
      },
      {
        adminId: 2,
        email: 'operations@ompolymer.com',
        passwordHash: '$2a$11$q9iU6Kx1s18.261L51k7AOP9R.jJ4d0Qh39iWv6n/4JbY7a0t4s1q',
        fullName: 'Operations Manager',
        role: 'Admin',
        profileImageUrl: '/uploads/admins/operations_avatar.webp',
        isActive: true,
        isDeleted: false,
        lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-02-01T09:00:00Z'
      },
      {
        adminId: 3,
        email: 'inactive.staff@ompolymer.com',
        passwordHash: '$2a$11$q9iU6Kx1s18.261L51k7AOP9R.jJ4d0Qh39iWv6n/4JbY7a0t4s1q',
        fullName: 'Former Assistant',
        role: 'Admin',
        profileImageUrl: undefined,
        isActive: false,
        isDeleted: false,
        lastLoginAt: null,
        createdAt: '2024-02-10T10:00:00Z',
        updatedAt: '2024-02-10T10:00:00Z'
      }
    ];

    this.passwordResetTokens = [];

    // 2. Product Categories
    this.productCategories = [
      { categoryId: 1, categoryName: 'HDPE Pressure Pipes & Ducts', slug: 'hdpe-pipes-ducts', isActive: true },
      { categoryId: 2, categoryName: 'Engineering Polymers & Resins', slug: 'engineering-polymers', isActive: true },
      { categoryId: 3, categoryName: 'Color & Additive Masterbatches', slug: 'masterbatches', isActive: true },
      { categoryId: 4, categoryName: 'UPVC & CPVC Fitting Solutions', slug: 'upvc-cpvc-fittings', isActive: true }
    ];

    // 3. Products
    this.products = [
      {
        productId: 1,
        categoryId: 1,
        productName: 'High-Density Polyethylene (HDPE) PN16 Industrial Pipe',
        slug: 'hdpe-pn16-industrial-pipe',
        shortDescription: 'High-tensile PE100 grade pipes designed for municipal water distribution, mining slurry, and industrial chemical conveyance.',
        fullDescription: 'Manufactured from 100% virgin PE100 resin with superior hydrostatic strength and environmental stress crack resistance (ESCR). Capable of withstanding working pressures up to 16 bar at 20°C with 50+ year design lifetime.',
        specifications: 'Standard: ISO 4427 / IS 4984; Material: PE100 Virgin; Pressure Rating: PN16 (SDR 11); Size Range: OD 20mm to 630mm; Coil Length: 50m / 100m or 6m straight lengths.',
        mainImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isActive: true,
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-15T12:00:00Z'
      },
      {
        productId: 2,
        categoryId: 2,
        productName: 'Glass-Fiber Reinforced Polyamide 66 (PA66-GF30)',
        slug: 'pa66-gf30-engineering-polymer',
        shortDescription: '30% glass fiber reinforced nylon pellets for automotive housings, gear assemblies, and high thermal load components.',
        fullDescription: 'Engineered for exceptional mechanical rigidity, high heat deflection temperature (HDT > 250°C), and dimensional stability under persistent vibration and load cycles.',
        specifications: 'Tensile Modulus: 9800 MPa; Tensile Strength: 175 MPa; HDT (1.8 MPa): 252°C; Flammability: UL94 V-2 / HB; Color: Natural / Custom Black.',
        mainImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isActive: true,
        createdAt: '2024-02-05T11:30:00Z',
        updatedAt: '2024-02-18T14:20:00Z'
      },
      {
        productId: 3,
        categoryId: 3,
        productName: 'UV-Stabilized Black Carbon Masterbatch (OM-CB90)',
        slug: 'uv-black-carbon-masterbatch-om-cb90',
        shortDescription: 'High-jetness 45% furnace carbon black concentrate in LLDPE carrier for agricultural mulch films and drip irrigation.',
        fullDescription: 'Formulated with ultra-fine particle carbon black (<20nm) providing superior UV screening for outdoor polymer products exposed to intense sunlight, preventing photo-degradation.',
        specifications: 'Carbon Black Content: 45% ± 1%; Carrier Resin: LLDPE; Dispersion: Grade A (Filter Pressure Value < 0.8 bar/g); Moisture Content: < 0.15%; Dosage: 1.5% - 3.5%.',
        mainImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        isActive: true,
        createdAt: '2024-02-10T09:00:00Z',
        updatedAt: '2024-02-20T16:00:00Z'
      },
      {
        productId: 4,
        categoryId: 4,
        productName: 'Heavy-Duty Schedule 80 CPVC Industrial Flange Fitting',
        slug: 'schedule-80-cpvc-industrial-flange',
        shortDescription: 'Corrosion-proof chlorinated PVC one-piece flange for harsh acid and caustic process lines up to 93°C.',
        fullDescription: 'Engineered for seamless bolting to standard ANSI Class 150 flanges in chemical processing, power generation, and electroplating installations where metallic piping suffers severe galvanic corrosion.',
        specifications: 'Standard: ASTM F439 / ASTM D1784; Working Temp: -10°C to 93°C; Connection: Socket / ANSI 150# Flange; Sizes: 1/2" to 8" Nominal Bore.',
        mainImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        isActive: true,
        createdAt: '2024-02-12T14:15:00Z',
        updatedAt: '2024-02-22T10:00:00Z'
      }
    ];

    // 4. Product Images
    this.productImages = [
      { imageId: 1, productId: 1, imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80', sortOrder: 0 },
      { imageId: 2, productId: 1, imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', sortOrder: 1 },
      { imageId: 3, productId: 2, imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', sortOrder: 0 },
      { imageId: 4, productId: 4, imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', sortOrder: 0 }
    ];

    // 5. Blog Categories
    this.blogCategories = [
      { blogCategoryId: 1, categoryName: 'Industry Insights', slug: 'industry-insights' },
      { blogCategoryId: 2, categoryName: 'Material Engineering', slug: 'material-engineering' },
      { blogCategoryId: 3, categoryName: 'Company News', slug: 'company-news' }
    ];

    // 6. Blog Posts
    this.blogPosts = [
      {
        blogId: 1,
        blogCategoryId: 2,
        title: 'Advances in PE100-RC Resins for Trenchless Pipeline Installation',
        slug: 'advances-in-pe100-rc-resins-trenchless-installation',
        shortDescription: 'How OM Polymer is adopting crack-resistant bimodal polyethylenes to prevent point-loading failure during horizontal directional drilling.',
        content: '<p>Trenchless horizontal directional drilling (HDD) has revolutionized underground infrastructure, yet conventional PE80 and standard PE100 pipes face severe shear stress from sharp aggregates during pull-back operations.</p><p>OM Polymer has integrated specialized PE100-RC (Resistant to Crack) raw polymers into our municipal line, increasing the Full Notch Creep Test (FNCT) threshold from 300 hours to over 8,760 hours (1 full year) without rupture under 4.0 MPa stress at 80°C.</p>',
        featuredImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        author: 'Dr. M. Patel, Head of R&D',
        metaTitle: 'PE100-RC Pipeline Innovations | OM Polymer Tech',
        metaDescription: 'Technical breakdown of crack resistant PE100-RC polyethylenes for trenchless pipeline excavation.',
        isPublished: true,
        publishedAt: '2024-02-14T09:00:00Z',
        createdAt: '2024-02-10T11:00:00Z',
        updatedAt: '2024-02-14T09:00:00Z'
      },
      {
        blogId: 2,
        blogCategoryId: 1,
        title: 'Circular Polymer Compounding: Achieving 40% PCR with Zero Loss in Tensile Integrity',
        slug: 'circular-polymer-compounding-40-pcr-integrity',
        shortDescription: 'Case study on our reactive extrusion compatibilizers enabling high Post-Consumer Recycled content in technical injection moldings.',
        content: '<p>Global automotive and packaging directives demand higher recycled content, yet mechanical recycling typically degrades polymer molecular weight chains.</p><p>Through our proprietary grafting technology, OM Polymer introduces maleic anhydride functionalized polymers that bond mismatched polyolefin phases, retaining 94% of native Izod impact resistance even at 40% PCR loading.</p>',
        featuredImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        author: 'R. K. Sharma, Senior Technical Director',
        metaTitle: 'High PCR Polymer Compounding | OM Polymer',
        metaDescription: 'Achieving 40% PCR resin blends without sacrificing mechanical strength.',
        isPublished: true,
        publishedAt: '2024-03-01T10:00:00Z',
        createdAt: '2024-02-25T14:00:00Z',
        updatedAt: '2024-03-01T10:00:00Z'
      },
      {
        blogId: 3,
        blogCategoryId: 3,
        title: 'OM Polymer Expands Automated Extrusion Facility to 18,000 MT/Year',
        slug: 'om-polymer-expands-automated-extrusion-facility',
        shortDescription: '13 years of manufacturing experience culminate in the commissioning of our fourth high-speed compounding line.',
        content: '<p>We are proud to celebrate 13 continuous years of precision polymer manufacturing with the inauguration of Line 4 at our Ahmedabad facility. The German-engineered twin-screw extrusion line increases total output by 35%.</p>',
        featuredImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        author: 'Corporate Communications',
        metaTitle: 'Facility Expansion 18000 MT | OM Polymer',
        metaDescription: 'OM Polymer marks 13th anniversary with automated extrusion plant expansion.',
        isPublished: false, // Draft for testing draft protection!
        publishedAt: null,
        createdAt: '2024-03-05T08:00:00Z',
        updatedAt: '2024-03-05T08:00:00Z'
      }
    ];

    // 7. Client Requirements (Leads)
    this.clientRequirements = [
      {
        requirementId: 1,
        fullName: 'Vikram Singhania',
        companyName: 'Apex Water Infrastructure Ltd',
        email: 'vikram.singhania@apexinfra.in',
        phoneNumber: '+919825012345',
        productOfInterest: 'HDPE PN16 Industrial Pipe',
        quantity: '1,200 Meters (OD 315mm)',
        requirementDescription: 'Need quotation and test certificates for municipal sewer siphon project in Surat. Must conform to IS 4984:2016.',
        city: 'Surat',
        state: 'Gujarat',
        status: 'Contacted',
        adminRemarks: 'Quotation submitted on Feb 18. Followed up with Technical VP on Feb 22.',
        createdAt: '2024-02-18T07:30:00Z'
      },
      {
        requirementId: 2,
        fullName: 'Claire Beaumont',
        companyName: 'EuroMould Tech SARL',
        email: 'c.beaumont@euromould.fr',
        phoneNumber: '+33145892301',
        productOfInterest: 'Glass-Fiber Reinforced Polyamide 66',
        quantity: '24 Metric Tons (FCL)',
        requirementDescription: 'Export inquiry for automotive throttle body enclosures. Requesting TDS, SDS, and FOB Mundra port pricing.',
        city: 'Lyon',
        state: 'Auvergne-Rhône-Alpes',
        status: 'In Progress',
        adminRemarks: 'Export documentation team preparing proforma invoice and freight estimates.',
        createdAt: '2024-02-24T13:45:00Z'
      },
      {
        requirementId: 3,
        fullName: 'Amitabh Joshi',
        companyName: 'GreenPlast Solutions',
        email: 'ajoshi@greenplast.org',
        phoneNumber: '+919924198765',
        productOfInterest: 'UV-Stabilized Black Carbon Masterbatch',
        quantity: '5 MT Sample + Bulk Trial',
        requirementDescription: 'Developing 200-micron greenhouse film with 3-season durability requirement. Need high dispersion carbon black.',
        city: 'Pune',
        state: 'Maharashtra',
        status: 'New',
        adminRemarks: '',
        createdAt: '2024-03-02T10:15:00Z'
      }
    ];

    // 8. Testimonials
    this.testimonials = [
      {
        testimonialId: 1,
        displayName: 'Rajesh Mehta',
        companyOrDesignation: 'Chief Procurement Officer, Gujarat Water Board Projects',
        reviewText: 'OM Polymer has supplied over 40 kilometers of PE100 pipes for our bulk water transfer network. Hydrostatic pressure testing showed zero batch anomalies. Their 13 years of expertise is evident in product consistency.',
        rating: 5,
        isApproved: true,
        isPublished: true,
        createdAt: '2024-01-20T11:00:00Z'
      },
      {
        testimonialId: 2,
        displayName: 'Anand K. Verma',
        companyOrDesignation: 'Technical Director, Kautex Automotive Components',
        reviewText: 'We switched our glass-filled nylon sourcing to OM Polymer six months ago. The fiber dispersion is remarkably uniform, leading to reduced mold shrinkage and improved weld-line strength.',
        rating: 5,
        isApproved: true,
        isPublished: true,
        createdAt: '2024-02-05T14:30:00Z'
      },
      {
        testimonialId: 3,
        displayName: 'Demo Reviewer',
        companyOrDesignation: 'Pending Verification',
        reviewText: 'Testing review submission that is currently awaiting moderation.',
        rating: 4,
        isApproved: false,
        isPublished: false,
        createdAt: '2024-03-01T09:00:00Z'
      }
    ];
  }
}

export const db = new Database();
