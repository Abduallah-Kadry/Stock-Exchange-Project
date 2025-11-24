package com.example.stockexchange.service.authenticationservice;

import com.example.stockexchange.request.AuthenticationRequest;
import com.example.stockexchange.request.RegisterRequest;
import com.example.stockexchange.response.AuthenticationResponse;

public interface AuthenticationService {

    void register(RegisterRequest input) throws Exception;

    AuthenticationResponse login(AuthenticationRequest request);
}
