module.exports = {
    // publicPath: "/",
    publicPath: process.env.NODE_ENV === 'production' ? '/installment-payments' : '/',
    // assetsPublicPath: '/',   
    devServer: {
      proxy: {
        '^/sc2-admin/fe-payments/': {
          target: 'https://login.smartcharts.xyz/',
          ws: true,
          changeOrigin: true
        }
      }
    },    
  }