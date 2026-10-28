# 🚀 PlaceTrack — Placement Preparation Tracker

**Prepare smarter. Track your progress. Get placement-ready.**

PlaceTrack is a full-stack web application designed to help students organise and track their placement preparation in one place. It brings DSA practice, aptitude preparation, core computer science subjects, daily study planning, and learning resources together in a single platform.

The goal of PlaceTrack is to help students maintain consistency, monitor their progress, and identify areas that need more attention during placement preparation.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Application URLs](#-application-urls)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 📖 Overview

Preparing for placements involves managing multiple activities, including solving coding problems, practising aptitude questions, revising core subjects, and following a consistent study schedule.

PlaceTrack provides a centralised platform where students can organise these activities and monitor their preparation.

Instead of maintaining separate spreadsheets or notes, students can use PlaceTrack to record their progress, manage daily goals, and access useful learning resources.

---

## ✨ Features

### 📊 1. Placement Preparation Dashboard
- View an overview of placement preparation.
- Monitor progress across different preparation modules.
- Track completed activities and pending tasks.
- Access important preparation information from one place.

### 💻 2. DSA Progress Tracker
- Organise coding problems by topic.
- Track problem difficulty and completion status.
- Manage problems using statuses such as Pending, In Progress, Solved, and Revision Needed.
- Identify topics that require more practice.
- Monitor progress through problem-solving statistics.

### 🧠 3. Aptitude Preparation Tracker
- Organise aptitude practice by topic.
- Track questions attempted and correct answers.
- Calculate accuracy percentages.
- Monitor preparation across quantitative aptitude, logical reasoning, and verbal ability.

### 📚 4. Core Subjects Tracker
- Organise computer science subjects and their topics.
- Track completed and pending topics.
- Manage revision progress.
- Support preparation for technical placement interviews.

### 📅 5. Daily Study Planner
- Create and manage study tasks.
- Categorise tasks according to preparation areas.
- Set priorities and target dates.
- Mark tasks as completed.
- Monitor daily study progress.

### 🎯 6. Goals and Progress Tracking
- Create personal preparation goals.
- Track progress towards learning targets.
- Monitor completed activities.
- Encourage consistent study habits.

### 🔗 7. Learning Resources
- Access useful learning resources.
- Organise resources by category.
- Save resource titles, URLs, and descriptions.
- Keep important study materials accessible from one place.

### 🔐 8. User Authentication
- Register an account and log in.
- Authenticate users through the backend.
- Store application data in a MySQL database.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tool |
| Node.js | JavaScript runtime for the backend |
| Express.js | Backend API and server |
| MySQL | Relational database |
| JavaScript | Application logic |
| HTML5 | Web page structure |
| CSS3 | Styling and layout |
| Git and GitHub | Version control and collaboration |

---

## 📁 Project Structure

```text
PlaceTrack/
│
├── public/                 # Static assets
│
├── src/                    # Frontend source code
│   ├── pages/              # Application pages
│   ├── App.jsx             # Main React application
│   ├── api.js              # API communication
│   └── main.jsx             # Frontend entry point
│
├── server/                 # Backend application
│   ├── server.js            # Express server and API routes
│   ├── db.js                # MySQL database connection
│   ├── schema.sql           # Database schema
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Example environment configuration
│
├── index.html              # Frontend HTML entry point
├── package.json            # Frontend dependencies and scripts
├── vite.config.js          # Vite configuration
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

*The exact directory structure may vary slightly depending on the project version.*

---

## 🚀 Getting Started

Follow these instructions to run PlaceTrack locally.

### Prerequisites

Install the following software before proceeding:

- **Node.js and npm:** [Download Node.js](https://nodejs.org/)
- **MySQL Server:** [Download MySQL](https://dev.mysql.com/downloads/installer/)
- **Git:** [Download Git](https://git-scm.com/downloads)
- **Visual Studio Code:** [Download VS Code](https://code.visualstudio.com/) (recommended)

Make sure Node.js, npm, and MySQL are installed and working correctly.

Verify Node.js and npm:

```bash
node -v
npm -v
```

### 1. Clone the Repository

Replace `<your-username>` with your GitHub username.

```bash
git clone https://github.com/<your-username>/PlaceTrack.git
```

Navigate into the project directory:

```bash
cd PlaceTrack
```

Alternatively, download the repository as a ZIP file and extract it.

### 2. Install Frontend Dependencies

From the project root directory, run:

```bash
npm install
```

### 3. Install Backend Dependencies

Navigate to the server directory:

```bash
cd server
npm install
```

---

## ⚙️ Environment Configuration

The backend requires environment variables to connect to MySQL and configure authentication.

Inside the `server` directory, create a `.env` file by copying the example file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Open `server/.env` and configure the values according to your local environment.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=placetrack
JWT_SECRET=replace_with_a_long_random_secret
```

Replace the example password and secret with your own values.

**Security note:** Never commit your `.env` file or expose database credentials, authentication secrets, or other sensitive configuration in a public repository.

---

## 🗄️ Database Setup

PlaceTrack uses MySQL to store application data.

### 1. Start MySQL

Ensure your MySQL server is running.

### 2. Create the Database

If the application does not create the database automatically, open MySQL Workbench or the MySQL command-line client and execute:

```sql
CREATE DATABASE placetrack;
```

### 3. Initialise the Tables

The backend is designed to initialise the required tables when it starts.

If your version requires manual schema initialisation, use the provided `server/schema.sql` file to create the necessary tables.

Ensure the MySQL account configured in `.env` has the necessary permissions.

---

## ▶️ Running the Application

The frontend and backend must run simultaneously during local development.

### Terminal 1: Start the Backend

Open a terminal and navigate to the server directory:

```bash
cd server
npm start
```

The backend should start on:

```text
http://localhost:5000
```

Keep this terminal running.

### Terminal 2: Start the Frontend

Open a second terminal in the project root directory:

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser to use PlaceTrack.

> If the default port is already occupied, stop the conflicting process or configure an available port. Ensure the frontend API proxy matches the backend port.

---

## 🌐 Application URLs

| Component | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

These addresses are for local development. They do not make the application publicly accessible over the internet.

---

## 🔮 Future Improvements

Potential enhancements for future versions include:

- **Enhanced Analytics:** More detailed progress charts and weekly reports.
- **Revision Reminders:** Reminders for DSA problems that need revision.
- **Placement Readiness Score:** A summary of progress across preparation modules.
- **Study Streaks:** Track consecutive days of study activity.
- **Improved Resource Management:** Better organisation and filtering of learning materials.
- **