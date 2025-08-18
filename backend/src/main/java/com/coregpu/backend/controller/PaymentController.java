package com.coregpu.backend.controller;

import com.coregpu.backend.service.OrderService;
import com.coregpu.backend.service.PaymentService;
import com.coregpu.backend.service.PaymentService.PaymentPayload;
import com.coregpu.backend.config.VNPayConfig;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @GetMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestParam Long userId,
            @RequestParam Long amount,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String address
    ) {
        try {
            String orderInfo = "Thanh toan don hang cho user " + userId;
            String paymentUrl = paymentService.createPaymentUrl(userId, amount, orderInfo, name, phone, address);
            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
        } catch (UnsupportedEncodingException e) {
            return ResponseEntity.status(500).body("Lỗi tạo link thanh toán");
        }
    }

    @GetMapping("/return")
    public ResponseEntity<?> paymentReturn(@RequestParam Map<String, String> allParams) {
        try {
            // Lấy vnp_SecureHash và xoá khỏi map trước khi build lại chuỗi
            String vnpSecureHash = allParams.remove("vnp_SecureHash");
            allParams.remove("vnp_SecureHashType");

            List<String> fieldNames = new ArrayList<>(allParams.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                String value = allParams.get(key);
                if (value != null && value.length() > 0) {

                    String decoded = URLDecoder.decode(value, StandardCharsets.UTF_8.toString());
                    String encoded = java.net.URLEncoder.encode(decoded, StandardCharsets.UTF_8.toString());
                    hashData.append(key).append('=').append(encoded);
                    if (i < fieldNames.size() - 1) hashData.append('&');
                }
            }

            String signValue = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());

            String responseCode = allParams.get("vnp_ResponseCode");
            String txnRef = allParams.get("vnp_TxnRef");

            if (signValue.equalsIgnoreCase(vnpSecureHash) && "00".equals(responseCode)) {
                PaymentPayload payload = paymentService.getPayload(txnRef);
                if (payload != null) {
                    // Gọi OrderService
                    orderService.createOrder(payload.userId, payload.name, payload.phone, payload.address);
                    // xóa payload
                    paymentService.removePayload(txnRef);
                    // Redirect về frontend trang thankyou
                    String redirectUrl = "http://localhost:3000/thankyou?txnRef=" + txnRef + "&status=success";
                    return ResponseEntity.status(302).header("Location", redirectUrl).build();
                } else {
                    // payload không tồn tại => trả lỗi hoặc redirect thất bại
                    String redirectUrl = "http://localhost:3000/payment-result?status=unknown";
                    return ResponseEntity.status(302).header("Location", redirectUrl).build();
                }
            } else {
                // Xác thực thất bại hoặc response code khác
                String redirectUrl = "http://localhost:3000/payment-result?status=failed";
                return ResponseEntity.status(302).header("Location", redirectUrl).build();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            String redirectUrl = "http://localhost:3000/payment-result?status=error";
            return ResponseEntity.status(302).header("Location", redirectUrl).build();
        }
    }
}
