package com.example.triviaApplication.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Set your mail server host, for example, smtp.gmail.com for Gmail
        mailSender.setHost("smtp.gmail.com");

        // Set the mail server port
        mailSender.setPort(587);

        // Set your email and password
        mailSender.setUsername("tghidey@gmail.com");
        mailSender.setPassword("fsdu ardl ikov khpu");

        // Set mail properties
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true"); // You can set it to 'false' in the production environment

        return mailSender;
    }
}