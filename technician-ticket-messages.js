// ==========================================================================
// MotorPH IT Support - Technician Message Thread
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    var MESSAGE_STORAGE_KEY =
        "motorphTicketMessages";

    var CURRENT_TICKET_ID =
        "TCK-1001";


    var ticketPanel =
        document.getElementById("tck-1001");

    if (!ticketPanel) {
        return;
    }


    var messageList =
        ticketPanel.querySelector(".message-list");

    var messageInput =
        document.getElementById("message-1001");

    var messageForm =
        messageInput.closest("form");


    // Get saved messages
    function getSavedMessages() {

        var savedMessages =
            localStorage.getItem(MESSAGE_STORAGE_KEY);

        if (savedMessages === null) {
            return [];
        }

        return JSON.parse(savedMessages);

    }


    // Save messages
    function saveMessages(messages) {

        localStorage.setItem(
            MESSAGE_STORAGE_KEY,
            JSON.stringify(messages)
        );

    }


    // Show a message on the page
    function displayMessage(message) {

        var messageItem =
            document.createElement("li");

        var sender =
            document.createElement("strong");

        sender.textContent =
            message.sender;


        var messageText =
            document.createElement("span");

        messageText.textContent =
            " " + message.text;


        messageItem.appendChild(
            sender
        );

        messageItem.appendChild(
            messageText
        );


        if (message.time) {

            var timeText =
                document.createElement("small");

            timeText.textContent =
                " - " + message.time;

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


    // Load saved messages for TCK-1001
    var savedMessages =
        getSavedMessages();


    for (
        var i = 0;
        i < savedMessages.length;
        i++
    ) {

        if (
            savedMessages[i].ticketId ===
            CURRENT_TICKET_ID
        ) {

            displayMessage(
                savedMessages[i]
            );

        }

    }


    // Technician sends a reply
    messageForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            var messageText =
                messageInput.value.trim();


            if (messageText === "") {
                return;
            }


            var now =
                new Date();


            var timeText =
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            var newMessage = {

                ticketId:
                    CURRENT_TICKET_ID,

                sender:
                    "IT Technician",

                text:
                    messageText,

                time:
                    timeText

            };


            var messages =
                getSavedMessages();


            messages.push(
                newMessage
            );


            saveMessages(
                messages
            );


            displayMessage(
                newMessage
            );


            messageInput.value =
                "";

        }
    );

});