package com.example.demo.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.dto.CartItemDto;
import com.example.demo.entity.Order;
import com.example.demo.entity.User;
import com.example.demo.Repository.OrderRepository;
import com.example.demo.services.EmailService;
import com.example.demo.services.OrderService;
import com.example.demo.services.PdfService;
import com.example.demo.services.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Controller
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final PdfService pdfService;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    public OrderController(OrderService orderService, UserService userService, OrderRepository orderRepository,
                           PdfService pdfService, EmailService emailService, ObjectMapper objectMapper) {
        this.orderService = orderService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.pdfService = pdfService;
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/pago")
    public String checkoutPage() {
        return "pago";
    }
    
    @PostMapping("/pago/procesar")
    public String processOrder(@RequestParam("cartData") String cartDataJson, Principal principal, RedirectAttributes redirectAttributes) {
        if (principal == null) {
            return "redirect:/login";
        }
        try {
            User user = userService.findByUsername(principal.getName());
            List<CartItemDto> cartItems = objectMapper.readValue(cartDataJson, new TypeReference<>() {});

            Order newOrder = orderService.createOrder(user, cartItems);
            byte[] pdf = pdfService.generateOrderPdf(newOrder);
            emailService.sendOrderConfirmationEmail(user.getEmail(), newOrder, pdf);

            redirectAttributes.addAttribute("orderId", newOrder.getId());
            return "redirect:/pago-exitoso";
        } catch (IOException | IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", "Error al procesar el pedido: " + e.getMessage());
            return "redirect:/home";
        }
    }

    @GetMapping("/pago-exitoso")
    public String orderSuccess(@RequestParam("orderId") Long orderId, Model model) {
        model.addAttribute("orderId", orderId);
        return "pago_exitoso";
    }

    @GetMapping("/mis-pedidos")
    public String myOrdersPage(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("orders", orderRepository.findByUserOrderByOrderDateDesc(user));
        return "mis_pedidos";
    }

    @GetMapping("/pedido/{id}/pdf")
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long id, Authentication authentication) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));

        String currentUsername = authentication.getName();
        boolean isOwner = order.getUser().getUsername().equals(currentUsername);
        boolean isEmployee = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));

        if (!isOwner && !isEmployee) {
            throw new AccessDeniedException("No tienes permiso para ver este recibo.");
        }
        
        byte[] pdfBytes = pdfService.generateOrderPdf(order);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "recibo_pedido_" + id + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
