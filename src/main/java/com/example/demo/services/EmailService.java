package com.example.demo.services;

import com.example.demo.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOrderConfirmationEmail(String toEmail, Order order, byte[] pdf) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("no-reply@piccola.com");
            helper.setTo(toEmail);
            helper.setSubject("✅ Confirmación de tu pedido en Piccola #" + order.getId());

            String htmlContent = "<h1>¡Gracias por tu pedido, " + order.getUser().getUsername() + "!</h1>"
                    + "<p>Hemos recibido tu pedido con el ID #" + order.getId() + ".</p>"
                    + "<p>Tu orden por un total de <strong>$" + order.getTotalAmount() + "</strong> ha sido procesada.</p>"
                    + "<p>Adjunto encontrarás el recibo detallado en formato PDF.</p>"
                    + "<p>¡Tu hamburguesa está en camino! 🍔</p><br>"
                    + "<p>Saludos,<br>El equipo de Piccola.</p>";

            helper.setText(htmlContent, true);
            helper.addAttachment("Recibo-Pedido-" + order.getId() + ".pdf", new ByteArrayResource(pdf));

            mailSender.send(mimeMessage);
            logger.info("Correo de confirmación enviado a {}", toEmail);

        } catch (MessagingException e) {
            logger.error("Error al enviar el correo de confirmación a {}: {}", toEmail, e.getMessage());
        }
    }
}
