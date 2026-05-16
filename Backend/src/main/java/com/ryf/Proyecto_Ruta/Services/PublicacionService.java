package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Model.Ruta;

import com.ryf.Proyecto_Ruta.Repositories.PublicacionRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import com.ryf.Proyecto_Ruta.Repositories.RutaRepository;

import com.ryf.Proyecto_Ruta.Model.Publicacion;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.DTO.PublicacionRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.PublicacionResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.PublicacionMapper;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final UserRepository userRepository;
    private final RutaRepository rutaRepository;
    private final PublicacionMapper publicacionMapper;
    private final EmailService emailService;

    public PublicacionService(PublicacionRepository publicacionRepository,
                              UserRepository userRepository,
                              RutaRepository rutaRepository,
                              PublicacionMapper publicacionMapper,
                              EmailService emailService) {
        this.publicacionRepository = publicacionRepository;
        this.userRepository = userRepository;
        this.rutaRepository = rutaRepository;
        this.publicacionMapper = publicacionMapper;
        this.emailService = emailService;
    }

    //  CREAR PUBLICACION
    public PublicacionResponseDTO crearPublicacion(PublicacionRequestDTO dto) {
        Publicacion entity = publicacionMapper.toEntity(dto); // Crea la entidad base
        
        // Buscas y asignas las relaciones
        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        entity.setUser(user);
        
        if (dto.getRutaId() != null) {
            Ruta ruta = rutaRepository.findById(dto.getRutaId()).orElseThrow();
            entity.setRuta(ruta);
            ruta.setPublicada(true); // No olvides marcarla como publicada
        }
        
        entity.setFecha(LocalDateTime.now());
        Publicacion guardada = publicacionRepository.save(entity);
        // Enviar correo de publicación
        try {
            emailService.enviarCorreoRutaPublicada(user.getEmail(), dto.getTitulo());
            emailService.avisarAdminNuevaPublicacion(user.getCliente().getNombre(), dto.getTitulo());
        } catch (Exception e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
        }
        return publicacionMapper.toDTO(guardada);
    }

    public List<PublicacionResponseDTO> listar() {
        return publicacionRepository.findAll()
                .stream()
                .map(publicacionMapper::toDTO)
                .toList();
    }

    public List<PublicacionResponseDTO> listarPorUser(Integer userId) {
        return publicacionRepository.findByUserIdUser(userId)
                .stream()
                .map(publicacionMapper::toDTO)
                .toList();
    }

    public List<PublicacionResponseDTO> listarPorRuta(Integer rutaId) {
        return publicacionRepository.findByRutaId(rutaId)
                .stream()
                .map(publicacionMapper::toDTO)
                .toList();
    }

    public PublicacionResponseDTO obtenerPorId(Integer id) {
        return publicacionMapper.toDTO(
                publicacionRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Publicacion no encontrada"))
        );
    }

    public PublicacionResponseDTO actualizar(Integer id, PublicacionRequestDTO PublicacionDTO) {

        Publicacion publicacion = publicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicacion no encontrada"));
                
                publicacion.setTitulo(PublicacionDTO.getTitulo());
                publicacion.setContenido(PublicacionDTO.getContenido());
                publicacion.setFecha(LocalDateTime.now());

        Publicacion actualizada = publicacionRepository.save(publicacion);

        return publicacionMapper.toDTO(actualizada);
                
    }

    // ELIMINAR PUBLICACIÓN USANDO EL RUTA ID Y REVERTIR ESTADO
    @org.springframework.transaction.annotation.Transactional
    public void eliminarPorRutaId(Integer rutaId) {
        // 1. Buscamos la publicación usando el ID de la ruta
        List<Publicacion> publicaciones = publicacionRepository.findByRutaId(rutaId);
        
        if (publicaciones.isEmpty()) {
            throw new RuntimeException("No existe ninguna publicación asociada a la ruta con ID: " + rutaId);
        }
        
        // Obtenemos la publicación que vamos a destruir
        Publicacion publicacion = publicaciones.get(0);

        // 2. Buscamos la ruta de forma independiente para romper el lazo de Foreign Key
        Ruta ruta = rutaRepository.findById(rutaId).orElse(null);
        if (ruta != null) {
            ruta.setPublicada(false);
            rutaRepository.saveAndFlush(ruta); // Cambiamos el bit en la BD a 0
        }

        // 3. Rompemos explícitamente la relación en la entidad antes de borrar
        publicacion.setRuta(null);
        publicacion.setUser(null);
        publicacionRepository.saveAndFlush(publicacion);

        // 4. Ahora que está completamente suelta, la borramos físicamente
        publicacionRepository.delete(publicacion);
    }

    public void eliminar(Integer id) {
        publicacionRepository.deleteById(id);
    }
    
}
