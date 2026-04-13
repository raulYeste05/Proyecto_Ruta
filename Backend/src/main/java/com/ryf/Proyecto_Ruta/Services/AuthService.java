package com.ryf.Proyecto_Ruta.Services;

import com.ryf.Proyecto_Ruta.DTO.RegisterRequestDTO;
import com.ryf.Proyecto_Ruta.Model.Cliente;
import com.ryf.Proyecto_Ruta.Model.Rol;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Repositories.ClienteRepository;
import com.ryf.Proyecto_Ruta.Repositories.RolRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RolRepository rolRepository,
                       ClienteRepository clienteRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registrar(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        Rol rolUser = rolRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));

        // Crear USER
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(rolUser)
                .fechaRegistro(LocalDateTime.now())
                .build();

        User guardado = userRepository.save(user);

        // Crear CLIENTE
        Cliente cliente = Cliente.builder()
                .dni(request.getDni())
                .nombre(request.getNombre())
                .apellido1(request.getApellido1())
                .apellido2(request.getApellido2())
                .telefono(request.getTelefono())
                .provincia(request.getProvincia())
                .localidad(request.getLocalidad())
                .user(guardado)
                .build();

        clienteRepository.save(cliente);

        return guardado;
    }

    // AuthService.java
    public boolean existeEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existeDni(String dni) {
        return clienteRepository.existsByDni(dni);
    }
}
