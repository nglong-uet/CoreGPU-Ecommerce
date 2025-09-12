package com.coregpu.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private String description;
    private Double price;
    private String memory;
    private String product_condition;
    private String bus;
    private String connector;
    private String warranty;
    private int inventory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductImage> images;

    public Product() {}

    public Product(String name, String brand ,String description, Double price, String memory, String product_condition, String connector, String warranty, int inventory) {
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.memory = memory;
        this.product_condition = product_condition;
        this.connector = connector;
        this.warranty = warranty;
        this.inventory = inventory;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() {
        return brand;
    }
    public void setBrand(String brand) {
        this.brand = brand;
    }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getMemory() {
        return memory;
    }
    public void setMemory(String memory) {
        this.memory = memory;
    }

    public String getProduct_condition() {
        return product_condition;
    }

    public void setProduct_condition(String product_condition) {
        this.product_condition = product_condition;
    }

    public String getBus() {
        return bus;
    }
    public void setBus(String bus) {
        this.bus = bus;
    }

    public String getConnector() {
        return connector;
    }
    public void setConnector(String connector) {
        this.connector = connector;
    }

    public String getWarranty() {
        return warranty;
    }
    public void setWarranty(String warranty) {
        this.warranty = warranty;
    }

    public int getInventory() {
        return inventory;
    }

    public void setInventory(int inventory) {
        this.inventory = inventory;
    }

    public List<ProductImage> getImages() {
        return images;
    }
    public void setImages(List<ProductImage> images) {
        this.images = images;
    }
}