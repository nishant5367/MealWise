package com.mealwise.mealwise_backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // Allow frontend access
public class MealRecommendationController {

    @PostMapping("/recommend")
    public ResponseEntity<?> getMealRecommendation(@RequestBody Map<String, Object> userInput) {
        RestTemplate restTemplate = new RestTemplate();
       // String flaskUrl = "http://127.0.0.1:5000/recommend";  // Flask URL
       String flaskUrl = "https://3.109.200.236/recommend";


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userInput, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}

