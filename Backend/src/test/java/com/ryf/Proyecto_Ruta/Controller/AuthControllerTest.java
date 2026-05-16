package com.ryf.Proyecto_Ruta.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ryf.Proyecto_Ruta.DTO.RegisterRequestDTO;
import com.ryf.Proyecto_Ruta.Model.Rol;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Security.JwtUtil;
import com.ryf.Proyecto_Ruta.Security.UserDetailsServiceImpl; // <-- Importante que esté importado
import com.ryf.Proyecto_Ruta.Services.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    
    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser
    void alRegistrarUsuario_deberiaDevolverTokenYRol() throws Exception {
        // 1. Datos de entrada (JSON simulado)
        RegisterRequestDTO requestDTO = new RegisterRequestDTO();
        requestDTO.setEmail("test@gmail.com");
        requestDTO.setPassword("123456");
        requestDTO.setDni("12345678A");
        requestDTO.setNombre("Raul");
        requestDTO.setApellido1("Martinez");
        requestDTO.setTelefono("666777888");
        requestDTO.setProvincia("Jaén");
        requestDTO.setLocalidad("Jaén");

        // 2. Modelo simulado con tipo Integer
        Rol rolCliente = new Rol();
        rolCliente.setNombre("CLIENTE");

        User usuarioSimulado = new User();
        usuarioSimulado.setIdUser(1); // Entero correcto
        usuarioSimulado.setEmail("test@gmail.com");
        usuarioSimulado.setRol(rolCliente);

        // Comportamiento de los Mocks
        Mockito.when(authService.registrar(Mockito.any(RegisterRequestDTO.class))).thenReturn(usuarioSimulado);
        Mockito.when(jwtUtil.generarToken(Mockito.any(), Mockito.anyInt())).thenReturn("token-falso-de-prueba");

        // 3. Petición y verificación
        mockMvc.perform(post("/auth/registro")
                .with(csrf()) 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-falso-de-prueba"))
                .andExpect(jsonPath("$.rol").value("CLIENTE"));
    }
}