package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Method to find a user by their username.
    // Returns an Optional<User>, which will be empty if the user is not found.
    Optional<User> findByUsername(String username);

    // Method to check if a user exists with a given email.
    // Returns a Boolean: true if a user with the given email exists, false otherwise.
    Boolean existsByEmail(String email);

    // Method to check if a user exists with a given username.
    // Returns a Boolean: true if a user with the given username exists, false otherwise.
    Boolean existsByUsername(String username);
}