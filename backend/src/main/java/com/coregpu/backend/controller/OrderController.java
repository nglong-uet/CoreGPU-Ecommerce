package com.coregpu.backend.controller;

import com.coregpu.backend.entity.Order;
import com.coregpu.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String address
    ) {
        try {
            Order order = orderService.createOrder(userId, name, phone, address);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể tạo đơn hàng: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<String> completeOrder(@PathVariable Long id) {
        try {
            orderService.markOrderAsCompleted(id);
            return ResponseEntity.ok("Đơn hàng đã hoàn tất và tồn kho đã được cập nhật");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
