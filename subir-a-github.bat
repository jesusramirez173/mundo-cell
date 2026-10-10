@echo off
chcp 65001 >nul
echo ========================================================
echo       MUNDO CELL - SUBIR PROYECTO A GITHUB (APK)
echo ========================================================
echo.
echo Este asistente subirá el proyecto a tu cuenta de GitHub.
echo Al subirlo, GitHub Actions compilará automáticamente el APK
echo y lo pondrá a tu disposición para descargarlo e instalarlo.
echo.

set /p REPO_URL="Pega la URL de tu repositorio de GitHub (ej. https://github.com/jesusramirez173/mundo-cell.git): "

if "%REPO_URL%"=="" (
    echo Error: Debes ingresar una URL de repositorio válida.
    pause
    exit /b 1
)

echo.
echo [1/3] Configurando enlace remoto...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Preparando rama principal (main)...
git branch -M main

echo [3/3] Subiendo código a GitHub...
git push -u origin main

if %errorLevel% equ 0 (
    echo.
    echo ========================================================
    echo  ¡ÉXITO! Proyecto subido a GitHub correctamente.
    echo ========================================================
    echo.
    echo GitHub Actions está compilando tu archivo MundoCell-v1.0.apk.
    echo Entra a la pestaña "Actions" o "Releases" de tu repositorio
    echo para descargar e instalar el APK en tu celular.
) else (
    echo.
    echo Ocurrió un error al subir. Verifica tus credenciales de GitHub o que el repositorio exista.
)

echo.
pause
