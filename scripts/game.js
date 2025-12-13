// ======== MISSIONS DATA (SPACE + PYTHON + BUSINESS) ========

const missions = [
  {
    title: "Mission 1 · Python in a company",
    question:
      "A Mars startup wants to send daily revenue reports automatically. Which tool combo fits best?",
    answers: [
      "Manual Excel + copy-paste into email",
      "A Python script with a scheduled task/cron job",
      "Taking screenshots of a dashboard and sending them",
      "Writing numbers on paper and scanning them"
    ],
    correctIndex: 1,
    explanation:
      "Python script + scheduler is the standard way to automate recurring business reporting."
  },
  {
    title: "Mission 2 · Data formats",
    question:
      "The company on Jupiter exports customer data from a CRM. Which format is most convenient for Python and Excel?",
    answers: ["MP3", "PNG", "CSV", "PSD"],
    correctIndex: 2,
    explanation:
      "CSV (comma-separated values) is a text format easily read by Python and Excel."
  },
  {
    title: "Mission 3 · Pandas",
    question:
      "You receive a sales.csv file from Saturn. Which Python library is most popular for analyzing it?",
    answers: ["pygame", "pandas", "turtle", "random"],
    correctIndex: 1,
    explanation:
      "pandas is the go-to library for tabular business data (CSV, Excel, SQL)."
  },
  {
    title: "Mission 4 · KPIs",
    question:
      "The CEO on Venus asks for a KPI that shows how much money the company earns per month. What is this KPI?",
    answers: [
      "Number of planets in the Solar System",
      "Monthly revenue",
      "Favorite rocket color",
      "Number of emojis in emails"
    ],
    correctIndex: 1,
    explanation:
      "Monthly revenue is a classic business KPI and directly relates to income."
  },
  {
    title: "Mission 5 · Databases",
    question:
      "A new space shop wants to store orders in a reliable place, not just in one Excel file. What should they use?",
    answers: [
      "Cloud storage with random text files",
      "Relational database (e.g., PostgreSQL, MySQL)",
      "Only printed receipts in a drawer",
      "Instagram stories"
    ],
    correctIndex: 1,
    explanation:
      "Relational databases store structured business data reliably and safely."
  },
  {
    title: "Mission 6 · SQL basics",
    question:
      "Which SQL query selects all columns from 'orders' table?",
    answers: [
      "GET * FROM orders;",
      "SELECT * FROM orders;",
      "SHOW orders();",
      "TAKE ALL orders;"
    ],
    correctIndex: 1,
    explanation:
      "SELECT * FROM orders; is the correct SQL syntax for reading all columns."
  },
  {
    title: "Mission 7 · APIs",
    question:
      "A Moon shop needs up-to-date exchange rates every hour. How should the Python app get them?",
    answers: [
      "Manually looking at Google and typing values",
      "Calling an HTTP API that returns JSON with rates",
      "Guessing the rate randomly",
      "Using a local PNG picture of old rates"
    ],
    correctIndex: 1,
    explanation:
      "HTTP APIs returning JSON are the standard way to pull live exchange rates."
  },
  {
    title: "Mission 8 · Error handling",
    question:
      "Your script reads user input for 'price' and converts it with int(). What should you use to avoid crashes when someone types 'abc'?",
    answers: [
      "Ignore the error and hope it works",
      "Wrap conversion in try/except",
      "Restart the whole server every minute",
      "Block all users"
    ],
    correctIndex: 1,
    explanation:
      "try/except around int() allows you to handle invalid input gracefully."
  },
  {
    title: "Mission 9 · Dashboards",
    question:
      "The Mars manager wants a dashboard showing daily orders, revenue, and average check. What is the MAIN purpose of such a dashboard?",
    answers: [
      "Just to look futuristic",
      "To make decisions based on real-time data",
      "To replace the HR department",
      "To show more ads"
    ],
    correctIndex: 1,
    explanation:
      "Dashboards help decision-makers see trends and act based on data, not intuition."
  },
  {
    title: "Mission 10 · Clean code",
    question:
      "You are cleaning a Python project used by a space logistics company. Which practice helps most?",
    answers: [
      "Long functions with 200+ lines each",
      "Clear function names, small functions and comments where needed",
      "Putting all code in one file main.py",
      "Hiding business logic in random variable names"
    ],
    correctIndex: 1,
    explanation:
      "Readable, well-named, small functions make business logic easier to maintain and extend."
  }
];

// ======== DOM ELEMENTS ========

const missionCounterEl = document.getElementById("game-mission-counter");
const scoreEl          = document.getElementById("game-score");
const streakEl         = document.getElementById("game-streak");

const questionTitleEl  = document.getElementById("game-question-title");
const questionTextEl   = document.getElementById("game-question-text");
const answersEl        = document.getElementById("game-answers");

const statusEl         = document.getElementById("game-status");
const nextBtn          = document.getElementById("game-next-btn");

const progressFillEl   = document.getElementById("game-progress-fill");
const orbitsContainer  = document.getElementById("game-progress-orbits");

// final overlay
const endOverlayEl   = document.getElementById("game-end-overlay");
const endTitleEl     = document.getElementById("end-title");
const endMessageEl   = document.getElementById("end-message");
const endCloseBtn    = document.getElementById("game-end-close");
const endRestartBtn  = document.getElementById("game-end-restart");

// ======== GAME STATE ========

let currentMission = 0;      // index in missions[]
let score          = 0;
let streak         = 0;

let selectedIndex  = null;
let isReviewPhase  = false;  // false = выбираем ответ, true = уже показали результат
let isOnFinalScreen = false;

// ======== INIT ========

function initGame() {
  // создаём маленькие точки-орбиты
  if (orbitsContainer) {
    orbitsContainer.innerHTML = "";
    missions.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "mission-orbit-dot";
      dot.dataset.index = i;
      orbitsContainer.appendChild(dot);
    });
  }

  currentMission = 0;
  score = 0;
  streak = 0;
  selectedIndex = null;
  isReviewPhase = false;
  isOnFinalScreen = false;

  updateHeaderStats();
  renderMission();
}

function updateHeaderStats() {
  if (missionCounterEl) {
    missionCounterEl.textContent = `${currentMission + 1} / ${missions.length}`;
  }
  if (scoreEl)  scoreEl.textContent  = score;
  if (streakEl) streakEl.textContent = streak;
}

function updateProgress() {
  if (!progressFillEl || !orbitsContainer) return;

  const progress = (currentMission / missions.length) * 100;
  progressFillEl.style.width = `${progress}%`;

  const dots = orbitsContainer.querySelectorAll(".mission-orbit-dot");
  dots.forEach((dot, index) => {
    dot.classList.remove("mission-orbit-dot--current",
                          "mission-orbit-dot--done",
                          "mission-orbit-dot--failed");
    if (index < currentMission) {
      dot.classList.add("mission-orbit-dot--done");
    } else if (index === currentMission) {
      dot.classList.add("mission-orbit-dot--current");
    }
  });
}

// ======== RENDER MISSION ========

function renderMission() {
  const m = missions[currentMission];

  questionTitleEl.textContent = m.title;
  questionTextEl.textContent  = m.question;

  if (statusEl) {
    statusEl.textContent = "Choose an answer, then press “Check”.";
  }

  answersEl.innerHTML = "";
  selectedIndex = null;
  isReviewPhase = false;

  m.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "game-answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", () => onAnswerClick(index));
    answersEl.appendChild(btn);
  });

  // кнопка
  nextBtn.disabled = true;
  nextBtn.textContent = "Check";

  updateHeaderStats();
  updateProgress();
}

function onAnswerClick(index) {
  if (isReviewPhase) return;

  selectedIndex = index;
  const buttons = answersEl.querySelectorAll(".game-answer-btn");
  buttons.forEach((b, i) => {
    b.classList.toggle("selected", i === index);
  });

  nextBtn.disabled = false;
}

// ======== CHECK ANSWER / NEXT MISSION ========

function checkAnswer() {
  const mission = missions[currentMission];
  const buttons = answersEl.querySelectorAll(".game-answer-btn");

  if (selectedIndex === null) return;

  const isCorrect = selectedIndex === mission.correctIndex;

  buttons.forEach((btn, i) => {
    btn.classList.remove("selected");
    if (i === mission.correctIndex) {
      btn.classList.add("correct");
    }
    if (i === selectedIndex && !isCorrect) {
      btn.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score += 10;
    streak += 1;
    statusEl.textContent = "Correct! " + mission.explanation;
  } else {
    streak = 0;
    statusEl.textContent = "Not quite. " + mission.explanation;
  }

  updateHeaderStats();

  // переходим в фазу обзора
  isReviewPhase = true;
  nextBtn.textContent =
    currentMission === missions.length - 1 ? "Finish missions" : "Next mission";
}

function goToNextMission() {
  if (!isReviewPhase) {
    // если ещё не проверили, сначала проверяем
    checkAnswer();
    return;
  }

  // если уже на обзоре и нажали Next
  if (currentMission < missions.length - 1) {
    currentMission += 1;
    renderMission();
  } else {
    showFinalScreen();
  }
}

// ======== FINAL SCREEN ========

function showFinalScreen() {
  isOnFinalScreen = true;

  const total = missions.length;
  const baseMessage =
    score >= 80
      ? "You are a top-tier space business developer!"
      : score >= 50
      ? "Nice work! Keep practicing to become a galactic expert."
      : "Every great developer starts somewhere. Review your notes and try again.";

  // базовый текст в правой панели
  questionTitleEl.textContent = "All missions completed";
  questionTextEl.textContent =
    `You finished ${total} missions with a total score of ${score} points.\n` +
    baseMessage;

  answersEl.innerHTML = "";
  statusEl.textContent =
    "Look at the celebration screen and press “Play again” to restart.";

  if (progressFillEl) {
    progressFillEl.style.width = "100%";
  }

  const dots = orbitsContainer?.querySelectorAll(".mission-orbit-dot") || [];
  dots.forEach((dot) => {
    dot.classList.remove("mission-orbit-dot--current");
    dot.classList.add("mission-orbit-dot--done");
  });

  nextBtn.disabled = false;
  nextBtn.textContent = "Play again";

  // анимированный оверлей
  if (endOverlayEl && endTitleEl && endMessageEl) {
    endTitleEl.textContent = "All missions completed";
    endMessageEl.textContent =
      `You finished ${total} missions with ${score} points. ` + baseMessage;
    endOverlayEl.classList.add("active");
  }
}

function resetGame() {
  initGame();
}

// ======== EVENT LISTENERS ========

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (isOnFinalScreen) {
      // перезапуск
      isOnFinalScreen = false;
      endOverlayEl?.classList.remove("active");
      resetGame();
      return;
    }
    goToNextMission();
  });
}

if (endCloseBtn) {
  endCloseBtn.addEventListener("click", () => {
    endOverlayEl.classList.remove("active");
  });
}

if (endRestartBtn) {
  endRestartBtn.addEventListener("click", () => {
    endOverlayEl.classList.remove("active");
    resetGame();
  });
}

// запускаем игру после загрузки DOM
document.addEventListener("DOMContentLoaded", initGame);
