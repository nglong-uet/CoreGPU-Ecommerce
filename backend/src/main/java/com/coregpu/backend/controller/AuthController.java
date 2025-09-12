package com.coregpu.backend.controller;

import com.coregpu.backend.dto.LoginRequest;
import com.coregpu.backend.dto.RegisterRequest;
import com.coregpu.backend.entity.User;
import com.coregpu.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepo.findByEmail(req.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Đăng nhập thất bại");
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đăng ký đã tồn tại");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("Đăng ký thành công");
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        try {
            String url = "https://www.googleapis.com/oauth2/v3/userinfo";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map userInfo = response.getBody();

            if (userInfo != null && userInfo.get("email") != null) {
                String email = (String) userInfo.get("email");
                String name = (String) userInfo.get("name");

                Optional<User> userOpt = userRepo.findByEmail(email);
                User user = userOpt.orElseGet(() -> {
                    User u = new User();
                    u.setEmail(email);
                    u.setPassword(passwordEncoder.encode("oauth2")); // dummy password
                    return userRepo.save(u);
                });

                return ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", name
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google login failed");
    }

    @PostMapping("/facebook")
    public ResponseEntity<?> facebookLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        try {
            String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + token;
            RestTemplate restTemplate = new RestTemplate();
            Map userInfo = restTemplate.getForObject(url, Map.class);

            if (userInfo != null && userInfo.get("email") != null) {
                String email = (String) userInfo.get("email");
                String name = (String) userInfo.get("name");

                Optional<User> userOpt = userRepo.findByEmail(email);
                User user = userOpt.orElseGet(() -> {
                    User u = new User();
                    u.setEmail(email);
                    u.setPassword(passwordEncoder.encode("oauth2"));
                    return userRepo.save(u);
                });

                return ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "name", name
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Facebook login failed");
    }

}
