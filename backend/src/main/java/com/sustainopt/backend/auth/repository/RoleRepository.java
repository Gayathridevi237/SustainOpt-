package com.sustainopt.backend.auth.repository;

import com.sustainopt.backend.auth.entity.Role;
import com.sustainopt.backend.auth.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleName(RoleType roleName);

}