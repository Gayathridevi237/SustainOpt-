package com.sustainopt.backend.decision.graph;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActionInteractionGraph {

    public List<ActionInteraction> buildGraph(List<String> recommendations) {

        List<ActionInteraction> interactions = new ArrayList<>();

        for (String source : recommendations) {

            for (String target : recommendations) {

                if (source.equals(target)) {
                    continue;
                }

                // Renewable ↔ Carbon
                if (source.toLowerCase().contains("renewable")
                        && target.toLowerCase().contains("carbon")) {

                    interactions.add(
                            new ActionInteraction(
                                    source,
                                    target,
                                    "COMPLEMENTS",
                                    8.0
                            )
                    );
                }

                // Electricity ↔ Renewable
                if (source.toLowerCase().contains("electricity")
                        && target.toLowerCase().contains("renewable")) {

                    interactions.add(
                            new ActionInteraction(
                                    source,
                                    target,
                                    "COMPLEMENTS",
                                    7.0
                            )
                    );
                }

                // Transport ↔ Carbon
                if (source.toLowerCase().contains("transport")
                        && target.toLowerCase().contains("carbon")) {

                    interactions.add(
                            new ActionInteraction(
                                    source,
                                    target,
                                    "COMPLEMENTS",
                                    6.0
                            )
                    );
                }

                // Waste ↔ Water
                if (source.toLowerCase().contains("waste")
                        && target.toLowerCase().contains("water")) {

                    interactions.add(
                            new ActionInteraction(
                                    source,
                                    target,
                                    "RELATED",
                                    4.0
                            )
                    );
                }
            }
        }

        return interactions;
    }
}