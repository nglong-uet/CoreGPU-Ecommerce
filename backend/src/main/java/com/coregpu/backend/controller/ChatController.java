package com.coregpu.backend.controller;

import com.coregpu.backend.dto.ChatMessage;
import com.coregpu.backend.dto.ChatRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @PostMapping
    public ResponseEntity<?> chatWithGPT(@RequestBody ChatRequest chatRequest) {
        String url = "https://api.openai.com/v1/chat/completions";
        RestTemplate restTemplate = new RestTemplate();

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", chatRequest.getModel());
        requestBody.put("messages", chatRequest.getMessages());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // Call OpenAI API
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());

            // Lấy message trả về
            JsonNode messageNode = json.get("choices").get(0).get("message");

            // Trả đúng {role, content}
            Map<String, String> message = new HashMap<>();
            message.put("role", messageNode.get("role").asText());
            message.put("content", messageNode.get("content").asText());

            return ResponseEntity.ok(message);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
