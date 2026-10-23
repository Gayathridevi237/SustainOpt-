SustainOpt System Architecture
Overview

SustainOpt is a three-tier web application with an AI Decision Engine.

+------------------------------------------------------+
|                 React Frontend (UI)                  |
|  Dashboard | Decisions | Reports | Analytics         |
+-------------------------↑----------------------------+
                          |
                     REST API (JSON)
                          |
+-------------------------↓----------------------------+
|              Spring Boot Backend                     |
| Authentication | Decision Engine | Reports | Admin   |
+-------------------------↑----------------------------+
                          |
                    JPA / Hibernate
                          |
+-------------------------↓----------------------------+
|                    MySQL Database                    |
| Users | Decisions | Criteria | Scores | Reports      |
+------------------------------------------------------+

              (Future AI Engine)

          Python Recommendation Service
Components
Frontend
React
Vite
Tailwind CSS
Axios
React Router
Backend
Java 21
Spring Boot
Spring Security
Spring Data JPA
Hibernate
JWT Authentication
Database
MySQL

Tables include:

Users
Roles
Decision Alternatives
Sustainability Criteria
Decision Scores
Reports
AI Layer

Future module:

Sustainability Score Calculator
Decision Recommendation Engine
Scenario Analysis
Deployment
Backend → Docker
Frontend → Vercel
Database → MySQL