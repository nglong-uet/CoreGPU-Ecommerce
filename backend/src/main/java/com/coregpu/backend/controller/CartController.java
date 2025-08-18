package com.coregpu.backend.controller;

import com.coregpu.backend.dto.CartRequest;
import com.coregpu.backend.entity.CartItem;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.repo.CartRepository;
import com.coregpu.backend.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartController(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        CartItem existingItem = cartRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId());

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartRepository.save(existingItem);
            return ResponseEntity.ok("Sản phẩm đã cập nhật số lượng");
        } else {
            Product product = productRepository.findById(request.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.badRequest().body("Sản phẩm không tồn tại");
            }
            CartItem newItem = new CartItem(request.getUserId(), product, request.getQuantity());
            cartRepository.save(newItem);
            return ResponseEntity.ok("Sản phẩm đã thêm mới vào giỏ hàng");
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartItems(@PathVariable Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (CartItem item : items) {
            Product product = item.getProduct();
            if (product != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("product", product);
                map.put("quantity", item.getQuantity());
                result.add(map);
            }
        }

        return ResponseEntity.ok(result);
    }


    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        CartItem item = cartRepository.findByUserIdAndProductId(userId, productId);
        if (item != null) {
            cartRepository.delete(item);
            return ResponseEntity.ok("Đã xoá sản phẩm khỏi giỏ hàng");
        }
        return ResponseEntity.notFound().build();
    }
}

