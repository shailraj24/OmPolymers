export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    AUTH_TOKEN: 'om_token',
    ADMIN_NAME: 'om_admin_name',
    ADMIN_ROLE: 'om_admin_role',
    THEME: 'om_theme_preference'
  },
  DEFAULT_CONTACT: {
    PHONE: '+91 8866246042',
    PHONE_TEL: 'tel:+918866246042',
    EMAIL: 'sales@ompolymer.com',
    EMAIL_MAILTO: 'mailto:sales@ompolymer.com',
    ADDRESS: 'Vegdi GIDC, Plot No. 59, Dhoraji, Gujarat, India',
    MAPS_URL: 'https://maps.google.com/?q=Vegdi+GIDC,+Plot+No.+59,+Dhoraji,+Gujarat,+India'
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_SIZE: 10
  }
} as const;
