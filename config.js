var config = {
  production: {
    baseUrl: '', // '' for relative links
    site: {
      url: process.env.SITE_URL || 'http://teliasonera.github.io', // full site url
      title: 'Telia TechBlog',
      googleAnalytics: 'UA-65719787-2'
    }
  },
  development: {
    baseUrl: process.env.DEV_BASE_URL || '', // '' for relative links
    site: {
      url: process.env.DEV_SITE_URL || 'http://localhost:8000', // full site url
      title: 'Telia TechBlog',
      googleAnalytics: process.env.DEV_GOOGLE_ANALYTICS || '123456'
    }
  },
  social: {
    github_username: 'teliasonera',
    stackoverflow_id: '',
    twitter_username: '',
    google_plus_id: '',
    email: '',
    linkedin_username: '',
    angellist_username: '',
    bitcoin_url: '',
    paypal_url: '',
    flattr_button: ''
  }
};

module.exports = config;
