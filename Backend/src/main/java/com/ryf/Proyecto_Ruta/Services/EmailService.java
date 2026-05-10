package com.ryf.Proyecto_Ruta.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    private final String ADMIN_EMAIL = "ryeste124@gmail.com";

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.brevo.com/v3")
            .build();

    // Método general
    private void enviarCorreo(String destinatario, String asunto, String contenido) {

        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", "Proyecto Ruta",
                        "email", "ryeste124@gmail.com"
                ),
                "to", List.of(
                        Map.of("email", destinatario)
                ),
                "subject", asunto,
                "htmlContent", contenido
        );

        webClient.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    // Cliente
    public void enviarCorreoBienvenida(String destinatario, String nombre) {

        String contenido = """
                <h2>Bienvenido a Proyecto Ruta</h2>
                <p>Hola %s, tu cuenta ha sido creada correctamente.</p>
                """.formatted(nombre);

        enviarCorreo(destinatario,
                "¡Bienvenido a Proyecto Ruta!",
                contenido);
    }

    public void enviarCorreoRutaPublicada(String destinatario, String tituloRuta) {

        String contenido = """
                <h2>Ruta publicada</h2>
                <p>Tu ruta '%s' ya está visible en la aplicación.</p>
                """.formatted(tituloRuta);

        enviarCorreo(destinatario,
                "Ruta publicada correctamente",
                contenido);
    }

    public void enviarNotificacionNuevoComentario(String emailAutor,
                                                  String nombreComentador,
                                                  String tituloPublicacion) {

        String contenido = """
                <h2>Nuevo comentario</h2>
                <p>%s ha comentado tu publicación '%s'.</p>
                """.formatted(nombreComentador, tituloPublicacion);

        enviarCorreo(emailAutor,
                "Nuevo comentario",
                contenido);
    }

    // Admin
    public void avisarAdminNuevoRegistro(String nombreUser, String emailUser) {

        String contenido = """
                <h2>Nuevo usuario registrado</h2>
                <p>%s (%s)</p>
                """.formatted(nombreUser, emailUser);

        enviarCorreo(ADMIN_EMAIL,
                "Nuevo registro",
                contenido);
    }

    public void avisarAdminNuevaPublicacion(String nombreUser, String tituloRuta) {

        String contenido = """
                <h2>Nueva publicación</h2>
                <p>%s ha publicado: %s</p>
                """.formatted(nombreUser, tituloRuta);

        enviarCorreo(ADMIN_EMAIL,
                "Nueva publicación",
                contenido);
    }

    public void avisarAdminNuevoComentario(String nombreUser,
                                           String emailUser,
                                           String tituloPublicacion) {

        String contenido = """
                <h2>Nuevo comentario</h2>
                <p>%s (%s) comentó en '%s'</p>
                """.formatted(nombreUser, emailUser, tituloPublicacion);

        enviarCorreo(ADMIN_EMAIL,
                "Nuevo comentario",
                contenido);
    }
}