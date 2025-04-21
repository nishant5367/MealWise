// package com.mealwise.lambda;

// import com.amazonaws.services.lambda.runtime.Context;
// import com.amazonaws.services.lambda.runtime.RequestHandler;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
// import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
// import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
// import software.amazon.awssdk.regions.Region;


// import java.time.Instant;
// import java.util.HashMap;
// import java.util.Map;

// public class MealLogHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

//     private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
//         .region(Region.AP_SOUTH_1) // Replace with your actual DynamoDB region
//         .build();

//     private final String TABLE_NAME = "MealLogs";  // Your table name
//     private final ObjectMapper objectMapper = new ObjectMapper();

//     @Override
//     public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
//         Map<String, Object> response = new HashMap<>();
//         try {
//             // Parse JSON body string from API Gateway event
//             String rawBody = (String) input.get("body");
//             Map<String, Object> body = objectMapper.readValue(rawBody, Map.class);

//             // Extract and validate fields
//             String username = (String) body.get("username");
//             String food = (String) body.get("food");
//             Object caloriesRaw = body.get("calories");
//             String timestamp = (String) body.get("timestamp");

//             if (username == null || food == null || caloriesRaw == null) {
//                 response.put("statusCode", 400);
//                 response.put("body", "❌ Required fields missing: username, food, or calories.");
//                 return response;
//             }

//             String calories = String.valueOf(caloriesRaw);
//             if (timestamp == null || timestamp.isEmpty()) {
//                 timestamp = Instant.now().toString(); // fallback
//             }

//             // Build DynamoDB item
//             Map<String, AttributeValue> item = new HashMap<>();
//             item.put("username", AttributeValue.builder().s(username).build());
//             item.put("timestamp", AttributeValue.builder().s(timestamp).build());
//             item.put("food", AttributeValue.builder().s(food).build());
//             item.put("calories", AttributeValue.builder().s(calories).build());

//             // Save to DynamoDB
//             PutItemRequest request = PutItemRequest.builder()
//                     .tableName(TABLE_NAME)
//                     .item(item)
//                     .build();

//             dynamoDbClient.putItem(request);

//             // Success response
//             response.put("statusCode", 200);
//             response.put("body", "✅ Meal logged successfully for user: " + username);
//             return response;

//         } catch (Exception e) {
//             e.printStackTrace();
//             response.put("statusCode", 500);
//             response.put("body", "❌ Internal server error: " + e.getMessage());
//             return response;
//         }
//     }
// }
package com.mealwise.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class MealLogHandler implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private final DynamoDbClient dynamoDbClient = DynamoDbClient.builder()
            .region(Region.AP_SOUTH_1)
            .build();

    private final SnsClient snsClient = SnsClient.builder().region(Region.AP_SOUTH_1).build();

    private final String TABLE_NAME = "MealLogs";
    private final String TOPIC_ARN = "arn:aws:sns:ap-south-1:390844784590:meal-logging"; // Replace with real ARN

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {
        Map<String, Object> response = new HashMap<>();
        try {
            // ✅ Parse incoming request
            String rawBody = (String) input.get("body");
            Map<String, Object> body = objectMapper.readValue(rawBody, Map.class);

            String username = (String) body.get("username");
            String food = (String) body.get("food");
            Object caloriesRaw = body.get("calories");
            String timestamp = (String) body.get("timestamp");
            String meal = (String) body.getOrDefault("meal", "Meal");

            if (username == null || food == null || caloriesRaw == null) {
                response.put("statusCode", 400);
                response.put("body", " Required fields missing: username, food, or calories.");
                return response;
            }

            String calories = String.valueOf(caloriesRaw);
            if (timestamp == null || timestamp.isEmpty()) {
                timestamp = Instant.now().toString();
            }

            // ✅ Save to DynamoDB
            Map<String, AttributeValue> item = new HashMap<>();
            item.put("username", AttributeValue.builder().s(username).build());
            item.put("timestamp", AttributeValue.builder().s(timestamp).build());
            item.put("meal", AttributeValue.builder().s(meal).build());
            item.put("food", AttributeValue.builder().s(food).build());
            item.put("calories", AttributeValue.builder().s(calories).build());

            PutItemRequest request = PutItemRequest.builder()
                    .tableName(TABLE_NAME)
                    .item(item)
                    .build();

            dynamoDbClient.putItem(request);

            // ✅ Get email from Cognito (API Gateway Authorizer claims)
            Map<String, Object> requestContext = (Map<String, Object>) input.get("requestContext");
            Map<String, Object> authorizer = (Map<String, Object>) requestContext.get("authorizer");
            Map<String, Object> claims = (Map<String, Object>) authorizer.get("claims");

            String email = (String) claims.get("email");

            // ✅ Compose and send SNS email
            String message = " Hi " + username + ",\n\nYou logged " + meal + ": " + food + " (" + calories + " kcal) at " + timestamp;

            PublishRequest publishRequest = PublishRequest.builder()
                    .message(message)
                    .subject("Meal Logged in MealWise")
                    .topicArn(TOPIC_ARN)
                    .build();

            snsClient.publish(publishRequest);

            //  Return response
            response.put("statusCode", 200);
            response.put("body", " Meal logged and email notification sent to: " + email);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("statusCode", 500);
            response.put("body", " Error: " + e.getMessage());
            return response;
        }
    }
}
