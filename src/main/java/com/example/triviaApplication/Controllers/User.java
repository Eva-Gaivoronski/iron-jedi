package com.example.triviaApplication.Controllers;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class User {
    package com.example.triviaApplication;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

    @Entity
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;
        private String username;
        private String password; // Should be hashed
        private String email;
        private boolean isVerified;
        private String profilePictureUrl;

        // Constructors, getters, and setters...
    }

}
