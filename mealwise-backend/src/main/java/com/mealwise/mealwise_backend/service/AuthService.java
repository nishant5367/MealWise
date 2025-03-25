package com.mealwise.mealwise_backend.service;

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private CognitoIdentityProviderClient cognitoClient;

    public String login(String username, String password) {
        try {
            AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                    .userPoolId("eu-north-1_VTMvq2d98")
                    .clientId("5f6arupjha98bjqtp2mci0r4k4")
                    .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                    .authParameters(Map.of("USERNAME", username, "PASSWORD", password))
                    .build();
    
            AdminInitiateAuthResponse authResponse = cognitoClient.adminInitiateAuth(authRequest);
    
            return authResponse.authenticationResult().idToken();
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Invalid credentials or configuration issue");
        }
    }
    
}

