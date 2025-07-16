#!/bin/bash

# Script de inicio para Render.com
echo "🚀 Iniciando aplicación Piccola..."

# Verificar que JAVA_HOME esté configurado
if [ -z "$JAVA_HOME" ]; then
    echo "⚠️  JAVA_HOME no está configurado, usando java del PATH"
fi

# Mostrar información del sistema
echo "📋 Información del sistema:"
echo "Java version: $(java -version 2>&1 | head -1)"
echo "Maven version: $(mvn -version 2>&1 | head -1)"
echo "Puerto: ${PORT:-8160}"
echo "Perfil activo: ${SPRING_PROFILES_ACTIVE:-default}"

# Limpiar y compilar el proyecto
echo "🔧 Limpiando y compilando el proyecto..."
mvn clean compile

# Construir la aplicación
echo "📦 Construyendo la aplicación..."
mvn package -DskipTests

# Verificar que el JAR se haya creado
if [ -f "target/piccola-app.jar" ]; then
    echo "✅ JAR creado exitosamente: target/piccola-app.jar"
else
    echo "❌ Error: No se pudo crear el JAR"
    exit 1
fi

# Iniciar la aplicación
echo "🎯 Iniciando la aplicación Spring Boot..."
java -jar target/piccola-app.jar
