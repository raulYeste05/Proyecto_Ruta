package com.ryf.Proyecto_Ruta.Security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private String token;
    private String rol;
}
