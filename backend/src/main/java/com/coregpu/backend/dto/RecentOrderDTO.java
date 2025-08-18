package com.coregpu.backend.dto;

import java.sql.Timestamp;

public interface RecentOrderDTO {
    Long getId();
    String getCustomerName();
    Double getTotalAmount();
    String getStatus();
    Timestamp getCreatedAt();
}
