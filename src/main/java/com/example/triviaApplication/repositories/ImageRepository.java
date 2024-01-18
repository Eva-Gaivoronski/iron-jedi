package com.example.triviaApplication.repositories;
import com.example.triviaApplication.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<User,Integer> {

}