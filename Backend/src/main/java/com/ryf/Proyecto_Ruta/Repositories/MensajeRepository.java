package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Mensaje;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {

    List<Mensaje> findByChatIdOrderByFechaAsc(Integer chatId);
}
