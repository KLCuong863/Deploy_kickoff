package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class BcryptTest {
    @Test
    public void testHash() {
        System.out.println(new BCryptPasswordEncoder().encode("123456"));
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean matches = encoder.matches("123456", "$2a$10$7EqJtq98hPqEX7fNZaFWoOqK9h0E8Yk7E1YxDCEV4VpWw2X2gYd1G");
        System.out.println("====== MATCHES: " + matches + " ======");
    }
}
