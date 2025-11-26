package com.example.stockexchange.controller;

import com.example.stockexchange.exception.AuthenticationException;
import com.example.stockexchange.request.AuthenticationRequest;
import com.example.stockexchange.request.RegisterRequest;
import com.example.stockexchange.response.ApiRespond;
import com.example.stockexchange.response.AuthenticationResponse;
import com.example.stockexchange.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.paths.api-base}${app.paths.api-version}${app.paths.auth-base}")
@Tag(name = "Authentication REST API Endpoints", description = "Operations related to register & login")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final long jwtExpirationSeconds;


    public AuthenticationController(AuthenticationService authenticationService,
                                    @Value("${jwt.expiration}") long jwtExpirationSeconds) {
        this.authenticationService = authenticationService;
        this.jwtExpirationSeconds = jwtExpirationSeconds;
    }

    @Operation(summary = "Register a Student", description = "register a new Student")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<ApiRespond<Void>> register(@Valid @RequestBody RegisterRequest registerRequest) {


        authenticationService.register(registerRequest);

        return ResponseEntity.ok()
                .body(new ApiRespond<>(HttpStatus.OK, "registered successfully", null));

    }

    @Operation(summary = "Login a User", description = "Submit email & password to authenticate a student")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/login")
    public ResponseEntity<ApiRespond> login(@Valid @RequestBody AuthenticationRequest authenticationRequest) throws AuthenticationException {

        AuthenticationResponse token = authenticationService.login(authenticationRequest);

        ResponseCookie cookie = ResponseCookie.from("jwt", token.getToken())
                .httpOnly(true)
                .secure(false) // change to true if using HTTPS
                .path("/")
                .maxAge(jwtExpirationSeconds / 1000)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new ApiRespond(HttpStatus.OK, "login successfully",
                        token));
    }

    @Operation(summary = "Logout", description = "Logout user")
    @PostMapping("/logout")
    public ResponseEntity<Void> login(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // change to true if using HTTPS
                .path("/")
                .maxAge(0) // 1 day
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}
