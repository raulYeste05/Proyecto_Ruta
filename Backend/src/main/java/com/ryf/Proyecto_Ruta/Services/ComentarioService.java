package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Repositories.ComentarioRepository;
import com.ryf.Proyecto_Ruta.Repositories.PublicacionRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import com.ryf.Proyecto_Ruta.Services.EmailService;

import com.ryf.Proyecto_Ruta.Model.Comentario;
import com.ryf.Proyecto_Ruta.Model.Publicacion;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.DTO.ComentarioRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ComentarioResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.ComentarioMapper;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final PublicacionRepository publicacionRepository;
    private final UserRepository userRepository;
    private final ComentarioMapper comentarioMapper;
    private final EmailService emailService;

    public ComentarioService(ComentarioRepository comentarioRepository,
                             PublicacionRepository publicacionRepository,
                             UserRepository userRepository,
                             ComentarioMapper comentarioMapper,
                             EmailService emailService) {
        this.comentarioRepository = comentarioRepository;
        this.publicacionRepository = publicacionRepository;
        this.userRepository = userRepository;
        this.comentarioMapper = comentarioMapper;
        this.emailService = emailService;
    }

    // 🔥 CREAR
    public ComentarioResponseDTO crear(ComentarioRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Publicacion publicacion = publicacionRepository.findById(dto.getPublicacionId())
                .orElseThrow(() -> new RuntimeException("Publicacion no encontrada"));

        Comentario comentario = comentarioMapper.toEntity(dto);

        comentario.setUser(user);
        comentario.setPublicacion(publicacion);
        comentario.setFecha(LocalDateTime.now());

        Comentario guardado = comentarioRepository.save(comentario);
        // Enviar correo de notificación
        // Enviar correo de notificación
        try {
            User autorOriginal = publicacion.getUser();
            
            // Obtenemos el nombre del cliente que comenta (usamos la lógica que ya tenías)
            String nombreQuienComenta = (user.getCliente() != null) 
                                        ? user.getCliente().getNombre() 
                                        : user.getEmail();

            // NOTIFICACIÓN AL AUTOR ORIGINAL
            
            if (!autorOriginal.getIdUser().equals(user.getIdUser())) {
                emailService.enviarNotificacionNuevoComentario(
                    autorOriginal.getEmail(), 
                    nombreQuienComenta, 
                    publicacion.getTitulo()
                );
            }

            // 2. NOTIFICACIÓN AL ADMINISTRADOR 
            emailService.avisarAdminNuevoComentario(
                nombreQuienComenta, 
                user.getEmail(), 
                publicacion.getTitulo()
            );

        } catch (Exception e) {
            System.err.println("Error al enviar los correos de comentario: " + e.getMessage());
        }

        return comentarioMapper.toDTO(guardado);
    }

    public List<ComentarioResponseDTO> listarPorPublicacion(Integer id) {
        return comentarioRepository.findByPublicacionId(id)
                .stream()
                .map(comentarioMapper::toDTO)
                .toList();
    }

    public List<ComentarioResponseDTO> listarPorUsuario(Integer id) {
        return comentarioRepository.findByUserIdUser(id)
                .stream()
                .map(comentarioMapper::toDTO)
                .toList();
    }

    public ComentarioResponseDTO obtenerPorId(Integer id) {
        return comentarioMapper.toDTO(
                comentarioRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Comentario no encontrado"))
        );
    }

    public ComentarioResponseDTO actualizar(Integer id, ComentarioRequestDTO ComentarioDTO) {

        Comentario comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));

        comentario.setContenido(ComentarioDTO.getContenido());

        return comentarioMapper.toDTO(comentarioRepository.save(comentario));
    }

    // Método para contar el número de comentarios de una publicación
    
    public Long contarPorPublicacion(Integer publicacionId) {
        // Usamos el repositorio para contar directamente en la BD (más eficiente)
        return comentarioRepository.countByPublicacionId(publicacionId);
    }

    public void eliminar(Integer id) {
        comentarioRepository.deleteById(id);
    }
}
