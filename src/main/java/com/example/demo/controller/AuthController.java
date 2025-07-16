package com.example.demo.controller;

import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/registro")
    public String showRegistrationForm(Model model) {
        model.addAttribute("userDto", new UserRegistrationDto());
        return "registro";
    }

    @PostMapping("/registro")
    public String registerUser(@Valid @ModelAttribute("userDto") UserRegistrationDto registrationDto, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "registro";
        }
        try {
            userService.registerNewUser(registrationDto);
        } catch (IllegalStateException e) {
            result.rejectValue("username", null, e.getMessage());
            return "registro";
        }
        return "redirect:/registro?success";
    }
}