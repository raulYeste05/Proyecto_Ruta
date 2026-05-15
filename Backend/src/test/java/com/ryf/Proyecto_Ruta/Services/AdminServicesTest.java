package com.ryf.Proyecto_Ruta.Services;

import static org.mockito.Mockito.*;

import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void cuandoEliminarUsuario_entoncesLlamaAlRepositorio() {
        Long id = 1L;
        
        adminService.eliminarUsuario(id);

        // Verificamos que el servicio realmente le dijo al repo que borrara el ID 1
        verify(userRepository, times(1)).deleteById(1);
    }
}