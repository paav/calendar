module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      cal: {
        src: 'calendar.{js,css}',
        dest: 'test/js/lib/paav/calendar/'
      },
      lib: {
        cwd: 'lib',
        src: '**',
        dest: 'test/js/lib/',
        expand: true,
      }
    },

    watch: {
      cal: {
        files: [
          'calendar.{js,css}',
        ],
        tasks: ['copy:cal'],
        options: {
          spawn: false,
        },
      },
      lib: {
        files: [
          'lib/**/*',
        ],
        tasks: ['copy:lib'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);
};

