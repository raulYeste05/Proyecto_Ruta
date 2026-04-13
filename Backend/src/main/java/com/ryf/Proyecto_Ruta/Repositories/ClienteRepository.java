package com.ryf.Proyecto_Ruta.Repositories;

import java.util.Optional;

import com.ryf.Proyecto_Ruta.Model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByUserIdUser(Integer userId);

    boolean existsByUserIdUser(Integer userId);

    boolean existsByDni(String dni);
}
