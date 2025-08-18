    package com.coregpu.backend.entity;

    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;

    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;

    @Entity
    @Table(name = "orders")
    public class Order {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "user_id")
        private Long userId;

        @Column(name = "customer_name")
        private String customerName;

        private String phone;

        private String shippingAddress;

        @Column(name = "total_amount")
        private Double totalAmount;

        @Column(name = "status")
        private String status = "PENDING";

        private LocalDateTime createdAt = LocalDateTime.now();

        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonManagedReference
        private List<OrderItem> orderItems = new ArrayList<>();

        public Order() {
        }

        public Order(Long id, Long userId, String customerName, String phone, String shippingAddress, Double totalAmount, String status, LocalDateTime createdAt) {
            this.id = id;
            this.userId = userId;
            this.customerName = customerName;
            this.phone = phone;
            this.shippingAddress = shippingAddress;
            this.totalAmount = totalAmount;
            this.status = status;
            this.createdAt = createdAt;
        }

        // getters, setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getShippingAddress() {
            return shippingAddress;
        }

        public void setShippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
        }

        public Double getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public List<OrderItem> getOrderItems() {
            return orderItems;
        }

        public void setOrderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
        }
    }
