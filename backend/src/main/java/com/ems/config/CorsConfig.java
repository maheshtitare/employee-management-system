package com.ems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/**") // ✅ ALL endpoints
                        .allowedOrigins(
                                "http://localhost:3000",  // local testing
                                "https://employee-management-system-wy15.vercel.app", // ✅ PRODUCTION FRONTEND
                         "https://employee-management-system-wy15.vercel.app" // NEW
                              )
                        .allowedMethods("*") // allow all methods
                        .allowedHeaders("*") // allow all headers
                        .allowCredentials(true);
            }
        };
    }
}