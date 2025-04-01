package com.mealwise.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.regions.Region;

import java.util.*;

public class FetchUserMeals implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private final String TABLE_NAME = "MealWiseMeals";

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> event, Context context) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract body from HTTP API Gateway
            String bodyJson = (String) event.get("body");

            // Parse body JSON to Map
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> body = mapper.readValue(bodyJson, Map.class);
            String userId = body.get("user_id").toString();

            // Create DynamoDB client
            DynamoDbClient ddb = DynamoDbClient.builder()
                    .region(Region.of("eu-north-1"))  // Change if your region is different
                    .build();

            // Build query
            Map<String, AttributeValue> exprValues = new HashMap<>();
            exprValues.put(":uid", AttributeValue.builder().s(userId).build());

            QueryRequest queryRequest = QueryRequest.builder()
                    .tableName(TABLE_NAME)
                    .keyConditionExpression("UserID = :uid")
                    .expressionAttributeValues(exprValues)
                    .build();

            QueryResponse result = ddb.query(queryRequest);

            List<Map<String, String>> records = new ArrayList<>();
            for (Map<String, AttributeValue> item : result.items()) {
                Map<String, String> record = new HashMap<>();
                item.forEach((k, v) -> record.put(k, v.s()));
                records.add(record);
            }

            response.put("status", "success");
            response.put("data", records);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }
}
