# CodeShala: B2B & Institutional Feature Plan

## 1. Overview

This document outlines the plan for developing features tailored for B2B clients, such as schools, coding bootcamps, and other educational institutions. These features are designed to empower instructors and administrators, providing them with the tools to effectively teach, monitor, and manage their students' learning journey on the CodeShala platform.

The B2B offering will be a premium, subscription-based service, separate from the freemium model for individual learners.

---

## 2. Teacher Dashboard

The Teacher Dashboard is the central hub for instructors to manage their students and classes.

### Key Features:

*   **Secure Authentication:**
    *   Separate login portal for instructors.
    *   Role-based access control (e.g., Teacher, Admin).

*   **Student & Class Management:**
    *   **Add/Remove Students:** Manually add individual students or perform bulk uploads via a CSV file (containing fields like `name`, `email`).
    *   **Create Classes/Cohorts:** Group students into classes to easily manage and track them collectively.
    *   **View Student Roster:** See a list of all students, their assigned class, and their overall progress at a glance.

*   **Progress Tracking & Analytics:**
    *   **Class-level View:** A dashboard showing the aggregate progress of a class, highlighting the average number of levels completed and identifying common sticking points (levels where many students are failing).
    *   **Individual Student View:** Drill down into a specific student's profile to see:
        *   Which levels they have completed.
        *   The number of attempts per level.
        *   **The final, submitted code for each successfully completed level.** This is crucial for identifying students who are struggling with specific concepts or are finding non-optimal solutions.

### Proposed Tech Stack:

*   **Backend:** Node.js with Express.js for a robust API.
*   **Database:** PostgreSQL or MongoDB to store user data, progress, and class information.
*   **Frontend:** A modern JavaScript framework like React or Vue.js to build a dynamic and responsive dashboard interface.

---

## 3. Custom Level Creator

This feature provides instructors with the creative freedom to build their own puzzles, tailored to their specific curriculum or to challenge advanced students.

### Key Features:

*   **Visual Grid Editor:**
    *   An intuitive, web-based graphical interface.
    *   Drag-and-drop functionality to place elements (Walls, Guru's Start, Goal) onto a grid.
    *   Ability to resize the grid.

*   **Level Configuration:**
    *   **Instructions:** A text editor to write the level name, goal, and instructions for the student.
    *   **API Control:** The ability to enable or disable specific `guru` API functions for a level. For example, a teacher could create a puzzle that must be solved without using `guru.turnLeft()`.
    *   **Starter Code:** Define the initial code that appears in the student's editor for that level.

*   **Level Management & Assignment:**
    *   Save custom levels to a personal library.
    *   Assign a custom level to an entire class or specific students.
    *   Student progress on custom levels will be tracked in the Teacher Dashboard.

---

## 4. Bulk Licensing & Administration

This system is the backbone of the B2B model, allowing for the sale and management of licenses to institutions.

### Key Features:

*   **License Key System:**
    *   An internal admin tool to generate unique license keys.
    *   Keys will have associated metadata:
        *   Name of the institution.
        *   Number of student "seats".
        *   Expiration date.
        *   Chapters unlocked (e.g., access to all premium content).

*   **Institutional Admin Portal:**
    *   A simple portal for the client (e.g., a school's IT admin) to redeem their license key.
    *   Once redeemed, the admin can manage their allotted seats, for example, by creating the primary teacher accounts.

*   **Payment Gateway Integration:**
    *   The system for purchasing licenses will be integrated with a secure payment provider. For the target Indian market, providers like **Razorpay** or **PayU** should be prioritized, alongside international options like **Stripe**.
    *   Automated license key delivery upon successful payment.
