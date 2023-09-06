let questions = []; //Global array to store questions
let selectedCategories = []; //Global array to store selected categories

// Function to add a new question
function addQuestion(title, description, category, complexity) {
  // Check if a question with the same title or description already exists
  const isDuplicate = questions.some(question => question.title === title || question.description === description);

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

    // Clean form fields and selected categories
    clearSelectedCategories();
    document.getElementById("question-title").value = "";
    document.getElementById("question-description").value = "";
    document.getElementById("question-complexity").selectedIndex = 0; //Set default value to Easy
    selectedCategories = [];
  } else {
    alert('A question with the same title/description already exists. Please choose a different title/description.');
  }
}

// Function to display questions on right column of page
function displayQuestions() {
  const questionList = document.getElementById("question-list");

  questionList.innerHTML = "";

  // Create a question table element
  const questionTable = document.createElement("table");
  questionTable.classList.add("question-table");

  // Table header
  const headerRow = questionTable.insertRow(0);
  headerRow.innerHTML = "<th>ID</th><th>Title</th><th>Complexity</th><th>Category</th>";

  // Iterate through questions and add rows to the table
  questions.forEach(question => {
    const row = questionTable.insertRow(-1);

    // ID column
    const idCell = row.insertCell(0);
    idCell.textContent = question.id;

    // Clickable title column (to view question details)
    const titleCell = row.insertCell(1);
    const titleLink = document.createElement("a");
    titleLink.textContent = question.title;
    titleLink.href = "#";
    titleLink.addEventListener("click", () => {
      displayQuestionDetails(question.id, question.category);
    });
    titleCell.appendChild(titleLink);

    // Category column
    const categoryCell = row.insertCell(2);
    categoryCell.textContent = question.category || "";

    // Complexity column
    const complexityCell = row.insertCell(3);
    complexityCell.textContent = question.complexity || "";

    // Delete question column
    const deleteCell = row.insertCell(4);
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      deleteQuestion(question.id);
    });
    deleteCell.appendChild(deleteButton);
  });

  questionList.appendChild(questionTable);
}

// Function to display question details when a question title is clicked
function displayQuestionDetails(id, category) {
  const question = questions.find(q => q.id === id);
  if (question) {
    const questionDetails = document.getElementById("question-details");
    const formattedDescription = question.description.replace(/\n/g, '<br>');
    questionDetails.innerHTML = `
            <h2><u>${question.title}</u></h2>
            <p>Category: ${category || "N/A"}</p>
            <p>Complexity: ${question.complexity || "N/A"}</p>
            <p>${formattedDescription}</p>
        `;
  }
}

// Function to generate question catgory options dynamically
function generateCategoryOptions() {
  const categoryOptions = document.getElementById("category-options");
  const categories = ["String", "Algorithms", "Data Structures", "Bit Manipulation", "Recursion", "Databases", "Arrays", "Brainteaser"];

  categories.forEach((category) => {
    const optionDiv = document.createElement("div");
    optionDiv.innerHTML = `
          <input type="checkbox" value="${category}" /> ${category}
      `;
    categoryOptions.appendChild(optionDiv);
  });
}

generateCategoryOptions();

// Function to handle multi-select dropdown behavior for category options
function handleCustomSelect() {
  const select = document.getElementById("question-category");
  const selected = select.querySelector(".select-selected");
  const items = select.querySelector(".select-items");
  const checkboxes = items.querySelectorAll("input[type='checkbox']");

  selected.addEventListener("click", function () {
    items.style.display = items.style.display === "block" ? "none" : "block";
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateSelectedCategories();
    });
  });

  // Event listener to the document body to close dropdown when clicked outside
  document.body.addEventListener("click", function (e) {
    if (!select.contains(e.target)) {
      items.style.display = "none";
    }
  });

  function updateSelectedCategories() {
    selectedCategories = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedCategories.push(checkbox.value);
      }
    });
    selected.textContent = selectedCategories.length === 0 ? "Select categories" : selectedCategories.join(", ");
  }

  //Function to clear selection
  clearSelectedCategories = function () {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    selected.textContent = "Select categories";
  };
}

handleCustomSelect();


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

    // Check if at least one category is selected before adding question
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const title = document.getElementById("question-title").value;
    const description = document.getElementById("question-description").value;
    const category = selectedCategories.join(", ");
    const complexity = document.getElementById("question-complexity").value;
    addQuestion(title, description, category, complexity);

  });

loadData();
displayQuestions();
