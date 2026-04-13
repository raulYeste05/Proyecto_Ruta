package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Security.JwtUtil;
import com.ryf.Proyecto_Ruta.Security.LoginRequest;
import com.ryf.Proyecto_Ruta.Security.TokenResponse;
import com.ryf.Proyecto_Ruta.Services.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ryf.Proyecto_Ruta.DTO.RegisterRequestDTO;



@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }


    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody @Valid LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();

        String token = jwtUtil.generarToken(user, user.getIdUser());

        return ResponseEntity.ok(
                new TokenResponse(token, user.getRol().getNombre())
        );
    }

    // 🆕 REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<TokenResponse> registro(@RequestBody @Valid RegisterRequestDTO request) {

        User user = authService.registrar(request);

        String token = jwtUtil.generarToken(user, user.getIdUser());

        return ResponseEntity.ok(
                new TokenResponse(token, user.getRol().getNombre())
        );
    }

@GetMapping("/check-email")
public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
    return ResponseEntity.ok(authService.existeEmail(email));
}

@GetMapping("/check-dni")
public ResponseEntity<Boolean> checkDni(@RequestParam String dni) {
    return ResponseEntity.ok(authService.existeDni(dni));
}
}
