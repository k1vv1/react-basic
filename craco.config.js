const {
  when,
  whenDev,
  whenProd,
  getPlugin,
  pluginByName,
} = require('@craco/craco')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBar = require('webpackbar')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CracoLessPlugin = require('craco-less')

const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)

// 判断编译环境是否为生产
const isBuildAnalyzer = process.env.BUILD_ANALYZER === 'true'

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve('src'),
    },
    plugins: [
      // webpack构建进度条
      new WebpackBar({
        profile: true,
      }),
      // 查看打包的进度
      new SimpleProgressWebpackPlugin(),
      ...whenDev(
        () => [
          new CircularDependencyPlugin({
            exclude: /node_modules/,
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
          }),
          new webpack.HotModuleReplacementPlugin(),
        ],
        [],
      ),
      /**
       * 编译产物分析
       *  - https://www.npmjs.com/package/webpack-bundle-analyzer
       * 新增打包产物分析插件
       */
      ...when(
        isBuildAnalyzer,
        () => [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static', // html 文件方式输出编译分析
            openAnalyzer: true,
            reportFilename: resolve('analyzer/index.html'),
          }),
        ],
        [],
      ),
      ...whenProd(
        () => [
          new TerserPlugin({
            // sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {
                warnings: false,
                drop_console: true, // 生产环境下移除控制台所有的内容
                drop_debugger: true, // 移除断点
                pure_funcs: ['console.log'], // 生产环境下移除console
              },
            },
          }),
          // 打压缩包
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')/div>'),
            threshold: 1024,
            minRatio: 0.8,
          }),
        ],
        [],
      ),
    ],
    // 抽离公用模块
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
    configure: (webpackConfig, { env, paths }) => {
      const isProd = process.env.env_config === 'prod'
      webpackConfig.devtool = isProd ? false : 'eval-source-map'

      let cdn = {
        js: [],
        css: [],
      }
      // 只有生产环境才配置
      whenProd(() => {
        webpackConfig.externals = {
          react: 'React',
          'react-dom': 'ReactDOM',
          'crypto-js': 'CryptoJS',
          axios: 'axios',
        }
        cdn = {
          js: [
            'https://unpkg.com/react@18.1.0/umd/react.production.min.js',
            'https://unpkg.com/react-dom@18.1.0/umd/react-dom.production.min.js',
            'https://ydcommon.51yund.com/vue/crypto-js.min.js',
            'https://ydcommon.51yund.com/vue/axios.min.js',
            process.env.env_config !== 'prod'
              ? 'https://ydcommon.51yund.com/test_web_hd/vendor/vconsole.min.js'
              : '',
          ],
          css: [],
        }
      })

      const { isFound, match } = getPlugin(
        webpackConfig,
        pluginByName('HtmlWebpackPlugin'),
      )
      if (isFound) {
        match.userOptions.cdn = cdn
      }

      // paths.appPath='public'
      paths.appBuild = 'dist'
      webpackConfig.output = {
        ...webpackConfig.output,
        path: resolve('dist'),
        publicPath:
          process.env.env_config === 'prod'
            ? 'https://ydcommon.51yund.com/'
            : process.env.env_config === 'test'
            ? '/vapps/test/'
            : '/',
      }

      return webpackConfig
    },
  },
  devServer: {
    // host: '0.0.0.0',
    port: 3000, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
      '/api': {
        target: 'https://test-org.51yund.com',
        changeOrigin: true,
        secure: false,
        xfwd: false,
      },
    },
  },
}
