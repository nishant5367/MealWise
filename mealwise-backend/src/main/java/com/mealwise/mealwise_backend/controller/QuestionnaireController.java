package com.mealwise.mealwise_backend.controller;

import com.mealwise.mealwise_backend.model.QuestionnaireRequest;
import com.mealwise.mealwise_backend.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://main.d2dyro99idehki.amplifyapp.com"
})
@RestController
@RequestMapping("/api/questionnaire")
public class QuestionnaireController {

    @Autowired
    private QuestionnaireService questionnaireService;

    @GetMapping("/test")
    public String test() {
        return " Backend running and CORS enabled!";
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<Boolean> hasSubmitted(@PathVariable String username) {
        boolean exists = questionnaireService.hasSubmitted(username);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitQuestionnaire(@RequestBody QuestionnaireRequest request) {
        try {
            String username = request.getUsername();
    
            // ✅ Check if already submitted
            if (questionnaireService.hasSubmitted(username)) {
                System.out.println("⚠️ User already submitted questionnaire: " + username);
                return ResponseEntity.status(409).body("You have already submitted the questionnaire.");
            }
    
            Map<String, Object> responses = request.getResponses();
    
            questionnaireService.saveResponse(username, responses);
    
            return ResponseEntity.ok("Questionnaire saved successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to save questionnaire.");
        }
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<?> getQuestionnaireByUsername(@PathVariable String username) {
        Map<String, Object> response = questionnaireService.getByUsername(username);
        if (response == null) {
            return ResponseEntity.status(404).body("No data found for user: " + username);
        }
        return ResponseEntity.ok(Map.of("responses", response));
    }
    
    
}
