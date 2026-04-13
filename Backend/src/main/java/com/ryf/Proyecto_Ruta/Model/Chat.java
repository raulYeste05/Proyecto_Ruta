package com.ryf.Proyecto_Ruta.Model;

import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chat",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user1_id", "user2_id"}))

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Chat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    private LocalDateTime fechaInicio;
}
