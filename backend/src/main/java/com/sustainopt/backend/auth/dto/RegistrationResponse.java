package com.sustainopt.backend.auth.dto;

public class RegistrationResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private String message;

    public RegistrationResponse() {
    }

    public RegistrationResponse(Long userId, String fullName,
                                String email, String role,
                                String message) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}