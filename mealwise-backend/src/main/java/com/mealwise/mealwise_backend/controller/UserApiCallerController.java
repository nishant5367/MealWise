package com.mealwise.mealwise_backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserApiCallerController {

    @PostMapping("/get-user-data")
    public ResponseEntity<String> getUserData(@RequestBody Map<String, Object> body) {
        // Don't extract userId
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://fawf2idfwf.execute-api.eu-north-1.amazonaws.com/prod/FetchUserDataLambda";
    
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        return restTemplate.postForEntity(url, requestEntity, String.class);
    }
    @PostMapping("/fetch-meals")
    public ResponseEntity<String> fetchMeals(@RequestBody Map<String, Object> body) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        String apiUrl = "https://5vvo9pfwp3.execute-api.us-east-1.amazonaws.com/prod/GetUserMealsLambda";
        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

        return response;
    }

}