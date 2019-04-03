const path = require('path');

export default {
  entry: {
    index:path.resolve(__dirname, 'src/index.js'),
    common:[
      "@antv/data-set",
      "bizcharts",
    ],
  },
  // proxy: {
  //   "/userservice": {
  //     "target": 'http://192.168.3.8:8020',
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/test" : "" }
  //   },
  //   "/cross": {
  //     "target": "http://jsonplaceholder.typicode.com",
  //     "changeOrigin": true,
  //     "pathRewrite": {"^/cross": ""}
  //   } // 此处有一点需要注意，不能在最后一个代理对象后面加逗号，否则会报错！！！
  // },
  commons:[{
    name: "common",
    minChunks: Infinity,
  }],
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
    minify: {
      removeComments: true,              
      collapseWhitespace: true,           
      removeAttributeQuotes: true        
     }
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
