package com.mealwise.mealwise_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class QuestionnaireService {

    private final DynamoDbClient dynamoDbClient;

    @Autowired
    public QuestionnaireService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }
    public boolean hasSubmitted(String username) {
        try {
            Map<String, AttributeValue> key = new HashMap<>();
            key.put("Username", AttributeValue.builder().s(username).build());
    
            GetItemRequest request = GetItemRequest.builder()
                .tableName("QuestionnaireResponse")
                .key(key)
                .build();
        
            GetItemResponse response = dynamoDbClient.getItem(request);
            boolean found = response.hasItem();  // ✅ returns true if record exists
            System.out.println("✅ Found in DB? " + found);
            return found;

    
        } catch (Exception e) {
            e.printStackTrace();  //  will show the actual cause in console
            return false;         // fallback behavior
        }
    }
    


    public void saveResponse(String username, Map<String, Object> responses) {
        try {
            Map<String, AttributeValue> item = new HashMap<>();

            // Required fields
            item.put("Username", AttributeValue.builder().s(username).build());
            item.put("Timestamp", AttributeValue.builder().s(Instant.now().toString()).build());

            // Dynamic response fields
            for (Map.Entry<String, Object> entry : responses.entrySet()) {
                Object value = entry.getValue();

                // Convert List to string if checkbox answer
                if (value instanceof Iterable) {
                    String joined = String.join(", ", (Iterable<String>) value);
                    item.put(entry.getKey(), AttributeValue.builder().s(joined).build());
                } else {
                    item.put(entry.getKey(), AttributeValue.builder().s(String.valueOf(value)).build());
                }
            }

            PutItemRequest request = PutItemRequest.builder()
                    .tableName("QuestionnaireResponse")
                    .item(item)
                    .build();

            dynamoDbClient.putItem(request);
        } catch (Exception e) {
            System.err.println(" Failed to save response: " + e.getMessage());
            throw new RuntimeException("Error saving questionnaire response to DynamoDB");
        }
    }
}
