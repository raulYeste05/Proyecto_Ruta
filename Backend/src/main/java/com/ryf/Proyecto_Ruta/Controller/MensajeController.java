package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ryf.Proyecto_Ruta.Services.MensajeService;
import com.ryf.Proyecto_Ruta.DTO.MensajeResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.MensajeRequestDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/mensaje")
@CrossOrigin
public class MensajeController {

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    //Enviar mensaje
    @PostMapping
    public ResponseEntity<MensajeResponseDTO> enviar(
           @RequestBody MensajeRequestDTO MensajeDTO) {

        return ResponseEntity.ok(mensajeService.enviar(MensajeDTO));
    }

    //Mensajes de un chat
    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MensajeResponseDTO>> obtenerMensajes(@PathVariable Integer chatId) {
        return ResponseEntity.ok(mensajeService.obtenerPorChat(chatId));
    }

    //Obtener un mensaje por su id
    @GetMapping("/{id}")
    public ResponseEntity<MensajeResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(mensajeService.obtenerPorId(id));
    }

    //Eliminar un mensaje
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        mensajeService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
}
