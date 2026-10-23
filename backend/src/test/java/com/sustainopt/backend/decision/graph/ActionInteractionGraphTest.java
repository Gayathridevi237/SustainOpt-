package com.sustainopt.backend.decision.graph;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTimeoutPreemptively;

class ActionInteractionGraphTest {

    private ActionInteractionGraph graph;

    @BeforeEach
    void setUp() {
        graph = new ActionInteractionGraph();
    }

    @Test
    void returnsEmptyListWhenRecommendationsAreEmpty() {
        assertEquals(0, graph.buildGraph(List.of()).size());
    }

    @Test
    void detectsRenewableAndCarbonComplementaryRelationship() {
        List<ActionInteraction> result = graph.buildGraph(List.of(
                "Renewable energy adoption", "Carbon emission reduction"));

        assertEquals(1, result.size());
        assertEquals("COMPLEMENTS", result.get(0).getRelationshipType());
        assertEquals(8.0, result.get(0).getInteractionScore());
    }

    @Test
    void detectsElectricityAndRenewableRelationship() {
        List<ActionInteraction> result = graph.buildGraph(List.of(
                "Electricity reduction", "Renewable energy adoption"));

        assertEquals(1, result.size());
        assertEquals("COMPLEMENTS", result.get(0).getRelationshipType());
        assertEquals(7.0, result.get(0).getInteractionScore());
    }

    @Test
    void detectsTransportAndCarbonRelationship() {
        List<ActionInteraction> result = graph.buildGraph(List.of(
                "Transport emission reduction", "Carbon emission reduction"));

        assertEquals(1, result.size());
        assertEquals("COMPLEMENTS", result.get(0).getRelationshipType());
        assertEquals(6.0, result.get(0).getInteractionScore());
    }

    @Test
    void detectsWasteAndWaterRelationship() {
        List<ActionInteraction> result = graph.buildGraph(List.of(
                "Waste recycling", "Water conservation"));

        assertEquals(1, result.size());
        assertEquals("RELATED", result.get(0).getRelationshipType());
        assertEquals(4.0, result.get(0).getInteractionScore());
    }

    @Test
    void doesNotCreateSelfInteractions() {
        assertEquals(0, graph.buildGraph(
                List.of("Renewable energy adoption")).size());
    }

    @Test
    void circularActionRelationshipsTerminate() {
        List<String> recommendations = List.of(
                "Renewable energy adoption",
                "Carbon emission reduction",
                "Electricity reduction",
                "Transport emission reduction",
                "Waste recycling",
                "Water conservation");

        List<ActionInteraction> result = assertTimeoutPreemptively(
                Duration.ofSeconds(2),
                () -> graph.buildGraph(recommendations));

        assertFalse(result.isEmpty());
        assertEquals(4, result.size());
    }

    @Test
    void matchingIsCaseInsensitive() {
        List<ActionInteraction> result = graph.buildGraph(List.of(
                "RENEWABLE energy adoption", "carbon emission reduction"));

        assertEquals(1, result.size());
        assertEquals(8.0, result.get(0).getInteractionScore());
    }
}
