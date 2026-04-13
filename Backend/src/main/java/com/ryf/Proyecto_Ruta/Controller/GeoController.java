package com.ryf.Proyecto_Ruta.Controller;

import com.ryf.Proyecto_Ruta.Services.GeoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/geo")
@CrossOrigin(origins = "http://localhost:4200")
public class GeoController {

    private final GeoService geoService;

    public GeoController(GeoService geoService) {
        this.geoService = geoService;
    }

    @GetMapping(value = "/provincias")
    public Object provincias() {
        return geoService.obtenerProvincias();
    }

    @GetMapping(value = "/municipios/{codProvincia}")
    public Object municipios(@PathVariable String codProvincia) {
        return geoService.obtenerMunicipios(codProvincia);
    }
}
