// Sample tickets used only when the browser has no saved data yet.
const sampleTickets = [
  { id: "IT-1003", title: "Cannot connect to campus Wi-Fi", category: "Network", priority: "High", location: "Library", description: "My laptop can see the network but cannot connect.", status: "Open", date: "Sep 6, 2026", assignedTo: "Unassigned", comments: [] },
  { id: "IT-1002", title: "Printer produces blank pages", category: "Hardware", priority: "Medium", location: "Computer Lab 1", description: "The printer accepts the job but every page is blank.", status: "In Progress", date: "Sep 5, 2026", assignedTo: "Mark Santos", comments: ["The technician is checking the printer cartridge."] },
  { id: "IT-1001", title: "School email password reset", category: "Account Access", priority: "Low", location: "Online", description: "I could not access my school email.", status: "Resolved", date: "Sep 3, 2026", assignedTo: "Ana Reyes", comments: ["A password reset link was sent to the student."] }
];

let tickets = JSON.parse(localStorage.getItem("campusTickets")) || sampleTickets;

const pageSections = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");
const ticketDialog = document.querySelector("#ticketDialog");

// This is a visual demo login only. A real login will need PHP and a database.
document.querySelector("#loginForm").addEventListener("submit", event => {
  event.preventDefault();
  document.querySelector("#loginScreen").classList.add("hidden");
  showToast("Welcome to Campus IT Helpdesk.");
});

function saveTickets() {
  localStorage.setItem("campusTickets", JSON.stringify(tickets));
}

function showPage(pageId) {
  pageSections.forEach(section => section.classList.toggle("active", section.id === pageId));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.page === pageId));
  document.querySelector("#mainNav").classList.remove("open");
  document.querySelector("#menuButton").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

function createTicketHTML(ticket) {
  return `
    <article class="ticket-item">
      <span class="ticket-mark">${ticket.category.charAt(0)}</span>
      <div class="ticket-info">
        <button type="button" data-ticket-id="${ticket.id}">${ticket.title}</button>
        <small>${ticket.id} • ${ticket.category} • ${ticket.date}</small>
      </div>
      <span class="status ${statusClass(ticket.status)}">${ticket.status}</span>
    </article>`;
}

function renderTickets() {
  document.querySelector("#totalCount").textContent = tickets.length;
  document.querySelector("#openCount").textContent = tickets.filter(ticket => ticket.status === "Open").length;
  document.querySelector("#progressCount").textContent = tickets.filter(ticket => ticket.status === "In Progress").length;
  document.querySelector("#resolvedCount").textContent = tickets.filter(ticket => ticket.status === "Resolved").length;

  const recentList = document.querySelector("#recentTicketList");
  recentList.innerHTML = tickets.length ? tickets.slice(0, 3).map(createTicketHTML).join("") : '<p class="empty-state">No tickets yet.</p>';
  filterTickets();
}

function filterTickets() {
  const search = document.querySelector("#ticketSearch").value.toLowerCase();
  const status = document.querySelector("#statusFilter").value;
  const results = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search) || ticket.id.toLowerCase().includes(search);
    const matchesStatus = status === "All" || ticket.status === status;
    return matchesSearch && matchesStatus;
  });
  document.querySelector("#allTicketList").innerHTML = results.length ? results.map(createTicketHTML).join("") : '<p class="empty-state">No matching tickets found.</p>';
}

function openTicket(ticketId) {
  const ticket = tickets.find(item => item.id === ticketId);
  if (!ticket) return;

  const comments = ticket.comments.length ? ticket.comments.map(comment => `<li>${comment}</li>`).join("") : "<li>No comments yet.</li>";
  document.querySelector("#dialogContent").innerHTML = `
    <p class="eyebrow">${ticket.id}</p>
    <h2>${ticket.title}</h2>
    <p>${ticket.description}</p>
    <div class="detail-grid">
      <div><small>Status</small><strong>${ticket.status}</strong></div>
      <div><small>Priority</small><strong>${ticket.priority}</strong></div>
      <div><small>Location</small><strong>${ticket.location || "Not provided"}</strong></div>
      <div><small>Assigned to</small><strong>${ticket.assignedTo}</strong></div>
    </div>
    <label>Update status
      <select id="dialogStatus">
        <option ${ticket.status === "Open" ? "selected" : ""}>Open</option>
        <option ${ticket.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${ticket.status === "Resolved" ? "selected" : ""}>Resolved</option>
      </select>
    </label>
    <h3>Comments</h3><ul class="comments">${comments}</ul>
    <form class="comment-form" id="commentForm">
      <input id="commentText" type="text" aria-label="New comment" placeholder="Write an update" required>
      <button class="primary-button" type="submit">Add Comment</button>
    </form>`;

  document.querySelector("#dialogStatus").addEventListener("change", event => {
    ticket.status = event.target.value;
    if (ticket.status === "In Progress" && ticket.assignedTo === "Unassigned") ticket.assignedTo = "IT Support Team";
    saveTickets();
    renderTickets();
    openTicket(ticketId);
    showToast("Ticket status updated.");
  });

  document.querySelector("#commentForm").addEventListener("submit", event => {
    event.preventDefault();
    ticket.comments.push(document.querySelector("#commentText").value.trim());
    saveTickets();
    openTicket(ticketId);
    showToast("Comment added.");
  });

  if (!ticketDialog.open) ticketDialog.showModal();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

navLinks.forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  showPage(link.dataset.page);
}));

document.querySelectorAll("[data-open-form]").forEach(button => button.addEventListener("click", () => showPage("new-ticket")));
document.querySelectorAll("[data-page-button]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.pageButton)));
document.querySelector("#menuButton").addEventListener("click", () => {
  const nav = document.querySelector("#mainNav");
  nav.classList.toggle("open");
  document.querySelector("#menuButton").setAttribute("aria-expanded", nav.classList.contains("open"));
});

document.querySelector("#ticketForm").addEventListener("submit", event => {
  event.preventDefault();
  const nextNumber = Math.max(1000, ...tickets.map(ticket => Number(ticket.id.replace("IT-", "")))) + 1;
  const newTicket = {
    id: `IT-${nextNumber}`,
    title: document.querySelector("#ticketTitle").value.trim(),
    category: document.querySelector("#ticketCategory").value,
    priority: document.querySelector("#ticketPriority").value,
    location: document.querySelector("#ticketLocation").value.trim(),
    description: document.querySelector("#ticketDescription").value.trim(),
    status: "Open",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    assignedTo: "Unassigned",
    comments: []
  };
  tickets.unshift(newTicket);
  saveTickets();
  renderTickets();
  event.target.reset();
  showPage("tickets");
  showToast(`${newTicket.id} was submitted successfully.`);
});

document.addEventListener("click", event => {
  const ticketButton = event.target.closest("[data-ticket-id]");
  if (ticketButton) openTicket(ticketButton.dataset.ticketId);
});

document.querySelectorAll(".help-tip").forEach(button => button.addEventListener("click", () => {
  document.querySelector("#tipBox").textContent = button.dataset.tip;
}));

document.querySelector("#ticketSearch").addEventListener("input", filterTickets);
document.querySelector("#statusFilter").addEventListener("change", filterTickets);
document.querySelector("#closeDialog").addEventListener("click", () => ticketDialog.close());
ticketDialog.addEventListener("click", event => { if (event.target === ticketDialog) ticketDialog.close(); });

renderTickets();
