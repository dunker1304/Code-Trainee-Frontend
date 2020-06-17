const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE } = process.env

module.exports = {
  generateBuildId: async () => {
    return require('child_process').execSync('git rev-parse HEAD').toString().replace('\n', '')
  },
  webpack: (config, options) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }));

      // const rule = config.module.rules
      //   .find(rule => rule.oneOf)
      //   .oneOf.find(
      //     r =>
      //       // Find the global CSS loader
      //       r.issuer && r.issuer.include && r.issuer.include.includes("_app")
      //   );
      // if (rule) {
      //   rule.issuer.include = [
      //     rule.issuer.include,
      //     // Allow `monaco-editor` to import global CSS:
      //     /[\\/]node_modules[\\/]monaco-editor[\\/]/
      //   ];
      // }
      
      // config.plugins.push(new MonacoWebpackPlugin({
      //   languages: [
      //     'json',
      //     'javascript'
      //   ]
      // }))
    }
    
    config.module.rules.push({
    
    })

    return config
  }
}