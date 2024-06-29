function searchTable() {
    let input, filter, table, tr, i, idTxtValue, titleTxtValue, createdByTxtValue, priorityTxtValue, categoryTxtValue,
        statusTxtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("ticketTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        let idTd = tr[i].getElementsByTagName("td")[0]; // First column (ID)
        let titleTd = tr[i].getElementsByTagName("td")[1]; // Second column (Title)
        let createdByTd = tr[i].getElementsByTagName("td")[3]; // Fourth column (Created by)
        let priorityTd = tr[i].getElementsByTagName("td")[4]; // Fifth column (Priority)
        let categoryTd = tr[i].getElementsByTagName("td")[5]; // Sixth column (Category)
        let statusTd = tr[i].getElementsByTagName("td")[6]; // Seventh column (Status)

        if (idTd || titleTd || createdByTd || priorityTd || categoryTd || statusTd) {
            idTxtValue = idTd ? idTd.textContent || idTd.innerText : "";
            titleTxtValue = titleTd ? titleTd.textContent || titleTd.innerText : "";
            createdByTxtValue = createdByTd ? createdByTd.textContent || createdByTd.innerText : "";
            priorityTxtValue = priorityTd ? priorityTd.textContent || priorityTd.innerText : "";
            categoryTxtValue = categoryTd ? categoryTd.textContent || categoryTd.innerText : "";
            statusTxtValue = statusTd ? statusTd.textContent || statusTd.innerText : "";
            if (
                idTxtValue.toUpperCase().indexOf(filter) > -1 ||
                titleTxtValue.toUpperCase().indexOf(filter) > -1 ||
                createdByTxtValue.toUpperCase().indexOf(filter) > -1 ||
                priorityTxtValue.toUpperCase().indexOf(filter) > -1 ||
                categoryTxtValue.toUpperCase().indexOf(filter) > -1 ||
                statusTxtValue.toUpperCase().indexOf(filter) > -1
            ) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterTable() {
    let titleFilter = document.getElementById("filterTitle").value.toLowerCase();
    let dateFilter = document.getElementById("filterDate").value;
    let assignedToFilter = document.getElementById("filterAssignedTo").value.toLowerCase();
    let priorityFilter = document.getElementById("filterPriority").value.toLowerCase();
    let categoryFilter = document.getElementById("filterCategory").value.toLowerCase();
    let statusFilter = document.getElementById("filterStatus").value.toLowerCase();

    let table = document.getElementById("ticketTable");
    let trs = table.getElementsByTagName("tr");

    for (let i = 1; i < trs.length; i++) {
        let tdTitle = trs[i].getElementsByTagName("td")[1];
        let tdDate = trs[i].getElementsByTagName("td")[2];
        let tdAssignedTo = trs[i].getElementsByTagName("td")[3];
        let tdPriority = trs[i].getElementsByTagName("td")[4];
        let tdCategory = trs[i].getElementsByTagName("td")[5];
        let tdStatus = trs[i].getElementsByTagName("td")[6];

        if (tdTitle && tdDate && tdAssignedTo && tdPriority && tdCategory && tdStatus) {
            let titleText = tdTitle.textContent || tdTitle.innerText;
            let dateText = tdDate.textContent || tdDate.innerText;
            let assignedToText = tdAssignedTo.textContent || tdAssignedTo.innerText;
            let priorityText = tdPriority.textContent || tdPriority.innerText;
            let categoryText = tdCategory.textContent || tdCategory.innerText;
            let statusText = tdStatus.textContent || tdStatus.innerText;

            if (
                (titleText.toLowerCase().indexOf(titleFilter) > -1 || titleFilter == "") &&
                (dateText.indexOf(dateFilter) > -1 || dateFilter == "") &&
                (assignedToText.toLowerCase().indexOf(assignedToFilter) > -1 || assignedToFilter == "") &&
                (priorityText.toLowerCase().indexOf(priorityFilter) > -1 || priorityFilter == "") &&
                (categoryText.toLowerCase().indexOf(categoryFilter) > -1 || categoryFilter == "") &&
                (statusText.toLowerCase().indexOf(statusFilter) > -1 || statusFilter == "")
            ) {
                trs[i].style.display = "";
            } else {
                trs[i].style.display = "none";
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var dropdowns = document.querySelectorAll('.filter-arrow, .dropdown-menu');
    var actionIcon = document.getElementById('actionIcon');
    var filterButton = document.getElementById('filterButton');

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('click', function (event) {
            actionIcon.style.display = 'none';
            filterButton.style.display = 'block';
            event.stopPropagation();
        });
    });

    document.addEventListener('click', function (event) {
        var isClickInsideDropdown = Array.from(dropdowns).some(function (dropdown) {
            return dropdown.contains(event.target);
        });

        if (!isClickInsideDropdown) {
            actionIcon.style.display = 'block';
            filterButton.style.display = 'none';
        }
    });
});

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
document.addEventListener('DOMContentLoaded', function () {
    var assignModal = document.getElementById('assignModal');
    assignModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var ticketId = button.getAttribute('data-ticket-id');
        var form = assignModal.querySelector('#assignForm');
        var action = form.getAttribute('action').replace('0', ticketId);
        form.setAttribute('action', action);
    });
});

function applyFilter(name, value) {
    const form = document.forms[0];
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
    }
    input.value = value;
    form.submit();
}
