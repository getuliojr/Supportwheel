echo
echo Instalando pacotes através do NPM
call npm install --production
echo
echo Copiando scripts para a pasta correta
call xcopy node_modules .\app\libs /y /i /s
echo
echo Instalação das bibliotecas concluídas