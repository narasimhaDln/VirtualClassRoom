# React + Vite

Practical Images of Project:
Live Class ScreenShot:
![IMG_20250208_214523](https://github.com/user-attachments/assets/c4e31777-43f5-46bc-81c9-7940ef83e37f)
Login Page ScreenShot:
![IMG_20250208_214456](https://github.com/user-attachments/assets/96c0fc7d-43f7-4310-9a48-e9f692555e56)
Assignments Page ScreenShot:
![IMG_20250208_214509](https://github.com/user-attachments/assets/0655a178-8a11-4710-aa4b-00d07226e2a5)

Deployment URL:https://virtual-class-room-r3dw.vercel.app/

Git Hub URL:https://github.com/narasimhaDln/VirtualClassRoom/tree/main/vite-project

**\*Video\*\***
=> Brakeout Room Component:
1 .Room Management: Create and manage multiple virtual breakout rooms where participants can be divided into smaller groups for focused discussions or activities.

2 .Participant Controls: Allow hosts/teachers to manually assign or randomly distribute participants into different rooms, with the ability to move participants between rooms.

3. Timer & Notifications: Include a countdown timer for breakout sessions and broadcast notifications to all rooms, with automatic room closure when time expires.

4. Communication Tools: Provide basic communication features like chat, audio/video conferencing, and a shared whiteboard within each breakout room.

5. Host Oversight: Enable hosts to monitor all rooms, join any room at will, send announcements, and extend/end breakout sessions as needed.

=> VideoConference Component
Packages:

# Core Dependencies

npm install react react-dom

# UI Icons

npm install lucide-react

# Notifications

npm install react-hot-toast

# Media Handling

# (Built-in browser APIs are used, no additional packages needed)

# Optional Styling

npm install tailwindcss
npm install @tailwindcss/forms

# Optional - For Virtual Background

npm install @tensorflow/tfjs @tensorflow-models/body-pix

# Optional - For Better Media Handling

npm install mediasoup-client

# Optional - For Better State Management

npm install zustand

# or

npm install @reduxjs/toolkit react-redux

1. **Video/Audio Controls**

   > Camera toggle (on/off)
   > Microphone toggle (mute/unmute)
   > Screen sharing
   > Background blur
   > Virtual background support
   > Audio level monitoring

2. **Recording Features**

   > Start/stop recording
   > Download recordings
   > Screen capture support

3. **Meeting Management**

   > Meeting duration timer
   > Participant management
   > Meeting status display (quality, participants count)
   > Full-screen mode
   > Layout controls
   > Breakout rooms

4. **Interactive Features**
   > Hand raising with queue system
   > Chat functionality
   > Polling system
   > Meeting notes
   > Emoji reactions
   > Keyboard shortcuts
5. **Device Management**

   > Camera selection
   > Microphone selection
   > Audio output control
   > Network quality monitoring

6. **UI Elements**
   > Status bar
   > Control bar
   > Settings panel
   > Various modal dialogs
   > Picture-in-picture view
   > => Whiteboard Component
   > Drawing tools (pencil, eraser, color picker)
   > Text input
   > Shape drawing
   > Image upload
   > Undo/redo functionality

=> Chat Panel Component

> Basic chat functionality
> File sharing
> Emoji reactions
> Message reactions

=> Course Management Component

> Course creation
> Course management
> Enrollment management
> Progress tracking
> Certificate generation

=>Screen Sharing Component

> Screen sharing functionality
> Audio controls (mute/unmute)
> Participant list management
> Hand raising feature
> Background blur/effects
> =>MeetingNotes Component
> Meeting notes creation
> Meeting notes management
> Meeting notes sharing
> Meeting notes editing
> Meeting notes deleting
> =>ParticipentVideo Component
> Participent video functionality
> Participent video management
> Participent video sharing
> =>UseMediaStream
> Media stream functionality
> Media stream management
> Media stream sharing
> Media stream editing
> Media stream deleting
> =>File Sharing
> Image and document upload support
> File size validation (5MB limit)
> Preview for image files
> Download option for files
> Supported formats: images, PDF, DOC, DOCX
> =>ChatPanel Component
> Basic chat functionality
> File sharing
> Emoji reactions
> Message reactions
> =>ClassInfo Component
> **Class Information Display**
> Shows class name, room number, and live status
> Visual indicators for live/offline status
> Clean UI with icons and responsive design
> **Schedule Management**
> Modal popup showing class schedule
> Displays weekly schedule (Mon/Wed/Fri)
> Time slots with calendar icons
> **Attendance Tracking**
> Modal showing attendance statistics
> Visual circular progress indicator
> Shows present/total students and percentage
> **Office Hours**
> Quick access to join office hours
> Opens Zoom link in new tab
> Loading state with toast notification
> Required Packages:

# Core packages

-> npm install react

# UI Components and Icons

-> npm install lucide-react # For Calendar and other icons

# Toast Notifications

# (Current implementation uses custom hook 'useToast',

# but you could use one of these alternatives):

-> npm install react-hot-toast

# OR

-> npm install react-toastify

# Styling

# The component uses Tailwind CSS, so you'll need:

-> npm install tailwindcss postcss autoprefixer

=>Navigation Component
**Navigation Bar**

> Logo with "Virtual Classroom" title
> Main navigation menu (Dashboard, Courses, Calendar, Resources)
> Responsive design (mobile/desktop)
> **Notifications System**
> Bell icon with unread indicator
> Dropdown notification panel
> Different notification types (warning, info, success)
> Mark all as read functionality
> **User Profile Menu**
> User avatar display
> Username display (visible on desktop)
> Dropdown menu with options:
> Profile
> My Courses
> Preferences
> Sign Out
> **Settings Button**
> Quick access to settings (currently shows toast message)
> Required Packages:

# Core Dependencies

->npm install react react-dom react-router-dom

# UI Icons

->npm install lucide-react

# Optional but recommended for enhanced styling

->npm install tailwindcss
->npm install @headlessui/react # For better dropdowns
->npm install framer-motion # For smooth animations

# Toast Notifications (choose one)

->npm install react-hot-toast

# or

->npm install react-toastify
**Additional Notes**
The component uses custom hooks:

> useToast (custom hook for notifications)
> useNavigate (from react-router-dom)  
> =>Sidebar Component
> **Instructor Information Display**
> Shows instructor's avatar, name, department
> Quick access buttons for email and office hours
> **Class Schedule Section**
> Displays class timing (Mon, Wed, Fri)
> Shows room location
> **Assignments Tracker**
> Lists upcoming assignments
> Color coding (orange for important, blue for regular)
> Status badges (completed/pending)
> Interactive cards with hover effects
> "View All" option
> **Resources Section**
> Quick access to course materials
> Interactive buttons with icons
> Hover effects with external link icon
> Different icons for different resource types
> Required Packages:

# Core Dependencies

->npm install react

# UI Icons

->npm install lucide-react

# For styling (already using Tailwind CSS)

->npm install tailwindcss
->npm install @tailwindcss/forms # Optional - for better form styling

# For notifications (custom hook useToast is being used)

# You might want to consider these toast libraries:

->npm install react-hot-toast

# OR

->npm install react-toastify

<!-- Alam work -->

#Assignment Component

This React component allows users to answer and submit assignments with support for text, multiple-choice, and code-based questions.

## Features

- Supports text, multiple-choice, and coding questions.

- Code execution simulation.

- Firebase integration for submission storage.

# Assignment List Component

This React component displays a list of assignments with details like title, subject,
question count, total points, and due time. Users can view assignments by clicking the "View Assignment" button.

## Features

- Displays assignment details in a card layout
- Shows total questions and points
- Allows users to view assignments with a button click

# Code Editor Component

This React component provides a code editor with syntax highlighting, language selection,
and execution support. It allows users to write, copy, and run code in multiple programming languages.

## Features

- Supports multiple programming languages
- Allows users to write, copy, and execute code
- Displays real-time code output

# Submitted Assignments Component

This React component fetches and displays submitted assignments from a Firebase database.
It shows assignment details, submission status, answers, and total points.

## Features

- Fetches submissions from Firebase
- Displays assignment details and answers
- Shows submission status and total points

# useToast Hook

A custom React hook for displaying toast notifications with different
message types (info, success, error, warning). It provides a `showToast` function to trigger toasts and a `ToastContainer` component to render them.

## Features

- Supports multiple toast types
- Auto-dismisses after 3 seconds
- Easy to integrate into any React project

# AuthContext (Authentication Provider)

A React authentication context that manages user login, logout, and token verification using localStorage.
It provides an `AuthProvider` component and a `useAuth` hook for easy authentication handling.

## Features

- Stores user authentication state
- Verifies tokens from localStorage
- Provides login and logout functionality

# Virtual Classroom Login Component

This React component provides a user-friendly interface for logging into a virtual classroom application.
It supports email/password authentication, account creation, and GitHub OAuth login.
The UI is designed with a modern, responsive layout and includes features like password visibility toggle and form validation.

# ProtectedRoute Component

The `ProtectedRoute` component in React ensures that only authenticated users can access certain routes.
It utilizes `useAuth` to check user authentication status. If the user is not authenticated, they are redirected to the login page.

## Features

- Displays a loading spinner while authentication is in progress.
- Redirects unauthenticated users to the `/login` page.
- Wraps around protected components to restrict access.

## Usage

Wrap the `ProtectedRoute` aroun# Register Component

The `Register` component allows users to create an account for the virtual classroom. It includes form fields for name, email, and password, with real-time validation and a loading state. The component interacts with Firebase for user registration and redirects users upon successful signup.

## Features

- Displays a loading state during registration.
- Checks for existing users before creating a new account.
- Uses Firebase Realtime Database for storing user details.
- Includes password visibility toggle for better user experience.
  ;d components that require authentication:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
### Register Component

The `Register` component allows users to create an account for the virtual classroom.
It includes form fields for name, email, and password, with real-time validation and a loading state.
The component interacts with Firebase for user registration and redirects users upon successful signup.

## Features
- Displays a loading state during registration.
- Checks for existing users before creating a new account.
- Uses Firebase Realtime Database for storing user details.
- Includes password visibility toggle for better user experience.

///kishan work

# Custom Calendar Component Documentation

## Overview
Custom calendar component React aur Tailwind CSS ka use karke banaya gaya hai. Is component mein multiple views, event handling, aur custom styling implement ki gayi hai.

## Features
1. *Multiple Views*
   - Month View: Pura month calendar format mein display hota hai
   - Week View: Week wise events aur dates show hoti hain
   - Day View: Single day ka detailed view with hourly slots

2. *Event Handling*
   - Event creation support
   - Drag and drop functionality for events
   - Event resizing capability
   - Event details popup on click

3. *Custom Date Cell*
   - Date number display
   - Event indicators
   - Current date highlighting
   - Selected date highlighting

## Component Structure

jsx
// Main Calendar Wrapper
<div className="calendar-wrapper">
  {/* Header Section */}
  <div className="calendar-header">
    <div className="month-navigation">
      {/* Previous/Next Month Buttons */}
    </div>
    <div className="view-options">
      {/* Month/Week/Day View Toggle */}
    </div>
  </div>

  {/* Calendar Grid */}
  <div className="calendar-grid">
    {/* Week Days Header */}
    <div className="week-days">
      {/* Sun to Sat */}
    </div>

    {/* Date Cells */}
    <div className="date-cells">
      {/* Individual Date Cells */}
    </div>
  </div>
</div>


## Key Functions

### Date Navigation
javascript
const navigateMonth = (direction) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + direction);
  setCurrentDate(newDate);
};


### View Switching
javascript
const switchView = (view) => {
  setCurrentView(view);
  // Update grid layout based on view
};


### Event Handling
javascript
const handleEventClick = (event) => {
  setSelectedEvent(event);
  openEventModal();
};

const handleDateClick = (date) => {
  setSelectedDate(date);
  // Additional date selection logic
};


## Styling Implementation

### Cell Styling
css
.date-cell {
  @apply p-2 border rounded-lg;
  @apply hover:bg-gray-100;
  @apply cursor-pointer;
}

.current-date {
  @apply bg-blue-50 font-bold;
}

.selected-date {
  @apply bg-blue-500 text-white;
}


### Event Indicators
css
.event-indicator {
  @apply h-1.5 w-1.5 rounded-full;
  @apply bg-blue-500;
}

.multiple-events {
  @apply flex gap-0.5;
}


## Props
typescript
interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  initialView?: 'month' | 'week' | 'day';
  initialDate?: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}


## Helper Functions

### Date Formatting
javascript
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};


### Event Sorting
javascript
const sortEvents = (events) => {
  return events.sort((a, b) => a.start - b.start);
};


## Usage Example
jsx
function App() {
  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
  };

  const handleDateSelect = (date) => {
    console.log('Date selected:', date);
  };

  return (
    <Calendar
      events={myEvents}
      onEventClick={handleEventClick}
      onDateSelect={handleDateSelect}
      initialView="month"
      initialDate={new Date()}
    />
  );
// }
// kuldeekp features

Settings Page

This Settings Page allows users to manage their account preferences, appearance settings, notifications, and security options. Below is a breakdown of the key features available in the settings panel.

Features

1. Account Settings

Displays the user's email.

Provides an option to change the password.

2. Appearance

Dark Mode Toggle: Users can enable or disable dark mode.

Theme preference is saved in localStorage for persistence.

3. Notifications

Users can enable or disable email notifications.

Users can enable or disable push notifications.

4. Security & Privacy

Logout: Users can log out of their account securely.

Delete Account: Users can permanently delete their account (requires confirmation).

5. Help & Support

FAQs on common topics like password reset, contacting support, and account deletion.

Provides guidance on how to manage settings efficiently.

How to Use

Navigate to the Settings page from the sidebar.

Select the desired tab (Account, Appearance, Notifications, Security & Privacy, or Help & Support).

Modify preferences and save changes if necessary.

Technologies Used

React.js for the UI

React Router for navigation

Lucide Icons for UI enhancements

Tailwind CSS for styling

Firebase for authentication and account management

Future Enhancements

Add more security features like 2FA (Two-Factor Authentication).

Allow users to customize email and push notification preferences in detail.

Implement AI-powered insights for user activity tracking..
```
