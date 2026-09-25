# MotorPH IT Support Ticketing System

A browser-based IT support ticketing system for MotorPH employees, IT technicians, and administrators.

## Group Information

**Group:** WST - Group 1

**Members:**
- Irisha Bea Montaño
- Cris Gerald Tan
- Leonardo Arellano
- Macky Arriesgado

---

# Quick Start Guide

## 1. Open the Project

Open the project folder in Visual Studio Code.

Then open:

`index.html`

Right-click the file and select:

`Open with Live Server`

The browser should open an address similar to:

`http://127.0.0.1:5500/index.html`

or:

`http://127.0.0.1:5501/index.html`

> Important: Continue using the same Live Server address while testing because browser localStorage is connected to the browser origin.

---

# How to Log In

The current version is a frontend prototype and does not use a real authentication database.

Enter any non-empty username and password.

Example:

Username:

`testuser`

Password:

`test123`

Then select the role you want to test:

- Employee
- IT Technician
- Administrator

The username and password fields are only used to simulate the login interface.

---

# Recommended Instructor Testing Flow

For the easiest way to test the complete system, follow this order:

`Employee → Administrator → IT Technician → Employee`

This demonstrates the full ticket workflow.

---

## Step 1: Login as Employee

From the login page:

1. Enter any username.
2. Enter any password.
3. Click `Employee`.

The Employee Dashboard will open.

Default sample tickets are already included so that the system has visible data even on a new browser.

---

## Step 2: Submit a New Ticket

Go to:

`Submit Ticket`

Example test data:

Subject:

`Microsoft Teams not opening`

Category:

`Software`

Priority:

`High`

Department:

`Accounting`

Device / Equipment:

`Laptop`

Problem Description:

`Microsoft Teams closes immediately after opening.`

Click:

`Submit Ticket`

A confirmation message will appear.

On a fresh browser, the first locally submitted ticket will normally be:

`TCK-1004`

The ticket is saved using browser localStorage.

---

## Step 3: Check My Tickets

Go to:

`Employee → My Tickets`

The page will show:

- Default sample tickets
- Newly submitted tickets

Try searching:

`TCK-1004`

You can also filter tickets by status.

Refresh the browser or log out and log back in.

The submitted ticket should still remain because it is stored using localStorage.

---

## Step 4: Login as Administrator

Logout and return to the login page.

Enter any username and password, then click:

`Administrator`

Go to:

`All Tickets`

The newly submitted employee ticket should appear together with the default sample tickets.

---

## Step 5: Assign a Technician

Go to:

`Administrator → Assign Technician`

Open the Ticket dropdown.

The newly submitted ticket should appear automatically.

Example:

`TCK-1004 - Microsoft Teams not opening`

Select a technician:

- Mark Santos
- Ana Reyes
- IT Support Team

Then click:

`Assign Technician`

A confirmation message will appear.

The selected technician is saved in localStorage.

The ticket status will also change to:

`In Progress`

---

## Step 6: Login as IT Technician

Logout and return to the login page.

Enter any username and password, then click:

`IT Technician`

Go to:

`Assigned Tickets`

The ticket assigned by the administrator should appear in the list.

Example:

| Ticket ID | Employee | Category | Priority | Status | Assigned To |
| --- | --- | --- | --- | --- | --- |
| TCK-1004 | Employee | Software | High | In Progress | Mark Santos |

You can search and filter the assigned ticket list.

---

## Step 7: Check the Technician Dashboard

Go to:

`IT Technician → Dashboard`

The assigned ticket should also appear on the Technician Dashboard.

The dashboard counts automatically update.

---

## Step 8: Update the Ticket Status

Find the newly assigned ticket.

Use the Quick Action dropdown and change:

`In Progress`

to:

`Resolved`

The status and dashboard counters should update.

The new status is also saved in localStorage.

---

## Step 9: Verify the Updated Status as Employee

Logout and login again as:

`Employee`

Go to:

`Dashboard`

or:

`My Tickets`

The same ticket should now show:

`Resolved`

This demonstrates the complete workflow:

`Employee submits ticket → Administrator assigns technician → Technician updates status → Employee sees updated status`

---

# Project Overview

The MotorPH IT Support Ticketing System is a frontend browser-based application designed to simulate the basic workflow of an IT support service.

The system allows employees to submit and monitor IT support tickets, administrators to review and assign tickets, and IT technicians to manage assigned tickets and update their status.

The project uses HTML, CSS, JavaScript, and browser localStorage.

A backend server and database are not required for the current project version.

---

# Current Features

## Employee

- Employee portal
- Employee dashboard
- Submit new IT support tickets
- Automatically generate ticket IDs
- Save submitted tickets using browser localStorage
- View default sample tickets
- View newly submitted tickets
- Search tickets by ticket ID or subject
- Filter tickets by status
- View ticket status
- View ticket details
- Access basic troubleshooting help
- Dashboard ticket counts automatically update

## IT Technician

- IT Technician portal
- Technician dashboard
- View assigned support tickets
- View tickets assigned by the administrator
- Search and filter assigned tickets
- Filter tickets by status
- Update ticket status
- Change tickets between:
  - Open
  - In Progress
  - Resolved
- Updated ticket status is saved using localStorage
- Dashboard counts automatically update
- Add shift handover notes

## Administrator

- Administrator portal
- Administrator dashboard
- View all support tickets
- View newly submitted employee tickets
- Search and filter tickets
- Monitor ticket status
- View assigned technicians
- Assign tickets to:
  - Mark Santos
  - Ana Reyes
  - IT Support Team
- Assigned technician is saved using localStorage
- Assigned tickets automatically become In Progress
- Post dashboard announcements
- View administrator dashboard activity and ticket information

---

# Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser localStorage
- Visual Studio Code
- Live Server
- Git
- GitHub

---

# Default Sample Tickets and Browser Storage

The system uses two types of ticket data.

## Default Sample Tickets

Default sample tickets are included directly in the project so that an instructor opening the system on a new computer can immediately see example data.

These sample tickets do not depend on localStorage.

## Submitted Tickets

Tickets submitted through the Employee portal are saved in:

`localStorage`

This allows submitted tickets to remain available after refreshing the page or logging out and logging back in using the same browser.

### Important Limitation

localStorage is browser-based storage.

This means tickets created on one computer are not automatically transferred to another computer.

For example:

- Tickets created by a student remain in the student's browser.
- An instructor opening the repository on another computer will see the default sample tickets.
- Tickets created by the instructor during testing will be stored in the instructor's own browser.

This is expected because the project does not use a server-side database.

---

# Current Workflow

## Employee

`Login → Dashboard → Submit Ticket → My Tickets → View Status → Help`

## Administrator

`Login → Administrator Dashboard → All Tickets → Assign Technician`

## IT Technician

`Login → Technician Dashboard → Assigned Tickets → Update Ticket Status`

## Complete Workflow

`Employee submits ticket`

↓

`Ticket saved in localStorage`

↓

`Administrator sees ticket`

↓

`Administrator assigns technician`

↓

`Ticket becomes In Progress`

↓

`Technician sees assigned ticket`

↓

`Technician updates ticket status`

↓

`Employee sees updated status`

---

# Project Structure

## HTML Files

- `index.html` - Main login page
- `employee-dashboard.html` - Employee dashboard
- `submit-ticket.html` - Employee ticket submission form
- `my-tickets.html` - Employee ticket list
- `ticket-detail.html` - Employee ticket details
- `help.html` - Employee troubleshooting help page
- `technician-dashboard.html` - IT Technician dashboard
- `manage-tickets.html` - Technician assigned ticket list
- `technician-ticket-detail.html` - Technician ticket details
- `admin-dashboard.html` - Administrator dashboard
- `admin-tickets.html` - Administrator ticket list
- `assign-technician.html` - Administrator technician assignment page

## JavaScript Files

- `script.js` - Employee ticket submission, localStorage, employee dashboard, My Tickets, and administrator ticket integration
- `technician-dashboard.js` - Technician dashboard interactions and ticket status updates
- `manage-tickets.js` - Assigned ticket loading, searching, and filtering
- `admin-dashboard.js` - Administrator dashboard interactions
- `assign-technician.js` - Technician assignment and localStorage updates

## Styling

- `style.css` - Shared styling for the login page and all role portals

## Images

- `images/motorph-logo.png`
- `images/login-illustration.png`

---

# Data Storage

The project currently uses browser localStorage instead of a database.

The main localStorage key used by the system is:

`motorphTickets`

Each submitted ticket can store information such as:

- Ticket ID
- Subject
- Category
- Priority
- Department
- Device
- Problem description
- Status
- Submitted date
- Assigned technician

Example:

```javascript
{
    id: "TCK-1004",
    subject: "Microsoft Teams not opening",
    category: "software",
    priority: "high",
    department: "Accounting",
    device: "Laptop",
    status: "in-progress",
    technician: "Mark Santos"
}
