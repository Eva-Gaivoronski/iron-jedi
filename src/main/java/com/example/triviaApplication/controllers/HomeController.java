package com.example.triviaApplication.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "index"; // Return the name of the HTML file (index.html)
    }
}
