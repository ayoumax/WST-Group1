// ==========================================================================
// MotorPH IT Support - Ticket Message Thread
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    var MESSAGE_STORAGE_KEY =
        "motorphTicketMessages";

    var CURRENT_TICKET_ID =
        "TCK-1001";


    var commentForm =
        document.getElementById("employeeCommentForm");

    var commentInput =
        document.getElementById("comment");

    var messageList =
        document.getElementById("messageList");

    var commentFeedback =
        document.getElementById("commentFeedback");


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


    // Add one message to the page
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


    // Load messages for this ticket
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


    // Add new employee comment
    commentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            var commentText =
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
                    "Employee",

                text:
                    commentText,

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

});