package com.coregpu.backend.controller;

import com.coregpu.backend.dto.ProductDTO;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.entity.ProductImage;
import com.coregpu.backend.repo.ProductImageRepository;
import com.coregpu.backend.repo.ProductRepository;
import com.coregpu.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductImageRepository productImageRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getProductsWithThumbnails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            ProductDTO dto = convertToDto(product.get());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ProductDTO convertToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setMemory(product.getMemory());
        dto.setProduct_condition(product.getProduct_condition());
        dto.setBus(product.getBus());
        dto.setConnector(product.getConnector());
        dto.setWarranty(product.getWarranty());
        dto.setInventory(product.getInventory());

        Optional<ProductImage> thumbnail = productImageRepository.findThumbnailByProductId(product.getId());
        String baseUrl = "http://localhost:8080";
        dto.setThumbnail(thumbnail.map(img -> baseUrl + img.getImageUrl()).orElse(null));

        // Lấy toàn bộ danh sách ảnh
        List<String> imageUrls = product.getImages().stream()
                .map(img -> baseUrl + img.getImageUrl())
                .collect(Collectors.toList());
        dto.setImages(imageUrls);

        return dto;
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam("q") String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<ProductDTO> results = productService.searchProductsWithThumbnails(keyword);
        return ResponseEntity.ok(results);
    }
}

