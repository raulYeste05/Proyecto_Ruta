package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.Services.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest; // Esto ahora sí debería funcionar
import org.springframework.test.context.bean.override.mockito.MockitoBean; 
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import com.ryf.Proyecto_Ruta.Controller.AdminController; // Asegúrate de que esté este import

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean 
    private AdminService adminService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void alLlamarListar_deberiaDarEstadoOk() throws Exception {
        mockMvc.perform(get("/api/admin/usuarios"))
                .andExpect(status().isOk());
    }
}