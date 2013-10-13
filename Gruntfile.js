module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['*.js', '*/*.js'],
      options: {
        ignores: ['mootools/**'],
        smarttabs: true,
        laxcomma: true,
      },
    },
    watch: {
      files: ['*.js', '*/*.js'],
      tasks: ['default'],
      options: {
        atBegin: true,
        interrupt: true,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};
