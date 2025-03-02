const API_URL = "https://crudcrud.com/api/999xc2w515ec315vb32jc8146584tu1r/seat";

// Save Booking (POST)
function saveToApi(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const seatNumber = document.getElementById("seatNumber").value.trim();

    if (!username || !seatNumber || seatNumber <= 0) {
        alert("Invalid details. Please enter a valid username or seat number.");
        return;
    }

    // First, check if the seat number is already booked
    axios.get(API_URL)
        .then(response => {
            const existingBooking = response.data.find(booking => booking.seatNumber === seatNumber);

            if (existingBooking) {
                alert(`Seat ${seatNumber} is already booked by ${existingBooking.username}. Choose another seat.`);
            } else {
                // If seat is available, proceed with booking
                const booking = { 
                    username, 
                    seatNumber 
                };

                axios.post(API_URL, booking)
                    .then(res => {
                        console.log("Data sent successfully:", res.data);
                        displayUserOnScreen(res.data);
                        updateTotalBooked();
                    })
                    .catch(error => {
                        console.error("Error sending data:", error);
                        alert("Failed to save booking");
                    });
            }
        })
        .catch(error => console.error("Error checking existing bookings:", error));
}



// Display Booking on Screen
function displayUserOnScreen(userDetails) {
    const parentElement = document.getElementById("display");
    document.getElementById("emptyMessage").textContent = "";

    const bookingElement = document.createElement("p");
    bookingElement.id = `booking-${userDetails._id}`;
    bookingElement.textContent = `${userDetails.username} Seat: ${userDetails.seatNumber}`;

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteBooking(userDetails._id, bookingElement);

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editBooking(userDetails);

    bookingElement.appendChild(deleteBtn);
    bookingElement.appendChild(editBtn);
    parentElement.appendChild(bookingElement);
    updateTotalBooked();
}

// Fetch All Bookings on Page Load (GET)
window.addEventListener("DOMContentLoaded", () => {
    axios.get(API_URL)
        .then(response => {
            if (response.data.length === 0) {
                document.getElementById("emptyMessage").textContent = "Nothing Present";
            } else {
                document.getElementById("emptyMessage").textContent = "";
                response.data.forEach(displayUserOnScreen);
            }
            updateTotalBooked();
        })
        .catch(error => console.error("Error Fetching Bookings:", error));
});

// Delete Booking (DELETE)
function deleteBooking(id, element) {
    axios.delete(`${API_URL}/${id}`)
        .then(() => {
            element.remove();
            updateTotalBooked();
        })
        .catch(error => console.error("Error Deleting Booking:", error));
}

// Edit Booking (PUT)
function editBooking(userDetails) {
    document.getElementById("username").value = userDetails.username;
    document.getElementById("seatNumber").value = userDetails.seatNumber;

    deleteBooking(userDetails._id, document.getElementById(`booking-${userDetails._id}`));
}

// Find User by Seat Number
function findUser() {
    const seatNumber = document.getElementById("findSeat").value.trim();
    const messageElement = document.getElementById("message");

    axios.get(API_URL)
        .then(response => {
            const foundUser = response.data.find(b => b.seatNumber === seatNumber);
            if (foundUser) {
                messageElement.textContent = `User: ${foundUser.username}, Seat: ${foundUser.seatNumber}`;
            } else {
                messageElement.textContent = "No booking found for this seat.";
            }
        })
        .catch(error => console.error("Error Finding User:", error));
}

// Update Total Booked Seats
function updateTotalBooked() {
    axios.get(API_URL)
        .then(response => {
            document.getElementById("totalBooked").textContent = `Total Booked: ${response.data.length}`;
        })
        .catch(error => console.error("Error Updating Total:", error));
}

// Attach event listeners
document.getElementById("post-btn").addEventListener("click", saveToApi);
document.getElementById("get-btn").addEventListener("click", findUser);
