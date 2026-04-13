package com.ryf.Proyecto_Ruta.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoService {

    private final RestTemplate restTemplate;
    private final String API_KEY = "5d5086f62a1b1e75748642f4e717f0217de404f716f56fb82341e77e9cb0f912";

    public GeoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object obtenerProvincias() {
        String url = "https://apiv1.geoapi.es/provincias?type=JSON&key=" + API_KEY;

        return restTemplate.getForObject(url, Object.class);
    }

    public Object obtenerMunicipios(String codProvincia) {
        String url = "https://apiv1.geoapi.es/municipios?CPRO="
                + codProvincia + "&type=JSON&key=" + API_KEY;

        return restTemplate.getForObject(url, Object.class);
    }
}
