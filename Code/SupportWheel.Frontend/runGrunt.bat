@echo off
echo Installing npm dependencies
call npm config set registry http://registry.npmjs.org/
call npm install
echo Running grunt.cli()
call node -e "var g = require('grunt'); g.cli.tasks = ['build']; g.cli.options.color = false; g.cli();"