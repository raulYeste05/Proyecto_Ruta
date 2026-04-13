package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.ParadaService;
import com.ryf.Proyecto_Ruta.DTO.ParadaResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.ParadaRequestDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paradas")
@CrossOrigin

public class ParadaController {
    
    private final ParadaService paradaService;

    public ParadaController(ParadaService paradaService) {
        this.paradaService = paradaService;
    }

    //  CREAR PARADA
    @PostMapping
    public ResponseEntity<ParadaResponseDTO> CrearParada(
            @RequestBody ParadaRequestDTO ParadaDTO) {

        return ResponseEntity.ok(paradaService.crearParada(ParadaDTO));
    }

    //  LISTAR POR RUTA
    @GetMapping("/ruta/{rutaId}")
    public ResponseEntity<List<ParadaResponseDTO>> listarPorRuta(@PathVariable Integer rutaId) {
        return ResponseEntity.ok(paradaService.listarParadas(rutaId));
    }

    //  OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ParadaResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(paradaService.obtenerPorId(id));
    }

    //  ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<ParadaResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody ParadaRequestDTO ParadaDTO) {

        return ResponseEntity.ok(paradaService.actualizar(id, ParadaDTO));
    }

    //  ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        paradaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
