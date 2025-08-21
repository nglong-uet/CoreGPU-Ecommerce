package com.coregpu.backend.dto;

import com.coregpu.backend.entity.Review;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.userName = review.getUser() != null ? review.getUser().getName() : "Người dùng ẩn danh";
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
