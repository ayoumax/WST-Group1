const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const crypto = require("crypto");

const app = express();

const usersPath = path.join(__dirname, "users.json");
const ticketsPath = path.join(__dirname, "tickets.json");

app.use(express.json());

// Remember the authenticated user
app.use(session({
    name: "motorph.sid",
    secret: process.env.SESSION_SECRET ||
        crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // Local development uses HTTP
        maxAge: 60 * 60 * 1000
    }
}));

// LOGIN
app.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            username.trim() === "" ||
            password === ""
        ) {
            return res.status(400).json({
                message: "Please enter your username and password."
            });
        }

        const users = JSON.parse(
            fs.readFileSync(usersPath, "utf8")
        );

        const user = users.find(function (account) {
            return account.username === username.trim();
        });

        const passwordMatches = user
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Replace the old session after successful authentication
        req.session.regenerate(function (error) {
            if (error) {
                return next(error);
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            };

            req.session.save(function (error) {
                if (error) {
                    return next(error);
                }

                res.json({
                    message: "Login successful.",
                    user: req.session.user
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

// CHECK CURRENT LOGIN
app.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please log in first."
        });
    }

    res.json({ user: req.session.user });
});

// LOGOUT
app.post("/logout", (req, res, next) => {
    req.session.destroy(function (error) {
        if (error) {
            return next(error);
        }

        res.clearCookie("motorph.sid", { path: "/" });
        res.json({ message: "Logged out successfully." });
    });
});

// CREATE TICKET
app.post("/tickets", requireRole("employee"), (req, res, next) => {
    try {
        const body = req.body || {};

        const categoryLabels = {
            network: "Network / Internet",
            hardware: "Hardware",
            software: "Software",
            account: "Account Access",
            email: "Email",
            printer: "Printer",
            other: "Other"
        };

        const priorityLabels = {
            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent"
        };

        // Validate text fields before using them
        if (
            typeof body.subject !== "string" ||
            body.subject.trim() === "" ||
            typeof body.description !== "string" ||
            body.description.trim() === ""
        ) {
            return res.status(400).json({
                message: "Please enter a subject and problem description."
            });
        }

        if (
            typeof body.category !== "string" ||
            !Object.hasOwn(categoryLabels, body.category) ||
            typeof body.priority !== "string" ||
            !Object.hasOwn(priorityLabels, body.priority)
        ) {
            return res.status(400).json({
                message: "Please select a valid category and priority."
            });
        }

        if (
            (body.department !== undefined &&
                typeof body.department !== "string") ||
            (body.device !== undefined &&
                typeof body.device !== "string")
        ) {
            return res.status(400).json({
                message: "Department and device must be text."
            });
        }

        const tickets = JSON.parse(
            fs.readFileSync(ticketsPath, "utf8")
        );

        if (!Array.isArray(tickets)) {
            throw new Error("tickets.json must contain an array.");
        }

        // Generate the next number from tickets saved on the server
        let highestNumber = 1003;

        tickets.forEach(function (ticket) {
            const match = /^TCK-(\d+)$/.exec(ticket.id);

            if (match) {
                const number = Number(match[1]);

                if (Number.isSafeInteger(number)) {
                    highestNumber = Math.max(highestNumber, number);
                }
            }
        });

        const now = new Date();

        // Only accept editable fields from the form
        const newTicket = {
            id: "TCK-" + (highestNumber + 1),

            employeeId: req.session.user.id,
            employeeName: req.session.user.name,

            subject: body.subject.trim(),

            category: body.category,
            categoryText: categoryLabels[body.category],

            priority: body.priority,
            priorityText: priorityLabels[body.priority],

            department: body.department?.trim() || "Not provided",
            device: body.device?.trim() || "Not provided",

            description: body.description.trim(),

            status: "open",
            statusText: "Open",

            technician: "Unassigned",

            submitted: now.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            }),

            createdAt: now.toISOString()
        };

        tickets.push(newTicket);

        fs.writeFileSync(
            ticketsPath,
            JSON.stringify(tickets, null, 2),
            "utf8"
        );

        res.status(201).json({
            message: "Ticket submitted successfully.",
            ticket: newTicket
        });
    } catch (error) {
        next(error);
    }
});

// Reusable protection for backend endpoints
function requireRole(...allowedRoles) {
    return function (req, res, next) {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Please log in first."
            });
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to do this."
            });
        }

        next();
    };
}

// Define which role can open each page
const pageRoles = {
    "/employee-dashboard.html": "employee",
    "/submit-ticket.html": "employee",
    "/my-tickets.html": "employee",
    "/ticket-detail.html": "employee",
    "/help.html": "employee",

    "/technician-dashboard.html": "technician",
    "/manage-tickets.html": "technician",
    "/technician-ticket-detail.html": "technician",

    "/admin-dashboard.html": "admin",
    "/admin-tickets.html": "admin",
    "/assign-technician.html": "admin"
};

// Check access before serving protected pages
app.use((req, res, next) => {
    const requiredRole = pageRoles[req.path];

            if (!requiredRole) {
                return next();
            }

            res.set("Cache-Control", "no-store");

            if (!req.session.user) {
                return res.redirect("/index.html");
            }

            if (req.session.user.role !== requiredRole) {
                return res.status(403).send(
                    "Access denied. This page is for another user role."
                );
            }

            next();
});

// Serve only frontend files, keeping server files private
const publicFiles = new Set([
    "index.html",
    "employee-dashboard.html",
    "submit-ticket.html",
    "my-tickets.html",
    "ticket-detail.html",
    "help.html",
    "technician-dashboard.html",
    "manage-tickets.html",
    "technician-ticket-detail.html",
    "admin-dashboard.html",
    "admin-tickets.html",
    "assign-technician.html",
    "style.css",
    "login.js",
    "logout.js",
    "script.js",
    "admin-dashboard.js",
    "assign-technician.js",
    "manage-tickets.js",
    "technician-dashboard.js",
    "technician-ticket-messages.js",
    "ticket-messages.js"
]);

app.use("/images", express.static(
    path.join(__dirname, "images")
));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res, next) => {
    const filename = req.path.slice(1);

    if (
        (req.method === "GET" || req.method === "HEAD") &&
        publicFiles.has(filename)
    ) {
        return res.sendFile(path.join(__dirname, filename));
    }

    next();
});

// Handle unexpected server errors
app.use((error, req, res, next) => {
    console.error(error.message);

    res.status(500).json({
        message: "A server error occurred. Please try again."
    });
});

app.listen(3000, () => {
    console.log("MotorPH backend running on port 3000");
});