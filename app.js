const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/tickets", (req, res) => {
    const tickets = JSON.parse(
        fs.readFileSync("tickets.json", "utf8")
    );

    tickets.push(req.body);

    fs.writeFileSync(
        "tickets.json",
        JSON.stringify(tickets, null, 2)
    );

    res.json({
        message: "Ticket submitted successfully."
    });
});

app.listen(3000, () => {
    console.log("MotorPH backend running on port 3000");
});