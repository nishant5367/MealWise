package com.mealwise.mealwise_backend.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // Allow frontend access
public class MealRecommendationController {
// String flaskUrl = "http://127.0.0.1:5000/recommend";
    @PostMapping("/recommend")
    public ResponseEntity<?> getMealRecommendation(@RequestBody Map<String, Object> userInput) {
        RestTemplate restTemplate = new RestTemplate();
        String flaskUrl = "https://3.109.200.236/recommend";
    
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
    
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userInput, headers);
    
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
    e.printStackTrace();  // Backend log

    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("error", "Meal recommendation failed.");
    errorResponse.put("details", e.getMessage());

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                         .body(errorResponse);
}
    }
    
}

