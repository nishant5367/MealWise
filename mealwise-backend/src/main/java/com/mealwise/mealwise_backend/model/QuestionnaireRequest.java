package com.mealwise.mealwise_backend.model;

import java.util.Map;

public class QuestionnaireRequest {

    private String username;
    private Map<String, Object> responses;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Map<String, Object> getResponses() {
        return responses;
    }

    public void setResponses(Map<String, Object> responses) {
        this.responses = responses;
    }
}
