# SustainOpt — Intelligent Corporate Sustainability Decision Support Platform

SustainOpt is an intelligent corporate sustainability decision-support platform designed to evaluate sustainability performance, identify improvement opportunities, and generate explainable, data-driven recommendations.

The platform combines sustainability metrics, context-aware scoring, adaptive decision optimization, and feedback-based refinement to support informed sustainability decisions.

## Key Features

- **Sustainability Metrics Management** — Track electricity, water, waste, carbon emissions, and renewable energy usage.
- **Sustainability Scoring** — Evaluate sustainability performance using a structured scoring framework.
- **Adaptive Decision Optimization** — Prioritize improvement actions using AMSDF and AMSDOA.
- **Explainable Recommendations** — Generate prioritized actions based on sustainability indicators and contextual factors.
- **Feedback-Based Refinement** — Incorporate implementation feedback into decision scoring.
- **Analytics Dashboard** — Visualize sustainability performance and decision insights.
- **Secure Authentication** — Implement authentication and role-based access control using Spring Security and JWT.
- **REST API Integration** — Connect the frontend and backend through REST APIs.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Java, Spring Boot, Spring Security |
| Database | MySQL |
| Authentication | JWT, BCrypt |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## Decision Framework

SustainOpt uses two core concepts:

- **AMSDF:** Adaptive Multi-Context Sustainability Decision Framework.
- **AMSDOA:** Adaptive Multi-Context Sustainability Decision Optimization Algorithm.

Together, they organize sustainability indicators, contextual factors, interactions, and feedback to support the prioritization of sustainability actions.

## Project Structure

```text
SustainOpt/
├── backend/                  # Spring Boot application
├── frontend/
│   └── sustainopt-frontend/  # React + TypeScript application
├── database/                 # Database-related resources
├── datasets/                 # Project datasets
├── diagrams/                 # Architecture and design diagrams
├── docs/                     # Project documentation
├── prompts/                  # Development prompts
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Java 21 or a compatible version
- Maven or the included Maven Wrapper
- Node.js and npm
- MySQL Server 8.x
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Gayathridevi237/SustainOpt-.git
cd SustainOpt-
```

### 2. Configure the database

Create the MySQL database:

```sql
CREATE DATABASE sustainopt_db;
```

Configure the database URL, username, password, and JWT signing secret using environment variables required by the backend.

Never commit real credentials or signing secrets to version control.

### 3. Run the backend

From the project root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 4. Run the frontend

Open a second terminal:

```powershell
cd frontend/sustainopt-frontend
npm install
npm run dev
```

Open the local development URL displayed by Vite.

## Security Notes

- Keep database passwords and JWT secrets outside source control.
- Use strong, randomly generated signing secrets.
- Review authorization rules before deployment.
- Rotate credentials if they have been exposed.

## Future Enhancements

- Integration with real-time sustainability data sources.
- Sustainability forecasting and scenario comparison.
- Expanded recommendation explainability.
- Automated testing and continuous integration.
- Production deployment and monitoring.

## Author

**Gayathri Devi C**  
Integrated M.Tech in Software Engineering  
Vellore Institute of Technology (VIT), Vellore

[GitHub Profile](https://github.com/Gayathridevi237)

---

*Project status: Under Development*
