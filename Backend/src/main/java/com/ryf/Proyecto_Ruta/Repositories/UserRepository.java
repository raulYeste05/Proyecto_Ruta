package com.ryf.Proyecto_Ruta.Repositories;

import java.util.Optional;

import com.ryf.Proyecto_Ruta.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
}
