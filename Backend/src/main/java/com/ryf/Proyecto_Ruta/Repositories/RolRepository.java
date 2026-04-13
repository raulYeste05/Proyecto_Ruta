package com.ryf.Proyecto_Ruta.Repositories;

import java.util.Optional;

import com.ryf.Proyecto_Ruta.Model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    Optional<Rol> findByNombre(String nombre);

}
