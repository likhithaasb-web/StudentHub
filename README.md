# StudentHub — All-in-One Student Productivity Website

**StudentHub** is a modern, responsive, high-performance web application designed to solve real-world productivity challenges faced by college students. It centralizes assignment deadlines, exam preparation countdowns, weekly class timetables, lecture notes, attendance requirements, and daily focus study sessions into a unified dashboard.

Built with **React**, **Vite**, **React Router v6**, **Lucide Icons**, **Recharts**, and an offline-first **localStorage** architecture.

---

## 🌟 Key Features

### 1. Authentication & Onboarding (Login & Signup)
- **High-Converting Split-Screen Interface**: Custom designed following modern SaaS standards with Dark Blue (`#274245`) and Yellow Sapling (`#DFD6AE`).
- **Interactive Mini Dashboard Showcase**: Displays live preview components on the left (mini sidebar, 4 stat cards, 7-day study bars, donut chart, schedule, and deadlines).
- **Comprehensive Authentication Form**:
  - Email and password validation with show/hide password toggle.
  - "Remember me" persistence checkbox.
  - "Forgot password?" prompt.
  - Primary "Sign In ->" action in Yellow Sapling.
  - Google Sign-In with official multi-color brand logo.
  - **Instant 1-Click Demo Login** for quick reviewer evaluation.
  - Switchable mode: Seamless toggle between **Sign In** and **Create Account**.

### 2. Dashboard Overview
- **Dynamic Greeting & Time Banner**: Personalized greetings (*"Good morning / afternoon / evening"*) with live calendar date and student profile greeting.
- **Real-Time Key Metrics**:
  - Pending assignments count
  - Completed tasks count & completion rate percentage
  - Upcoming exams count
  - Overall college attendance percentage with safe/shortage indicator
- **Interactive Visual Analytics (Recharts)**:
  - **Weekly Study Hours Chart**: Bar chart aggregating study minutes per day across the past 7 days.
  - **Task Completion Status**: Donut breakdown of tasks (Pending, In Progress, Completed).
- **Today's Class Schedule**: Shows today's classes sorted by time with ongoing/next indicator.
- **Upcoming Deadlines**: Next urgent assignments with dynamic countdowns (*"Today"*, *"Tomorrow"*, *"In 3 days"*, *"Overdue"*).
- **Recent Notes**: Quick access to pinned lecture notes and cheatsheets.
- **Quick Create Modal**: Universally accessible button to add tasks, notes, or exams from anywhere in the app.

### 2. Task & Assignment Manager
- Full CRUD operations (Create, Read, Update, Delete) with confirmation dialogs.
- Detailed task attributes: Title, Subject, Due Date, Priority (*Low, Medium, High*), Status (*Pending, In Progress, Completed*), and Descriptions.
- Real-time search across task titles and descriptions.
- Multi-dimensional filters: Filter by Subject, Priority, and Status.
- Sorting options: Sort by Due Date or Priority.
- Overdue task alerts and banner warnings.
- Celebratory empty state when 100% of tasks are completed.

### 3. Weekly Class Timetable
- Monday through Saturday weekly class grid.
- Highlighted column for the current day of the week.
- **Next Upcoming Class Banner**: Dynamically calculates and displays your immediate next lecture or lab with room numbers.
- Time conflict validation preventing overlapping classes on the same weekday.
- Dual view modes: Full Week Grid and Single Day View (optimized for mobile).
- Color-coded subject cards with classroom/hall indicators.

### 4. Exam Schedule & Planner
- Add, edit, and delete exams with subject name, exam date, start time, hall location, and syllabus notes.
- Dynamic countdown calculations: Calculates exact days remaining until each exam.
- Urgent visual highlighting for exams occurring within 3 days.
- Tabs for *Upcoming Exams*, *Completed Exams*, and *All Exams*.
- One-click completion toggles.

### 5. Notes Organizer
- Clean card-based layout with multi-line note preview.
- Important note pinning (pinned notes pinned to top with glow effects).
- Filter by academic subject.
- Full-text search across titles, contents, and tag chips.
- Add and manage comma-separated `#tags`.
- Confirmation modal before deleting any note.

### 6. Attendance Tracker & Calculator
- Add subjects with total classes held and classes attended.
- Real-time attendance percentage: `(Attended / Held) * 100`.
- Configurable attendance target (defaults to 75%).
- **Consecutive Attendance Forecaster**:
  $$\text{Smallest } x \ge 0 \text{ such that } \frac{\text{Attended} + x}{\text{Held} + x} \ge T$$
  Calculates exact consecutive classes required to recover from a shortage.
- **Safe Margin Forecaster**:
  $$\text{Max safe absences } m = \left\lfloor \frac{\text{Attended}}{T} - \text{Held} \right\rfloor$$
  Calculates how many classes you can safely miss while remaining above the target.
- Quick action buttons: **+ Attended** (+1 held, +1 attended) and **+ Missed** (+1 held, +0 attended).
- Transparent educational disclaimer distinguishing student estimates from official college registrar ERPs.

### 7. Study Planner & Focus Timer
- **Pomodoro Focus Timer**: Presets for 25m (Pomodoro), 45m (Deep Work), and 60m (Intensive) with Start, Pause, Resume, and Reset.
- **Verified Study Logging**: Only logs time when a session actually runs to completion or is recorded.
- Visual completion banner and web notification upon timer completion.
- Configurable Daily Study Goal (e.g. 120 mins) with progress bar and percent completion.
- Subject-by-subject study distribution breakdown.
- Session history with manual logging and deletion.

### 8. Global Search & Notifications Center
- **Global Search (`⌘K` / `Ctrl+K`)**: Modal search across all tasks, notes, exams, and classes with direct navigation links.
- **In-App Notification Center**: Dynamically detects overdue tasks, assignments due today/tomorrow, exams within 7 days, and low attendance subjects.
- Dismiss individual alerts or "Clear all" without spamming notifications on re-render.

### 9. Settings & Theme System
- Student display name and optional college name.
- Persistent Light/Dark theme toggle (defaulting to a sophisticated Dark Navy / Purple palette).
- Attendance target and study goal adjusters.
- **Load Realistic Demo Data**: 1-click restore of sample courses, assignments, exams, and notes.
- **Wipe All Data**: Permanent delete with double-confirmation dialog.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18 (Functional components & Hooks) |
| **Build Tool** | Vite 6 |
| **Language** | JavaScript (ESModules) |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Data Visualizations** | Recharts (ResponsiveContainer, BarChart, PieChart) |
| **Styling** | Vanilla CSS with custom properties & design tokens |
| **Storage** | Browser `localStorage` (Modular storage adapter) |

---

## 📁 Project Folder Structure

```
StudentHub/
├── index.html                   # HTML entry with Plus Jakarta Sans & JetBrains Mono fonts
├── vite.config.js               # Vite config with manual chunk optimization
├── package.json                 # Dependencies & scripts
├── public/
│   └── favicon.svg              # Brand vector favicon
└── src/
    ├── main.jsx                 # Application bootstrapping
    ├── App.jsx                  # Route definitions & AppProvider
    ├── context/
    │   └── AppContext.jsx       # Global state, localStorage syncing & notification engine
    ├── styles/
    │   ├── variables.css        # CSS variables for dark navy/purple & light theme
    │   └── global.css           # Global resets, typography, cards, badges, and layout
    ├── utils/
    │   ├── storage.js           # Type-safe localStorage manager
    │   ├── dateUtils.js         # Countdown calculations, formatting, day-of-week
    │   ├── attendanceUtils.js   # Mathematical formulas for attendance & shortages
    │   └── initialData.js       # Realistic initial student sample dataset
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx       # Responsive shell with sidebar offset and modals
    │   │   ├── Sidebar.jsx      # Desktop collapsible sidebar with badge counters
    │   │   ├── Navbar.jsx       # Top navigation, global search, notifications, theme
    │   │   └── MobileNav.jsx    # Touch-friendly bottom bar for mobile screens
    │   ├── common/
    │   │   ├── Modal.jsx        # Reusable modal with focus escape handling
    │   │   ├── ConfirmDialog.jsx# Delete confirmation modal
    │   │   ├── EmptyState.jsx   # Friendly empty state cards with quick action
    │   │   ├── GlobalSearchModal.jsx # Ctrl+K global search
    │   │   └── QuickActionModal.jsx  # Universal quick creation popup
    │   ├── dashboard/
    │   │   ├── StatCard.jsx     # Metric cards
    │   │   ├── WeeklyStudyChart.jsx  # Recharts 7-day study bar chart
    │   │   ├── TaskStatusChart.jsx   # Recharts task status donut chart
    │   │   ├── TodayScheduleCard.jsx # Today's classes
    │   │   ├── UpcomingDeadlinesCard.jsx # Upcoming assignments
    │   │   └── RecentNotesCard.jsx   # Pinned notes preview
    │   ├── tasks/
    │   │   ├── TaskFormModal.jsx
    │   │   └── TaskItem.jsx
    │   ├── timetable/
    │   │   └── ClassFormModal.jsx
    │   ├── exams/
    │   │   ├── ExamFormModal.jsx
    │   │   └── ExamCard.jsx
    │   ├── notes/
    │   │   ├── NoteEditorModal.jsx
    │   │   └── NoteCard.jsx
    │   ├── attendance/
    │   │   ├── AttendanceFormModal.jsx
    │   │   └── SubjectAttendanceCard.jsx
    │   └── study-planner/
    │       ├── FocusTimer.jsx
    │       └── StudySessionModal.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── Tasks.jsx
        ├── Timetable.jsx
        ├── Exams.jsx
        ├── Notes.jsx
        ├── Attendance.jsx
        ├── StudyPlanner.jsx
        └── Settings.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js version 18 or higher (Node 20+ recommended)
- npm or pnpm

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd c:\Users\saili\OneDrive\Desktop\StudentHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Production Build

To build the optimized static production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Verification & Edge Case Handling

1. **Attendance Calculation Boundaries**:
   - Handles `held = 0` and `attended = 0` without dividing by zero (`NaN%`).
   - Prevents entering `attended > held`.
   - Accurately computes consecutive classes required using ceiling math.
   - Detects when reaching 100% target is mathematically impossible after missed classes.
2. **Timetable Conflict Detection**:
   - Detects time overlaps on the same weekday when scheduling new classes (`startTime < existing.endTime && existing.startTime < endTime`).
3. **Empty States**:
   - Every single view (Dashboard, Tasks, Timetable, Exams, Notes, Attendance, Study Planner) provides helpful guidance and a prominent "Add" action when lists are empty.
4. **Theme Persistence**:
   - Selected theme (`dark` or `light`) is stored in `localStorage` and automatically restored on page reloads.
5. **Data Reset and Restoration**:
   - Users can restore rich sample data anytime via Settings or wipe all stored records cleanly.

---

## ⚠️ Current Scope & Limitations

- **Browser Storage**: Initial version utilizes `localStorage`. Data is local to the current browser profile and does not sync between different computers or browsers. The storage layer (`src/utils/storage.js`) is abstracted so that a backend such as Supabase or Firebase can be linked with minimal refactoring.
- **Audio Chime**: Audio alerts for the timer utilize the Web Audio API and standard HTML5 Notification API, which require the tab to be active or user permission granted.

---

## 🚢 Deployment Instructions

### 1. Push to GitHub

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: complete modern StudentHub productivity platform"
   ```

2. Create a new repository on GitHub (e.g. `StudentHub`).

3. Link the remote and push:
   ```bash
   git remote add origin https://github.com/<your-username>/StudentHub.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. **Via Vercel Web Dashboard**:
   - Log in to [vercel.com](https://vercel.com).
   - Click **"Add New Project"** and select **"Import Git Repository"**.
   - Select your `StudentHub` repository.
   - Vercel automatically detects **Vite**:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click **Deploy**.

2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
