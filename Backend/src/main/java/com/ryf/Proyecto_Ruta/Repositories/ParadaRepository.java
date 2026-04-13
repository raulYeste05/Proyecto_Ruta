package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Parada;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface ParadaRepository extends JpaRepository<Parada, Integer> {

    List<Parada> findByRutaIdOrderByOrdenAsc(Integer rutaId);
}
