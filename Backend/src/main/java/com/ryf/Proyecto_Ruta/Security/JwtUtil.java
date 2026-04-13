package com.ryf.Proyecto_Ruta.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;

import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    //  Debe tener al menos 256 bits (32 caracteres)
    private static final String SECRET_KEY = "clave_super_secreta_muy_larga_para_jwt_256_bits";
    // 1 hora
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
}

    /**
     * Generar token JWT
     */

    public String generarToken(UserDetails user, Integer userId) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("id", userId)
                .claim("roles",
                        user.getAuthorities().stream()
                                .map(auth -> auth.getAuthority())
                                .collect(Collectors.toList()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public String extraerUsername(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean tokenExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    public boolean tokenValido(String token, UserDetails userDetails) {
        final String username = extraerUsername(token);
        return username.equals(userDetails.getUsername()) && !tokenExpirado(token);
    }

    private Claims extraerClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
