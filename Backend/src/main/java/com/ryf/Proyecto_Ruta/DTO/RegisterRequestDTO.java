package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String dni;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido1;

    private String apellido2;

    @NotBlank
    private String telefono;

    @NotBlank
    private String provincia;

    @NotBlank
    private String localidad;
}
