package com.ryf.Proyecto_Ruta.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequestDTO {

    @NotNull
    private Integer user1Id;

    @NotNull
    private Integer user2Id;
}
