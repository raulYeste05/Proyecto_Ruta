package com.ryf.Proyecto_Ruta.Model;

import com.ryf.Proyecto_Ruta.Model.ENUM.TipoTransporte;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "parada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class Parada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    private Ruta ruta;

    private Integer orden;
    private Double latitud;
    private Double longitud;

    @Enumerated(EnumType.STRING)
    private TipoTransporte tipoTransporte;

    private Integer tiempoEstimado;
    private Double distanciaEstimada;
}
