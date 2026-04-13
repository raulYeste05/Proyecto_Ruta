package com.ryf.Proyecto_Ruta.Security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
            !authentication.isAuthenticated() ||
            authentication.getPrincipal().equals("anonymousUser")) {
            throw new UsernameNotFoundException("Usuario no autenticado");
        }

        return (User) authentication.getPrincipal();
    }
}
