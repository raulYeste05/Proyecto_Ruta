package com.ryf.Proyecto_Ruta.Services;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ryf.Proyecto_Ruta.Repositories.ServicioCercanoRepository;
import tools.jackson.databind.ObjectMapper;

import com.ryf.Proyecto_Ruta.Repositories.ParadaRepository;
import com.ryf.Proyecto_Ruta.Model.ServicioCercano;
import com.ryf.Proyecto_Ruta.Model.Parada;
import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ServicioCercanoResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.ServicioCercanoMapper;
import com.ryf.Proyecto_Ruta.Model.ENUM.TipoServicio;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


@Service

public class ServicioCercanoService {

    private final ServicioCercanoRepository servicioCercanoRepository;
    private final ParadaRepository paradaRepository;
    private final ServicioCercanoMapper servicioCercanoMapper;

    private final RestTemplate restTemplate;
    private final String ORS_POI_URL = "https://api.openrouteservice.org/pois";
    private final String API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImVjZWRhMmVjYjdmZTRiNzA5ODdhNzJmNDQzYzY0MmVmIiwiaCI6Im11cm11cjY0In0=";

    public ServicioCercanoService(ServicioCercanoRepository servicioCercanoRepository,
                                  ParadaRepository paradaRepository,
                                  ServicioCercanoMapper servicioCercanoMapper,
                                  RestTemplate restTemplate) {
        this.servicioCercanoRepository = servicioCercanoRepository;
        this.paradaRepository = paradaRepository;
        this.servicioCercanoMapper = servicioCercanoMapper;
        this.restTemplate = restTemplate;
    }

    // Crear Servicio Cercano
    public ServicioCercanoResponseDTO crearServicioCercano(ServicioCercanoRequestDTO ServicioCercanoDTO) {

        Parada parada = paradaRepository.findById(ServicioCercanoDTO.getParadaId())
                .orElseThrow(() -> new RuntimeException("Parada no encontrada"));
        
        ServicioCercano servicioCercano = servicioCercanoMapper.toEntity(ServicioCercanoDTO);
        servicioCercano.setParada(parada);

        ServicioCercano guardado = servicioCercanoRepository.save(servicioCercano);

        return servicioCercanoMapper.toDTO(guardado);
    }

    //Lista por parada
    public List<ServicioCercanoResponseDTO> obtenerPorParada(Integer paradaId) {
        return servicioCercanoRepository.findByParadaId(paradaId)
                .stream()
                .map(servicioCercanoMapper::toDTO)
                .toList();
    }

    //Obtener un servicio cercano por su id
    public ServicioCercanoResponseDTO obtenerPorId(Integer id) {
        return servicioCercanoMapper.toDTO(
                servicioCercanoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Servicio Cercano no encontrado"))
        );
    }

    //Actualizar un servicio cercano
    public ServicioCercanoResponseDTO actualizar(Integer id, ServicioCercanoRequestDTO ServicioCercanoDTO) {

        ServicioCercano servicioCercano = servicioCercanoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio Cercano no encontrado"));

                servicioCercano.setNombre(ServicioCercanoDTO.getNombre());
                servicioCercano.setTipoServicio(TipoServicio.valueOf(ServicioCercanoDTO.getTipo()));
                servicioCercano.setDistancia(ServicioCercanoDTO.getDistancia());
                servicioCercano.setLatitud(ServicioCercanoDTO.getLatitud());
                servicioCercano.setLongitud(ServicioCercanoDTO.getLongitud());

        ServicioCercano actualizado = servicioCercanoRepository.save(servicioCercano);

        return servicioCercanoMapper.toDTO(actualizado);
    }

    //Eliminar un servicio cercano
    public void eliminar(Integer id) {
        servicioCercanoRepository.deleteById(id);
    }


    // Obtener las coordenadas de un POI




    /**
     * Este método buscará servicios en ORS y los guardará en tu DB
     */
    public void buscarYGuardarServiciosAutomaticos(Parada parada) {
    System.out.println("--- Iniciando búsqueda de servicios para parada ID: " + parada.getId() + " ---");

    Map<String, Object> geojson = new HashMap<>();
    geojson.put("type", "Point");
    geojson.put("coordinates", List.of(parada.getLongitud(), parada.getLatitud()));

    Map<String, Object> geometry = new HashMap<>();
    geometry.put("geojson", geojson);
    geometry.put("buffer", 2000); 

    Map<String, Object> filters = new HashMap<>();
    filters.put("category_ids", List.of(500, 510, 161, 164, 247)); 

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("request", "pois");
    requestBody.put("geometry", geometry);
    requestBody.put("filters", filters);
    requestBody.put("limit", 100);

    try {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", API_KEY);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        System.out.println("Enviando petición a ORS...");
        ResponseEntity<String> response = restTemplate.postForEntity(ORS_POI_URL, entity, String.class);
        System.out.println("Respuesta recibida de ORS. Status: " + response.getStatusCode());

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            // LIMPIEZA RADICAL: Reemplaza CUALQUIER aparición de NaN por null
            // El regex \\bNaN\\b encuentra la palabra exacta NaN
            String jsonLimpio = response.getBody().replaceAll("\\bNaN\\b", "null");
            
            System.out.println("Intentando parsear JSON (limpio)...");
            ObjectMapper mapper = new ObjectMapper();
            
            // Si esto falla, saltará al catch de abajo
            Map<String, Object> bodyMap = mapper.readValue(jsonLimpio, Map.class);
            
            System.out.println("JSON parseado correctamente. Procesando features...");
            procesarRespuestaORS(bodyMap, parada);
        }
    } catch (Exception e) {
        System.err.println("¡ERROR DETECTADO!: " + e.getMessage());
        e.printStackTrace(); 
    }
}

    private void procesarRespuestaORS(Map<String, Object> response, Parada parada) {
    try {
        List<Map<String, Object>> features = (List<Map<String, Object>>) response.get("features");

        if (features == null || features.isEmpty()) {
            System.out.println("⚠️ No se encontraron servicios (features está vacío).");
            return;
        }

        int guardados = 0;
        for (Map<String, Object> feature : features) {
            Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
            
            // 1. Determinar tipo (con seguridad)
            TipoServicio tipoDetectado = determinarTipo(properties);
            if (tipoDetectado == null) continue; 

            // 2. Extraer coordenadas
            Map<String, Object> geom = (Map<String, Object>) feature.get("geometry");
            List<Object> coords = (List<Object>) geom.get("coordinates");
            
            // Verificamos que las coordenadas no sean nulas o NaN (aunque ya limpiamos el JSON)
            if (coords == null || coords.get(0) == null) continue;

            Double lon = Double.parseDouble(coords.get(0).toString());
            Double lat = Double.parseDouble(coords.get(1).toString());

            // 3. Extraer nombre
            String nombreFinal = "Servicio cercano";
            if (properties.containsKey("osm_tags")) {
                Map<String, Object> tags = (Map<String, Object>) properties.get("osm_tags");
                if (tags != null && tags.get("name") != null) {
                    nombreFinal = tags.get("name").toString();
                }
            }

            // 4. Crear y Guardar
            ServicioCercano servicio = new ServicioCercano();
            servicio.setNombre(nombreFinal);
            servicio.setTipoServicio(tipoDetectado);
            servicio.setParada(parada);
            servicio.setLatitud(lat);
            servicio.setLongitud(lon);
            
            // Distancia con seguridad
            if (properties.get("distance") != null) {
                servicio.setDistancia(Double.parseDouble(properties.get("distance").toString()));
            }

            servicioCercanoRepository.save(servicio);
            guardados++;
        }
        System.out.println("✅ Éxito: " + guardados + " servicios guardados para la parada " + parada.getId());
        
    } catch (Exception e) {
        System.err.println("❌ Error en procesarRespuestaORS: " + e.getMessage());
        e.printStackTrace(); // Esto nos dirá la línea exacta del fallo
    }
}

    private TipoServicio determinarTipo(Map<String, Object> properties) {
        Map<String, Object> categories = (Map<String, Object>) properties.get("category_ids");
        if (categories == null || categories.isEmpty()) return null;

        List<Integer> ids = categories.keySet().stream()
                                    .map(Integer::parseInt)
                                    .toList();
        
        // LOG TEMPORAL: Esto te dirá qué IDs está viendo Java en la consola
        // System.out.println("Analizando POI con IDs: " + ids);

        // 1. PRIORIDAD MÁXIMA: Gasolinera (510 es específica, 500 es el grupo de Automoción)
        if (ids.contains(510) || ids.contains(500)) return TipoServicio.gasolinera;

        // 2. SEGUNDA PRIORIDAD: Área de descanso
        if (ids.contains(247)) return TipoServicio.area_descanso;

        // 3. TERCERA PRIORIDAD: Restaurantes
        if (ids.contains(161) || ids.contains(164)) {
            return TipoServicio.restaurante;
        }

        return null; 
    }


    /**
 * Método para buscar servicios "al vuelo" por coordenadas sin guardar en DB.
 */
public List<ServicioCercanoResponseDTO> buscarServiciosTemporales(Double lat, Double lon) {
    Map<String, Object> geojson = new HashMap<>();
    geojson.put("type", "Point");
    geojson.put("coordinates", List.of(lon, lat)); // ORS usa [lon, lat]

    Map<String, Object> geometry = new HashMap<>();
    geometry.put("geojson", geojson);
    geometry.put("buffer", 2000); // 2km a la redonda

    Map<String, Object> filters = new HashMap<>();
    filters.put("category_ids", List.of(500, 510, 161, 164, 247)); 

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("request", "pois");
    requestBody.put("geometry", geometry);
    requestBody.put("filters", filters);
    requestBody.put("limit", 20); // Limitamos para rapidez

    try {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", API_KEY);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(ORS_POI_URL, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String jsonLimpio = response.getBody().replaceAll("\\bNaN\\b", "null");
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> bodyMap = mapper.readValue(jsonLimpio, Map.class);
            
            // Reutilizamos tu lógica de determinación de tipos, pero devolviendo DTOs
            return transformarRespuestaADTOs(bodyMap);
        }
    } catch (Exception e) {
        System.err.println("Error en búsqueda temporal: " + e.getMessage());
    }
    return List.of();
}

// Método auxiliar para no ensuciar el código
private List<ServicioCercanoResponseDTO> transformarRespuestaADTOs(Map<String, Object> response) {
    List<ServicioCercanoResponseDTO> listaDtos = new java.util.ArrayList<>();
    List<Map<String, Object>> features = (List<Map<String, Object>>) response.get("features");

    if (features == null) return listaDtos;

    for (Map<String, Object> feature : features) {
        Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
        TipoServicio tipo = determinarTipo(properties);
        if (tipo == null) continue;

        Map<String, Object> geom = (Map<String, Object>) feature.get("geometry");
        List<Object> coords = (List<Object>) geom.get("coordinates");

        ServicioCercanoResponseDTO dto = new ServicioCercanoResponseDTO();
        dto.setNombre(extraerNombre(properties));
        dto.setTipo(tipo.name());
        dto.setLatitud(Double.parseDouble(coords.get(1).toString()));
        dto.setLongitud(Double.parseDouble(coords.get(0).toString()));
        if (properties.get("distance") != null) {
            dto.setDistancia(Double.parseDouble(properties.get("distance").toString()));
        }
        listaDtos.add(dto);
    }
    return listaDtos;
}

private String extraerNombre(Map<String, Object> properties) {
    if (properties.containsKey("osm_tags")) {
        Map<String, Object> tags = (Map<String, Object>) properties.get("osm_tags");
        if (tags != null && tags.get("name") != null) return tags.get("name").toString();
    }
    return "Servicio cercano";
}

}