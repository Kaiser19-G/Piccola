// Ubicación: src/main/java/com/piccola/config/SecurityConfig.java
package com.example.demo.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            // --- ¡PRIORIDAD NÚMERO 1! ---
            // Le decimos a Spring Security que estas rutas DEBEN ser públicas SIEMPRE,
            // sin importar si el usuario está logueado o no.
            // Esta regla se evaluará primero.
            .requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()

            // --- PRIORIDAD NÚMERO 2 ---
            // Páginas que también son siempre públicas.
            .requestMatchers("/", "/home", "/login", "/registro").permitAll()

            // --- REGLAS PARA USUARIOS AUTENTICADOS ---
            .requestMatchers("/pago/**", "/mis-pedidos", "/pedido/**").hasAnyAuthority("ROLE_USER", "ROLE_EMPLOYEE")
            .requestMatchers("/dashboard/**").hasAuthority("ROLE_EMPLOYEE")
            
            // --- REGLA FINAL ---
            // Todas las demás peticiones deben ser autenticadas.
            .anyRequest().authenticated()
        )
        .formLogin(form -> form
            .loginPage("/login")
            .loginProcessingUrl("/login")
            .defaultSuccessUrl("/home", true) // Redirige a /home después de un login exitoso
            .failureUrl("/login?error=true")
            .permitAll()
        )
        .logout(logout -> logout
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/login?logout")
            .permitAll()
        )
        .csrf(csrf -> csrf.disable()); // Simplificamos para la prueba

    return http.build();
}
}