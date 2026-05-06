package com.ryf.Proyecto_Ruta.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ryf.Proyecto_Ruta.Model.ENUM.TipoTransporte;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Id;
import jakarta.persistence.CascadeType;
import java.util.List;

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

    

    private Integer orden;
    private Double latitud;
    private Double longitud;

    @Enumerated(EnumType.STRING)
    private TipoTransporte tipoTransporte;

    private Integer tiempoEstimado;
    private Double distanciaEstimada;

    @ManyToOne
    @JoinColumn(name = "ruta_id")
    @JsonBackReference
    private Ruta ruta;

    // Si borras la parada, borras los servicios de gasolineras/restaurantes guardados para esa parada
    @OneToMany(mappedBy = "parada", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ServicioCercano> serviciosCercanos;
}
