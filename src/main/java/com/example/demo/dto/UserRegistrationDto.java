package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDto {
    @NotEmpty(message = "El nombre de usuario no puede estar vacío.")
    private String username;

    @NotEmpty(message = "El email no puede estar vacío.")
    @Email(message = "Debe ser una dirección de email válida.")
    private String email;

    @NotEmpty(message = "La contraseña no puede estar vacía.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String password;
}
