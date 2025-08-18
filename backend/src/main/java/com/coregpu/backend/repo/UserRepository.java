package com.coregpu.backend.repo;

import com.coregpu.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Map;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Khách hàng mới trong 30 ngày
    @Query(value = """
    SELECT COUNT(*) 
    FROM (
        SELECT o.user_id, MIN(o.created_at) AS first_order_date
        FROM orders o
        GROUP BY o.user_id
        HAVING first_order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    ) AS new_customers
""", nativeQuery = true)
    Long countNewCustomersLast30Days();

    // Tổng khách hàng
    @Query(value = "SELECT COUNT(DISTINCT o.user_id) FROM orders o", nativeQuery = true)
    Long countTotalCustomers();

    // Khách hàng quay lại
    @Query(value = """
    SELECT COUNT(*) 
    FROM (
        SELECT o.user_id
        FROM orders o
        GROUP BY o.user_id
        HAVING COUNT(o.id) > 1
    ) AS repeat_customers
""", nativeQuery = true)
    Long countRepeatCustomers();
}