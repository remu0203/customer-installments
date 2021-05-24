module.exports = {
    devServer: {
      proxy: {
        '^/sc2-admin/fe-payments/': {
          target: 'https://login.smartcharts.xyz/',
          //ws: true,
          changeOrigin: true
        }
      }
    }
  }