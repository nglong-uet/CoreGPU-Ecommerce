package com.coregpu.backend.service;

import com.coregpu.backend.dto.ReviewDTO;
import com.coregpu.backend.entity.Review;
import com.coregpu.backend.entity.ReviewReaction;
import com.coregpu.backend.entity.User;
import com.coregpu.backend.repo.ReviewReactionRepository;
import com.coregpu.backend.repo.ReviewRepository;
import com.coregpu.backend.repo.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewReactionRepository reviewReactionRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, ReviewReactionRepository reviewReactionRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewReactionRepository = reviewReactionRepository;
        this.userRepository = userRepository;
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews()  {
        return reviewRepository.findAll();
    }

    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));
    }

    public ReviewDTO toggleReaction(Long reviewId, Long userId, int reactionType) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Optional<ReviewReaction> existing = reviewReactionRepository.findByReviewAndUser(review, user);

        if (existing.isPresent()) {
            ReviewReaction rr = existing.get();
            if (rr.getReaction() == reactionType) {
                reviewReactionRepository.delete(rr);
            } else {
                rr.setReaction(reactionType);
                reviewReactionRepository.save(rr);
            }
        } else {
            ReviewReaction rr = new ReviewReaction();
            rr.setReview(review);
            rr.setUser(user);
            rr.setReaction(reactionType);
            reviewReactionRepository.save(rr);
        }

        review.setLikes((int) reviewReactionRepository.countByReviewAndReaction(review, 1));
        review.setDislikes((int) reviewReactionRepository.countByReviewAndReaction(review, -1));
        reviewRepository.save(review);

        return new ReviewDTO(review);
    }
}
