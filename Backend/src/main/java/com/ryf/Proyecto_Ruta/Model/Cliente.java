package com.ryf.Proyecto_Ruta.Model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;

    private String dni;
    private String nombre;
    private String apellido1;
    private String apellido2;
    private String telefono;
    private String provincia;
    private String localidad;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
}
