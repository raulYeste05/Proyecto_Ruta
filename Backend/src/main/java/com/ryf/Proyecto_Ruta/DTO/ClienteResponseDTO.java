package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteResponseDTO {

    private Integer idCliente;
    private String dni;
    private String nombre;
    private String apellido1;
    private String apellido2;
    private String telefono;
    private String provincia;
    private String localidad;

    private Integer userId;
    private String email;
    private String password;
}
