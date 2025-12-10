# EduScrum-Awards
EduScrum Awards – A Gamified Platform for Evaluating Scrum - Based Projects -> Software Quality Project

Objective
Develop a full-stack web application (UI + API + back-end + database) that:
• Manages courses, teams, and Scrum-based projects;
• Tracks project progress and performance over time;
• Allows teachers to define and assign awards (manual or automatic);
• Calculates a global performance score per student;
• Provides dashboards and rankings to assist teachers in final evaluations.

Description
In active learning environments, the Scrum methodology is widely adopted to promote teamwork, self-organization, and iterative software delivery.
To support this approach in higher education, your task is to develop a web-based gamification platform that allows teachers and students to manage Scrum projects
across multiple courses, track team performance, and assign awards based on achievement criteria.
It serves as an evaluation and engagement tool where each student accumulates points throughout their degree based on their project performance and awards earned. 
In this context, the software quality project intends to create the UPT EduScrum Awards.

EduScrum Awards should:
• Contain a user-friendly interface for both teachers and students.
• A RESTful API for managing users, teams, projects, awards, and scores.
• Gamification module that awards points and badges.
• Apply software quality best practices, including:
• Modular and maintainable code structure;
• Version control (e.g., GitHub or GitLab);
• Unit, integration, and performance testing on your own system;
• Present results through dashboards and ranking visualizations.


## Testes e Cobertura

Foram implementados testes unitários com JUnit, incidindo na lógica de negócio
localizada no pacote `devapp.upt`.

A cobertura de testes foi analisada com o plugin JaCoCo, apresentando valores
elevados no domínio da aplicação (aproximadamente de 91% de instruções e 97% de ramos/branches).

Os relatórios HTML gerados pelo JaCoCo não se encontram incluídos no repositório,
por corresponderem a artefactos criados automaticamente durante o processo de
compilação.

Os endpoints da API (controllers e services) foram validados através de testes
de integração realizados com o Postman. A coleção Postman utilizada encontra-se
disponível na pasta `/backend/Project_Maven/postman`.
