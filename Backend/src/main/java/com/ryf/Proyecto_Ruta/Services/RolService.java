package com.ryf.Proyecto_Ruta.Services;

import com.ryf.Proyecto_Ruta.Model.Rol;
import com.ryf.Proyecto_Ruta.Repositories.RolRepository;
import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.DTO.RolResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.RolMapper;
import com.ryf.Proyecto_Ruta.DTO.RolRequestDTO;

import java.util.List;


@Service
public class RolService {

    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    public RolService(RolRepository rolRepository,
                      RolMapper rolMapper
    ) {
        this.rolRepository = rolRepository;
        this.rolMapper = rolMapper;
    }

    public RolResponseDTO crearRol(RolRequestDTO RolDTO) {
        Rol rol = rolMapper.toEntity(RolDTO);
        return rolMapper.toDTO(rolRepository.save(rol));
    }

    public List<RolResponseDTO> listar() {
        return rolRepository.findAll()
                .stream()
                .map(rolMapper::toDTO)
                .toList();
    }

    public RolResponseDTO obtenerPorId(Integer id) {
        return rolMapper.toDTO(
                rolRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado"))
        );
    }

    public RolResponseDTO obtenerPorNombre(String nombre) {
        return rolMapper.toDTO(
                rolRepository.findByNombre(nombre)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado"))
        );
    }

    public void eliminar(Integer id) {
        rolRepository.deleteById(id);
    }
}