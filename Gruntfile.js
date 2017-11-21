var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');
grunt.loadNpmTasks('grunt-mocha-test');

grunt.initConfig({
   mochaTest: {
      testImageSize: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['tests/testImageSize.js']
      }
   },

   lambda_invoke: {
      default: {
         options: {
            file_name: 'index.js'
         }
      }
   },
   lambda_deploy: {
      default: {
         arn: 'arn:aws:lambda:us-east-1:767259522535:function:CreateThumbnail',
         options: {
             region: 'us-east-1'
         }
      }
   },
   lambda_package: {
      default: {
         options: {
            include_time: false,
            include_version: false
         }
   }
   }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])
grunt.registerTask('test', ['mochaTest']);
