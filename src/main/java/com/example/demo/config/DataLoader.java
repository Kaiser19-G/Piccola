package com.example.demo.config;

import com.example.demo.entity.Product;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.RoleRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(RoleRepository roleRepository, UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Carga los datos solo si no existen para evitar duplicados en reinicios.
        loadRoles();
        loadEmployeeUser();
        loadProducts();
    }

    private void loadRoles() {
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role("ROLE_USER"));
        }
        if (roleRepository.findByName("ROLE_EMPLOYEE").isEmpty()) {
            roleRepository.save(new Role("ROLE_EMPLOYEE"));
        }
    }

    private void loadEmployeeUser() {
        if (!userRepository.existsByUsername("empleado")) {
            User employee = new User();
            employee.setUsername("empleado");
            employee.setEmail("empleado@piccola.com");
            employee.setPassword(passwordEncoder.encode("password123")); // Contraseña para el empleado
            
            Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseThrow(() -> new RuntimeException("Error: Rol 'ROLE_EMPLOYEE' no encontrado."));
            employee.setRoles(Set.of(employeeRole));
            
            userRepository.save(employee);
        }
    }

    private void loadProducts() {
        if (productRepository.count() == 0) {
            productRepository.save(new Product(null, "Clásica Piccola", "Hamburguesa con queso cheddar, lechuga, tomate y nuestra salsa secreta.", new BigDecimal("8.50"), "/images/hamburguesa classica.JPG"));
            productRepository.save(new Product(null, "Doble Bacon", "Doble carne, doble queso cheddar y una generosa porción de bacon crujiente.", new BigDecimal("11.00"), "https://i.imgur.com/PZCFv3b.png"));
            productRepository.save(new Product(null, "Pollo Crispy", "Jugosa pechuga de pollo empanizada, mayonesa cremosa y lechuga fresca.", new BigDecimal("9.00"), "https://i.imgur.com/G5g3g7U.png"));
            productRepository.save(new Product(null, "Veggie Deluxe", "Deliciosa hamburguesa a base de lentejas, con aguacate, rúcula y tomate.", new BigDecimal("9.50"), "https://i.imgur.com/e58fJvB.png"));
        }
    }
}