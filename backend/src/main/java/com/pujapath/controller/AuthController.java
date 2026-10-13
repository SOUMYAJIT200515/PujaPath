package com.pujapath.controller;

import com.pujapath.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public static class AuthRequest {
        public String email;
        public String password;
        public String fullName;
        public String nickname;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody AuthRequest req) {
        try {
            return ResponseEntity.ok(authService.register(req.email, req.password, req.fullName));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req.email, req.password));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/guest")
    public ResponseEntity<Map<String, Object>> guest(@RequestBody(required = false) AuthRequest req) {
        String nickname = req != null ? req.nickname : null;
        return ResponseEntity.ok(authService.createGuestSession(nickname));
    }
}
