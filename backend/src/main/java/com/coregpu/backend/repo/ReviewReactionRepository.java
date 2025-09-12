package com.coregpu.backend.repo;


import com.coregpu.backend.entity.Review;
import com.coregpu.backend.entity.ReviewReaction;
import com.coregpu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewReactionRepository extends JpaRepository<ReviewReaction, Long> {
    Optional<ReviewReaction> findByReviewAndUser(Review review, User user);
    long countByReviewAndReaction(Review review, int reaction);
}
