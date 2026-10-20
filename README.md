# SustainOpt — Intelligent Corporate Sustainability Decision Support Platform

SustainOpt is an intelligent sustainability decision-support platform designed to help organizations evaluate sustainability performance, identify high-priority improvement opportunities, and generate explainable, data-driven recommendations.

The platform combines sustainability metrics, context-aware scoring, optimization logic, and feedback-based refinement to support informed corporate sustainability decisions.

## Key Features

- **Sustainability Metrics Management:** Track electricity, water, waste, carbon emissions, and renewable energy usage.
- **Sustainability Scoring:** Evaluate sustainability performance using a structured scoring framework.
- **Adaptive Decision Optimization:** Prioritize sustainability actions using the Adaptive Multi-Context Sustainability Decision Framework (AMSDF) and its optimization algorithm (AMSDOA).
- **Explainable Recommendations:** Generate prioritized recommendations based on sustainability indicators and contextual factors.
- **Feedback-Based Refinement:** Incorporate implementation feedback to refine future decision scores.
- **Analytics Dashboard:** Present sustainability performance and decision insights through a dashboard.
- **Secure Authentication:** Support authentication and role-based access control through Spring Security and JWT.
- **REST API Integration:** Connect the frontend and backend through REST APIs.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Java, Spring Boot, Spring Security |
| Database | MySQL |
| Authentication | JWT, BCrypt |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## Architecture

```text
┌────────────────────────────────────┐
│        React + TypeScript UI       │
│ Dashboard · Analytics · Metrics    │
└──────────────────┬─────────────────┘
                   │ REST APIs
┌──────────────────▼─────────────────┐
│          Spring Boot API           │
│ Authentication · Metrics           │
│ Scoring · Recommendations           │
│ Decision Optimization · Feedback    │
└──────────────────┬─────────────────┘
                   │
┌──────────────────▼─────────────────┐
│               MySQL                │
│ Users · Roles · Sustainability Data │
│ Recommendations · Feedback          │
└────────────────────────────────────┘
```

## Decision Framework

SustainOpt uses two core concepts:

- **AMSDF:** Adaptive Multi-Context Sustainability Decision Framework, which organizes sustainability indicators and contextual factors for decision support.
- **AMSDOA:** Adaptive Multi-Context Sustainability Decision Optimization Algorithm, which scores and prioritizes potential sustainability actions.

The framework considers sustainability utility, context, indicator interactions, and feedback to support recommendations. Final decisions depend on the implemented scoring rules and available input data.

## Project Structure

```text
SustainOpt/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   └── sustainopt-frontend/
│       ├── src/
│       ├── package.json
│       └── ...
├── README.md
└── .gitignore
```

Refer to the actual project directories for the complete implementation.

## Prerequisites

Install the following before running the application:

- Java 21 or a compatible version supported by the backend configuration
- Maven, or the included Maven Wrapper
- Node.js and npm
- MySQL Server 8.x
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Gayathridevi237/SustainOpt.git
cd SustainOpt
```

### 2. Configure the database

Create the database in MySQL:

```sql
CREATE DATABASE sustainopt_db;
```

Configure the database connection using environment variables. The exact variable names must match the backend configuration.

For example, in PowerShell:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/sustainopt_db"
$env:DB_USERNAME="your_mysql_username"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your_secure_random_secret"
```

Use a strong, randomly generated JWT secret that meets the application's signing-key requirements. Never commit real secrets to GitHub.

### 3. Run the backend

From the backend directory:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend uses the port configured in the Spring Boot application settings.

### 4. Run the frontend

Open another terminal:

```powershell
cd frontend/sustainopt-frontend
npm install
npm run dev
```

Open the local development URL printed by Vite in your terminal.

### 5. Build the frontend

```powershell
npm run build
```

Run backend tests from the backend directory:

```powershell
.\mvnw.cmd test
```

## Security

- Never commit database credentials, JWT signing keys, or API tokens.
- Use environment variables or an appropriate secrets manager for sensitive configuration.
- Keep `.env` files and local configuration secrets out of version control.
- Rotate any credentials that may have been exposed previously.
- Configure authentication and authorization appropriately before deploying to production.

## Current Scope and Limitations

SustainOpt is a software engineering and sustainability decision-support project. The quality of its recommendations depends on the input data, scoring rules, and implementation.

Before production deployment, validate the optimization methodology, add comprehensive automated tests, review authorization rules, and assess the reliability of generated recommendations.

## Future Enhancements

- Integration with real-time sustainability data sources.
- Advanced sustainability forecasting.
- Scenario analysis and comparison.
- More detailed explainability for recommendations.
- Expanded automated testing and continuous integration.
- Production deployment and monitoring.

## Author

**Gayathri Devi C**

Integrated M.Tech in Software Engineering  
Vellore Institute of Technology (VIT), Vellore

GitHub: [Gayathridevi237](https://github.com/Gayathridevi237)

---

*Developed as an intelligent decision-support platform for corporate sustainability analysis and optimization.*
