package com.ryf.Proyecto_Ruta.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatResponseDTO {

    private Integer id;
    private Integer user1Id;
    private String emailUser1;
    private Integer user2Id;
    private String emailUser2;
    private LocalDateTime fechaInicio;
}
