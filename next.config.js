const withSass = require('@zeit/next-sass')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE } = process.env

module.exports = withSass({
  generateBuildId: async () => {
    return require('child_process').execSync('git rev-parse HEAD').toString().replace('\n', '')
  },
  webpack: (config, options) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }))

      // config.plugins.push(
      //   new webpack.ProvidePlugin({
      //       '$': 'jquery',
      //       'jQuery': 'jquery',
      //   })
      // )
    }

    config.module.rules.push({
      
    })

    return config
  }
})