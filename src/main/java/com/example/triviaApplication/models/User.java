package com.example.triviaApplication.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Represents a user entity in the application.
 * Mapped to 'app_user' table in the database.
 */
@Entity(name = "AppUser") // Renaming the table to avoid using the reserved keyword "user"
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 3, max = 50)
    private String username;

    @NotNull
    @Size(min = 6)
    private String password;

    @Email
    @NotNull
    private String email;

    // Indicates whether the user's email is verified
    private int is_email_verified;

    // Profile picture stored as a byte array in the database
    @Lob
    @Column(name = "profile_picture", length = 10485760)
    private byte[] profilePicture;

    // Standard getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public int getIsEmailVerified() {
        return is_email_verified;
    }

    public void setIsEmailVerified(int is_email_verified) {
        this.is_email_verified = is_email_verified;
    }

    // Uncomment and use the following if you need to link questions and quizzes directly to the user
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Set<Question> questions;

    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Set<Quiz> quizzes;
}