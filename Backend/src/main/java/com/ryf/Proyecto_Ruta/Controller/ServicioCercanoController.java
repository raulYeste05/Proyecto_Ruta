package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.ServicioCercanoService;

import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoRequestDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicio_cercano")
@CrossOrigin

public class ServicioCercanoController {

    private final ServicioCercanoService servicioCercanoService;

    public ServicioCercanoController(ServicioCercanoService servicioCercanoService) {
        this.servicioCercanoService = servicioCercanoService;
    }

    //Crear servicio cercano
    @PostMapping
    public ResponseEntity<ServicioCercanoResponseDTO> crear(
            @RequestBody ServicioCercanoRequestDTO ServicioCercanoDTO) {

        return ResponseEntity.ok(servicioCercanoService.crearServicioCercano(ServicioCercanoDTO));
    }

    //Listar por parada
    @GetMapping("/parada/{paradaId}")
    public ResponseEntity<List<ServicioCercanoResponseDTO>> listarPorParada(@PathVariable Integer paradaId) {
        return ResponseEntity.ok(servicioCercanoService.obtenerPorParada(paradaId));
    }

    //Obtener un servicio cercano por su id
    @GetMapping("/{id}")
    public ResponseEntity<ServicioCercanoResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioCercanoService.obtenerPorId(id));
    }

    //Actualizar un servicio cercano
    @PutMapping("/{id}")
    public ResponseEntity<ServicioCercanoResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody ServicioCercanoRequestDTO ServicioCercanoDTO) {

        return ResponseEntity.ok(servicioCercanoService.actualizar(id, ServicioCercanoDTO));
    }

    //Eliminar un servicio cercano
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        servicioCercanoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
}
