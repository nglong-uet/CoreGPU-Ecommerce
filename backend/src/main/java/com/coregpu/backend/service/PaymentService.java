package com.coregpu.backend.service;

import com.coregpu.backend.config.VNPayConfig;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PaymentService {
    private final Map<String, PaymentPayload> payloadStore = new ConcurrentHashMap<>();

    public static class PaymentPayload {
        public Long userId;
        public String name;
        public String phone;
        public String address;
        public long amount;
        public String txnRef;

        public PaymentPayload(Long userId, String name, String phone, String address, long amount, String txnRef) {
            this.userId = userId;
            this.name = name;
            this.phone = phone;
            this.address = address;
            this.amount = amount;
            this.txnRef = txnRef;
        }
    }

    public String createPaymentUrl(Long userId, long amountVnd, String orderInfo, String name, String phone, String address) throws UnsupportedEncodingException {
        // vnp_Amount expects amount * 100
        long amount = amountVnd;

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String vnp_Locale = "vn";
        String vnp_CurrCode = "VND";
        String vnp_OrderType = "other";
        String vnp_IpAddr = "127.0.0.1";

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnp_Version);
        vnpParams.put("vnp_Command", vnp_Command);
        vnpParams.put("vnp_TmnCode", vnp_TmnCode);
        // VNPay requires amount in cents (i.e., VND * 100)
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", vnp_CurrCode);
        vnpParams.put("vnp_TxnRef", vnp_TxnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", vnp_OrderType);
        vnpParams.put("vnp_Locale", vnp_Locale);
        vnpParams.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnpParams.put("vnp_IpAddr", vnp_IpAddr);

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        vnpParams.put("vnp_CreateDate", formatter.format(new Date()));

        // Sort keys
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String nameKey = fieldNames.get(i);
            String value = vnpParams.get(nameKey);
            if (value != null && value.length() > 0) {
                // URLEncode value
                String encodedValue = URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
                // For hash use encodedValue (common approach)
                hashData.append(nameKey).append('=').append(encodedValue);
                query.append(nameKey).append('=').append(encodedValue);
                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        String paymentUrl = VNPayConfig.vnp_Url + "?" + query.toString();

        // Lưu payload tạm để dùng khi callback
        PaymentPayload payload = new PaymentPayload(userId, name, phone, address, amount, vnp_TxnRef);
        payloadStore.put(vnp_TxnRef, payload);

        return paymentUrl;
    }

    public PaymentPayload getPayload(String txnRef) {
        return payloadStore.get(txnRef);
    }

    public void removePayload(String txnRef) {
        payloadStore.remove(txnRef);
    }
}
