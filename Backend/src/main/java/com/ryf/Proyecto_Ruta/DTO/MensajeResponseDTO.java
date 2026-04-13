package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MensajeResponseDTO {

    private Integer id;
    private Integer chatId;
    private Integer userId;
    private String emailUsuario;
    private String contenido;
    private LocalDateTime fecha;
}
