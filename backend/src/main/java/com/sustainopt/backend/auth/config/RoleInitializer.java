package com.sustainopt.backend.auth.config;

import com.sustainopt.backend.auth.entity.Role;
import com.sustainopt.backend.auth.entity.RoleType;
import com.sustainopt.backend.auth.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        createRoleIfNotExists(RoleType.ADMIN, "System Administrator");
        createRoleIfNotExists(RoleType.MANAGER, "Sustainability Manager");
        createRoleIfNotExists(RoleType.ANALYST, "Sustainability Analyst");

    }

    private void createRoleIfNotExists(RoleType roleType, String description) {

        if (roleRepository.findByRoleName(roleType).isEmpty()) {

            Role role = new Role();
            role.setRoleName(roleType);
            role.setDescription(description);

            roleRepository.save(role);
        }
    }
}