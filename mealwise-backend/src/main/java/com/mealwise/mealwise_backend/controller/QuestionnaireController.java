package com.mealwise.mealwise_backend.controller;

import com.mealwise.mealwise_backend.model.QuestionnaireRequest;
import com.mealwise.mealwise_backend.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/questionnaire")
// Allows frontend to access this endpoint
public class QuestionnaireController {
    @GetMapping("/test")
    public String test() {
        return " Backend running and CORS enabled!";
    }
    @GetMapping("/status/{username}")
    public ResponseEntity<Boolean> hasSubmitted(@PathVariable String username) {
        boolean exists = questionnaireService.hasSubmitted(username);
        return ResponseEntity.ok(exists);  // returns true if already submitted
    }

    @Autowired
    private QuestionnaireService questionnaireService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitQuestionnaire(@RequestBody QuestionnaireRequest request) {
        try {
            String username = request.getUsername();
            Map<String, Object> responses = request.getResponses();

            questionnaireService.saveResponse(username, responses);

            return ResponseEntity.ok("Questionnaire saved successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to save questionnaire.");
        }
    }
}
