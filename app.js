const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const TICKETS_FILE = path.join(__dirname, "tickets.json");

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/tickets", (req, res) => {
    try {
        const fileData = fs.readFileSync(TICKETS_FILE, "utf8");
        const tickets = JSON.parse(fileData);

        const newTicket = {
            ...req.body,
            assignedTech: req.body.assignedTech || req.body.technician || "Unassigned",
            technician: req.body.technician || req.body.assignedTech || "Unassigned",
            messages: req.body.messages || []
        };

        tickets.push(newTicket);

        fs.writeFileSync(
            TICKETS_FILE,
            JSON.stringify(tickets, null, 2)
        );

        res.json({
            message: "Ticket submitted successfully.",
            ticket: newTicket
        });
    } catch (err) {
        console.error("Error saving ticket:", err);
        res.status(500).json({ error: "Failed to save ticket" });
    }
});

app.listen(PORT, () => {
    console.log(`MotorPH backend running on port ${PORT}`);
});
