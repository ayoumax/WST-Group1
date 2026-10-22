// ==========================================================================
// MotorPH IT Support - Login
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const loginFeedback =
            document.getElementById(
                "loginFeedback"
            );


        const loginButtons =
            loginForm.querySelectorAll(
                "button[type='submit']"
            );


        const dashboards = {

            employee:
                "employee-dashboard.html",

            technician:
                "technician-dashboard.html",

            admin:
                "admin-dashboard.html"

        };


        // ==================================================
        // LOGIN FORM
        // ==================================================

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const selectedRole =
                    event.submitter
                        ? event.submitter.dataset.role
                        : null;


                if (!selectedRole) {

                    loginFeedback.textContent =
                        "Please select a login role.";

                    loginFeedback.style.color =
                        "#B42318";

                    loginFeedback.hidden =
                        false;

                    return;

                }


                const username =
                    document
                        .getElementById(
                            "username"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "password"
                        )
                        .value;


                loginFeedback.hidden =
                    true;


                loginButtons.forEach(
                    function (button) {

                        button.disabled =
                            true;

                    }
                );


                try {

                    const response =
                        await fetch(
                            "/login",
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        {

                                            username:
                                                username,

                                            password:
                                                password

                                        }
                                    )

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Unable to log in."
                        );

                    }


                    // Check whether the account matches
                    // the selected portal.
                    if (
                        data.user.role !==
                        selectedRole
                    ) {

                        // End the session if the wrong
                        // portal was selected.
                        await fetch(
                            "/logout",
                            {

                                method:
                                    "POST"

                            }
                        );


                        throw new Error(
                            "This account does not match the selected role."
                        );

                    }


                    const dashboard =
                        dashboards[
                            data.user.role
                        ];


                    if (!dashboard) {

                        throw new Error(
                            "This account has an unsupported role."
                        );

                    }


                    // Go to the correct dashboard.
                    window.location.href =
                        dashboard;

                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    loginFeedback.textContent =
                        error.message;


                    loginFeedback.style.color =
                        "#B42318";


                    loginFeedback.hidden =
                        false;

                } finally {

                    loginButtons.forEach(
                        function (button) {

                            button.disabled =
                                false;

                        }
                    );

                }

            }
        );

    }
);