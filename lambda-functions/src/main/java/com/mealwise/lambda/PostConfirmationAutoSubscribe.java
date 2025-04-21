package com.mealwise.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.SubscribeRequest;

import java.util.Map;

public class PostConfirmationAutoSubscribe implements RequestHandler<Map<String, Object>, Object> {

    private final SnsClient snsClient = SnsClient.create();
    private final String topicArn = "arn:aws:sns:ap-south-1:YOUR_ACCOUNT_ID:MealLoggedTopic"; // Replace with your actual ARN

    @Override
    public Object handleRequest(Map<String, Object> event, Context context) {
        try {
            System.out.println(" Raw Event: " + event);

            Map<String, Object> request = (Map<String, Object>) event.get("request");
            Map<String, String> userAttributes = (Map<String, String>) request.get("userAttributes");

            String email = userAttributes.get("email");

            if (email != null && !email.isEmpty()) {
                SubscribeRequest requestSub = SubscribeRequest.builder()
                        .topicArn(topicArn)
                        .protocol("email")
                        .endpoint(email)
                        .build();

                snsClient.subscribe(requestSub);

                System.out.println("Successfully subscribed " + email + " to SNS topic.");
            } else {
                System.out.println(" Email not found in user attributes.");
            }

        } catch (Exception e) {
            System.err.println(" Error during subscription: " + e.getMessage());
        }

        return event;
    }
}
