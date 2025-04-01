package com.mealwise.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class FetchUserData implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> event, Context context) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🔥 RAW EVENT: " + event);

            // Get the raw JSON string from the "body" key
            String bodyJson = (String) event.get("body");

            // Convert the string body into a map
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> bodyMap = mapper.readValue(bodyJson, Map.class);

            // Extract user_id
            String userId = (String) bodyMap.get("user_id");

            response.put("status", "success");
            response.put("message", "Received user ID: " + userId);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Exception: " + e.getMessage());
        }

        return response;
    }
}
