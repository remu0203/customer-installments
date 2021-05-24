module.exports = {
    devServer: {
      proxy: {
        '^/sc2-admin/fe-payments/customer-installment': {
          target: 'https://login.smartcharts.xyz/',
          //ws: true,
          changeOrigin: true
        }
      }
    }
  }