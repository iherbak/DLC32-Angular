echo packing

Powershell -Command "(Get-Content .\dist\dlc32-ui\index.html -Raw) -Replace '(<noscript.*)/noscript>|(<script.*)script>|(<link.*)"">|(<style.*)style>','' | Set-Content .\dist\index.html"

Powershell -Command "Get-ChildItem -Path .\dist\dlc32-ui\* -Include *.js | Foreach-Object{ Get-Content $_.FullName -Raw } | Set-Content .\dist\mergedscripts.js"
Powershell -Command "Get-ChildItem -Path .\dist\dlc32-ui\* -Include *.css | Foreach-Object{ Get-Content $_.FullName -Raw } | Set-Content .\dist\mergedstyles.css"

Powershell -Command "(Get-Content .\dist\index.html -Raw) -Replace '</body>', '<script type=\"text/javascript\">scriptplaceholder</script><style>styleplaceholder</style></body>' | Set-Content .\dist\index.html"

Powershell -Command "(Get-Content .\dist\index.html -Raw) -Replace 'scriptplaceholder', (Get-Content .\dist\mergedscripts.js -Raw) | Set-Content .\dist\index.html"
Powershell -Command "(Get-Content .\dist\index.html -Raw) -Replace 'styleplaceholder',  (Get-Content .\dist\mergedstyles.css -Raw) | Set-Content .\dist\index.html"

@REM del .\dist\mergedscripts.js
@REM del .\dist\mergedstyles.css

@REM Powershell -Command "tar -cvzf .\dist\index.html.gz  .\dist\index.html"

@REM del .\dist\index.html