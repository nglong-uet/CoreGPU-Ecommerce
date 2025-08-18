package com.coregpu.backend.service;

import com.coregpu.backend.dto.CustomerDTO;
import com.coregpu.backend.entity.CartItem;
import com.coregpu.backend.entity.Order;
import com.coregpu.backend.entity.OrderItem;
import com.coregpu.backend.entity.Product;
import com.coregpu.backend.repo.CartRepository;
import com.coregpu.backend.repo.OrderRepository;
import com.coregpu.backend.repo.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order createOrder(Long userId, String name, String phone, String address) {
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setCustomerName(name);
        order.setPhone(phone);
        order.setShippingAddress(address);

        double total = 0;
        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());

            order.getOrderItems().add(orderItem);

            total += item.getQuantity() * item.getProduct().getPrice();
        }

        order.setTotalAmount(total);
        order.setStatus("PENDING");
        cartRepository.deleteAll(cartItems);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public void markOrderAsCompleted(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Đơn hàng không ở trạng thái PENDING");
        }

        //Trừ tồn kho
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int remaining = product.getInventory() - item.getQuantity();
            if (remaining < 0) {
                throw new RuntimeException("Sản phẩm hiện tại đã hết!" + product.getName());
            }
            product.setInventory(remaining);
            productRepository.save(product);
        }

        order.setStatus("COMPLETED");
        orderRepository.save(order);
    }

}

