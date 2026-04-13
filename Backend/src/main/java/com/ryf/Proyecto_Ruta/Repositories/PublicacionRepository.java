package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Publicacion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {

    List<Publicacion> findByUserIdUser(Integer userId);

    List<Publicacion> findByRutaId(Integer rutaId);
}
