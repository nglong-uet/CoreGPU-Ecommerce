package com.coregpu.backend.service;

import com.coregpu.backend.dto.ProductDTO;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.entity.ProductImage;
import com.coregpu.backend.repo.ProductImageRepository;
import com.coregpu.backend.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    private final String baseUrl = "http://localhost:8080";

    public List<ProductDTO> getProductsWithThumbnails() {
        List<Product> products = productRepository.findAllWithImages();

        return products.stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setPrice(product.getPrice());
                    dto.setDescription(product.getDescription());
                    dto.setProduct_condition(product.getProduct_condition());
                    dto.setBrand(product.getBrand());
                    dto.setConnector(product.getConnector());
                    dto.setWarranty(product.getWarranty());
                    dto.setMemory(product.getMemory());
                    dto.setBus(product.getBus());
                    dto.setInventory(product.getInventory());

                    // Thumbnail
                    Optional<ProductImage> thumbnail = productImageRepository.findThumbnailByProductId(product.getId());
                    dto.setThumbnail(thumbnail.map(img -> baseUrl + img.getImageUrl()).orElse(null));

                    List<String> imageUrls = product.getImages().stream()
                            .map(img -> baseUrl + img.getImageUrl())
                            .collect(Collectors.toList());
                    dto.setImages(imageUrls);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findWithImagesById(id);
    }

    public List<ProductDTO> searchProductsWithThumbnails(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);

        return products.stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setPrice(product.getPrice());
                    dto.setDescription(product.getDescription());
                    dto.setProduct_condition(product.getProduct_condition());
                    dto.setBrand(product.getBrand());
                    dto.setConnector(product.getConnector());
                    dto.setWarranty(product.getWarranty());
                    dto.setMemory(product.getMemory());
                    dto.setBus(product.getBus());
                    dto.setInventory(product.getInventory());

                    // Thumbnail
                    Optional<ProductImage> thumbnail = productImageRepository.findThumbnailByProductId(product.getId());
                    dto.setThumbnail(thumbnail.map(img -> baseUrl + img.getImageUrl()).orElse(null));

                    List<String> imageUrls = product.getImages().stream()
                            .map(img -> baseUrl + img.getImageUrl())
                            .collect(Collectors.toList());
                    dto.setImages(imageUrls);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Product saveProduct(Product product) {
        if (product.getImages() != null) {
            boolean first = true;
            for (ProductImage img : product.getImages()) {
                img.setProduct(product);

                if (first) {
                    img.setThumbnail(true);
                    first = false;
                } else {
                    img.setThumbnail(false);
                }
            }
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setBrand(updatedProduct.getBrand());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setMemory(updatedProduct.getMemory());
            product.setProduct_condition(updatedProduct.getProduct_condition());
            product.setBus(updatedProduct.getBus());
            product.setConnector(updatedProduct.getConnector());
            product.setWarranty(updatedProduct.getWarranty());
            product.setInventory(updatedProduct.getInventory());

            product.getImages().clear();

            if (updatedProduct.getImages() != null && !updatedProduct.getImages().isEmpty()) {
                boolean first = true;
                for (ProductImage img : updatedProduct.getImages()) {
                    img.setProduct(product);
                    img.setThumbnail(first);
                    first = false;
                    product.getImages().add(img);
                }
            }

            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Page<Product> getProducts(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search == null || search.isBlank()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.findByNameContainingIgnoreCase(search, pageable);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productRepository.save(product));
    }

    public List<ProductDTO> searchProductsByPriceRange(Double minPrice, Double maxPrice) {
        List<Product> products;

        if (minPrice != null && maxPrice != null) {
            products = productRepository.findByPriceBetween(minPrice, maxPrice);
        } else if (minPrice != null) {
            products = productRepository.findByPriceGreaterThanEqual(minPrice);
        } else if (maxPrice != null) {
            products = productRepository.findByPriceLessThanEqual(maxPrice);
        } else {
            products = productRepository.findAll();
        }

        return products.stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            dto.setMemory(product.getMemory());
            dto.setBrand(product.getBrand());
            return dto;
        }).collect(Collectors.toList());
    }
}
