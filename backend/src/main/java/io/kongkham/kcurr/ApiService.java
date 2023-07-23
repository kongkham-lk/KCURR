package io.kongkham.kcurr;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface ApiService {
    default Mono<String> handleApiError(Throwable ex, Mono<String> fallback) {
        // Handle the error from the API (optional)
        System.out.println("API Error: " + ex.getMessage());

        // Return the fallback Mono
        return fallback;
    }
}
