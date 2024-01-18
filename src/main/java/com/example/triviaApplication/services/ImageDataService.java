package com.example.triviaApplication.services;

import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageDataService {

    @Autowired
    private UserRepository userRepository;

    public String uploadImage(MultipartFile file, String id) throws IOException {
        // Find the user by ID
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("upload imiage user : " + user.getUsername());
        // Set the updated profile picture
        user.setProfilePicture(file.getBytes());

        // Save the user with the updated profile picture
        userRepository.save(user);

        return "Profile picture updated successfully for user ID: " + id;
    }

    public User getImage(String id) {
        return userRepository.findById(Long.valueOf(id)).get();
    }
}