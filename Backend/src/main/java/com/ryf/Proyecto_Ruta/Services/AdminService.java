package com.ryf.Proyecto_Ruta.Services;


import java.util.List;

import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> obtenerUsuarios() {
        return userRepository.findAll();
    }

    public void eliminarUsuario(Long idUser) {
        userRepository.deleteById(idUser.intValue());
    }
}
