package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Integer rolId;
}