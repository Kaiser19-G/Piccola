# Multi-stage build para optimizar el tamaño de la imagen

# Etapa 1: Build
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Runtime - Usar imagen más segura
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copiar el JAR desde la etapa de build
COPY --from=builder /app/target/piccola-app.jar app.jar

# Configurar variables de entorno
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
