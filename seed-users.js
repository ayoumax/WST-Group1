const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

async function createDemoUsers() {
    const usersPath = path.join(__dirname, "users.json");
    const fileExists = fs.existsSync(usersPath);

    const users = fileExists
        ? JSON.parse(fs.readFileSync(usersPath, "utf8"))
        : [];

    if (!Array.isArray(users)) {
        throw new Error("users.json must contain an array.");
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
            id: "TECH-002",
            name: "Ana Reyes",
            username: "ana",
            password: "Ana123!",
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

    // Check for conflicting records before making changes.
    for (const account of demoAccounts) {
        const byId = users.find(user => user.id === account.id);
        const byUsername = users.find(
            user => user.username === account.username
        );

        if (byId || byUsername) {
            if (
                !byId ||
                byId !== byUsername ||
                byId.name !== account.name ||
                byId.role !== account.role
            ) {
                throw new Error(
                    `Conflicting account for ${account.username}. No changes saved.`
                );
            }
        }
    }

    let addedCount = 0;

    for (const account of demoAccounts) {
        if (users.some(user => user.id === account.id)) {
            console.log(`Existing account preserved: ${account.username}`);
            continue;
        }

        const passwordHash = await bcrypt.hash(account.password, 12);

        users.push({
            id: account.id,
            name: account.name,
            username: account.username,
            passwordHash,
            role: account.role
        });

        addedCount++;
        console.log(`Added demo account: ${account.username}`);
    }

    if (addedCount === 0) {
        console.log("All demo accounts already exist. No accounts changed.");
        return;
    }

    if (fileExists) {
        fs.copyFileSync(
            usersPath,
            `${usersPath}.${Date.now()}.bak`,
            fs.constants.COPYFILE_EXCL
        );
    }

    fs.writeFileSync(
        usersPath,
        JSON.stringify(users, null, 2),
        { flag: fileExists ? "w" : "wx" }
    );

    console.log(`${addedCount} demo account(s) saved.`);
}

createDemoUsers().catch(function (error) {
    console.error("Unable to create demo accounts:", error.message);
    process.exitCode = 1;
});