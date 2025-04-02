package com.mealwise.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

import java.util.*;

public class GetMealLogsHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
            .region(Region.AP_SOUTH_1) // ✅ Replace with your DynamoDB region
            .build();
    private final String TABLE_NAME = "MealLogs"; // ✅ Your actual table name

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Get path parameter: username
            Map<String, String> pathParams = (Map<String, String>) input.get("pathParameters");
            String username = pathParams.get("username");

            Map<String, AttributeValue> expressionValues = new HashMap<>();
            expressionValues.put(":u", AttributeValue.builder().s(username).build());

            QueryRequest queryRequest = QueryRequest.builder()
                    .tableName(TABLE_NAME)
                    .keyConditionExpression("username = :u")
                    .expressionAttributeValues(expressionValues)
                    .scanIndexForward(false) // latest first
                    .build();

            QueryResponse result = dynamoDbClient.query(queryRequest);

            List<Map<String, Object>> meals = new ArrayList<>();
            result.items().forEach(item -> {
                Map<String, Object> meal = new HashMap<>();
                item.forEach((k, v) -> meal.put(k, v.s() != null ? v.s() : v.n()));
                meals.add(meal);
            });

            ObjectMapper objectMapper = new ObjectMapper();
            String body = objectMapper.writeValueAsString(Collections.singletonMap("meals", meals));

            response.put("statusCode", 200);
            response.put("body", body);
            response.put("headers", Map.of("Content-Type", "application/json"));

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("statusCode", 500);
            response.put("body", "Error fetching meal logs: " + e.getMessage());
            return response;
        }
    }
}
