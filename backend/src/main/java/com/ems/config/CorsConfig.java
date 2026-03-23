package com.ems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🔧 CORS Configuration
 *
 * CORS (Cross-Origin Resource Sharing) allows the React frontend (running on port 3000)
 * to make API calls to Spring Boot backend (running on port 8080).
 *
 * Without this, the browser will block API calls with a CORS error.
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                    .addMapping("/api/**")          // Allow all /api/* endpoints
                    .allowedOrigins("http://localhost:3000")  // React frontend URL
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
