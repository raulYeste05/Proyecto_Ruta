package com.ryf.Proyecto_Ruta.Services;


import com.ryf.Proyecto_Ruta.DTO.RutaResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.RutaMapper;
import com.ryf.Proyecto_Ruta.Model.Ruta;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Repositories.RutaRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import org.springframework.stereotype.Service;
import com.ryf.Proyecto_Ruta.DTO.RutaRequestDTO;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class RutaService {

    private final RutaRepository rutaRepository;
    private final UserRepository userRepository;
    private final RutaMapper rutaMapper;

    public RutaService(RutaRepository rutaRepository,
                       UserRepository userRepository,
                        RutaMapper rutaMapper) {
        this.rutaRepository = rutaRepository;
        this.userRepository = userRepository;
        this.rutaMapper = rutaMapper;

    }

    // 🔥 CREAR RUTA
    public RutaResponseDTO crearRuta(RutaRequestDTO RutaDTO) {

        User user = userRepository.findById(RutaDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Ruta ruta = rutaMapper.toEntity(RutaDTO);
        ruta.setUser(user);
        ruta.setFechaCreacion(LocalDateTime.now());

        if (ruta.getPublicada() == null) {
            ruta.setPublicada(false);
        }

        Ruta guardada = rutaRepository.save(ruta);

        return rutaMapper.toDTO(guardada);
    }


    //  LISTAR TODAS
    public List<RutaResponseDTO> listar() {
        return rutaRepository.findAll()
                .stream()
                .map(rutaMapper::toDTO)
                .toList();
    }

    //  LISTAR POR USUARIO
    public List<RutaResponseDTO> listarPorUser(Integer userId) {
        return rutaRepository.findByUserIdUser(userId)
                .stream()
                .map(rutaMapper::toDTO)
                .toList();
    }

    //  SOLO PUBLICAS
    public List<RutaResponseDTO> listarPublicas() {
        return rutaRepository.findByPublicadaTrue()
                .stream()
                .map(rutaMapper::toDTO)
                .toList();
    }

    //  POR ID
    public RutaResponseDTO obtenerPorId(Integer id) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
        return rutaMapper.toDTO(ruta);
    }

    //  ACTUALIZAR
    public RutaResponseDTO actualizar(Integer id, RutaRequestDTO RutaDTO) {

        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        ruta.setTitulo(ruta.getTitulo());
        ruta.setDescripcion(ruta.getDescripcion());
        ruta.setPublicada(ruta.getPublicada());

        Ruta actualizada = rutaRepository.save(ruta);

        return rutaMapper.toDTO(actualizada);
    }

    //  ELIMINAR
    public void eliminar(Integer id) {
        if (!rutaRepository.existsById(id)) {
            throw new RuntimeException("Ruta no encontrada");
            
        }

        rutaRepository.deleteById(id);
    }

}
