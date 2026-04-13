package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Comentario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

    List<Comentario> findByPublicacionId(Integer publicacionId);

    List<Comentario> findByUserIdUser(Integer userId);
}
