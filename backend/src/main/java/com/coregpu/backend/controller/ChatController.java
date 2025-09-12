package com.coregpu.backend.controller;

import com.coregpu.backend.dto.ProductDTO;
import com.coregpu.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ProductService productService;

    public ChatController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");

        List<ProductDTO> products;

        if (userMessage.matches(".*\\d+.*")) {
            products = parseAndSearchByPrice(userMessage);
        } else {
            products = productService.searchProductsWithThumbnails(userMessage);
        }

        String reply;
        if (products.isEmpty()) {
            reply = "Xin lỗi, tôi chưa tìm thấy sản phẩm phù hợp theo yêu cầu của bạn.";
        } else {
            StringBuilder sb = new StringBuilder("Tôi gợi ý cho bạn:\n");
            for (ProductDTO p : products) {
                sb.append("- ")
                        .append(p.getName())
                        .append(" (")
                        .append(p.getMemory()).append(") - ")
                        .append(String.format("%,.0f", p.getPrice())) // format có dấu ,
                        .append(" VNĐ\n");
            }
            reply = sb.toString();
        }

        return Map.of("role", "assistant", "content", reply);
    }

    private List<ProductDTO> parseAndSearchByPrice(String message) {
        Pattern numberPattern = Pattern.compile("(\\d+)");
        Matcher matcher = numberPattern.matcher(message);
        List<Integer> numbers = new ArrayList<>();
        while (matcher.find()) {
            numbers.add(Integer.parseInt(matcher.group()));
        }

        double multiplier = 1;
        if (message.toLowerCase().contains("triệu")) {
            multiplier = 1_000_000;
        } else if (message.toLowerCase().contains("k")) {
            multiplier = 1_000;
        }

        Double minPrice = null, maxPrice = null;
        if (numbers.size() == 1) {
            double value = numbers.get(0) * multiplier;
            if (message.toLowerCase().contains("dưới") || message.contains("<")) {
                maxPrice = value;
            } else if (message.toLowerCase().contains("trên") || message.contains(">")) {
                minPrice = value;
            } else {
                // mặc định coi là "dưới X"
                maxPrice = value;
            }
        } else if (numbers.size() >= 2) {
            minPrice = numbers.get(0) * multiplier;
            maxPrice = numbers.get(1) * multiplier;
        }

        return productService.searchProductsByPriceRange(minPrice, maxPrice);
    }
}
