function saveToLocalStorage(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const seatNumber = document.getElementById('seatNumber').value.trim();
    const messageElement = document.getElementById('emptyMessage');

    if (!username || !seatNumber) {
        messageElement.textContent = "Nothing Present";
        return;
    }

    if (localStorage.getItem(seatNumber)) {
        alert("This Seat is Already Booked");
        return;
    }

    const obj = { username, seatNumber };
    
    if(seatNumber > 0)
    {
        localStorage.setItem(seatNumber, JSON.stringify(obj));
    }

    showUserOnScreen(obj);

    document.getElementById('username').value = "";
    document.getElementById('seatNumber').value = "";

    updateTotalBooked();
    checkIfEmpty();
}

function showUserOnScreen(obj) {
    const parentElement = document.getElementById('display');
    const messageElement = document.getElementById('emptyMessage');

    messageElement.textContent = "";

    if (document.getElementById(`user-${obj.seatNumber}`)) {
        return;
    }

    const childElement = document.createElement('p');
    
    if(obj.seatNumber <= 0)
    {
        alert("Invalid Seat");
        return;
    }

    childElement.id = `user-${obj.seatNumber}`;
    childElement.textContent = `${obj.username} Seat:${obj.seatNumber}`;

    const deleteButton = document.createElement('input');
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.onclick = () => {
        localStorage.removeItem(obj.seatNumber);
        parentElement.removeChild(childElement);
        updateTotalBooked();
        checkIfEmpty();
    };

    const editButton = document.createElement('input');
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.onclick = () => {
        localStorage.removeItem(obj.seatNumber);
        parentElement.removeChild(childElement);

        document.getElementById("username").value = obj.username;
        document.getElementById("seatNumber").value = obj.seatNumber;
        updateTotalBooked();
        checkIfEmpty();
    };

    childElement.appendChild(deleteButton);
    childElement.appendChild(editButton);
    parentElement.appendChild(childElement);
    updateTotalBooked();
    checkIfEmpty();
}

window.onload = function () {
    const keys = Object.keys(localStorage);
    if (keys.length === 0) {
        document.getElementById('emptyMessage').textContent = "Nothing Present";
    } else {
        document.getElementById('emptyMessage').textContent = "";
        keys.forEach((key) => {
            const user = JSON.parse(localStorage.getItem(key));
            if (user && user.username && user.seatNumber) {
                showUserOnScreen(user);
            }
        });
    }
    updateTotalBooked();
};

function findUser() {
    const seatNumber = document.getElementById('findSeat').value.trim();
    const messageElement = document.getElementById('message');

    if (!seatNumber) {
        messageElement.textContent = "Please enter a seat number.";
        return;
    }

    const user = localStorage.getItem(seatNumber);
    if (user) {
        const userData = JSON.parse(user);
        messageElement.textContent = `User: ${userData.username}, Seat: ${userData.seatNumber}`;
    } else {
        messageElement.textContent = "No booking found for this seat.";
    }
}

function updateTotalBooked() {
    const total = Object.keys(localStorage).length;
    document.getElementById('totalBooked').textContent = `Total Booked: ${total}`;
}

function checkIfEmpty() {
    const messageElement = document.getElementById('emptyMessage');
    if (Object.keys(localStorage).length === 0) {
        messageElement.textContent = "Nothing Present";
    } else {
        messageElement.textContent = "";
    }
}
