package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Repositories.ParadaRepository;
import com.ryf.Proyecto_Ruta.Repositories.RutaRepository;

import com.ryf.Proyecto_Ruta.Model.Parada;
import com.ryf.Proyecto_Ruta.Model.Ruta;

import com.ryf.Proyecto_Ruta.DTO.ParadaRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ParadaResponseDTO;

import com.ryf.Proyecto_Ruta.Mapper.ParadaMapper;

import com.ryf.Proyecto_Ruta.Model.ENUM.TipoTransporte;

import java.util.List;

@Service


public class ParadaService {

    private final ParadaRepository paradaRepository;
    private final RutaRepository rutaRepository;
    private final ParadaMapper paradaMapper;

    public ParadaService(ParadaRepository paradaRepository,
                         RutaRepository rutaRepository,
                         ParadaMapper paradaMapper) {
        this.paradaRepository = paradaRepository;
        this.rutaRepository = rutaRepository;
        this.paradaMapper = paradaMapper;

    }

    // Crear Parada
    public ParadaResponseDTO crearParada(ParadaRequestDTO ParadaDTO) {

        Ruta ruta = rutaRepository.findById(ParadaDTO.getRutaId())
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
        
        Parada parada = paradaMapper.toEntity(ParadaDTO);
        parada.setRuta(ruta);

        return paradaMapper.toDTO(paradaRepository.save(parada));
    }

    //Lista paradas de una ruta de forma ordenada
    public List<ParadaResponseDTO> listarParadas(Integer rutaId) {
        return paradaRepository.findByRutaIdOrderByOrdenAsc(rutaId)
                .stream()
                .map(paradaMapper::toDTO)
                .toList();
    }

    //Obtener una parada por su id
    public ParadaResponseDTO obtenerPorId(Integer id) {
        return paradaMapper.toDTO(
                paradaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Parada no encontrada"))
        );
    }

    //Actualizar una parada
    public ParadaResponseDTO actualizar(Integer id, ParadaRequestDTO ParadaDTO) {

        Parada parada = paradaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parada no encontrada"));

                parada.setOrden(ParadaDTO.getOrden());
                parada.setLatitud(ParadaDTO.getLatitud());
                parada.setLongitud(ParadaDTO.getLongitud());
                parada.setTipoTransporte(TipoTransporte.valueOf(ParadaDTO.getTipoTransporte()));
                parada.setTiempoEstimado(ParadaDTO.getTiempoEstimado());
                parada.setDistanciaEstimada(ParadaDTO.getDistanciaEstimada());

        Parada actualizada = paradaRepository.save(parada);

        return paradaMapper.toDTO(actualizada);
    }

    //Eliminar una parada
    public void eliminar(Integer id) {
        paradaRepository.deleteById(id);
    }
    
}
