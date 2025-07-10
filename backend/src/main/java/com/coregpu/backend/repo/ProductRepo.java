package com.coregpu.backend.repo;

import com.coregpu.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, Long> {

}
