package com.coregpu.backend.service;

import com.coregpu.backend.entity.Review;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.repo.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }
}
