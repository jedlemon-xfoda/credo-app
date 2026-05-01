const tabButtons = document.querySelectorAll(".tab-button");
const appScreens = document.querySelectorAll(".app-screen");

const qaData = [
  {
    key: "confession",
    match: ["confess", "confession", "priest", "penance", "reconciliation"],
    question: "Why do Catholics confess sins to a priest?",
    sourceType: "Official teaching",
    title: "Confession is rooted in Christ giving the apostles authority to forgive sins.",
    answer:
      "Catholics confess to a priest because Christ entrusted the ministry of reconciliation to the apostles and their successors. The priest acts as a minister of Christ and the Church, and the sacrament includes contrition, confession, absolution, and satisfaction.",
    citations: [
      {
        type: "Scripture",
        title: "John 20:21-23",
        note: "Christ sends the apostles and speaks of forgiving and retaining sins.",
      },
      {
        type: "Catechism",
        title: "CCC 1422-1498",
        note: "The Catechism summarizes the sacrament of Penance and Reconciliation.",
      },
      {
        type: "Reference",
        title: "New Advent: Penance",
        note: "Historical and theological context appears below official sources.",
      },
    ],
  },
  {
    key: "purgatory",
    match: ["purgatory", "purification", "dead", "after death"],
    question: "What does the Church teach about purgatory?",
    sourceType: "Official teaching",
    title: "Purgatory is the final purification of those who die in God's grace.",
    answer:
      "The Church teaches that those who die in God's grace and friendship, but still need purification, undergo final purification before entering the joy of heaven. This is distinct from the punishment of the damned.",
    citations: [
      {
        type: "Catechism",
        title: "CCC 1030-1032",
        note: "Defines purgatory and connects it to prayer for the dead.",
      },
      {
        type: "Scripture",
        title: "2 Maccabees 12:45",
        note: "Shows prayer for the dead as a holy and pious practice.",
      },
      {
        type: "Tradition",
        title: "St. Gregory the Great",
        note: "A patristic witness used as theological and historical support.",
      },
    ],
  },
  {
    key: "eucharist",
    match: ["eucharist", "communion", "real presence", "mass", "host"],
    question: "What is the Eucharist?",
    sourceType: "Official teaching",
    title: "The Eucharist is the source and summit of the Christian life.",
    answer:
      "The Eucharist is the sacrament in which Christ is truly, really, and substantially present under the appearances of bread and wine. It is the memorial of Christ's sacrifice and the center of Catholic worship.",
    citations: [
      {
        type: "Catechism",
        title: "CCC 1322-1419",
        note: "The Catechism's main section on the sacrament of the Eucharist.",
      },
      {
        type: "Scripture",
        title: "John 6; Luke 22; 1 Corinthians 11",
        note: "Biblical foundations for Eucharistic doctrine and practice.",
      },
      {
        type: "Council",
        title: "Lumen Gentium 11",
        note: "Vatican II describes the Eucharistic sacrifice as source and summit.",
      },
    ],
  },
];

let currentAnswer = qaData[0];

function showScreen(screenId) {
  tabButtons.forEach((item) => {
    item.classList.toggle("active", item.dataset.screen === screenId);
  });

  appScreens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });
}

function findAnswer(question) {
  const normalized = question.toLowerCase();
  return (
    qaData.find((item) => item.match.some((token) => normalized.includes(token))) ||
    qaData[0]
  );
}

function renderAnswer(answer) {
  currentAnswer = answer;

  document.getElementById("question-input").value = answer.question;
  document.getElementById("ask-source-type").textContent = answer.sourceType;
  document.getElementById("ask-answer-title").textContent = answer.title;
  document.getElementById("ask-answer-body").textContent = answer.answer;
  document.getElementById("detail-question").textContent = answer.question;
  document.getElementById("detail-answer").textContent = answer.answer;

  const askCitations = document.getElementById("ask-citations");
  const detailCitations = document.getElementById("detail-citations");

  askCitations.innerHTML = "";
  detailCitations.innerHTML = "";

  answer.citations.forEach((citation) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.textContent = citation.title;
    chip.addEventListener("click", () => showScreen("answer-screen"));
    askCitations.appendChild(chip);

    const card = document.createElement("article");
    card.innerHTML = `
      <span>${citation.type}</span>
      <strong>${citation.title}</strong>
      <p>${citation.note}</p>
    `;
    detailCitations.appendChild(card);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.getElementById("ask-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const question = document.getElementById("question-input").value;
  renderAnswer(findAnswer(question));
  document.getElementById("saved-note").classList.remove("visible");
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    renderAnswer(findAnswer(button.dataset.question));
    showScreen("ask-screen");
    document.getElementById("saved-note").classList.remove("visible");
  });
});

document.getElementById("open-sources").addEventListener("click", () => {
  renderAnswer(currentAnswer);
  showScreen("answer-screen");
});

document.getElementById("save-answer").addEventListener("click", () => {
  document.getElementById("saved-note").classList.add("visible");
});

renderAnswer(currentAnswer);
