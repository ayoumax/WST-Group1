const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const crypto = require("crypto");


const app = express();

const PORT =
    process.env.PORT || 3000;


const usersPath =
    path.join(
        __dirname,
        "users.json"
    );


const ticketsPath =
    path.join(
        __dirname,
        "tickets.json"
    );


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
    express.json()
);


// Remember the authenticated user
app.use(
    session({

        name:
            "motorph.sid",

        secret:
            process.env.SESSION_SECRET ||
            crypto
                .randomBytes(32)
                .toString("hex"),

        resave:
            false,

        saveUninitialized:
            false,

        cookie: {

            httpOnly:
                true,

            sameSite:
                "lax",

            secure:
                false,

            maxAge:
                60 * 60 * 1000

        }

    })
);


// =========================================================
// ROLE PROTECTION
// =========================================================

function requireRole(
    ...allowedRoles
) {

    return function (
        req,
        res,
        next
    ) {

        if (
            !req.session.user
        ) {

            return res
                .status(401)
                .json({

                    message:
                        "Please log in first."

                });

        }


        if (
            !allowedRoles.includes(
                req.session.user.role
            )
        ) {

            return res
                .status(403)
                .json({

                    message:
                        "You do not have permission to do this."

                });

        }


        next();

    };

}


// =========================================================
// CHECK IF USER CAN VIEW A TICKET
// =========================================================

function canViewTicket(
    user,
    ticket
) {

    // Administrator can view all tickets
    if (
        user.role === "admin"
    ) {

        return true;

    }


    // Employee can only view their own tickets
    if (
        user.role === "employee"
    ) {

        return (

            ticket.employeeId ===
                user.id ||

            ticket.submittedBy ===
                user.username

        );

    }


    // Technician can only view tickets assigned to them
    if (
        user.role === "technician"
    ) {

        return (

            ticket.assignedTech ===
                user.name ||

            ticket.technician ===
                user.name

        );

    }


    return false;

}


// =========================================================
// LOGIN
// =========================================================

app.post(
    "/login",
    async (
        req,
        res,
        next
    ) => {

        try {

            const {
                username,
                password
            } =
                req.body || {};


            if (
                typeof username !==
                    "string" ||

                typeof password !==
                    "string" ||

                username.trim() ===
                    "" ||

                password ===
                    ""
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Please enter your username and password."

                    });

            }


            const users =
                JSON.parse(
                    fs.readFileSync(
                        usersPath,
                        "utf8"
                    )
                );


            if (
                !Array.isArray(users)
            ) {

                throw new Error(
                    "users.json must contain an array."
                );

            }


            const user =
                users.find(
                    function (
                        account
                    ) {

                        return (
                            account.username ===
                            username.trim()
                        );

                    }
                );


            // Supports both the newer passwordHash format
            // and older plain password format.
            let passwordMatches =
                false;


            if (user) {

                if (
                    typeof user.passwordHash ===
                    "string"
                ) {

                    passwordMatches =
                        await bcrypt.compare(
                            password,
                            user.passwordHash
                        );

                } else if (
                    typeof user.password ===
                    "string"
                ) {

                    passwordMatches =
                        password ===
                        user.password;

                }

            }


            if (
                !passwordMatches
            ) {

                return res
                    .status(401)
                    .json({

                        message:
                            "Invalid username or password."

                    });

            }


            req.session.regenerate(
                function (
                    error
                ) {

                    if (error) {

                        return next(
                            error
                        );

                    }


                    req.session.user = {

                        id:
                            user.id,

                        name:
                            user.name,

                        username:
                            user.username,

                        role:
                            user.role,

                        department:
                            user.department ||
                            ""

                    };


                    req.session.save(
                        function (
                            error
                        ) {

                            if (error) {

                                return next(
                                    error
                                );

                            }


                            res.json({

                                message:
                                    "Login successful.",

                                user:
                                    req.session.user

                            });

                        }
                    );

                }
            );

        } catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


// =========================================================
// CHECK CURRENT LOGIN
// =========================================================

app.get(
    "/me",
    (
        req,
        res
    ) => {

        if (
            !req.session.user
        ) {

            return res
                .status(401)
                .json({

                    message:
                        "Please log in first."

                });

        }


        res.json({

            user:
                req.session.user

        });

    }
);


// =========================================================
// LOGOUT
// =========================================================

app.post(
    "/logout",
    (
        req,
        res,
        next
    ) => {

        req.session.destroy(
            function (
                error
            ) {

                if (error) {

                    return next(
                        error
                    );

                }


                res.clearCookie(
                    "motorph.sid",
                    {
                        path:
                            "/"
                    }
                );


                res.json({

                    message:
                        "Logged out successfully."

                });

            }
        );

    }
);


// =========================================================
// GET TICKETS
// =========================================================
// Employee   -> own tickets
// Technician -> assigned tickets
// Admin      -> all tickets
// =========================================================

app.get(
    "/tickets",

    requireRole(
        "employee",
        "technician",
        "admin"
    ),

    (
        req,
        res,
        next
    ) => {

        try {

            const tickets =
                JSON.parse(
                    fs.readFileSync(
                        ticketsPath,
                        "utf8"
                    )
                );


            if (
                !Array.isArray(
                    tickets
                )
            ) {

                throw new Error(
                    "tickets.json must contain an array."
                );

            }


            const visibleTickets =
                tickets.filter(
                    function (
                        ticket
                    ) {

                        return canViewTicket(
                            req.session.user,
                            ticket
                        );

                    }
                );


            res.json({

                tickets:
                    visibleTickets

            });

        } catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


// =========================================================
// GET ONE TICKET BY ID
// =========================================================

app.get(
    "/tickets/:id",

    requireRole(
        "employee",
        "technician",
        "admin"
    ),

    (
        req,
        res,
        next
    ) => {

        try {

            const tickets =
                JSON.parse(
                    fs.readFileSync(
                        ticketsPath,
                        "utf8"
                    )
                );


            if (
                !Array.isArray(
                    tickets
                )
            ) {

                throw new Error(
                    "tickets.json must contain an array."
                );

            }


            const ticket =
                tickets.find(
                    function (
                        item
                    ) {

                        return (
                            item.id ===
                            req.params.id
                        );

                    }
                );


            if (
                !ticket
            ) {

                return res
                    .status(404)
                    .json({

                        message:
                            "Ticket not found."

                    });

            }


            if (
                !canViewTicket(
                    req.session.user,
                    ticket
                )
            ) {

                return res
                    .status(403)
                    .json({

                        message:
                            "You do not have permission to view this ticket."

                    });

            }


            res.json({

                ticket:
                    ticket

            });

        } catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


// =========================================================
// CREATE TICKET
// =========================================================

app.post(
    "/tickets",

    requireRole(
        "employee"
    ),

    (
        req,
        res,
        next
    ) => {

        try {

            const body =
                req.body || {};


            const categoryLabels = {

                network:
                    "Network / Internet",

                hardware:
                    "Hardware",

                software:
                    "Software",

                account:
                    "Account Access",

                "account-access":
                    "Account Access",

                email:
                    "Email",

                printer:
                    "Printer",

                other:
                    "Other"

            };


            const priorityLabels = {

                low:
                    "Low",

                medium:
                    "Medium",

                high:
                    "High",

                urgent:
                    "Urgent"

            };


            // Validate required fields
            if (
                typeof body.subject !==
                    "string" ||

                body.subject.trim() ===
                    "" ||

                typeof body.description !==
                    "string" ||

                body.description.trim() ===
                    ""
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Please enter a subject and problem description."

                    });

            }


            if (
                typeof body.category !==
                    "string" ||

                !Object.hasOwn(
                    categoryLabels,
                    body.category
                ) ||

                typeof body.priority !==
                    "string" ||

                !Object.hasOwn(
                    priorityLabels,
                    body.priority
                )
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Please select a valid category and priority."

                    });

            }


            if (
                (
                    body.department !==
                        undefined &&

                    typeof body.department !==
                        "string"
                ) ||

                (
                    body.device !==
                        undefined &&

                    typeof body.device !==
                        "string"
                )
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Department and device must be text."

                    });

            }


            const tickets =
                JSON.parse(
                    fs.readFileSync(
                        ticketsPath,
                        "utf8"
                    )
                );


            if (
                !Array.isArray(
                    tickets
                )
            ) {

                throw new Error(
                    "tickets.json must contain an array."
                );

            }


            // Generate the next ticket number
            let highestNumber =
                1000;


            tickets.forEach(
                function (
                    ticket
                ) {

                    const match =
                        /^TCK-(\d+)$/.exec(
                            ticket.id
                        );


                    if (
                        match
                    ) {

                        const number =
                            Number(
                                match[1]
                            );


                        if (
                            Number.isSafeInteger(
                                number
                            )
                        ) {

                            highestNumber =
                                Math.max(
                                    highestNumber,
                                    number
                                );

                        }

                    }

                }
            );


            const now =
                new Date();


            const newTicket = {

                id:
                    "TCK-" +
                    (
                        highestNumber +
                        1
                    ),

                employeeId:
                    req.session.user.id,

                employeeName:
                    req.session.user.name,

                submittedBy:
                    req.session.user.username,

                subject:
                    body.subject.trim(),

                category:
                    body.category,

                categoryText:
                    categoryLabels[
                        body.category
                    ],

                priority:
                    body.priority,

                priorityText:
                    priorityLabels[
                        body.priority
                    ],

                department:
                    (
                        typeof body.department ===
                            "string" &&

                        body.department.trim() !==
                            ""
                    )
                        ? body.department.trim()
                        : (
                            req.session.user.department ||
                            "Not provided"
                        ),

                device:
                    (
                        typeof body.device ===
                            "string" &&

                        body.device.trim() !==
                            ""
                    )
                        ? body.device.trim()
                        : "Not provided",

                description:
                    body.description.trim(),

                status:
                    "open",

                statusText:
                    "Open",

                assignedTech:
                    "Unassigned",

                technician:
                    "Unassigned",

                messages:
                    [],

                submitted:
                    now.toLocaleDateString(
                        "en-US",
                        {

                            month:
                                "long",

                            day:
                                "numeric",

                            year:
                                "numeric"

                        }
                    ),

                createdAt:
                    now.toISOString()

            };


            tickets.push(
                newTicket
            );


            fs.writeFileSync(
                ticketsPath,

                JSON.stringify(
                    tickets,
                    null,
                    2
                ),

                "utf8"
            );


            res
                .status(201)
                .json({

                    message:
                        "Ticket submitted successfully.",

                    ticket:
                        newTicket

                });

        } catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


// =========================================================
// PROTECTED PAGES
// =========================================================

const pageRoles = {

    "/employee-dashboard.html":
        "employee",

    "/submit-ticket.html":
        "employee",

    "/my-tickets.html":
        "employee",

    "/ticket-detail.html":
        "employee",

    "/help.html":
        "employee",


    "/technician-dashboard.html":
        "technician",

    "/manage-tickets.html":
        "technician",

    "/technician-ticket-detail.html":
        "technician",


    "/admin-dashboard.html":
        "admin",

    "/admin-tickets.html":
        "admin",

    "/assign-technician.html":
        "admin"

};


// Check access before serving protected pages
app.use(
    (
        req,
        res,
        next
    ) => {

        const requiredRole =
            pageRoles[
                req.path
            ];


        if (
            !requiredRole
        ) {

            return next();

        }


        res.set(
            "Cache-Control",
            "no-store"
        );


        if (
            !req.session.user
        ) {

            return res.redirect(
                "/index.html"
            );

        }


        if (
            req.session.user.role !==
            requiredRole
        ) {

            return res
                .status(403)
                .send(
                    "Access denied. This page is for another user role."
                );

        }


        next();

    }
);


// =========================================================
// FRONTEND FILES
// =========================================================
// Only explicitly listed frontend files are publicly served.
// JSON data files are not exposed directly.
// =========================================================

const publicFiles =
    new Set([

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

        "my-tickets.js",

        "admin-tickets.js",

        "admin-dashboard.js",

        "assign-technician.js",

        "manage-tickets.js",

        "technician-dashboard.js",

        "technician-ticket-messages.js",

        "ticket-messages.js"

    ]);


// Allow images to load
app.use(
    "/images",

    express.static(
        path.join(
            __dirname,
            "images"
        )
    )
);


// =========================================================
// HOME PAGE
// =========================================================

app.get(
    "/",
    (
        req,
        res
    ) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


// =========================================================
// SERVE ALLOWED FRONTEND FILES
// =========================================================

app.use(
    (
        req,
        res,
        next
    ) => {

        const filename =
            req.path.slice(
                1
            );


        if (
            (
                req.method ===
                    "GET" ||

                req.method ===
                    "HEAD"
            ) &&

            publicFiles.has(
                filename
            )
        ) {

            return res.sendFile(
                path.join(
                    __dirname,
                    filename
                )
            );

        }


        next();

    }
);


// =========================================================
// ERROR HANDLER
// =========================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );


        res
            .status(500)
            .json({

                message:
                    "A server error occurred. Please try again."

            });

    }
);


// =========================================================
// START SERVER
// =========================================================

app.listen(
    PORT,
    () => {

        console.log(
            `MotorPH backend running on port ${PORT}`
        );

    }
);