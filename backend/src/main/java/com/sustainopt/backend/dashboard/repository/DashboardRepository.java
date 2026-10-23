package com.sustainopt.backend.dashboard.repository;

import com.sustainopt.backend.metrics.entity.SustainabilityMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DashboardRepository
        extends JpaRepository<SustainabilityMetric, Long> {

    @Query("""
            SELECT COUNT(m)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Long getTotalMetrics(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(SUM(m.electricityKwh),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getTotalElectricity(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(SUM(m.waterLiters),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getTotalWater(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(SUM(m.wasteKg),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getTotalWaste(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(SUM(m.carbonEmission),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getTotalCarbon(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(AVG(m.renewableEnergyPercent),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getAverageRenewableEnergy(
            @Param("organizationName") String organizationName
    );

    @Query("""
            SELECT COALESCE(AVG(m.transportEmission),0)
            FROM SustainabilityMetric m
            WHERE m.organizationName = :organizationName
            """)
    Double getAverageTransportEmission(
            @Param("organizationName") String organizationName
    );

    List<SustainabilityMetric>
    findByOrganizationNameOrderByCreatedAtDesc(
            String organizationName
    );
}