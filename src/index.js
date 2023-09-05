// Define a global array to store questions
let questions = [];

// Function to add a new question
function addQuestion(title, description, category, complexity) {
    // Check if a question with the same title already exists
    const isDuplicate = questions.some(question => question.title === title);

    if (!isDuplicate) {
        const question = {
            id: questions.length + 1,
            title,
            description,
            category,
            complexity,
        };
        questions.push(question);
        saveData();
        displayQuestions();
    } else {
        alert('A question with the same title already exists. Please choose a different title.');
    }
}


// Function to display questions on the landing page
function displayQuestions() {
    const questionList = document.getElementById("question-list");
    questionList.innerHTML = "";

    // Create a table element
    const table = document.createElement("table");
    table.classList.add("question-table");

    // Create table header row
    const headerRow = table.insertRow(0);
    headerRow.innerHTML = "<th>ID</th><th>Title</th><th>Complexity</th><th>Category</th>";

    // Iterate through questions and add rows to the table
    questions.forEach(question => {
        const row = table.insertRow(-1);

        // Add ID column
        const idCell = row.insertCell(0);
        idCell.textContent = question.id;

        // Add Title column (make it clickable)
        const titleCell = row.insertCell(1);
        const titleLink = document.createElement("a");
        titleLink.textContent = question.title;
        titleLink.href = "#";
        titleLink.addEventListener("click", () => {
            displayQuestionDetails(question.id, question.category);
        });
        titleCell.appendChild(titleLink);

        // Add Complexity column
        const complexityCell = row.insertCell(2);
        complexityCell.textContent = question.complexity || "";

        // Add Category column
        const categoryCell = row.insertCell(3);
        categoryCell.textContent = question.category || "";

        // Add Delete button column
        const deleteCell = row.insertCell(4);
        const deleteButton = document.createElement("button");
        // Add a Font Awesome trash icon inside the button
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.classList.add("delete-button"); // Optional: Add a class for styling
        deleteButton.addEventListener("click", () => {
            deleteQuestion(question.id);
        });
        deleteCell.appendChild(deleteButton);

    });

    // Append the table to the questionList div
    questionList.appendChild(table);
}


// Function to display question details when a question is clicked
function displayQuestionDetails(id, category) {
    const question = questions.find(q => q.id === id);
    if (question) {
        const questionDetails = document.getElementById("question-details");
        // Replace newline characters with <br> tags for proper display
        const formattedDescription = question.description.replace(/\n/g, '<br>');
        questionDetails.innerHTML = `
            <h2><u>${question.title}</u></h2>
            <p>Category: ${category || "N/A"}</p>
            <p>Complexity: ${question.complexity || "N/A"}</p>
            <p>${formattedDescription}</p>
        `;
    }
}


// Function to delete a question
function deleteQuestion(id) {
  questions = questions.filter((question) => question.id !== id);
  questions.forEach((question, index) => {
    question.id = index + 1; // Assign new IDs based on the array order
    });
  saveData();
  displayQuestions();
}

// Function to save data to local storage
function saveData() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Function to load data from local storage
function loadData() {
  const data = localStorage.getItem("questions");
  if (data) {
    questions = JSON.parse(data);
  }
}

// Event listener for the add question form
document
  .getElementById("add-question-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("question-title").value;
    const description = document.getElementById("question-description").value;
    const category = document.getElementById("question-category").value;
    const complexity = document.getElementById("question-complexity").value;
    addQuestion(title, description, category, complexity);

    // Clear the form by setting input values to empty strings
    titleInput.value = "";
    descriptionInput.value = "";
    categoryInput.value = "";
    complexityInput.value = "";
  });

// Load data from local storage when the page loads
loadData();
// Display questions on page load
displayQuestions();


// TODO:
// 1. Give users the option to add images into the question description
// 2. Catergory can be a tags, selected from a dropdown list, mutiple tags can be selected e.g. Strings, Data Structures, Algorithms, etc
// 3. Option to edit questions (nice to have)
// 4. Set table width , display question width fixed (?)