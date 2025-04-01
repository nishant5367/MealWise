package com.mealwise.mealwise_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

@Configuration
public class DynamoDBConfig {

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of("ap-south-1")) // Change if needed
                .credentialsProvider(ProfileCredentialsProvider.create("default")) // uses credentials from ~/.aws/credentials
                .build();
    }
}
