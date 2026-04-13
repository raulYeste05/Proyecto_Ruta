package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.ComentarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ryf.Proyecto_Ruta.DTO.ComentarioRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ComentarioResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin
public class ComentarioController {

    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @PostMapping
    public ResponseEntity<ComentarioResponseDTO> crear(@RequestBody ComentarioRequestDTO dto) {
        return ResponseEntity.ok(comentarioService.crear(dto));
    }

    @GetMapping("/publicacion/{id}")
    public ResponseEntity<List<ComentarioResponseDTO>> listarPorPublicacion(@PathVariable Integer id) {
        return ResponseEntity.ok(comentarioService.listarPorPublicacion(id));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<ComentarioResponseDTO>> listarPorUsuario(@PathVariable Integer id) {
        return ResponseEntity.ok(comentarioService.listarPorUsuario(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComentarioResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(comentarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComentarioResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody ComentarioRequestDTO dto) {

        return ResponseEntity.ok(comentarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        comentarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}