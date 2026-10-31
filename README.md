# TaskMatrix

### Enterprise Agile Project Management Platform

TaskMatrix is a full-stack project management platform designed to help software development teams organize projects, manage tasks, track progress, and collaborate efficiently.

The platform provides a centralized workspace where team members can create projects, assign tasks, monitor deadlines, and visualize project progress through an interactive Kanban board.

The goal is to build a scalable, responsive, and user-friendly project management solution inspired by modern tools like Jira and Asana.

---

## 1. Project Information

* **Project Name:** TaskMatrix
* **Project Type:** Enterprise Project Management Platform
* **Designated Track:** Full Stack Development
* **Development Model:** Individual Contributor (IC)
* **Project Duration:** 5 Weeks
* **Status:** Planning and Architecture Phase

## 2. Problem Statement

Software development teams often struggle with scattered task information, unclear responsibilities, missed deadlines, and poor project visibility.

TaskMatrix aims to solve these problems by providing a centralized platform for project planning, task assignment, progress tracking, and team collaboration.

## 3. Project Objectives

* Simplify project and task management.
* Improve team collaboration and productivity.
* Provide real-time updates on task activities.
* Track project deadlines and priorities.
* Visualize project progress through Kanban boards.
* Provide role-based access to users.

## 4. Technology Stack

| Layer                   | Technology     |
| ----------------------- | -------------- |
| Frontend                | Next.js        |
| Programming Language    | JavaScript     |
| Styling                 | Tailwind CSS   |
| UI Components           | Shadcn UI      |
| State Management        | Redux Toolkit  |
| Backend                 | Node.js        |
| Backend Framework       | Express.js     |
| Database                | MongoDB Atlas  |
| ODM                     | Mongoose       |
| Authentication          | JWT and bcrypt |
| Real-Time Communication | Socket.IO      |
| Drag and Drop           | @dnd-kit       |
| API Testing             | Postman        |
| Version Control         | Git and GitHub |
| Frontend Deployment     | Vercel         |
| Backend Deployment      | Render         |

## 5. User Roles

### 5.1 Administrator

* Manage workspace members.
* Create and manage projects.
* Assign user roles.
* Monitor project activities.

### 5.2 Project Manager

* Create and manage projects.
* Assign tasks to team members.
* Set deadlines and priorities.
* Monitor project progress.

### 5.3 Team Member

* View assigned tasks.
* Update task status.
* Add comments to tasks.
* Track deadlines and activities.

## 6. Core Features and Priorities

### P0 – Essential Features

* User registration and login.
* JWT-based authentication.
* Role-Based Access Control (RBAC).
* Workspace creation and management.
* Project creation, editing, and deletion.
* Task creation, editing, and deletion.
* Task assignment to team members.
* Task priority management.
* Deadline management.

### P1 – Advanced Features

* Interactive drag-and-drop Kanban board.
* Real-time task status updates.
* Team member management.
* Project progress dashboard.
* Activity feed.
* Task search and filtering.
* Task comments.

### P2 – Enhancement Features

* Deadline notifications.
* Project analytics.
* Dark and light theme.
* Advanced productivity insights.

## 7. Functional Requirements

1. Users must be able to register and securely log in.
2. Administrators must be able to manage workspace members.
3. Project managers must be able to create and manage projects.
4. Authorized users must be able to create, update, and delete tasks.
5. Tasks must support assignment, priority, status, and deadlines.
6. Users must be able to move tasks between Kanban columns.
7. Task updates must be reflected in real time.
8. The system must maintain an activity history.

## 8. Non-Functional Requirements

* Responsive interface for desktop, tablet, and mobile.
* Secure authentication and authorization.
* Optimized API response time.
* Maintainable and modular architecture.
* Reliable database operations.
* Input validation and error handling.
* Scalable application structure.

## 9. Database Architecture

The application will use MongoDB with five primary collections.

| Collection   | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| Users        | Stores user profiles, credentials, and roles.                 |
| Workspaces   | Stores team workspace information.                            |
| Projects     | Stores project details and workspace references.              |
| Tasks        | Stores task descriptions, assignments, status, and deadlines. |
| ActivityLogs | Records important user and project activities.                |

Relationships will be maintained using MongoDB ObjectId references.

## 10. Application Modules

* Authentication Module
* User and Role Management Module
* Workspace Management Module
* Project Management Module
* Task Management Module
* Kanban Board Module
* Real-Time Communication Module
* Analytics and Reporting Module

## 11. UI/UX Design

The application will follow a modern SaaS dashboard design approach.

Planned core screens:

1. Authentication and Registration.
2. Main Project Dashboard.
3. Project Details and Kanban Board.

The interface will support responsive layouts for desktop, tablet, and mobile devices.

**Figma Design:** Coming Soon.

## 12. Development Roadmap

| Sprint    | Planned Deliverables                       |
| --------- | ------------------------------------------ |
| Sprint 13 | PRD, UI/UX Wireframes, System Architecture |
| Sprint 14 | MVP, Authentication, Dashboard             |
| Sprint 15 | Complete CRUD Operations and Kanban        |
| Sprint 16 | Real-Time Features and UX Enhancements     |
| Sprint 17 | Testing, CI/CD and Deployment              |

## 13. Project Repository

**GitHub:** https://github.com/KumkumPatel07/prodesk-capstone-TaskMatrix

## 14. Future Scope

* Email notifications.
* Advanced project analytics.
* File attachments.
* Third-party integrations.
* AI-assisted task recommendations.

---

**Project:** TaskMatrix
**Track:** Full Stack Development
**Phase:** Capstone Planning and Architecture


