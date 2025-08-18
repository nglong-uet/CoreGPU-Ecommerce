package com.coregpu.backend.repo;

import com.coregpu.backend.dto.CustomerDTO;
import com.coregpu.backend.dto.RecentOrderDTO;
import com.coregpu.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    // Top sản phẩm bán chạy nhất
    @Query("SELECT new map(" +
            "p.id as id, " +
            "p.name as name, " +
            "COUNT(oi.id) as quantity, " +
            "(SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product.id = p.id AND pi.isThumbnail = true) as thumbnail " +
            ") " +
            "FROM OrderItem oi JOIN oi.product p JOIN oi.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY p.id, p.name " +
            "ORDER BY quantity DESC")
    List<Map<String, Object>> findTopSellingProducts();

    @Query(value = """
        SELECT 
            o.id AS id,
            o.customer_name AS customerName,
            o.total_amount AS totalAmount,
            o.status AS status,
            o.created_at AS createdAt
        FROM orders o
        ORDER BY o.created_at DESC
        LIMIT 10
    """, nativeQuery = true)
    List<RecentOrderDTO> findRecentOrders();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    Double getTotalRevenue();

    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    Double getAverageOrderValue();

    @Query("""
    SELECT o.userId AS userId, o.customerName AS customerName, COUNT(o) AS orderCount, SUM(o.totalAmount) AS totalSpent
    FROM Order o
    GROUP BY o.userId, o.customerName
    ORDER BY totalSpent DESC""")
    List<Map<String, Object>> findTopCustomersByTotalSpent();

    @Query(value = """
    SELECT DATE(o.created_at) AS date,
           COUNT(o.id) AS totalOrders,
           COALESCE(SUM(o.total_amount), 0) AS totalIncome
    FROM orders o
    WHERE o.status = 'COMPLETED'
      AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(o.created_at)
    ORDER BY DATE(o.created_at)
""", nativeQuery = true)
    List<Object[]> getSummaryStats();

    @Query("""
        SELECT new com.coregpu.backend.dto.CustomerDTO(
            o.userId,
            o.customerName,
            o.phone,
            u.email,
            COUNT(o.id),
            SUM(o.totalAmount)
        )
        FROM Order o
        JOIN User u ON o.userId = u.id
        GROUP BY o.userId, o.customerName, o.phone, u.email
        ORDER BY SUM(o.totalAmount) DESC
    """)
    List<CustomerDTO> findAllCustomersFromOrders();

    Page<Order> findByStatus(String status, Pageable pageable);

    @Query("""
    SELECT o FROM Order o
    WHERE (:status IS NULL OR :status = '' OR o.status = :status)
      AND (
           :search IS NULL OR :search = '' 
           OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(o.phone) LIKE LOWER(CONCAT('%', :search, '%'))
      )
""")
    Page<Order> searchOrders(@Param("status") String status,
                             @Param("search") String search,
                             Pageable pageable);
}