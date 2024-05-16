function searchTable() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("ticketTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1]; // Numărul coloanei
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterTickets(status) {
    let table, tr, i, ticketStatus;
    table = document.getElementById("ticketTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        // Get the status of the ticket from the data-status attribute
        ticketStatus = tr[i].getAttribute("data-status");
        if (ticketStatus) {
            // Convert to lowercase for comparison
            ticketStatus = ticketStatus.toLowerCase();
            // Show or hide the row based on the selected status
            if (status === 'all' || ticketStatus === status) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}