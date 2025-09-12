package com.coregpu.backend.controller;

import com.coregpu.backend.dto.ProductDTO;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.entity.ProductImage;
import com.coregpu.backend.repo.ProductImageRepository;
import com.coregpu.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductImageRepository productImageRepository;

    private final String baseUrl = "http://localhost:8080";

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Product> products = productService.getProducts(search, page, size);

        Page<ProductDTO> dtoPage = products.map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setBrand(product.getBrand());
            dto.setDescription(product.getDescription());
            dto.setPrice(product.getPrice());
            dto.setMemory(product.getMemory());
            dto.setBus(product.getBus());
            dto.setProduct_condition(product.getProduct_condition());
            dto.setConnector(product.getConnector());
            dto.setWarranty(product.getWarranty());
            dto.setInventory(product.getInventory());

            dto.setThumbnail(
                    product.getImages().stream()
                            .filter(ProductImage::isThumbnail)
                            .findFirst()
                            .map(img -> baseUrl + img.getImageUrl())
                            .orElse(null)
            );

            dto.setImages(
                    product.getImages().stream()
                            .map(img -> baseUrl + img.getImageUrl())
                            .collect(Collectors.toList())
            );

            return dto;
        });

        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        for (ProductImage img : product.getImages()) {
            img.setProduct(product);
        }
        Product saved = productService.saveProduct(product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(id, product);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
