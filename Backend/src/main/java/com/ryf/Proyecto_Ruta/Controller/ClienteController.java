package com.ryf.Proyecto_Ruta.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ryf.Proyecto_Ruta.Services.ClienteService;
import com.ryf.Proyecto_Ruta.DTO.ClienteResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.RegistroClienteDTO;
import com.ryf.Proyecto_Ruta.DTO.ClienteRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // crear cliente con userId
    @PostMapping("/registro-completo")
    public ResponseEntity<ClienteResponseDTO> registrar(@RequestBody RegistroClienteDTO dto) {
        return ResponseEntity.ok(clienteService.registrarClienteCompleto(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listar() {
        return ResponseEntity.ok(clienteService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ClienteResponseDTO> obtenerPorUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(clienteService.obtenerPorUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> actualizar(
            @PathVariable Integer id,
            @RequestBody ClienteRequestDTO clienteDto) {

        return ResponseEntity.ok(clienteService.actualizar(id, clienteDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
