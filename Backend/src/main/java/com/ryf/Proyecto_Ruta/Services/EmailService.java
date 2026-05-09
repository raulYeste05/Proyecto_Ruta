package com.ryf.Proyecto_Ruta.Services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String ADMIN_EMAIL = "ryeste124@gmail.com";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //Correos para clientes
    @Async
    public void enviarCorreoBienvenida(String destinatario, String nombre) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("¡Bienvenido a Proyecto Ruta!");
        message.setText("Hola " + nombre + ",\n\n" +
                "¡Tu cuenta ha sido creada con éxito! Gracias por registrarte en nuestra aplicación.\n\n" +
                "Saludos,\nEl equipo de Proyecto Ruta.");
        message.setFrom("ryeste124@gmail.com");

        mailSender.send(message);
    }
    @Async
    public void enviarCorreoRutaPublicada(String destinatario, String tituloRuta) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("¡Ruta publicada correctamente! 🗺️");
        message.setText("Tu ruta '" + tituloRuta + "' ya está disponible en el foro.\n\n" +
                "Otros usuarios ya pueden verla y comentar tu aventura.\n" +
                "¡Gracias por compartir con la comunidad!");
        message.setFrom("ryeste124@gmail.com");

        mailSender.send(message);
    }

    
    @Async
    public void enviarNotificacionNuevoComentario(String emailAutor, String nombreComentador, String tituloPublicacion) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailAutor);
        message.setSubject("¡Nuevo comentario en tu ruta! 💬");
        message.setText("Hola,\n\n" +
                nombreComentador + " ha dejado un comentario en tu publicación '" + tituloPublicacion + "'.\n\n" +
                "¡Entra en la app para ver qué ha dicho!");
        message.setFrom("ryeste124@gmail.com");

        mailSender.send(message);
    }

    //Correos para administradores
    @Async
    public void avisarAdminNuevoRegistro(String nombreUser, String emailUser) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ADMIN_EMAIL);
        message.setFrom("ryeste124@gmail.com");
        message.setSubject("ALERTA: Nuevo usuario registrado");
        message.setText("Se ha registrado: " + nombreUser + " (" + emailUser + ")");
        mailSender.send(message);
    }
    @Async
    public void avisarAdminNuevaPublicacion(String nombreUser, String tituloRuta) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ADMIN_EMAIL);
        message.setSubject("ALERTA: Nueva ruta publicada");
        message.setText("El usuario " + nombreUser + " ha publicado: " + tituloRuta);
        mailSender.send(message);
    }
    @Async
    public void avisarAdminNuevoComentario(String nombreUser, String emailUser, String tituloPublicacion) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ADMIN_EMAIL);
        message.setSubject("ALERTA: Nuevo comentario en publicación");
        message.setText("El usuario " + nombreUser + " (" + emailUser + ") ha dejado un comentario en la publicación: " + tituloPublicacion);
        mailSender.send(message);
    }
}