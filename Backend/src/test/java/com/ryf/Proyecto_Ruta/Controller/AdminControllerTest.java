package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.Services.AdminService;
import com.ryf.Proyecto_Ruta.Security.JwtUtil;
import com.ryf.Proyecto_Ruta.Security.UserDetailsServiceImpl; // <-- ASEGÚRATE DE QUE SE IMPORTE ESTA CLASE
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean; 
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean 
    private AdminService adminService;

    @MockitoBean
    private JwtUtil jwtUtil;

    // AÑADE ESTA LÍNEA AQUÍ PARA AGREGAR EL COMPONENTE QUE FALTA:
    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void alLlamarListar_deberiaDarEstadoOk() throws Exception {
        mockMvc.perform(get("/api/admin/usuarios"))
                .andExpect(status().isOk());
    }
}