var config = {
  production: {
    baseUrl: process.env.BASE_URL || '', // '' for relative links
    site: {
      url: process.env.SITE_URL || 'http://teliasonera.github.io/tech-blog', // full site url
      title: 'TeliaSonera TechBlog',
      googleAnalytics: process.env.GOOGLE_ANALYTICS || '123457'
    }
  },
  development: {
    baseUrl: process.env.DEV_BASE_URL || '', // '' for relative links
    site: {
      url: process.env.DEV_SITE_URL || 'http://localhost:8000', // full site url
      title: 'TeliaSonera TechBlog',
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
