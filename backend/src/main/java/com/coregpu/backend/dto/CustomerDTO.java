package com.coregpu.backend.dto;

public class CustomerDTO {
    private Long userId;
    private String name;
    private String phone;
    private String email;
    private Long orderCount;
    private Double totalSpent;

    public CustomerDTO(Long userId, String name, String phone, String email, Long orderCount, Double totalSpent) {
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.orderCount = orderCount;
        this.totalSpent = totalSpent;
    }

    // getters & setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }
}
