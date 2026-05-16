package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.DTO.ClienteResponseDTO;
import com.ryf.Proyecto_Ruta.Security.JwtUtil;
import com.ryf.Proyecto_Ruta.Security.UserDetailsServiceImpl;
import com.ryf.Proyecto_Ruta.Services.ClienteService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClienteController.class)
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService clienteService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser(username = "raul@gmail.com") 
    void alObtenerPerfilPropio_deberiaDevolverDatosDelCliente() throws Exception {
        
        ClienteResponseDTO respuestaSimulada = new ClienteResponseDTO();
        respuestaSimulada.setIdCliente(1);
        respuestaSimulada.setNombre("Raul");
        respuestaSimulada.setDni("12345678A");

        Mockito.when(clienteService.obtenerPorEmail("raul@gmail.com")).thenReturn(respuestaSimulada);

        // Ejecutar petición GET al endpoint de perfil y verificar
        mockMvc.perform(get("/api/clientes/perfil")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Esperamos un HTTP 200 OK
                .andExpect(jsonPath("$.idCliente").value(1))
                .andExpect(jsonPath("$.nombre").value("Raul"))
                .andExpect(jsonPath("$.dni").value("12345678A"));
    }
}