package com.ryf.Proyecto_Ruta.Mapper;

import com.ryf.Proyecto_Ruta.DTO.ClienteRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ClienteResponseDTO;
import com.ryf.Proyecto_Ruta.Model.Cliente;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setDni(dto.getDni());
        cliente.setNombre(dto.getNombre());
        cliente.setApellido1(dto.getApellido1());
        cliente.setApellido2(dto.getApellido2());
        cliente.setTelefono(dto.getTelefono());
        cliente.setProvincia(dto.getProvincia());
        cliente.setLocalidad(dto.getLocalidad());
        return cliente;
    }

    public ClienteResponseDTO toDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setIdCliente(cliente.getIdCliente());
        dto.setDni(cliente.getDni());
        dto.setNombre(cliente.getNombre());
        dto.setApellido1(cliente.getApellido1());
        dto.setApellido2(cliente.getApellido2());
        dto.setTelefono(cliente.getTelefono());
        dto.setProvincia(cliente.getProvincia());
        dto.setLocalidad(cliente.getLocalidad());

        if (cliente.getUser() != null) {
            dto.setUserId(cliente.getUser().getIdUser());
            dto.setEmail(cliente.getUser().getEmail());
            dto.setPassword(cliente.getUser().getPassword());
        }

        return dto;
    }
}
