package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.ParadaRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ParadaResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Parada;
import com.ryf.Proyecto_Ruta.Model.ENUM.TipoTransporte;

import org.springframework.stereotype.Component;


@Component
public class ParadaMapper {

    public Parada toEntity(ParadaRequestDTO dto) {
        Parada parada = new Parada();
        parada.setOrden(dto.getOrden());
        parada.setLatitud(dto.getLatitud());
        parada.setLongitud(dto.getLongitud());
        parada.setTipoTransporte(TipoTransporte.valueOf(dto.getTipoTransporte()));
        parada.setTiempoEstimado(dto.getTiempoEstimado());
        parada.setDistanciaEstimada(dto.getDistanciaEstimada());
        return parada;
    }

    public ParadaResponseDTO toDTO(Parada parada) {
        ParadaResponseDTO dto = new ParadaResponseDTO();
        dto.setId(parada.getId());
        dto.setOrden(parada.getOrden());
        dto.setLatitud(parada.getLatitud());
        dto.setLongitud(parada.getLongitud());
        dto.setTipoTransporte(parada.getTipoTransporte().name());
        dto.setTiempoEstimado(parada.getTiempoEstimado());
        dto.setDistanciaEstimada(parada.getDistanciaEstimada());

        if (parada.getRuta() != null) {
            dto.setRutaId(parada.getRuta().getId());
        }

        return dto;
    }
}
