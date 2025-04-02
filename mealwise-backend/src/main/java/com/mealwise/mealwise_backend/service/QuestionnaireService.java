package com.mealwise.mealwise_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionnaireService {

    private final DynamoDbClient dynamoDbClient;

    @Autowired
    public QuestionnaireService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }
    public boolean hasSubmitted(String username) {
        Map<String, AttributeValue> expressionValues = new HashMap<>();
        expressionValues.put(":val", AttributeValue.builder().s(username).build());
    
        QueryRequest request = QueryRequest.builder()
            .tableName("QuestionnaireResponse")
            .indexName("Username-index") // Match your actual GSI name
            .keyConditionExpression("Username = :val")
            .expressionAttributeValues(expressionValues)
            .build();
    
        QueryResponse response = dynamoDbClient.query(request);
        return response.count() > 0;
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
    public Map<String, Object> getByUsername(String username) {
        try {
            Map<String, AttributeValue> expressionValues = new HashMap<>();
            expressionValues.put(":val", AttributeValue.builder().s(username).build());
    
            QueryRequest queryRequest = QueryRequest.builder()
                .tableName("QuestionnaireResponse")
                .indexName("Username-index") // ⚠️ Replace with your actual GSI name
                .keyConditionExpression("Username = :val")
                .expressionAttributeValues(expressionValues)
                .build();
    
            QueryResponse response = dynamoDbClient.query(queryRequest);
    
            if (response.count() == 0) {
                System.out.println("No data found for user: " + username);
                return null;
            }
    
            return response.items().get(0).entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> {
                    AttributeValue val = e.getValue();
                    if (val.s() != null) return val.s();
                    if (val.n() != null) return val.n();
                    if (val.bool() != null) return val.bool();
                    return val.toString();
                }));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch questionnaire by username.");
        }
    }
    
}
