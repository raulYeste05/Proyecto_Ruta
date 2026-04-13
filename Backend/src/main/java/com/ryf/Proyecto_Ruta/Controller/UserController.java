package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ryf.Proyecto_Ruta.Services.UserService;
import com.ryf.Proyecto_Ruta.DTO.UserRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.UserResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Crear usuario con rol
    @PostMapping
    public ResponseEntity<UserResponseDTO> crear(
            @RequestBody UserRequestDTO userDTO) {

        return ResponseEntity.ok(userService.crearUser(userDTO));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> listar() {
        return ResponseEntity.ok(userService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        userService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
