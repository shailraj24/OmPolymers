export const API_ENDPOINTS = {
  COMPANY: {
    GET_INFO: '/company',
    GET_WHATSAPP_URL: '/contact/whatsapp-url',
    UPDATE: '/admin/company',
    UPLOAD_LOGO: '/admin/company/logo'
  },
  REQUIREMENTS: {
    SUBMIT: '/requirements',
    GET_ALL: '/admin/requirements',
    GET_BY_ID: (id: number) => `/admin/requirements/${id}`,
    UPDATE_STATUS: (id: number) => `/admin/requirements/${id}/status`
  },
  PRODUCTS: {
    LIST: '/products',
    FEATURED: '/products/featured',
    CATEGORIES: '/products/categories',
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    BY_ID: (id: number) => `/products/${id}`,
    CREATE: '/admin/products',
    UPDATE: (id: number) => `/admin/products/${id}`,
    TOGGLE_STATUS: (id: number) => `/admin/products/${id}/status`,
    DELETE: (id: number) => `/admin/products/${id}`
  },
  TESTIMONIALS: {
    PUBLIC_LIST: '/testimonials',
    ADMIN_LIST: '/admin/testimonials'
  },
  BLOGS: {
    PUBLIC_LIST: '/blogs',
    BY_SLUG: (slug: string) => `/blogs/${slug}`,
    CATEGORIES: '/blogs/categories',
    ADMIN_LIST: '/admin/blogs',
    CREATE: '/admin/blogs',
    UPDATE: (id: number) => `/admin/blogs/${id}`,
    PUBLISH: (id: number) => `/admin/blogs/${id}/publish`,
    UNPUBLISH: (id: number) => `/admin/blogs/${id}/unpublish`,
    DELETE: (id: number) => `/admin/blogs/${id}`
  },
  LOGS: {
    LIST: '/admin/logs',
    FILES: '/admin/logs/files',
    CLEAR: '/admin/logs/clear'
  },
  AUTH: {
    LOGIN: '/admin/auth/login',
    FORGOT_PASSWORD: '/admin/auth/forgot-password',
    RESET_PASSWORD: '/admin/auth/reset-password',
    CHANGE_PASSWORD: '/admin/auth/change-password',
    VERIFY: '/admin/auth/verify'
  },
  USERS: {
    LIST: '/admin/users',
    BY_ID: (id: number) => `/admin/users/${id}`,
    CREATE: '/admin/users',
    UPDATE: (id: number) => `/admin/users/${id}`,
    TOGGLE_STATUS: (id: number) => `/admin/users/${id}/status`,
    DELETE: (id: number) => `/admin/users/${id}`
  },
  DATABASE: {
    OVERVIEW: '/admin/database/overview',
    RESET: '/admin/database/reset'
  },
  UPLOADS: {
    IMAGE: '/uploads/image',
    LOGO: '/uploads/logo',
    LIST: '/uploads',
    BY_ID: (id: number) => `/uploads/${id}`,
    BY_CATEGORY: (category: string) => `/uploads/category/${category}`
  }
} as const;
