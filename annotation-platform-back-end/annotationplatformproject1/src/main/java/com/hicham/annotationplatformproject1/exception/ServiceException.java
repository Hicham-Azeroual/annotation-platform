package com.hicham.annotationplatformproject1.exception;

// Custom exception class for consistent error handling across services
public class ServiceException extends RuntimeException {
    // Constructor with message
    public ServiceException(String message) {
        super(message);
    }

    // Constructor with message and cause
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}