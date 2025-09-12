package com.coregpu.backend.dto;

import com.coregpu.backend.entity.Review;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private String productName;
    private int likes;
    private int dislikes;
    private LocalDateTime createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.userName = review.getUser() != null ? review.getUser().getName() : "Người dùng ẩn danh";
        this.productName = review.getProduct() != null ? review.getProduct().getName() : "Sản phẩm không xác định";
        this.likes = review.getLikes();
        this.dislikes = review.getDislikes();
        this.createdAt = review.getCreatedAt();
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public int getLikes() {
        return likes;
    }
    public void setLikes(int likes) {
        this.likes = likes;
    }
    public int getDislikes() {
        return dislikes;
    }
    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
