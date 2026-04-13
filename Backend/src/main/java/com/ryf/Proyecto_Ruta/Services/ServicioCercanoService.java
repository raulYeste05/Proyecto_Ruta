package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Repositories.ServicioCercanoRepository;
import com.ryf.Proyecto_Ruta.Repositories.ParadaRepository;

import com.ryf.Proyecto_Ruta.Model.ServicioCercano;
import com.ryf.Proyecto_Ruta.Model.Parada;

import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.ServicioCercanoMapper;

import com.ryf.Proyecto_Ruta.Model.ENUM.TipoServicio;

import java.util.List;

@Service

public class ServicioCercanoService {

    private final ServicioCercanoRepository servicioCercanoRepository;
    private final ParadaRepository paradaRepository;
    private final ServicioCercanoMapper servicioCercanoMapper;

    public ServicioCercanoService(ServicioCercanoRepository servicioCercanoRepository,
                                  ParadaRepository paradaRepository,
                                  ServicioCercanoMapper servicioCercanoMapper) {
        this.servicioCercanoRepository = servicioCercanoRepository;
        this.paradaRepository = paradaRepository;
        this.servicioCercanoMapper = servicioCercanoMapper;
    }

    // Crear Servicio Cercano
    public ServicioCercanoResponseDTO crearServicioCercano(ServicioCercanoRequestDTO ServicioCercanoDTO) {

        Parada parada = paradaRepository.findById(ServicioCercanoDTO.getParadaId())
                .orElseThrow(() -> new RuntimeException("Parada no encontrada"));
        
        ServicioCercano servicioCercano = servicioCercanoMapper.toEntity(ServicioCercanoDTO);
        servicioCercano.setParada(parada);

        ServicioCercano guardado = servicioCercanoRepository.save(servicioCercano);

        return servicioCercanoMapper.toDTO(guardado);
    }

    //Lista por parada
    public List<ServicioCercanoResponseDTO> obtenerPorParada(Integer paradaId) {
        return servicioCercanoRepository.findByParadaId(paradaId)
                .stream()
                .map(servicioCercanoMapper::toDTO)
                .toList();
    }

    //Obtener un servicio cercano por su id
    public ServicioCercanoResponseDTO obtenerPorId(Integer id) {
        return servicioCercanoMapper.toDTO(
                servicioCercanoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Servicio Cercano no encontrado"))
        );
    }

    //Actualizar un servicio cercano
    public ServicioCercanoResponseDTO actualizar(Integer id, ServicioCercanoRequestDTO ServicioCercanoDTO) {

        ServicioCercano servicioCercano = servicioCercanoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio Cercano no encontrado"));

                servicioCercano.setNombre(ServicioCercanoDTO.getNombre());
                servicioCercano.setTipoServicio(TipoServicio.valueOf(ServicioCercanoDTO.getTipo()));
                servicioCercano.setDistancia(ServicioCercanoDTO.getDistancia());

        ServicioCercano actualizado = servicioCercanoRepository.save(servicioCercano);

        return servicioCercanoMapper.toDTO(actualizado);
    }

    //Eliminar un servicio cercano
    public void eliminar(Integer id) {
        servicioCercanoRepository.deleteById(id);
    }
    
}
