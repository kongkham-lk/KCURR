package io.kongkham.kcurr;

public class APIRequestException extends RuntimeException {
    public APIRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
