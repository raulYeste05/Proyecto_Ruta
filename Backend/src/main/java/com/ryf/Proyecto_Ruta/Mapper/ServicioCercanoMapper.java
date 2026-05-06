package com.ryf.Proyecto_Ruta.Mapper;

import org.springframework.stereotype.Component;

import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoResponseDTO;
import com.ryf.Proyecto_Ruta.Model.ServicioCercano;
import com.ryf.Proyecto_Ruta.Model.ENUM.TipoServicio;


@Component
public class ServicioCercanoMapper {

    public ServicioCercano toEntity(ServicioCercanoRequestDTO dto) {
        ServicioCercano servicio = new ServicioCercano();
        servicio.setTipoServicio(TipoServicio.valueOf(dto.getTipo()));
        servicio.setNombre(dto.getNombre());
        servicio.setDistancia(dto.getDistancia());
        servicio.setLatitud(dto.getLatitud());
        servicio.setLongitud(dto.getLongitud());
        return servicio;
    }

    public ServicioCercanoResponseDTO toDTO(ServicioCercano servicio) {
        ServicioCercanoResponseDTO dto = new ServicioCercanoResponseDTO();
        dto.setId(servicio.getId());
        dto.setTipo(servicio.getTipoServicio().name());
        dto.setNombre(servicio.getNombre());
        dto.setDistancia(servicio.getDistancia());
        dto.setLatitud(servicio.getLatitud());
        dto.setLongitud(servicio.getLongitud());

        if (servicio.getParada() != null) {
            dto.setParadaId(servicio.getParada().getId());
        }

        return dto;
    }
}
