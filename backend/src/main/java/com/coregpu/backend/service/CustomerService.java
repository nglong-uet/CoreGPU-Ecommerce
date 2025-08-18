package com.coregpu.backend.service;

import com.coregpu.backend.dto.CustomerDTO;
import com.coregpu.backend.repo.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final OrderRepository orderRepository;

    public CustomerService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<CustomerDTO> getAllCustomers() {
        return orderRepository.findAllCustomersFromOrders();
    }
}
