package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.Repository.OrderRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    private final OrderRepository orderRepository;

    public DashboardController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public String getDashboard(Model model) {
        List<Order> allOrders = orderRepository.findAllByOrderByOrderDateDesc();
        long totalOrders = allOrders.size();
        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Order> recentOrders = allOrders.stream().limit(10).toList();

        model.addAttribute("totalOrders", totalOrders);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("recentOrders", recentOrders);
        
        return "dashboard_empleado";
    }
}