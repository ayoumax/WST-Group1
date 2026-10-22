// ==========================================================================
// MotorPH IT Support - Technician Ticket Details
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const MESSAGE_STORAGE_KEY =
            "motorphTicketMessages";


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
        // GET SAVED LOCAL MESSAGES
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
        // DISPLAY MESSAGES
        // ==================================================

        function displayMessages(serverMessages) {

            messageList.innerHTML = "";


            const allMessages = [];


            if (
                Array.isArray(serverMessages)
            ) {

                serverMessages.forEach(
                    function (message) {

                        allMessages.push(
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

                        allMessages.push(
                            message
                        );

                    }

                }
            );


            if (allMessages.length === 0) {

                noMessages.hidden =
                    false;

                return;

            }


            noMessages.hidden =
                true;


            allMessages.forEach(
                function (message) {

                    displayMessage(
                        message
                    );

                }
            );

        }


        // ==================================================
        // DISPLAY TICKET
        // ==================================================

        function displayTicket(ticket) {

            headingId.textContent =
                "Ticket " +
                ticket.id;


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


            displayMessages(
                ticket.messages
            );

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
        // STATUS FORM
        // ==================================================
        // Your current backend does not yet have a route
        // for updating ticket status, so this remains a
        // frontend-only interaction for now.
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
        // TECHNICIAN MESSAGE
        // ==================================================

        messageForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const messageText =
                    messageInput.value.trim();


                if (messageText === "") {
                    return;
                }


                if (!currentTicketId) {
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
                        "IT Technician",

                    senderRole:
                        "technician",

                    text:
                        messageText,

                    time:
                        timeText

                };


                const savedMessages =
                    getSavedMessages();


                savedMessages.push(
                    newMessage
                );


                saveMessages(
                    savedMessages
                );


                noMessages.hidden =
                    true;


                displayMessage(
                    newMessage
                );


                messageInput.value =
                    "";

            }
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadTicket();

    }
);