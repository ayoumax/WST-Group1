# MotorPH IT Support Ticketing System

A web application for MotorPH employees, IT technicians, and administrators. Employees submit support requests, administrators assign technicians, and technicians update ticket statuses and respond to employees.

## Group Information

**Group:** WST – Group 1

**Members:**

- Irisha Bea Montaño
- Cris Gerald Tan
- Leonardo Arellano
- Macky Arriesgado

## Technologies

- HTML5, CSS3, and JavaScript
- Node.js and Express
- express-session for session authentication
- bcryptjs for password hashing
- Server-side JSON files for persistence
- Git and GitHub

## Setup and Startup

Install Node.js and open the project folder containing `package.json` in Visual Studio Code.

Run these commands individually in the terminal:

```cmd
npm.cmd install
```

```cmd
node seed-users.js
```

```cmd
npm.cmd start
```

Open:

http://localhost:3000

Keep the server terminal running while using the application. Access the website through the Node.js server. Live Server does not provide the required API or authentication routes.

The seed script creates missing demo accounts while preserving existing accounts and password hashes. When updating an existing users file, it creates a backup.

## Demo Accounts

These credentials are for classroom testing only.

| Account | Username | Password | Role |
| --- | --- | --- | --- |
| Demo Employee | employee | Employee123! | Employee |
| Mark Santos | technician | Technician123! | Technician |
| Ana Reyes | ana | Ana123! | Technician |
| Demo Administrator | admin | Admin123! | Administrator |

Existing accounts retain their existing passwords when the seed script runs.

Mark and Ana are separate technicians. A ticket assigned to Ana is not accessible to Mark, and vice versa.

## Features

### Employee

- Submit IT support tickets with server-generated ticket IDs.
- View their own tickets and ticket details.
- Search and filter their ticket list.
- View dashboard counts calculated from backend data.
- Send comments and read replies from the assigned technician.
- Access troubleshooting help.

### Technician

- View only tickets assigned to their account.
- Search and filter assigned tickets.
- Update assigned tickets to Open, In Progress, Resolved, or Closed.
- Read employee comments and send replies.
- View dashboard counts based on assigned tickets.
- Save and view shared technician shift handover notes.

### Administrator

- View all tickets.
- Search and filter the ticket list.
- View ticket counts, priority totals, and technician workloads.
- Assign and reassign tickets to technicians loaded from the backend.
- Assigning an Open ticket to a technician changes it to In Progress.
- Preview an announcement on the current dashboard page.

The announcement preview is temporary. It is not saved or broadcast to other users.

## Phase 3: Route Protection and Backend Data

Protected ticket endpoints use role guards and ticket access checks.

- Unauthenticated protected API requests return `401 Unauthorized`.
- Technicians can view, update, and message only their assigned tickets.
- Attempts to access another technician's ticket return `403 Forbidden`.
- Non-administrators cannot reassign tickets.
- Invalid technician assignments are rejected.
- Unauthenticated navigation to protected HTML pages redirects to `index.html` with a `302` response.
- Authenticated users attempting to open a page outside their permitted role receive `403 Forbidden`.

Ticket tables, status badges, messages, technician choices, and dashboard counters load through backend API requests. Prototype localStorage code and hardcoded ticket rows have been removed.

Search and filtering can operate in the browser on records already retrieved from the backend.

Backend communication does not mean automatic real-time updates. Refresh or reload the relevant page to retrieve changes made by another user.

## Data Storage

The application uses server-side files:

| File | Purpose |
| --- | --- |
| `users.json` | Accounts, roles, and hashed passwords |
| `tickets.json` | Tickets, assignments, statuses, and ticket messages |
| `shift-notes.json` | Shared technician handover notes |

Saved data remains available after browser refreshes and server restarts because it is stored in files on the server.

Login sessions are held in server memory. Restarting the server requires users to log in again.

Different browsers connected to the same server use the same saved backend data. Separate project copies running on different computers have separate data files.

## Recommended Demonstration

1. Log in as the employee and submit a ticket.
2. Record the ticket ID shown by the application.
3. Log out and log in as the administrator.
4. Assign the ticket to Mark Santos or Ana Reyes.
5. Log out and log in as the assigned technician, then open the ticket.
6. Send a reply and update the ticket status to Resolved.
7. Log out and log in as the employee, then confirm the reply and status.
8. Send an employee comment.
9. Log back in as the assigned technician and confirm the employee comment appears. Change the ticket status to Closed and refresh to confirm it persists.
10. Log out and log in as the other technician. Confirm the ticket does not appear in their assigned list and that directly requesting its details returns `403 Forbidden`.

When demonstrating accounts simultaneously, use separate browser profiles or a normal and private window. Tabs in the same browser profile share the login session.

Refresh or reload the relevant page when checking changes made through another account.

## Manual Verification

| Check | Expected result |
| --- | --- |
| Request protected ticket APIs without logging in | 401 |
| Open a protected dashboard without logging in | 302 redirect to index.html |
| Technician requests another technician's ticket | 403 |
| Technician reads or posts messages on another technician's ticket | 403 |
| Non-administrator attempts reassignment | 403 |
| Administrator submits an invalid technician assignment | 400 |
| Employee and assigned technician exchange comments | Messages persist after refresh |
| Assigned technician changes a ticket to Closed | Closed status persists after refresh |

Ticket IDs and dashboard totals depend on the current server data. Do not assume a particular ticket ID exists on every installation.

## Main Project Files

| File | Purpose |
| --- | --- |
| `app.js` | Server, authentication, route protection, and REST endpoints |
| `seed-users.js` | Creates missing demo accounts |
| `script.js` | Employee ticket submission and dashboard |
| `my-tickets.js` | Employee ticket list |
| `ticket-messages.js` | Employee ticket details and messaging |
| `technician-dashboard.js` | Technician dashboard, quick status updates, and shift notes |
| `manage-tickets.js` | Technician assigned ticket list |
| `technician-ticket-messages.js` | Technician ticket details, statuses, and messaging |
| `admin-dashboard.js` | Administrator dashboard |
| `admin-tickets.js` | Administrator ticket list |
| `assign-technician.js` | Loads assignment choices and submits assignments |
| `logout.js` | Logout behavior |
| `style.css` | Shared styling |

## Development Notes

- Run the application through the Express server.
- Preserve local testing data when preparing code commits.
- Account backups and local shift notes are excluded through `.gitignore`.
- Teammates should run `node seed-users.js` after pulling the updated seed script to add any missing demo accounts.
- Local Phase 3 test tickets and message exchanges are excluded from the Phase 3 code commit. They remain available on the computer where they were created.
- To demonstrate on another computer, create a ticket and repeat the assignment, messaging, and status update workflow.

This is a classroom demonstration application. JSON file storage and in-memory sessions would need further development for production use.