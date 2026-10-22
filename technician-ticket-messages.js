// =========================================================
// MotorPH IT Support - Technician Ticket Details
// Backend-supported ticket messaging
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const headingId =
        document.getElementById(
            "technicianTicketHeadingId"
        );

    const headingSubject =
        document.getElementById(
            "technicianTicketHeadingSubject"
        );

    const employeeText =
        document.getElementById(
            "technicianTicketEmployee"
        );

    const departmentText =
        document.getElementById(
            "technicianTicketDepartment"
        );

    const categoryText =
        document.getElementById(
            "technicianTicketCategory"
        );

    const priorityText =
        document.getElementById(
            "technicianTicketPriority"
        );

    const statusText =
        document.getElementById(
            "technicianTicketStatus"
        );

    const ticketIdText =
        document.getElementById(
            "technicianTicketId"
        );

    const descriptionText =
        document.getElementById(
            "technicianTicketDescription"
        );

    const loadMessage =
        document.getElementById(
            "technicianTicketLoadMessage"
        );

    const statusForm =
        document.getElementById(
            "technicianStatusForm"
        );

    const statusSelect =
        document.getElementById(
            "technicianStatusSelect"
        );

    const statusFeedback =
        document.getElementById(
            "technicianStatusFeedback"
        );

    const messageList =
        document.getElementById(
            "technicianMessageList"
        );

    const noMessages =
        document.getElementById(
            "technicianNoMessages"
        );

    const messageForm =
        document.getElementById(
            "technicianMessageForm"
        );

    const messageInput =
        document.getElementById(
            "technicianMessageInput"
        );

    const queryParameters =
        new URLSearchParams(
            window.location.search
        );

    const currentTicketId =
        queryParameters.get("id");

    let currentTicket = null;


    // ==================================================
    // DISPLAY ONE MESSAGE
    // ==================================================

    function displayMessage(message) {

        const messageItem =
            document.createElement("li");

        const sender =
            document.createElement("strong");

        sender.textContent =
            message.sender ||
            (
                message.senderRole === "technician"
                    ? "IT Technician"
                    : message.senderRole === "admin"
                        ? "Administrator"
                        : "Employee"
            );

        const messageText =
            document.createElement("span");

        messageText.textContent =
            " " +
            (message.text || "");

        messageItem.appendChild(
            sender
        );

        messageItem.appendChild(
            messageText
        );

        let displayTime =
            message.time || "";

        if (
            !displayTime &&
            message.createdAt
        ) {

            const createdDate =
                new Date(
                    message.createdAt
                );

            if (
                !Number.isNaN(
                    createdDate.getTime()
                )
            ) {

                displayTime =
                    createdDate.toLocaleString();

            }
        }

        if (displayTime) {

            const timeText =
                document.createElement("small");

            timeText.textContent =
                " - " +
                displayTime;

            timeText.style.marginLeft =
                "8px";

            timeText.style.color =
                "var(--text-muted)";

            messageItem.appendChild(
                timeText
            );
        }

        messageList.appendChild(
            messageItem
        );
    }


    // ==================================================
    // DISPLAY ALL SERVER MESSAGES
    // ==================================================

    function displayMessages(messages) {

        messageList.innerHTML = "";

        if (
            !Array.isArray(messages) ||
            messages.length === 0
        ) {

            noMessages.hidden =
                false;

            return;
        }

        noMessages.hidden =
            true;

        messages.forEach(
            function (message) {

                displayMessage(
                    message
                );

            }
        );
    }


    // ==================================================
    // DISPLAY TICKET INFORMATION
    // ==================================================

    function displayTicket(ticket) {

        headingId.textContent =
            "Ticket " +
            (ticket.id || "-");

        headingSubject.textContent =
            ticket.subject ||
            "No subject";

        employeeText.textContent =
            ticket.employeeName ||
            ticket.submittedBy ||
            "Employee";

        departmentText.textContent =
            ticket.department ||
            "-";

        categoryText.textContent =
            ticket.categoryText ||
            ticket.category ||
            "-";

        priorityText.textContent =
            ticket.priorityText ||
            ticket.priority ||
            "-";

        statusText.textContent =
            ticket.statusText ||
            ticket.status ||
            "-";

        ticketIdText.textContent =
            ticket.id ||
            "-";

        descriptionText.textContent =
            ticket.description ||
            "No description provided.";

        statusSelect.value =
            ticket.status ||
            "open";
    }


    // ==================================================
    // LOAD TICKET FROM SERVER
    // ==================================================

    async function loadTicket() {

        if (!currentTicketId) {

            loadMessage.textContent =
                "No ticket ID was provided.";

            loadMessage.style.color =
                "#B91C1C";

            loadMessage.hidden =
                false;

            return;
        }

        loadMessage.textContent =
            "Loading ticket...";

        loadMessage.hidden =
            false;

        try {

            const response =
                await fetch(
                    "/tickets/" +
                    encodeURIComponent(
                        currentTicketId
                    )
                );

            const data =
                await response.json();

            if (!response.ok) {

                loadMessage.textContent =
                    data.message ||
                    "Unable to load ticket.";

                loadMessage.style.color =
                    "#B91C1C";

                loadMessage.hidden =
                    false;

                return;
            }

            currentTicket =
                data.ticket;

            loadMessage.hidden =
                true;

            displayTicket(
                currentTicket
            );

        } catch (error) {

            console.error(
                "Error loading technician ticket:",
                error
            );

            loadMessage.textContent =
                "Unable to connect to the server.";

            loadMessage.style.color =
                "#B91C1C";

            loadMessage.hidden =
                false;
        }
    }


    // ==================================================
    // LOAD MESSAGES FROM BACKEND
    // ==================================================

    async function loadMessages() {

        if (!currentTicketId) {
            return;
        }

        try {

            const response =
                await fetch(
                    "/tickets/" +
                    encodeURIComponent(
                        currentTicketId
                    ) +
                    "/messages"
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(
                    data.message ||
                    "Unable to load messages."
                );

                return;
            }

            displayMessages(
                data.messages
            );

        } catch (error) {

            console.error(
                "Error loading ticket messages:",
                error
            );
        }
    }


    // ==================================================
    // STATUS FORM
    // ==================================================
    // Status update remains frontend-only for now.
    // Another team member is handling the backend
    // ticket-status feature.
    // ==================================================

    statusForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            if (!currentTicket) {
                return;
            }

            currentTicket.status =
                statusSelect.value;

            if (
                statusSelect.value ===
                "in-progress"
            ) {

                currentTicket.statusText =
                    "In Progress";

            } else if (
                statusSelect.value ===
                "resolved"
            ) {

                currentTicket.statusText =
                    "Resolved";

            } else if (
                statusSelect.value ===
                "closed"
            ) {

                currentTicket.statusText =
                    "Closed";

            } else {

                currentTicket.statusText =
                    "Open";
            }

            statusText.textContent =
                currentTicket.statusText;

            statusFeedback.textContent =
                "Status updated on this page.";

            statusFeedback.style.color =
                "#166534";

            statusFeedback.hidden =
                false;
        }
    );


    // ==================================================
    // SEND TECHNICIAN MESSAGE TO BACKEND
    // ==================================================

    messageForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const messageText =
                messageInput.value.trim();

            if (messageText === "") {
                return;
            }

            if (!currentTicketId) {
                return;
            }

            try {

                const response =
                    await fetch(
                        "/tickets/" +
                        encodeURIComponent(
                            currentTicketId
                        ) +
                        "/messages",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    text:
                                        messageText
                                })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        data.message ||
                        "Unable to send message."
                    );

                    alert(
                        data.message ||
                        "Unable to send message."
                    );

                    return;
                }

                messageInput.value =
                    "";

                await loadMessages();

            } catch (error) {

                console.error(
                    "Error sending technician message:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );
            }
        }
    );


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    loadTicket();
    loadMessages();

});