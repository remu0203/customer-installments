module.exports = {
  devServer: {
    proxy: {
      '^/sc2-admin/fe-payments/customer': {
        target: 'https://portal-login.app',
        //ws: true,
        changeOrigin: true,
        logLevel: "debug",
      }
    }
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/<REPO>/,
   * (i.e. your repository is at https://github.com/<USERNAME>/<REPO>),
   * set publicPath to "/<REPO>/". For example, if your repo name is "my-project",
   * your vue.config.js should look like this:
   */
  publicPath: process.env.NODE_ENV === 'production'
  ? '/'
  : '/'
}
