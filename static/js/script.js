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

document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const deleteModal = document.getElementById('deleteModal');
    const deleteForm = document.getElementById('deleteForm');
    const deleteTicketId = document.getElementById('deleteTicketId');

    deleteButtons.forEach(function (button) {
      button.addEventListener('click', function () {
          const ticketId = this.getAttribute('data-ticket-id');
          deleteTicketId.value = ticketId;
        deleteForm.action = `/ticket/delete-ticket/${ticketId}/`; // Set the correct URL for the form action
      });
    });
  });

//assign modal
document.addEventListener('DOMContentLoaded', function() {
  var assignModal = document.getElementById('assignModal');
  assignModal.addEventListener('show.bs.modal', function(event) {
    var button = event.relatedTarget;
    var ticketId = button.getAttribute('data-ticket-id');
    var form = assignModal.querySelector('#assignForm');
    var action = form.getAttribute('action').replace('0', ticketId);
    form.setAttribute('action', action);
  });
});


