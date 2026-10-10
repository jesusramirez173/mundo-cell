@echo off
chcp 65001 >nul
echo ========================================================
echo       MUNDO CELL - SUBIR PROYECTO A GITHUB (APK)
echo ========================================================
echo.
echo Repositorio vinculado: https://github.com/jesusramirez173/mundo-cell.git
echo Rama: main
echo.
echo Subiendo codigo a GitHub...
git push -u origin main
echo.
if %errorLevel% equ 0 (
    echo ========================================================
    echo  ¡EXITO! Codigo subido correctamente a GitHub.
    echo ========================================================
    echo.
    echo GitHub Actions esta compilando tu archivo MundoCell-v1.0.apk.
    echo Puedes ver el progreso y descargar el APK en:
    echo https://github.com/jesusramirez173/mundo-cell/actions
    echo https://github.com/jesusramirez173/mundo-cell/releases
) else (
    echo ========================================================
    echo  Atencion: Se requiere inicio de sesion de GitHub
    echo ========================================================
    echo Si se abrio una ventana de GitHub en tu navegador, haz clic en "Sign in"
    echo para autorizar la subida.
)
echo.
pause
