const loginForm = document.getElementById("loginForm");
const loginFeedback = document.getElementById("loginFeedback");
const loginButtons = loginForm.querySelectorAll("button");

const dashboards = {
    employee: "employee-dashboard.html",
    technician: "technician-dashboard.html",
    admin: "admin-dashboard.html"
};

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const selectedRole = event.submitter?.dataset.role;

    if (!selectedRole) {
        loginFeedback.textContent = "Please select a login role.";
        loginFeedback.hidden = false;
        return;
    }

    loginFeedback.hidden = true;
    loginButtons.forEach(button => button.disabled = true);

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: document.getElementById("username").value.trim(),
                password: document.getElementById("password").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to log in.");
        }

        if (data.user.role !== selectedRole) {
            // End the session when the wrong portal was selected
            await fetch("/logout", { method: "POST" });

            throw new Error(
                "This account does not match the selected role."
            );
        }

        const dashboard = dashboards[data.user.role];

        if (!dashboard) {
            throw new Error("This account has an unsupported role.");
        }

        window.location.href = dashboard;
    } catch (error) {
        loginFeedback.textContent = error.message;
        loginFeedback.style.color = "#B42318";
        loginFeedback.hidden = false;
    } finally {
        loginButtons.forEach(button => button.disabled = false);
    }
});