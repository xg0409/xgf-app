var path = require('path');
module.exports = {

  options: {
    projectRoot: './projects',
    projectName: 'projects',
    devServer: {
      host: 'localhost',
      port: 10086,
      publicPath: 'http://localhost:10086/public/'
    },
    assets: {
      dev: 'http://localhost:10086/public/',
      prod: "http://css.40017.com/webapp/"
    }

  },

  projects: {
    activities: {
      _metaInfo: {
        // 是否自动生成index.html到模块默认true
        genIndexHtml: true,
        version: '111'
      },
      activities1: {
        _metaInfo: {
          version: '2222',
          genIndexHtml: false
        },
        match: /^\/activities\/activities1(\/)$/,
        entry: './projects/activities/activities1/index.js',
        jsBundles: [
          'http://localhost:8090/public/lib/angular.js',
          'http://localhost:8090/public/lib/angular-ui-router.js',
          'activities/activities1/bundle.js?${version}'
        ],
        cssBundles: [
          'http://js.40017.cn/jinrong/common/styles/m.ratchet.min.css',
          'activities/activities1/bundle.css?${version}'
        ]
      },
      activities2: {
        _metaInfo: {
          version: '',
          genIndexHtml: true
        },
        match: /^\/activities\/activities2(\/)$/,
        entry: './projects/activities/activities2/index.js',
        jsBundles: [],
        cssBundles: []
      }
    },
    dialogs: {
      _metaInfo: {
        // 是否自动生成index.html到模块默认true
        genIndexHtml: true,
        version: ''
      },
      message: {
        _metaInfo: {
          version: '',
          genIndexHtml: true
        },
        match: /^$/,
        entry: './projects/dialogs/message/index.js',
        jsBundles: [],
        cssBundles: []
      }
    }
  }
};
