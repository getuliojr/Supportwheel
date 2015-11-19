echo
echo Instalando Bower
call npm install bower
echo
echo Limpando Cache Bower
call node_modules\.bin\bower cache clean
echo
echo Instalando Bower.json
call node_modules\.bin\bower install