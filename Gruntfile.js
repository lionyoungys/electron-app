module.exports = function(grunt) {
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'create-windows-installer': {
            // x64: {
            //   appDirectory: 'packager/electron-win32-ia32',
            //   outputDirectory: 'build/installer64',
            //   authors: 'yangyunlong',
            //   exe: '速洗达商家端.exe'
            // },
            ia32: {
              appDirectory: 'packager/速洗达商家端-win32-ia32',
              authors: 'yangyunlong'
              //exe: 'electron.exe',
              //description: '速洗达商家端'
            }
          }
      });
    
      grunt.loadNpmTasks('grunt-electron-installer')
    
      // 默认被执行的任务列表。
      grunt.registerTask('default', ['create-windows-installer']);
    
    };