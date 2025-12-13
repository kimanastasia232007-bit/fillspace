// ===== PROGRESS / UNLOCK SETTINGS =====
const TOTAL_LEVELS      = 12;                // всего уровней
const PASS_SCORE        = 5;                 // минимум правильных ответов для прохождения
const STORAGE_KEY_LEVEL = "galaxy_unlocked_level";

let currentCardId = null;                    // id текущей карточки, например "game-3"

// ===== QUIZZES =====

const quizzes = {
  "game-1": {
    title: "Level 1: Python Basics",
    questions: [
      { type: "mc", text: "Which symbol starts a comment in Python?", options: ["//", "#", "/* */", "--"], correctIndex: 1 },
      { type: "mc", text: "Which function prints text on the screen?", options: ["echo()", "show()", "print()", "display()"], correctIndex: 2 },
      { type: "mc", text: "Which file extension is used for Python files?", options: [".py", ".js", ".html", ".txt"], correctIndex: 0 },
      { type: "mc", text: "Which data type stores True/False values?", options: ["int", "str", "bool", "list"], correctIndex: 2 },
      { type: "mc", text: "What does int(\"5\") return?", options: ["\"5\"", "5", "Error", "0"], correctIndex: 1 },
      { type: "tf", text: "Python is a high-level programming language.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "Python code can run without correct indentation.", options: ["True", "False"], correctIndex: 1 },
      { type: "tf", text: "The expression 3 + 4 * 2 equals 11 in Python.", options: ["True", "False"], correctIndex: 0 }
    ]
  },

  "game-2": {
    title: "Level 2: Data Types & Structures",
    questions: [
      { type: "mc", text: "Which of these is a list in Python?", options: ["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "\"1,2,3\""], correctIndex: 1 },
      { type: "mc", text: "Which of these is immutable?", options: ["list", "set", "tuple", "dict"], correctIndex: 2 },
      { type: "mc", text: "Which type stores key–value pairs?", options: ["list", "tuple", "dict", "set"], correctIndex: 2 },
      { type: "mc", text: "What is the type of 3.14 in Python?", options: ["int", "float", "str", "bool"], correctIndex: 1 },
      { type: "mc", text: "Which function converts a value to a string?", options: ["int()", "str()", "float()", "bool()"], correctIndex: 1 },
      { type: "tf", text: "Strings in Python are immutable.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "Sets can contain duplicate values.", options: ["True", "False"], correctIndex: 1 },
      { type: "tf", text: "A tuple can be used as a key in a dictionary.", options: ["True", "False"], correctIndex: 0 }
    ]
  },

  "game-3": {
    title: "Level 3: Conditions & Loops",
    questions: [
      { type: "mc", text: "Which keyword starts a conditional statement?", options: ["if", "when", "case", "switch"], correctIndex: 0 },
      { type: "mc", text: "Which keyword starts a for-loop?", options: ["loop", "for", "each", "repeat"], correctIndex: 1 },
      { type: "mc", text: "Which keyword stops the loop immediately?", options: ["exit", "stop", "break", "quit"], correctIndex: 2 },
      { type: "mc", text: "What does range(3) generate?", options: ["0,1,2", "1,2,3", "1,2", "3,2,1"], correctIndex: 0 },
      { type: "mc", text: "Which keyword skips to the next loop iteration?", options: ["skip", "continue", "pass", "next"], correctIndex: 1 },
      { type: "tf", text: "A while loop can run forever if its condition is always True.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "Every for-loop must have a break statement.", options: ["True", "False"], correctIndex: 1 },
      { type: "tf", text: "You can nest if-statements inside loops in Python.", options: ["True", "False"], correctIndex: 0 }
    ]
  },

  "game-4": {
    title: "Level 4: Functions & Modules",
    questions: [
      { type: "mc", text: "Which keyword defines a function?", options: ["function", "def", "lambda", "make"], correctIndex: 1 },
      { type: "mc", text: "How do you call a function named greet?", options: ["greet", "call greet", "greet()", "run greet"], correctIndex: 2 },
      { type: "mc", text: "Which keyword returns a value from a function?", options: ["send", "yield", "return", "back"], correctIndex: 2 },
      { type: "mc", text: "Where do we usually put import statements?", options: ["At the end of the file", "Inside print()", "At the top of the file", "Only in loops"], correctIndex: 2 },
      { type: "mc", text: "What does \"import math\" do?", options: ["Imports the math module", "Calculates pi", "Opens a calculator", "Nothing"], correctIndex: 0 },
      { type: "tf", text: "A function can have more than one parameter.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "If a function has no return statement, it returns None.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "You cannot import your own Python files as modules.", options: ["True", "False"], correctIndex: 1 }
    ]
  },

  "game-5": {
    title: "Level 5: Files & Errors",
    questions: [
      { type: "mc", text: "Which mode opens a file for reading?", options: ["\"w\"", "\"r\"", "\"a\"", "\"x\""], correctIndex: 1 },
      { type: "mc", text: "Which method closes a file object f?", options: ["close(f)", "f.stop()", "f.close()", "end f"], correctIndex: 2 },
      { type: "mc", text: "Which keyword starts a block that may raise an error?", options: ["error", "try", "catch", "except"], correctIndex: 1 },
      { type: "mc", text: "Which block handles the error if it occurs?", options: ["handle", "except", "else", "finally"], correctIndex: 1 },
      { type: "mc", text: "Which function can raise ValueError when converting text to a number?", options: ["to_int()", "int()", "parse()", "convert()"], correctIndex: 1 },
      { type: "tf", text: "The 'finally' block runs only when an exception happens.", options: ["True", "False"], correctIndex: 1 },
      { type: "tf", text: "Opening a non-existent file in mode 'r' raises an error.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "Using try/except can prevent your program from crashing.", options: ["True", "False"], correctIndex: 0 }
    ]
  },

  "game-6": {
    title: "Level 6: Debugging & Logic",
    questions: [
      { type: "mc", text: "What is a 'bug' in programming?", options: ["A secret feature", "An error in the code", "A fast algorithm", "A security password"], correctIndex: 1 },
      { type: "mc", text: "Which function is often used to print values for debugging?", options: ["debug()", "show()", "print()", "log()"], correctIndex: 2 },
      { type: "mc", text: "What will print(2 == 2 and 3 > 5) output?", options: ["True", "False", "2", "Error"], correctIndex: 1 },
      { type: "mc", text: "Which of these is a syntax error?", options: ["print('Hello')", "if x > 3:", "for i in range(5)", "x = 10"], correctIndex: 2 },
      { type: "mc", text: "Which tool helps you track variable values step by step?", options: ["Debugger", "Browser history", "Music player", "PowerPoint"], correctIndex: 0 },
      { type: "tf", text: "Logical operators like and/or/not are used to combine conditions.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "A runtime error happens while your program is running.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "The best way to debug is to randomly change code and hope it works.", options: ["True", "False"], correctIndex: 1 }
    ]
  },

  "game-7": {
    title: "Level 7: Python & IT Mix",
    questions: [
      { type: "mc", text: "What does API stand for?", options: ["Application Programming Interface", "Advanced Python Interpreter", "Automatic Program Installer", "Application Process Index"], correctIndex: 0 },
      { type: "mc", text: "Which Python library is used for data analysis?", options: ["Django", "Pandas", "Flask", "BeautifulSoup"], correctIndex: 1 },
      { type: "mc", text: "Which tool is commonly used for version control?", options: ["Git", "Excel", "Photoshop", "PowerPoint"], correctIndex: 0 },
      { type: "mc", text: "What does KPI stand for in business?", options: ["Key Performance Indicator", "Keyboard Programming Interface", "Kernel Process Input", "Key Python Instruction"], correctIndex: 0 },
      { type: "mc", text: "Which of these is a database language?", options: ["HTML", "CSS", "SQL", "PNG"], correctIndex: 2 },
      { type: "tf", text: "Cloud services allow companies to store data on remote servers.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "Git is used to track changes in source code projects.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "In Python, indentation style is completely optional.", options: ["True", "False"], correctIndex: 1 }
    ]
  },

  "game-8": {
    title: "Level 8: Mixed Review",
    questions: [
      { type: "mc", text: "Which operator compares two values in Python?", options: ["=", "==", "!=", "=>"], correctIndex: 1 },
      { type: "mc", text: "Which keyword starts a while loop?", options: ["loop", "while", "for", "repeat"], correctIndex: 1 },
      { type: "mc", text: "Which of these is NOT a Python data structure?", options: ["list", "set", "arraylist", "dict"], correctIndex: 2 },
      { type: "mc", text: "Which library is used for machine learning in Python?", options: ["Flask", "NumPy", "scikit-learn", "Requests"], correctIndex: 2 },
      { type: "mc", text: "Which type of system is used to manage customers and sales?", options: ["CRM", "OS", "IDE", "CMS"], correctIndex: 0 },
      { type: "tf", text: "A list can contain another list inside it.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "The expression 10 // 3 equals 3 in Python.", options: ["True", "False"], correctIndex: 0 },
      { type: "tf", text: "You always need an 'else' with every 'if' statement.", options: ["True", "False"], correctIndex: 1 }
    ]
  },

  "game-9": {
    title: "Level 9: Business Programming Basics",
    questions: [
      { 
        type: "mc",
        text: "Why do businesses use programming?",
        options: ["To make games only", "To automate tasks and processes", "To design office furniture", "To write paper letters"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "Which is the best example of automation in a company?",
        options: ["Printing everything by hand", "Sending invoices automatically by code", "Calling every client manually", "Writing notes in a notebook"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "Which file format is often used to exchange business data?",
        options: ["MP3", "JPG", "CSV", "GIF"],
        correctIndex: 2
      },
      {
        type: "mc",
        text: "Which Python library is commonly used to work with CSV/Excel data?",
        options: ["pygame", "pandas", "turtle", "matplotlib"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "What is an ERP system used for?",
        options: ["Editing photos", "Managing resources and processes in a company", "Playing music", "Designing websites"],
        correctIndex: 1
      },
      {
        type: "tf",
        text: "Business logic is the set of rules that describe how a company works.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "A script that automatically sends daily sales reports is an example of business programming.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "In business programming, we never use data from Excel files.",
        options: ["True", "False"],
        correctIndex: 1
      }
    ]
  },

  "game-10": {
    title: "Level 10: Databases & SQL for Business",
    questions: [
      {
        type: "mc",
        text: "What is a database used for in a business?",
        options: ["Storing structured data", "Making memes", "Sending emails", "Drawing logos"],
        correctIndex: 0
      },
      {
        type: "mc",
        text: "Which of these is a relational database?",
        options: ["MySQL", "Photoshop", "PowerPoint", "Figma"],
        correctIndex: 0
      },
      {
        type: "mc",
        text: "Which language is used to query most relational databases?",
        options: ["HTML", "CSS", "SQL", "JSON"],
        correctIndex: 2
      },
      {
        type: "mc",
        text: "Which SQL command is used to get data from a table 'customers'?",
        options: ["SELECT * FROM customers;", "TAKE * FROM customers;", "GET customers;", "SHOW customers();"],
        correctIndex: 0
      },
      {
        type: "mc",
        text: "In a 'customers' table, which column is the best primary key?",
        options: ["first_name", "email", "customer_id", "city"],
        correctIndex: 2
      },
      {
        type: "tf",
        text: "Storing all client data in one big Excel file is always better than using a database.",
        options: ["True", "False"],
        correctIndex: 1
      },
      {
        type: "tf",
        text: "In business applications, databases help keep data consistent and organized.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "SQL can be used together with Python to build business dashboards.",
        options: ["True", "False"],
        correctIndex: 0
      }
    ]
  },

  "game-11": {
    title: "Level 11: Web & APIs in Business Apps",
    questions: [
      {
        type: "mc",
        text: "What is a REST API used for?",
        options: ["Printing documents", "Communicating between programs over the web", "Designing posters", "Playing videos"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "Which protocol is usually used for web APIs?",
        options: ["HTTP/HTTPS", "FTP only", "SMTP only", "Bluetooth"],
        correctIndex: 0
      },
      {
        type: "mc",
        text: "In Python, which library is commonly used to make HTTP requests to APIs?",
        options: ["math", "random", "requests", "turtle"],
        correctIndex: 2
      },
      {
        type: "mc",
        text: "Which HTTP method is typically used to get data from an API?",
        options: ["POST", "DELETE", "PUT", "GET"],
        correctIndex: 3
      },
      {
        type: "mc",
        text: "A business uses an API to get daily currency exchange rates. Why is this useful?",
        options: ["To change the company logo", "To update prices automatically in different currencies", "To edit holiday photos", "To send spam emails"],
        correctIndex: 1
      },
      {
        type: "tf",
        text: "APIs allow different systems (CRM, ERP, website) to share data automatically.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "JSON is a common format for sending data in web APIs.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "Without APIs, many modern business integrations would not work.",
        options: ["True", "False"],
        correctIndex: 0
      }
    ]
  },

  "game-12": {
    title: "Level 12: Data Analytics & Dashboards",
    questions: [
      {
        type: "mc",
        text: "What is the main goal of data analytics in business?",
        options: ["To randomly store numbers", "To make decisions based on data", "To decorate slides", "To print longer reports"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "Which Python library is often used for data visualization?",
        options: ["requests", "matplotlib", "os", "sys"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "Which of these is a common KPI for sales?",
        options: ["Number of wallpapers", "Monthly revenue", "Number of chairs", "Type of keyboard"],
        correctIndex: 1
      },
      {
        type: "mc",
        text: "A dashboard that shows daily sales, profit and number of orders is mainly used by:",
        options: ["Developers only", "Marketing only", "Decision makers and managers", "Security guards"],
        correctIndex: 2
      },
      {
        type: "mc",
        text: "Which of these sources can be used as input for a business dashboard?",
        options: ["Databases and Excel files", "Only hand-written notes", "Only images", "Only audio files"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "In business programming, we can automatically refresh dashboard data every hour.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "Data cleaning is an important step before building business reports.",
        options: ["True", "False"],
        correctIndex: 0
      },
      {
        type: "tf",
        text: "KPIs should be simple and clearly connected to business goals.",
        options: ["True", "False"],
        correctIndex: 0
      }
    ]
  }
};

// ===== LOCAL STORAGE HELPERS =====

function getUnlockedLevel() {
  const raw = localStorage.getItem(STORAGE_KEY_LEVEL);
  const n = parseInt(raw, 10);
  if (!raw || isNaN(n) || n < 1) return 1;         // по умолчанию открыт только 1 уровень
  return Math.min(TOTAL_LEVELS, n);
}

function setUnlockedLevel(newLevel) {
  const current = getUnlockedLevel();
  if (newLevel > current) {
    localStorage.setItem(STORAGE_KEY_LEVEL, String(newLevel));
  }
}

function getLevelFromCardId(cardId) {
  // "game-3" -> 3
  const parts = cardId.split("-");
  return parseInt(parts[1], 10);
}

// ===== DOM ELEMENTS =====

const overlay       = document.getElementById("quiz-overlay");
const closeBtn      = document.getElementById("quiz-close");
const questionEl    = document.getElementById("quiz-question");
const optionsEl     = document.getElementById("quiz-options");
const counterEl     = document.getElementById("quiz-counter");
const typeLabelEl   = document.getElementById("quiz-type-label");
const backBtn       = document.getElementById("quiz-back");
const nextBtn       = document.getElementById("quiz-next");
const resultsEl     = document.getElementById("quiz-results");
const controlsEl    = document.getElementById("quiz-controls");
const progressInner = document.getElementById("quiz-progress-inner");
const titleEl       = document.querySelector(".quiz-title");

let currentQuestions = [];
let currentIndex     = 0;
let userAnswers      = [];

// ===== ИНИЦИАЛИЗАЦИЯ КАРТОЧЕК С УЧЁТОМ ПРОГРЕССА =====

function initCardsWithProgress() {
  const unlocked = getUnlockedLevel();

  Object.keys(quizzes).forEach(id => {
    const card = document.getElementById(id);
    if (!card) return;

    const levelNum = getLevelFromCardId(id);

    // визуальная блокировка
    if (levelNum > unlocked) {
      card.classList.add("locked");
    } else {
      card.classList.remove("locked");
    }

    // один обработчик на клик
    card.onclick = () => {
      const currentUnlocked = getUnlockedLevel(); // вдруг уже обновился
      if (levelNum > currentUnlocked) {
        alert(`This planet is locked. Pass Level ${currentUnlocked} first (at least ${PASS_SCORE} correct answers).`);
        return;
      }
      startQuizForCard(id);
    };
  });
}

// сразу инициализируем
initCardsWithProgress();

// ===== СТАРТ КВИЗА ДЛЯ КОНКРЕТНОЙ КАРТОЧКИ =====

function startQuizForCard(cardId) {
  const quiz = quizzes[cardId];
  if (!quiz) return;

  currentCardId   = cardId;
  currentQuestions = quiz.questions;
  currentIndex     = 0;
  userAnswers      = new Array(currentQuestions.length).fill(null);

  titleEl.textContent       = quiz.title;
  resultsEl.hidden          = true;
  resultsEl.innerHTML       = "";
  controlsEl.style.display  = "flex";
  progressInner.style.width = "0%";

  overlay.classList.add("active");
  renderQuestion();
}

// ===== ЗАКРЫТЬ КВИЗ =====

function closeQuiz() {
  overlay.classList.remove("active");
}

closeBtn.addEventListener("click", closeQuiz);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeQuiz();
});

// ===== ПОКАЗАТЬ ВОПРОС =====

function renderQuestion() {
  const q = currentQuestions[currentIndex];

  counterEl.textContent   = `Question ${currentIndex + 1} / ${currentQuestions.length}`;
  typeLabelEl.textContent = q.type === "mc" ? "Multiple choice" : "True / False";
  questionEl.textContent  = q.text;

  const progress = (currentIndex / currentQuestions.length) * 100;
  progressInner.style.width = progress + "%";

  optionsEl.innerHTML = "";
  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;

    if (userAnswers[currentIndex] === index) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => selectOption(index));
    optionsEl.appendChild(btn);
  });

  backBtn.disabled    = currentIndex === 0;
  nextBtn.disabled    = userAnswers[currentIndex] === null;
  nextBtn.textContent = currentIndex === currentQuestions.length - 1 ? "Finish" : "Next";
}

// ===== ВЫБОР ОТВЕТА =====

function selectOption(index) {
  userAnswers[currentIndex] = index;

  document.querySelectorAll(".quiz-option").forEach((btn, i) => {
    btn.classList.toggle("selected", i === index);
  });

  nextBtn.disabled = false;
}

// ===== КНОПКИ NEXT / BACK =====

nextBtn.addEventListener("click", () => {
  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});

backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

// ===== ПОКАЗАТЬ РЕЗУЛЬТАТЫ =====

function showResults() {
  let correctCount = 0;
  resultsEl.innerHTML = "";

  currentQuestions.forEach((q, i) => {
    const userIndex = userAnswers[i];
    const isCorrect = userIndex === q.correctIndex;
    if (isCorrect) correctCount++;

    const item = document.createElement("div");
    item.className = "quiz-result-item " + (isCorrect ? "correct" : "incorrect");

    item.innerHTML = `
      <div class="quiz-result-q">${i + 1}. ${q.text}</div>
      <div class="quiz-result-line"><strong>Your answer:</strong> ${
        userIndex !== null ? q.options[userIndex] : "<em>no answer</em>"
      }</div>
      <div class="quiz-result-line"><strong>Correct answer:</strong> ${q.options[q.correctIndex]}</div>
    `;

    resultsEl.appendChild(item);
  });

  const currentLevel   = currentCardId ? getLevelFromCardId(currentCardId) : null;
  const unlockedBefore = getUnlockedLevel();

  const scoreBox = document.createElement("div");
  scoreBox.className = "quiz-score";
  scoreBox.textContent = `Score: ${correctCount} / ${currentQuestions.length}`;

  const statusBox = document.createElement("div");
  statusBox.className = "quiz-status-message";

  if (correctCount >= PASS_SCORE) {
    statusBox.textContent = `You passed this level! (minimum ${PASS_SCORE} correct answers)`;

    if (currentLevel && currentLevel >= unlockedBefore && currentLevel < TOTAL_LEVELS) {
      const newUnlocked = currentLevel + 1;
      setUnlockedLevel(newUnlocked);
      initCardsWithProgress(); // обновляем визуальные замки

      const unlockMsg = document.createElement("div");
      unlockMsg.className = "quiz-unlock-message";
      unlockMsg.textContent = `Planet Level ${newUnlocked} is now unlocked!`;
      resultsEl.prepend(unlockMsg);
    }
  } else {
    statusBox.textContent = `You need at least ${PASS_SCORE} correct answers to pass this level. Try again!`;
  }

  resultsEl.prepend(statusBox);
  resultsEl.prepend(scoreBox);

  controlsEl.style.display  = "none";
  resultsEl.hidden          = false;
  progressInner.style.width = "100%";
}
