# Script para probar Docker localmente

# Construir la imagen
docker build -t piccola-app .

# Ejecutar el contenedor
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e MYSQLHOST=yamanote.proxy.rlwy.net \
  -e MYSQLPORT=28411 \
  -e MYSQLDATABASE=railway \
  -e MYSQLUSER=root \
  -e MYSQLPASSWORD=pFdxybzAvYZDjdvsIyURmKakkWKycbQE \
  piccola-app

# Verificar que funciona
# curl http://localhost:8080/health
