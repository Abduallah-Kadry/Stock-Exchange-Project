package com.example.stockexchange.controller;


import com.example.stockexchange.entity.Authority;
import com.example.stockexchange.entity.User;
import com.example.stockexchange.response.ApiRespond;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController("/")
public class UserController {

    @GetMapping
    public ResponseEntity<ApiRespond<User>> getUser() {
        return ResponseEntity.ok().body(new ApiRespond<>(HttpStatus.OK, "User fetched", new User(1L, "Abdullah", "Kadry", "someEmail@gmail.com", "aks123", 1, new ArrayList<>(List.of(new Authority("ROLE_ADMIN")))))
        );
    }

    @GetMapping("/random")
    public ResponseEntity<ApiRespond<User>> getUser2() {
        return ResponseEntity.ok().body(new ApiRespond<>(HttpStatus.OK, "User fetched", new User(1L, "Abdullah", "Kadry", "someEmail@gmail.com", "aks123", 1, new ArrayList<>(List.of(new Authority("ROLE_ADMIN")))))
        );
    }
}
