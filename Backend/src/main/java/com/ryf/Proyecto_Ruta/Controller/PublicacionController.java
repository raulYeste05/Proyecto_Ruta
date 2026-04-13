package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.PublicacionService;

import com.ryf.Proyecto_Ruta.DTO.PublicacionResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.PublicacionRequestDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@CrossOrigin
public class PublicacionController {

    private final PublicacionService publicacionService;

    public PublicacionController(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    //  CREAR PUBLICACION
    @PostMapping
    public ResponseEntity<PublicacionResponseDTO> crear(
            @RequestBody PublicacionRequestDTO PublicacionDTO) {

        return ResponseEntity.ok(
            publicacionService.crearPublicacion(PublicacionDTO));
    }

    // Listar Todas
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PublicacionResponseDTO>> listarPorUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(publicacionService.listarPorUser(userId));
    }

    // Listar por Ruta
    @GetMapping("/ruta/{rutaId}")
    public ResponseEntity<List<PublicacionResponseDTO>> listarPorRuta(@PathVariable Integer rutaId) {
        return ResponseEntity.ok(publicacionService.listarPorRuta(rutaId));
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<PublicacionResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(publicacionService.obtenerPorId(id));
    }

    // Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<PublicacionResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody PublicacionRequestDTO PublicacionDTO) {

        return ResponseEntity.ok(publicacionService.actualizar(id, PublicacionDTO));
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        publicacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
}
