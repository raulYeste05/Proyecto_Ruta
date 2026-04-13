package com.ryf.Proyecto_Ruta.Repositories;

import com.ryf.Proyecto_Ruta.Model.Chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Integer> {

    // Buscar chat entre dos usuarios
    Optional<Chat> findByUser1IdUserAndUser2IdUser(Integer user1, Integer user2);

    // chats donde participa el usuario
    List<Chat> findByUser1IdUserOrUser2IdUser(Integer user1, Integer user2);
}
