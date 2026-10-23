package com.sustainopt.backend.decision.algorithm;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AMSDOAScoreCalculatorTest {

    private AMSDOAScoreCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new AMSDOAScoreCalculator();

        ReflectionTestUtils.setField(calculator, "utilityWeight", 0.60);
        ReflectionTestUtils.setField(calculator, "contextWeight", 0.25);
        ReflectionTestUtils.setField(calculator, "interactionWeight", 0.10);
        ReflectionTestUtils.setField(calculator, "feedbackWeight", 0.05);
    }

    @Test
    void returnsZeroWhenAllInputsAreZero() {
        assertEquals(0.0,
                calculator.calculatePriorityScore(0, 0, 0, 0));
    }

    @Test
    void clipsNegativeWeightedTotalToZero() {
        assertEquals(0.0,
                calculator.calculatePriorityScore(-100, -100, -100, -100));
    }

    @Test
    void clipsMaximumInputsToOneHundred() {
        assertEquals(100.0,
                calculator.calculatePriorityScore(100, 100, 100, 100));
    }

    @Test
    void calculatesWeightedScoreCorrectly() {
        assertEquals(71.0,
                calculator.calculatePriorityScore(80, 60, 70, 20));
    }

    @Test
    void supportsNegativeFeedbackAdjustment() {
        assertEquals(67.5,
                calculator.calculatePriorityScore(80, 60, 70, -50));
    }
}
