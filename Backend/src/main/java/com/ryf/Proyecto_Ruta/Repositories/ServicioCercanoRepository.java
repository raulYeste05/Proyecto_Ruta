package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.ServicioCercano;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ServicioCercanoRepository extends JpaRepository<ServicioCercano, Integer> {

    List<ServicioCercano> findByParadaId(Integer paradaId);
}
