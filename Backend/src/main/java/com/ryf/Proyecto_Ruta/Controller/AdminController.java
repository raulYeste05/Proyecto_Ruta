package com.ryf.Proyecto_Ruta.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //  LISTAR USUARIOS
    @GetMapping("/usuarios")
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(adminService.obtenerUsuarios());
    }

    //  ELIMINAR USUARIO
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id) {
        adminService.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado");
    }
}
