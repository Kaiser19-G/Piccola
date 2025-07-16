# 🚀 Guía de Despliegue: Piccola en Render + Railway

## ✅ **Base de datos ya configurada en Railway**
- **Host**: yamanote.proxy.rlwy.net
- **Puerto**: 28411
- **Base de datos**: railway
- **Usuario**: root
- **Contraseña**: pFdxybzAvYZDjdvsIyURmKakkWKycbQE

## 📋 **Pasos para desplegar en Render**

### 1. Subir código a GitHub
```bash
git add .
git commit -m "Configure for Railway MySQL + Render deployment"
git push origin main
```

### 2. Crear Web Service en Render
1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Conecta tu repositorio GitHub `Kaiser19-G/Piccola`
4. Configura:
   - **Name**: `piccola-app`
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/piccola-app.jar`

### 3. Configurar Variables de Entorno en Render
Agrega estas variables en el dashboard de Render:

```
SPRING_PROFILES_ACTIVE=prod
MYSQLHOST=yamanote.proxy.rlwy.net
MYSQLPORT=28411
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=pFdxybzAvYZDjdvsIyURmKakkWKycbQE
DDL_AUTO=update
SHOW_SQL=false
LOG_LEVEL=INFO
EMAIL_USERNAME=valentinohernandez27@gmail.com
EMAIL_PASSWORD=eblj_rrbc_unzc_vegr
```

### 4. Deploy y Verificar
1. Click "Create Web Service"
2. Espera a que termine el build (5-10 minutos)
3. Verifica la aplicación en la URL proporcionada
4. Revisa los logs para confirmar la conexión con Railway

## 🔍 **Verificación de la conexión**
- La aplicación intentará conectarse a Railway al iniciar
- Los logs mostrarán "✅ Conexión exitosa a Railway MySQL!"
- El endpoint `/health` confirmará que el servicio está funcionando

## 🛠️ **Troubleshooting**
- **Error de conexión**: Verifica que las variables de entorno estén correctas
- **Puerto incorrecto**: Asegúrate de usar el puerto 28411 (no 3306)
- **Timeout**: Railway puede tardar en responder, es normal

## 🎯 **URLs importantes**
- **Aplicación**: `https://piccola-app.onrender.com`
- **Health Check**: `https://piccola-app.onrender.com/health`
- **Railway Dashboard**: `https://railway.app/dashboard`
