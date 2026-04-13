package com.ryf.Proyecto_Ruta.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "publicacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class Publicacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    private Ruta ruta;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    private LocalDateTime fecha;

}
