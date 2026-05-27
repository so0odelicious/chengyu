
document.getElementById('backToStartBtn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirects back to the start page
});

document.getElementById("closeCardBtn").addEventListener("click", () => {
    document.getElementById("idiomCard").style.display = "none"; // Hide the card
    document.getElementById("overlay").style.display = "none"; // Hide the overlay
});

let currentIdiomIndex = -1; // This will hold the current index for navigation

// Function to build the idioms list
function buildIdiomsList() {
    const idiomsContainer = document.getElementById("idiomsContainer");

    // Clear the container first
    idiomsContainer.innerHTML = "";

    // Loop through the idioms array and create items
    idioms.forEach((idiom, index) => {
        // Create a div for each idiom
        const idiomItem = document.createElement("div");
        idiomItem.className = "idiom-item";  // Assign a class for styling
        idiomItem.textContent = idiom.text;  // Set the idiom text

        // Add a click event to display the idiom card
        idiomItem.addEventListener("click", () => displayIdiomCard(index));

        // Append the idiom item to the container
        idiomsContainer.appendChild(idiomItem);
    });
}

// Function to display the idiom card
function displayIdiomCard(index) {
    const idiom = idioms[index]; // Retrieve the idiom based on the index

    // Populate the idiom card with details from the selected idiom
    document.getElementById("idiomImg").src ="imgs/" + idiom.img; // Set the image source
    document.getElementById("idiomText").textContent = idiom.text; // Set the idiom text
    document.getElementById("idiomDefinition").textContent = `解釋: ${idiom.def}`; // Set the definition
    document.getElementById("idiomExample").textContent = `例句: ${idiom.ex}`; // Set the example

    // Show the card and the overlay
    document.getElementById("idiomCard").style.display = "block"; 
    document.getElementById("overlay").style.display = "block";
    currentIdiomIndex = index; // Update the current index for further navigation
}

// Function to navigate to the previous idiom
function showPreviousIdiom() {
    if (currentIdiomIndex > 0) {
        displayIdiomCard(currentIdiomIndex - 1); // Show the previous idiom
    }
}

// Function to navigate to the next idiom
function showNextIdiom() {
    if (currentIdiomIndex < idioms.length - 1) {
        displayIdiomCard(currentIdiomIndex + 1); // Show the next idiom
    }
}

// Initialize the dictionary view
function initDictionary() {
    buildIdiomsList(); // Populate the idioms list

    // Set up the event listeners for navigation buttons
    document.getElementById("prevIdiomBtn").addEventListener("click", showPreviousIdiom);
    document.getElementById("nextIdiomBtn").addEventListener("click", showNextIdiom);
    document.getElementById("closeCardBtn").addEventListener("click", () => {
        document.getElementById("idiomCard").style.display = "none"; // Hide the card
        document.getElementById("overlay").style.display = "none"; // Hide the overlay
    });


}

// Setup initialization when the page loads
document.addEventListener("DOMContentLoaded", initDictionary);
