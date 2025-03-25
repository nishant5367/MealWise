package com.mealwise.mealwise_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class})
public class MealwiseBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MealwiseBackendApplication.class, args);
    }
}
