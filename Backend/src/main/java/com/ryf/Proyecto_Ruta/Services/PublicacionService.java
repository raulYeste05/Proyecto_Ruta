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

    public PublicacionService(PublicacionRepository publicacionRepository,
                              UserRepository userRepository,
                              RutaRepository rutaRepository,
                              PublicacionMapper publicacionMapper) {
        this.publicacionRepository = publicacionRepository;
        this.userRepository = userRepository;
        this.rutaRepository = rutaRepository;
        this.publicacionMapper = publicacionMapper;
    }

    //  CREAR PUBLICACION
    public PublicacionResponseDTO crearPublicacion(PublicacionRequestDTO PublicacionDTO) {

        User user = userRepository.findById(PublicacionDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Publicacion publicacion = publicacionMapper.toEntity(PublicacionDTO);
        publicacion.setUser(user);
        publicacion.setFecha(LocalDateTime.now());

        if (PublicacionDTO.getRutaId() != null) {
            Ruta ruta = rutaRepository.findById(PublicacionDTO.getRutaId())
                    .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

            publicacion.setRuta(ruta);
        }

        return publicacionMapper.toDTO(publicacionRepository.save(publicacion));
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

    public void eliminar(Integer id) {
        publicacionRepository.deleteById(id);
    }
    
}
