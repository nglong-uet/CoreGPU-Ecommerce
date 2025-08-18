package com.coregpu.backend.controller;

import com.coregpu.backend.dto.RecentOrderDTO;
import com.coregpu.backend.repo.OrderRepository;
import com.coregpu.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminStatsController {

    private final OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminStatsController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        Double totalRevenue = orderRepository.getTotalRevenue();
        Double averageOrderValue = orderRepository.getAverageOrderValue();
        Long newCustomers = userRepository.countNewCustomersLast30Days();
        Long totalCustomers = userRepository.countTotalCustomers();
        Long repeatCustomers = userRepository.countRepeatCustomers();

        double repeatPurchaseRate = (totalCustomers != null && totalCustomers > 0)
                ? (repeatCustomers * 100.0 / totalCustomers)
                : 0.0;

        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        stats.put("averageOrderValue", averageOrderValue != null ? averageOrderValue : 0.0);
        stats.put("newCustomers", newCustomers != null ? newCustomers : 0);
        stats.put("repeatPurchaseRate", repeatPurchaseRate);

        return stats;
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopSellingProducts() {
        return orderRepository.findTopSellingProducts();
    }

    @GetMapping("/recent")
    public List<RecentOrderDTO> getRecentOrders() {
        return orderRepository.findRecentOrders();
    }

    @GetMapping("/top")
    public List<Map<String, Object>> getTopCustomers() {
        return orderRepository.findTopCustomersByTotalSpent();
    }

    @GetMapping("/summary")
    public List<Map<String, Object>> getSummaryStats() {
        List<Object[]> results = orderRepository.getSummaryStats();

        LocalDate startDate = LocalDate.now().minusDays(6);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d 'Thg' M", new Locale("vi", "VN"));

        List<Map<String, Object>> data = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", date.format(formatter));
            entry.put("order", 0);
            entry.put("income", 0);

            for (Object[] row : results) {
                LocalDate rowDate = ((java.sql.Date) row[0]).toLocalDate();
                if (rowDate.equals(date)) {
                    entry.put("order", ((Number) row[1]).intValue());
                    entry.put("income", ((Number) row[2]).intValue());
                    break;
                }
            }

            data.add(entry);
        }

        return data;
    }

}
