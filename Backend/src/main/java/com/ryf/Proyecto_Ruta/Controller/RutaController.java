package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ryf.Proyecto_Ruta.Services.RutaService;
import com.ryf.Proyecto_Ruta.DTO.RutaRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.RutaResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin
public class RutaController {

    private final RutaService rutaService;

    public RutaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    //  CREAR RUTA
    @PostMapping
    public ResponseEntity<RutaResponseDTO> crear(
            @RequestBody RutaRequestDTO RutaDTO) {

        return ResponseEntity.ok(rutaService.crearRuta(RutaDTO));
    }

    //  TODAS
    @GetMapping
    public ResponseEntity<List<RutaResponseDTO>> listar() {
        return ResponseEntity.ok(rutaService.listar());
    }

    //  POR USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RutaResponseDTO>> porUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(rutaService.listarPorUser(userId));
    }

    //  PUBLICAS
    @GetMapping("/publicas")
    public ResponseEntity<List<RutaResponseDTO>> publicas() {
        return ResponseEntity.ok(rutaService.listarPublicas());
    }

    //  POR ID
    @GetMapping("/{id}")
    public ResponseEntity<RutaResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(rutaService.obtenerPorId(id));
    }

    //  ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<RutaResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody RutaRequestDTO RutaDTO) {

        return ResponseEntity.ok(rutaService.actualizar(id, RutaDTO));
    }

    //  ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        rutaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
