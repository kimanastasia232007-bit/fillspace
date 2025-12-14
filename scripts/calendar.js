/* ===== Activity Calendar (full monthly view) =====
   - Records 1 "use" per day on page load
   - Shows month grid with activity intensity
   - Calculates streak and shows 🔥 after threshold
*/

const ACTIVITY_KEY = "lg_activity_daily_counts_v1"; // shared across pages
const FIRE_STREAK_THRESHOLD = 3; // ✅ change this (e.g. 5, 7, 10)

function toISODateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadActivity() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || {}; }
  catch { return {}; }
}

function saveActivity(obj) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(obj));
}

function recordTodayUse() {
  const data = loadActivity();
  const todayKey = toISODateLocal(new Date());
  data[todayKey] = (data[todayKey] || 0) + 1;
  saveActivity(data);
}

function levelFromCount(count) {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4; // 5+ uses in a day
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function calcStreak(data) {
  // consecutive days ending today (local)
  const today = new Date();
  today.setHours(12,0,0,0);

  let streak = 0;
  let cursor = new Date(today);

  while (true) {
    const key = toISODateLocal(cursor);
    if ((data[key] || 0) > 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

function monthDaysUsed(data, monthDate) {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  let used = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const key = toISODateLocal(cur);
    if ((data[key] || 0) > 0) used++;
    cur.setDate(cur.getDate() + 1);
  }
  return used;
}

function buildDOWRow() {
  const dowRow = document.getElementById("dowRow");
  const names = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  dowRow.innerHTML = "";
  for (const n of names) {
    const el = document.createElement("div");
    el.className = "dow";
    el.textContent = n;
    dowRow.appendChild(el);
  }
}

function renderMonth(viewDate) {
  const data = loadActivity();

  const grid = document.getElementById("calendarGrid");
  const monthLabel = document.getElementById("monthLabel");
  const daysUsedLabel = document.getElementById("daysUsedLabel");
  const streakLabel = document.getElementById("streakLabel");
  const fireBadge = document.getElementById("fireBadge");

  const monthName = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  monthLabel.textContent = monthName;

  const used = monthDaysUsed(data, viewDate);
  daysUsedLabel.textContent = `Days used (month): ${used}`;

  const streak = calcStreak(data);
  streakLabel.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;

  if (streak >= FIRE_STREAK_THRESHOLD) {
    fireBadge.classList.add("show");
    fireBadge.textContent = `🔥 ${streak}-day streak!`;
  } else {
    fireBadge.classList.remove("show");
  }

  grid.innerHTML = "";

  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);

  // We fill a 6-week grid (42 cells) for a clean calendar layout
  const firstCell = new Date(start);
  firstCell.setDate(start.getDate() - start.getDay()); // back to Sunday

  const today = new Date();
  today.setHours(12,0,0,0);

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(firstCell);
    cellDate.setDate(firstCell.getDate() + i);

    const inMonth = cellDate.getMonth() === viewDate.getMonth();
    const key = toISODateLocal(cellDate);
    const count = data[key] || 0;
    const lvl = levelFromCount(count);

    const cell = document.createElement("div");
    cell.className = "day";
    cell.dataset.lvl = String(lvl);

    if (!inMonth) cell.classList.add("muted");
    if (sameDay(cellDate, today)) cell.classList.add("todayRing");

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = cellDate.getDate();

    const meta = document.createElement("div");
    meta.className = "meta";

    if (count > 0) {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = `${count} use${count === 1 ? "" : "s"}`;
      meta.appendChild(pill);
    } else {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = "—";
      meta.appendChild(pill);
    }

    // tooltip
    const tip = `${count} use${count === 1 ? "" : "s"} on ${cellDate.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"})}`;
    cell.title = tip;

    cell.appendChild(num);
    cell.appendChild(meta);
    grid.appendChild(cell);
  }
}

function wireControls(state) {
  document.getElementById("prevMonth").addEventListener("click", () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1);
    renderMonth(state.viewDate);
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + 1, 1);
    renderMonth(state.viewDate);
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    const now = new Date();
    state.viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
    renderMonth(state.viewDate);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(ACTIVITY_KEY);
    renderMonth(state.viewDate);
  });
}

/* ===== init ===== */
recordTodayUse(); // counts a "use" when user opens calendar page

buildDOWRow();

const now = new Date();
const state = { viewDate: new Date(now.getFullYear(), now.getMonth(), 1) };

renderMonth(state.viewDate);
wireControls(state);
