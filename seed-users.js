const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

async function createDemoUsers() {
    const usersPath = path.join(__dirname, "users.json");

    // Avoid replacing existing accounts accidentally
    if (fs.existsSync(usersPath)) {
        console.log("users.json already exists. No accounts changed.");
        return;
    }

    const demoAccounts = [
        {
            id: "EMP-001",
            name: "Demo Employee",
            username: "employee",
            password: "Employee123!",
            role: "employee"
        },
        {
            id: "TECH-001",
            name: "Mark Santos",
            username: "technician",
            password: "Technician123!",
            role: "technician"
        },
        {
            id: "ADMIN-001",
            name: "Demo Administrator",
            username: "admin",
            password: "Admin123!",
            role: "admin"
        }
    ];

    const users = [];

    for (const account of demoAccounts) {
        const passwordHash = await bcrypt.hash(account.password, 12);

        users.push({
            id: account.id,
            name: account.name,
            username: account.username,
            passwordHash: passwordHash,
            role: account.role
        });
    }

    fs.writeFileSync(
        usersPath,
        JSON.stringify(users, null, 2),
        { flag: "wx" }
    );

    console.log("Demo accounts created in users.json.");
}

createDemoUsers().catch(function (error) {
    console.error("Unable to create demo accounts:", error.message);
    process.exitCode = 1;
});