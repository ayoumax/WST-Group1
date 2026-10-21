document.querySelectorAll(".logout-button").forEach(function (button) {
    button.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            const response = await fetch("/logout", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Unable to log out. Please try again.");
            }

            window.location.replace("/index.html");
        } catch (error) {
            alert(error.message);
        }
    });
});