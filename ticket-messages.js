// ==========================================================================
// MotorPH IT Support - Employee Ticket Details
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const MESSAGE_STORAGE_KEY =
            "motorphTicketMessages";


        const ticketHeadingId =
            document.getElementById(
                "ticketHeadingId"
            );

        const ticketHeadingSubject =
            document.getElementById(
                "ticketHeadingSubject"
            );

        const ticketId =
            document.getElementById(
                "ticketId"
            );

        const ticketCategory =
            document.getElementById(
                "ticketCategory"
            );

        const ticketPriority =
            document.getElementById(
                "ticketPriority"
            );

        const ticketStatus =
            document.getElementById(
                "ticketStatus"
            );

        const ticketSubmitted =
            document.getElementById(
                "ticketSubmitted"
            );

        const ticketTechnician =
            document.getElementById(
                "ticketTechnician"
            );

        const ticketDescription =
            document.getElementById(
                "ticketDescription"
            );

        const ticketLoadMessage =
            document.getElementById(
                "ticketLoadMessage"
            );

        const messageList =
            document.getElementById(
                "messageList"
            );

        const noMessagesMessage =
            document.getElementById(
                "noMessagesMessage"
            );

        const commentForm =
            document.getElementById(
                "employeeCommentForm"
            );

        const commentInput =
            document.getElementById(
                "comment"
            );

        const commentFeedback =
            document.getElementById(
                "commentFeedback"
            );


        // ==================================================
        // GET TICKET ID FROM URL
        // ==================================================

        const queryParameters =
            new URLSearchParams(
                window.location.search
            );


        const currentTicketId =
            queryParameters.get("id");


        // ==================================================
        // STATUS CLASS
        // ==================================================

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


        // ==================================================
        // GET LOCAL MESSAGES
        // ==================================================

        function getSavedMessages() {

            const savedMessages =
                localStorage.getItem(
                    MESSAGE_STORAGE_KEY
                );


            if (savedMessages === null) {
                return [];
            }


            try {

                return JSON.parse(
                    savedMessages
                );

            } catch (error) {

                console.error(
                    "Unable to read saved messages:",
                    error
                );

                return [];

            }

        }


        // ==================================================
        // SAVE LOCAL MESSAGES
        // ==================================================

        function saveMessages(messages) {

            localStorage.setItem(
                MESSAGE_STORAGE_KEY,
                JSON.stringify(messages)
            );

        }


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


            if (message.time) {

                const timeText =
                    document.createElement("small");


                timeText.textContent =
                    " - " +
                    message.time;


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
        // DISPLAY MESSAGE THREAD
        // ==================================================

        function displayMessages(serverMessages) {

            messageList.innerHTML = "";


            const messagesToDisplay = [];


            if (
                Array.isArray(
                    serverMessages
                )
            ) {

                serverMessages.forEach(
                    function (message) {

                        messagesToDisplay.push(
                            message
                        );

                    }
                );

            }


            const savedMessages =
                getSavedMessages();


            savedMessages.forEach(
                function (message) {

                    if (
                        message.ticketId ===
                        currentTicketId
                    ) {

                        messagesToDisplay.push(
                            message
                        );

                    }

                }
            );


            if (
                messagesToDisplay.length === 0
            ) {

                noMessagesMessage.hidden =
                    false;

                return;

            }


            noMessagesMessage.hidden =
                true;


            messagesToDisplay.forEach(
                function (message) {

                    displayMessage(
                        message
                    );

                }
            );

        }


        // ==================================================
        // DISPLAY TICKET DETAILS
        // ==================================================

        function displayTicket(ticket) {

            ticketHeadingId.textContent =
                "Ticket " +
                ticket.id;


            ticketHeadingSubject.textContent =
                ticket.subject ||
                "No subject";


            ticketId.textContent =
                ticket.id ||
                "-";


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
                getStatusClass(
                    ticket.status
                );


            ticketSubmitted.textContent =
                ticket.submitted ||
                "-";


            ticketTechnician.textContent =
                ticket.assignedTech ||
                ticket.technician ||
                "Unassigned";


            ticketDescription.textContent =
                ticket.description ||
                "No description provided.";


            displayMessages(
                ticket.messages
            );

        }


        // ==================================================
        // LOAD TICKET FROM SERVER
        // ==================================================

        async function loadTicket() {

            if (!currentTicketId) {

                ticketLoadMessage.textContent =
                    "No ticket ID was provided.";

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


        // ==================================================
        // ADD EMPLOYEE COMMENT
        // ==================================================

        commentForm.addEventListener(
            "submit",
            function (event) {

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
                        "Unable to identify this ticket.";

                    commentFeedback.style.color =
                        "#B91C1C";

                    commentFeedback.hidden =
                        false;

                    return;

                }


                const now =
                    new Date();


                const timeText =
                    now.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                const newMessage = {

                    ticketId:
                        currentTicketId,

                    sender:
                        "Employee",

                    senderRole:
                        "employee",

                    text:
                        commentText,

                    time:
                        timeText

                };


                const messages =
                    getSavedMessages();


                messages.push(
                    newMessage
                );


                saveMessages(
                    messages
                );


                noMessagesMessage.hidden =
                    true;


                displayMessage(
                    newMessage
                );


                commentInput.value =
                    "";


                commentFeedback.textContent =
                    "Comment added successfully.";

                commentFeedback.style.color =
                    "#166534";

                commentFeedback.hidden =
                    false;

            }
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadTicket();

    }
);