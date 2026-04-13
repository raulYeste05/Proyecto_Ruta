package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MensajeRequestDTO {

    @NotNull
    private Integer chatId;

    @NotNull
    private Integer userId;

    @NotBlank
    private String contenido;
}
