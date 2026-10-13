package com.pujapath.service;

import com.pujapath.config.JwtUtil;
import com.pujapath.entity.User;
import com.pujapath.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setId("usr-" + UUID.randomUUID().toString().substring(0, 8));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole("ROLE_USER");
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("userId", user.getId());
        resp.put("email", user.getEmail());
        resp.put("fullName", user.getFullName());
        return resp;
    }

    public Map<String, Object> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("userId", user.getId());
        resp.put("email", user.getEmail());
        resp.put("fullName", user.getFullName());
        return resp;
    }

    public Map<String, Object> createGuestSession(String nickname) {
        String guestId = "gst-" + UUID.randomUUID().toString().substring(0, 8);
        String name = (nickname != null && !nickname.isBlank()) ? nickname : "Guest Hopper";
        String token = jwtUtil.generateToken(guestId, guestId + "@guest.pujapath.local", "ROLE_GUEST");

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("userId", guestId);
        resp.put("fullName", name);
        resp.put("isGuest", true);
        return resp;
    }
}
