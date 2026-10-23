import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Organization from "./pages/Organization";
import Metrics from "./pages/Metrics";
import SustainabilityHealth from "./pages/SustainabilityHealth";
import Decision from "./pages/Decision";
import DigitalTwin from "./pages/DigitalTwin";
import ScenarioSimulation from "./pages/ScenarioSimulation";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import AlgorithmIntelligence from "./pages/AlgorithmIntelligence";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
                    Public Routes
            ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
              Protected Application
            ========================= */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/organization"
            element={<Organization />}
          />

          <Route
            path="/metrics"
            element={<Metrics />}
          />

          <Route
            path="/sustainability-health"
            element={<SustainabilityHealth />}
          />

          <Route
            path="/decision/:metricId"
            element={<Decision />}
          />

          <Route
            path="/algorithm-intelligence"
            element={<AlgorithmIntelligence />}
          />

          <Route
            path="/digital-twin"
            element={<DigitalTwin />}
          />

          <Route
            path="/scenario-simulation"
            element={<ScenarioSimulation />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;