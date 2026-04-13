package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Ruta;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    List<Ruta> findByUserIdUser(Integer userId);

    List<Ruta> findByPublicadaTrue();
}
