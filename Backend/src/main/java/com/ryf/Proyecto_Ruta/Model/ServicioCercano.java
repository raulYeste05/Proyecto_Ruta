package com.ryf.Proyecto_Ruta.Model;

import com.ryf.Proyecto_Ruta.Model.ENUM.TipoServicio;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
@Table(name = "servicio_cercano")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ServicioCercano {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "parada_id")
    private Parada parada;

    @Enumerated(EnumType.STRING)
    private TipoServicio tipoServicio;

    private String nombre;
    private Double distancia;
}
