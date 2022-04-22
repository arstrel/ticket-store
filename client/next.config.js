module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  experimental: {
    outputStandalone: true,
  },
};
