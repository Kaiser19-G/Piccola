# 🍕 Piccola - Aplicación de Restaurante

Una aplicación web completa para gestión de restaurante construida con Spring Boot y Bootstrap.

## 🚀 Despliegue en Render.com

### Paso 1: Preparar el repositorio
1. Sube tu código a GitHub
2. Asegúrate de que todos los archivos de configuración estén incluidos

### Paso 2: Configurar la base de datos en Railway
1. Ve a [Railway.app](https://railway.app/)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Agrega un servicio **MySQL**
5. Una vez creado, ve a la pestaña **"Variables"** del servicio MySQL
6. Copia las siguientes variables que Railway genera automáticamente:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

### Paso 3: Crear el Web Service
1. En Render, selecciona "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configura los siguientes parámetros:

**Configuración básica:**
- **Name**: piccola-app
- **Environment**: Java
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/piccola-app.jar`

### Paso 4: Configurar Variables de Entorno
Agrega las siguientes variables de entorno en Render:

**Variables de Railway MySQL:**
```
MYSQLHOST=yamanote.proxy.rlwy.net
MYSQLPORT=28411
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=pFdxybzAvYZDjdvsIyURmKakkWKycbQE
```

**Variables de la aplicación:**
```
SPRING_PROFILES_ACTIVE=prod
EMAIL_USERNAME=valentinohernandez27@gmail.com
EMAIL_PASSWORD=tu_app_password_gmail
DDL_AUTO=update
SHOW_SQL=false
LOG_LEVEL=INFO
```

### Paso 5: Configurar Gmail (para notificaciones)
1. Activa la autenticación de 2 factores en Gmail
2. Genera una contraseña de aplicación
3. Usa esa contraseña en la variable `EMAIL_PASSWORD`

## 🛠️ Desarrollo Local

### Requisitos
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Instalación
1. Clona el repositorio
2. Configura la base de datos MySQL
3. Actualiza `application.properties` con tus credenciales
4. Ejecuta: `mvn spring-boot:run`

### Estructura del Proyecto
```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── config/          # Configuraciones
│   │   ├── controller/      # Controladores REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entidades JPA
│   │   ├── Repository/     # Repositorios
│   │   └── services/       # Servicios de negocio
│   └── resources/
│       ├── static/         # Recursos estáticos (CSS, JS, imágenes)
│       └── templates/      # Templates Thymeleaf
└── test/                   # Pruebas unitarias
```

## 📝 Funcionalidades
- ✅ Gestión de menú y productos
- ✅ Sistema de pedidos
- ✅ Autenticación y autorización
- ✅ Dashboard de empleados
- ✅ Generación de PDFs
- ✅ Notificaciones por email
- ✅ Carrito de compras
- ✅ Sistema de pagos

## 🔧 Tecnologías Utilizadas
- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Frontend**: Thymeleaf, Bootstrap, JavaScript
- **Base de datos**: MySQL
- **PDF**: iText
- **Email**: Spring Mail

## 🐛 Troubleshooting

### Problemas comunes en Render:
1. **Error de puerto**: Render asigna el puerto automáticamente via `$PORT`
2. **Base de datos**: Usa variables de entorno para la configuración
3. **Recursos estáticos**: Configurados en `WebConfig.java`

### Logs útiles:
```bash
# Ver logs de la aplicación
heroku logs --tail

# Verificar estado de la base de datos
# Usar panel de Render para monitorear
```

## 📞 Soporte
Para problemas con el despliegue, revisa:
1. Logs de build en Render
2. Variables de entorno configuradas
3. Conectividad con la base de datos
