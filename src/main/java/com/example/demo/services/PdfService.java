package com.example.demo.services;

import com.itextpdf.html2pdf.HtmlConverter;
import com.example.demo.entity.Order;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateOrderPdf(Order order) {
        // Thymeleaf context
        Context context = new Context();
        context.setVariable("order", order);
        
        // Render the HTML template 'order_pdf.html' with the order data.
        String htmlContent = templateEngine.process("order_pdf", context);

        // Convert the rendered HTML to a PDF byte stream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(htmlContent, outputStream);
        return outputStream.toByteArray();
    }
}
