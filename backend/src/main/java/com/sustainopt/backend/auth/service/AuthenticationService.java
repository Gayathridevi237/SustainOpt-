package com.sustainopt.backend.auth.service;

import com.sustainopt.backend.auth.dto.LoginRequest;
import com.sustainopt.backend.auth.dto.LoginResponse;
import com.sustainopt.backend.auth.dto.RegistrationRequest;
import com.sustainopt.backend.auth.dto.RegistrationResponse;
import com.sustainopt.backend.auth.entity.Role;
import com.sustainopt.backend.auth.entity.RoleType;
import com.sustainopt.backend.auth.entity.User;
import com.sustainopt.backend.auth.jwt.JwtService;
import com.sustainopt.backend.auth.repository.RoleRepository;
import com.sustainopt.backend.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationService(UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager,
                                 JwtService jwtService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ===========================
    // Register
    // ===========================
    public RegistrationResponse register(RegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        RoleType roleType = RoleType.ANALYST;
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            try {
                RoleType requestedRole = RoleType.valueOf(request.getRole().toUpperCase());
                if (requestedRole == RoleType.ADMIN || requestedRole == RoleType.MANAGER) {
                    throw new RuntimeException("Registration with privileged roles is not allowed.");
                }
                roleType = requestedRole;
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role selected.");
            }
        }

        Role role = roleRepository.findByRoleName(roleType)
                .orElseThrow(() ->
                        new RuntimeException("Role not found."));

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setOrganizationName(request.getOrganizationName());
        user.setDepartment(request.getDepartment());
        user.setRole(role);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return new RegistrationResponse(
                savedUser.getId(),
                savedUser.getFirstName() + " " + savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole().getRoleName().name(),
                "User registered successfully."
        );
    }

    // ===========================
    // Login
    // ===========================
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password.")
                );

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getRole().getRoleName().name()
        );
    }
}