package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.DTO.RutaResponseDTO;
import com.ryf.Proyecto_Ruta.Security.JwtUtil;
import com.ryf.Proyecto_Ruta.Security.UserDetailsServiceImpl;
import com.ryf.Proyecto_Ruta.Services.RutaService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RutaController.class)
class RutaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RutaService rutaService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser
    void alListarPublicas_deberiaDevolverListaDeRutas() throws Exception {
        // 1. Preparar lista simulada
        RutaResponseDTO rutaMock = new RutaResponseDTO();
        rutaMock.setId(1);
        rutaMock.setTitulo("Ruta Turística Jaén");
        rutaMock.setPublicada(true);

        List<RutaResponseDTO> listaSimulada = List.of(rutaMock);

        Mockito.when(rutaService.listarPublicas()).thenReturn(listaSimulada);

        // 2Realizar petición GET y validar la estructura del  JSON
        mockMvc.perform(get("/api/rutas/publicas")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1)) 
                .andExpect(jsonPath("$[0].titulo").value("Ruta Turística Jaén"))
                .andExpect(jsonPath("$[0].publicada").value(true));
    }
}