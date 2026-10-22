// =========================================================
// MotorPH IT Support - Employee Ticket Details
// Backend-supported ticket messaging
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const ticketHeadingId = document.getElementById("ticketHeadingId");
    const ticketHeadingSubject = document.getElementById("ticketHeadingSubject");
    const ticketId = document.getElementById("ticketId");
    const ticketCategory = document.getElementById("ticketCategory");
    const ticketPriority = document.getElementById("ticketPriority");
    const ticketStatus = document.getElementById("ticketStatus");
    const ticketSubmitted = document.getElementById("ticketSubmitted");
    const ticketTechnician = document.getElementById("ticketTechnician");
    const ticketDescription = document.getElementById("ticketDescription");
    const ticketLoadMessage = document.getElementById("ticketLoadMessage");
    const messageList = document.getElementById("messageList");
    const noMessagesMessage = document.getElementById("noMessagesMessage");
    const commentForm = document.getElementById("employeeCommentForm");
    const commentInput = document.getElementById("comment");
    const commentFeedback = document.getElementById("commentFeedback");

    const queryParameters = new URLSearchParams(window.location.search);
    const currentTicketId = queryParameters.get("id");

    function getStatusClass(status) {
        if (status === "in-progress") {
            return "progress";
        }

        if (status === "resolved") {
            return "resolved";
        }

        if (status === "closed") {
            return "closed";
        }

        return "open";
    }

    function displayMessage(message) {
        const messageItem = document.createElement("li");
        const sender = document.createElement("strong");
        const messageText = document.createElement("span");

        sender.textContent =
            message.sender ||
            (message.senderRole === "technician"
                ? "IT Technician"
                : message.senderRole === "admin"
                    ? "Administrator"
                    : "Employee");

        messageText.textContent = " " + (message.text || "");

        messageItem.appendChild(sender);
        messageItem.appendChild(messageText);

        let displayTime = message.time || "";

        if (!displayTime && message.createdAt) {
            const createdDate = new Date(message.createdAt);

            if (!Number.isNaN(createdDate.getTime())) {
                displayTime = createdDate.toLocaleString();
            }
        }

        if (displayTime) {
            const timeText = document.createElement("small");
            timeText.textContent = " - " + displayTime;
            timeText.style.marginLeft = "8px";
            timeText.style.color = "var(--text-muted)";
            messageItem.appendChild(timeText);
        }

        messageList.appendChild(messageItem);
    }

    function displayMessages(messages) {
        messageList.innerHTML = "";

        if (!Array.isArray(messages) || messages.length === 0) {
            noMessagesMessage.hidden = false;
            return;
        }

        noMessagesMessage.hidden = true;

        messages.forEach(function (message) {
            displayMessage(message);
        });
    }

    function displayTicket(ticket) {
        ticketHeadingId.textContent = "Ticket " + (ticket.id || "-");
        ticketHeadingSubject.textContent = ticket.subject || "No subject";

        ticketId.textContent = ticket.id || "-";

        ticketCategory.textContent =
            ticket.categoryText ||
            ticket.category ||
            "-";

        ticketPriority.textContent =
            ticket.priorityText ||
            ticket.priority ||
            "-";

        ticketStatus.textContent =
            ticket.statusText ||
            ticket.status ||
            "-";

        ticketStatus.className =
            "status " +
            getStatusClass(ticket.status);

        ticketSubmitted.textContent =
            ticket.submitted || "-";

        ticketTechnician.textContent =
            ticket.assignedTech ||
            ticket.technician ||
            "Unassigned";

        ticketDescription.textContent =
            ticket.description ||
            "No description provided.";
    }

    async function loadTicket() {

        if (!currentTicketId) {
            ticketLoadMessage.textContent =
                "No ticket ID was provided. Please return to My Tickets and open a ticket again.";

            ticketLoadMessage.style.color =
                "#B91C1C";

            ticketLoadMessage.hidden =
                false;

            return;
        }

        ticketLoadMessage.textContent =
            "Loading ticket...";

        ticketLoadMessage.hidden =
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

                ticketLoadMessage.textContent =
                    data.message ||
                    "Unable to load ticket.";

                ticketLoadMessage.style.color =
                    "#B91C1C";

                ticketLoadMessage.hidden =
                    false;

                return;
            }

            ticketLoadMessage.hidden =
                true;

            displayTicket(
                data.ticket
            );

        } catch (error) {

            console.error(
                "Error loading ticket:",
                error
            );

            ticketLoadMessage.textContent =
                "Unable to connect to the server.";

            ticketLoadMessage.style.color =
                "#B91C1C";

            ticketLoadMessage.hidden =
                false;
        }
    }

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

    commentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const commentText =
                commentInput.value.trim();

            if (commentText === "") {

                commentFeedback.textContent =
                    "Please enter a comment.";

                commentFeedback.style.color =
                    "#B91C1C";

                commentFeedback.hidden =
                    false;

                return;
            }

            if (!currentTicketId) {

                commentFeedback.textContent =
                    "Unable to identify this ticket. Please return to My Tickets and open a ticket again.";

                commentFeedback.style.color =
                    "#B91C1C";

                commentFeedback.hidden =
                    false;

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
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    text:
                                        commentText
                                })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    commentFeedback.textContent =
                        data.message ||
                        "Unable to send message.";

                    commentFeedback.style.color =
                        "#B91C1C";

                    commentFeedback.hidden =
                        false;

                    return;
                }

                commentInput.value =
                    "";

                commentFeedback.textContent =
                    "Comment added successfully.";

                commentFeedback.style.color =
                    "#166534";

                commentFeedback.hidden =
                    false;

                await loadMessages();

            } catch (error) {

                console.error(
                    "Error sending message:",
                    error
                );

                commentFeedback.textContent =
                    "Unable to connect to the server.";

                commentFeedback.style.color =
                    "#B91C1C";

                commentFeedback.hidden =
                    false;
            }
        }
    );

    loadTicket();
    loadMessages();
});