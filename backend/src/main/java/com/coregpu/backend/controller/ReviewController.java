package com.coregpu.backend.controller;

import com.coregpu.backend.dto.ReviewDTO;
import com.coregpu.backend.entity.Review;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.entity.User;
import com.coregpu.backend.repo.ProductRepository;
import com.coregpu.backend.repo.UserRepository;
import com.coregpu.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long id) {
        List<Review> reviews = reviewService.getReviewsByProduct(id);
        List<ReviewDTO> dtos = reviews.stream().map(ReviewDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/add")
    public ResponseEntity<ReviewDTO> addReview(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long productId = Long.valueOf(payload.get("productId").toString());
        int rating = Integer.parseInt(payload.get("rating").toString());
        String comment = payload.get("comment").toString();

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User không tồn tại"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product không tồn tại"));

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewService.save(review);
        return ResponseEntity.ok(new ReviewDTO(saved));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        List<ReviewDTO> dtos = reviews.stream().map(ReviewDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

//    @PutMapping("/{id}/like")
//    public ResponseEntity<ReviewDTO> likeReview(@PathVariable Long id) {
//        Review review = reviewService.findById(id);
//        review.setLikes(review.getLikes() + 1);
//        Review updated = reviewService.save(review);
//        return ResponseEntity.ok(new ReviewDTO(updated));
//    }
//
//    @PutMapping("/{id}/dislike")
//    public ResponseEntity<ReviewDTO> dislikeReview(@PathVariable Long id) {
//        Review review = reviewService.findById(id);
//        review.setDislikes(review.getDislikes() + 1);
//        Review updated = reviewService.save(review);
//        return ResponseEntity.ok(new ReviewDTO(updated));
//    }

    @PutMapping("/{id}/toggle-like")
    public ResponseEntity<ReviewDTO> toggleLike(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(reviewService.toggleReaction(id, userId, 1));
    }

    @PutMapping("/{id}/toggle-dislike")
    public ResponseEntity<ReviewDTO> toggleDislike(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(reviewService.toggleReaction(id, userId, -1));
    }

}
