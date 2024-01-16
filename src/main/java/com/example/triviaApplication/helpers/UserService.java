package com.example.triviaApplication.helpers;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Method to create a user, send verification email, etc.
    public User createUser(String username, String email, String password) {
        // Check if the username or email already exists
        //  if (userRepository.findByUsername(username)) {
        // throw new IllegalStateException("User already registered.");
        // Handle username already exists scenario
        // You might want to throw an exception or return an appropriate response
        // Example: throw new UsernameAlreadyExistsException("Username already exists");
        // }


        // Create a new user entity
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);

        // Save the user to the database
        userRepository.save(user);

        // Perform actions such as sending a verification email
        // You might want to call a separate service or use an email library for this
        // Example: emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());

        return user;
    }


}