echo
echo Instalando pacotes através do NPM
call npm install --prefix .temp\scripts
echo
echo Copiando scripts para a pasta correta
call xcopy .temp\scripts\node_modules .\app\libs
echo
echo Instalação das bibliotecas concluídas