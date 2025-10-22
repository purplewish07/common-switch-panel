module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var pkgJson = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-ts");
  // grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({
    clean: ['dist'],

    copy: {
      dist_js: {
        expand: true,
        cwd: 'src',
        src: ['**/*.ts', '**/*.d.ts'],
        dest: 'dist',
      },
      dist_html: {
        expand: true,
        flatten: true,
        cwd: 'src/partials',
        src: ['*.html'],
        dest: 'dist/partials/',
      },
      dist_css: {
        expand: true,
        flatten: true,
        cwd: 'src/css',
        src: ['*.css'],
        dest: 'dist/css/',
      },
      dist_img: {
        expand: true,
        flatten: true,
        cwd: 'src/img',
        src: ['*.*'],
        dest: 'dist/img/',
      },
      dist_statics: {
        expand: true,
        flatten: true,
        src: ['src/*.json', 'LICENSE', 'README.md'],
        dest: 'dist/',
      },
      // app_core_utils: {
      //   expand: true,
      //   flatten: true,
      //   cwd: 'reference',
      //   src: ['fontsize.ts', 'operationURL.ts'],
      //   dest: 'node_modules/grafana-sdk-mocks/app/core/utils/',
      // },
      app_headers: {
        expand: true,
        flatten: true,
        cwd: 'reference',
        src: ['common.d.ts'],
        dest: 'node_modules/grafana-sdk-mocks/app/headers/',
      },
    },

    ts: {
      build: {
        src: ['dist/**/*.ts', '!**/*.d.ts'],
        dest: 'dist',
        options: {
          module: 'system', 
          target: 'es5',
          rootDir: 'dist/',
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          sourceMap: true,
          noImplicitAny: false,
          moduleResolution: 'node',  // 新增這行
          skipLibCheck: true,        // 新增這行，跳過庫文件檢查
          skipDefaultLibCheck: true, // 新增這行
          lib: ['es5', 'es2015', 'dom'], // 新增這行，指定庫
          removeComments: false  // 新增這行，保留註解
        },
      },
    },

    // old
    // typescript: {
    //   build: {
    //     src: ['dist/**/*.ts', '!**/*.d.ts'],
    //     dest: 'dist',
    //     options: {
    //       module: 'system',
    //       target: 'es5',
    //       rootDir: 'dist/',
    //       declaration: true,
    //       emitDecoratorMetadata: true,
    //       experimentalDecorators: true,
    //       sourceMap: true,
    //       noImplicitAny: false,
    //     },
    //   },
    // },

    // Babel 7.x 配置
    babel: {
      options: {
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-transform-for-of',
          // '@babel/plugin-transform-modules-systemjs'
        ],
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.js'],
          dest: 'dist'
        }]
      }
    },

    'string-replace': {
      dist: {
        files: [
          {
            cwd: 'src',
            expand: true,
            src: ['**/plugin.json'],
            dest: 'dist',
          },
        ],
        options: {
          replacements: [
            {
              pattern: '%VERSION%',
              replacement: pkgJson.version,
            },
            {
              pattern: '%TODAY%',
              replacement: '<%= grunt.template.today("yyyy-mm-dd") %>',
            },
          ],
        },
      },
    },

    watch: {
      files: [
        'src/**/*.ts',
        'src/**/*.html',
        'src/**/*.css',
        'src/img/*.*',
        'src/plugin.json',
        'README.md',
      ],
      tasks: ['default'],
      options: {
        debounceDelay: 250,
      },
    },
  });
  
  grunt.registerTask('default', [
    'clean',
    'copy:dist_js',
    // 'copy:app_core_utils',
    'copy:app_headers',
    'ts:build',          // 先編譯 TypeScript
    // 'babel:dist',        // 再用 Babel 處理 ES6+ 語法
    // 'typescript:build',
    'copy:dist_html',
    'copy:dist_css',
    'copy:dist_img',
    'copy:dist_statics',
    'string-replace',
  ]);
};
