package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ryf.Proyecto_Ruta.Services.RolService;

import com.ryf.Proyecto_Ruta.DTO.RolRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.RolResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PostMapping
    public ResponseEntity<RolResponseDTO> crear(@RequestBody RolRequestDTO RolDTO) {
        return ResponseEntity.ok(rolService.crearRol(RolDTO));
    }

    @GetMapping
    public ResponseEntity<List<RolResponseDTO>> listar() {
        return ResponseEntity.ok(rolService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(rolService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        rolService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
