document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const usernameInput =
            document.getElementById(
                "username"
            );

        const passwordInput =
            document.getElementById(
                "password"
            );

        const loginMessage =
            document.getElementById(
                "loginMessage"
            );


        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const username =
                    usernameInput.value.trim();

                const password =
                    passwordInput.value;


                loginMessage.hidden =
                    true;


                try {

                    const response =
                        await fetch(
                            "/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        username:
                                            username,

                                        password:
                                            password
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        loginMessage.textContent =
                            data.message ||
                            "Unable to log in.";

                        loginMessage.style.color =
                            "#B91C1C";

                        loginMessage.hidden =
                            false;

                        return;

                    }


                    loginMessage.textContent =
                        "Login successful.";

                    loginMessage.style.color =
                        "#166534";

                    loginMessage.hidden =
                        false;


                    if (
                        data.user.role ===
                        "employee"
                    ) {

                        window.location.href =
                            "/employee-dashboard.html";

                    } else if (
                        data.user.role ===
                        "technician"
                    ) {

                        window.location.href =
                            "/technician-dashboard.html";

                    } else if (
                        data.user.role ===
                        "admin"
                    ) {

                        window.location.href =
                            "/admin-dashboard.html";

                    }

                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    loginMessage.textContent =
                        "Unable to connect to the server.";

                    loginMessage.style.color =
                        "#B91C1C";

                    loginMessage.hidden =
                        false;

                }

            }
        );

    }
);