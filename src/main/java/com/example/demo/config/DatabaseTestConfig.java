package com.example.demo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
@Slf4j
public class DatabaseTestConfig {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Bean
    @Profile("prod")
    public CommandLineRunner testDatabaseConnection(DataSource dataSource) {
        return args -> {
            log.info("🔗 Probando conexión a la base de datos...");
            log.info("📋 URL: {}", databaseUrl);
            log.info("👤 Usuario: {}", username);
            
            try (Connection connection = dataSource.getConnection()) {
                if (connection != null && !connection.isClosed()) {
                    log.info("✅ Conexión exitosa a Railway MySQL!");
                    log.info("🏷️  Esquema: {}", connection.getSchema());
                } else {
                    log.error("❌ Error: La conexión está cerrada");
                }
            } catch (Exception e) {
                log.error("❌ Error al conectar con la base de datos: {}", e.getMessage());
                throw new RuntimeException("No se pudo conectar con Railway MySQL", e);
            }
        };
    }
}
