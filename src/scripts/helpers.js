const navigateTo = (id) => {
  console.log({ id });
  //? hide other pages;
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hide");
  });
  //? show the needed page
  document.getElementById(id).classList.remove("hide");
};

// ? a powerful function that executes and loads html files via network when needed
const loadHTML = async function (parent, url) {
  const xhres = await fetch(url);
  const html = await xhres.text();
  if (html.includes("<")) {
    element.innerHTML = html;
    const tc = document.createElement("div");
    tc.innerHTML = html;
    const ses = tc.querySelectorAll("script");
    ses.forEach((se) => {
      const jsCode = se.textContent?.trim();
      const ns = document.createElement("script");
      ns.textContent = jsCode || "";
      // ? kinda works
      document.body.appendChild(ns);
      ns.remove();
    });
  }
};

const listItem = document.querySelectorAll(".list");

function activateLink() {
  listItem.forEach((item) => {
    item.classList.remove("active");
  });
  this.classList.add("active");
}

listItem.forEach((item) => {
  item.addEventListener("click", activateLink);
});

// game

const words = [
  { word: "Hello", translation: "Bonjour" },
  { word: "Goodbye", translation: "Au revoir" },
  // Add more words and translations here
];

let currentWordIndex = 0;

function displayWord() {
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.textContent = words[currentWordIndex].word;
}

function displayOptions() {
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  const translations = words.map((word) => word.translation);
  const shuffledTranslations = shuffleArray(translations);

  shuffledTranslations.forEach((translation) => {
    const optionBtn = document.createElement("button");
    optionBtn.textContent = translation;
    optionBtn.addEventListener("click", () => checkAnswer(translation));
    optionsContainer.appendChild(optionBtn);
  });
}

function checkAnswer(translation) {
  const correctTranslation = words[currentWordIndex].translation;
  if (translation === correctTranslation) {
    alert("Correct!");
  } else {
    alert("Incorrect. Try again!");
  }
}

function nextWord() {
  currentWordIndex = (currentWordIndex + 1) % words.length;
  displayWord();
  displayOptions();
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

document.getElementById("next-btn").addEventListener("click", nextWord);

// Initialize the game
displayWord();
displayOptions();

const y = [
  "Afrikaans",
  "Amharic",
  "Arabic",
  "Asturian",
  "Azerbaijani",
  "Bashkir",
  "Belarusian",
  "Bulgarian",
  "Bengali",
  "Breton",
  "Bosnian",
  "Catalan",
  "Cebuano",
  "Czech",
  "Welsh",
  "Danish",
  "German",
  "Greeek",
  "English",
  "Spanish",
  "Estonian",
  "Persian",
  "Fulah",
  "Finnish",
  "French",
  "Western Frisian",
  "Irish",
  "Gaelic",
  "Galician",
  "Gujarati",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Croatian",
  "Haitian",
  "Hungarian",
  "Armenian",
  "Indonesian",
  "Igbo",
  "Iloko",
  "Icelandic",
  "Italian",
  "Japanese",
  "Javanese",
  "Georgian",
  "Kazakh",
  "Central Khmer",
  "Kannada",
  "Korean",
  "Luxembourgish",
  "Ganda",
  "Lingala",
  "Lao",
  "Lithuanian",
  "Latvian",
  "Malagasy",
  "Macedonian",
  "Malayalam",
  "Mongolian",
  "Marathi",
  "Malay",
  "Burmese",
  "Nepali",
  "Dutch",
  "Norwegian",
  "Northern Sotho",
  "Occitan",
  "Oriya",
  "Panjabi",
  "Polish",
  "Pushto",
  "Portuguese",
  "Romanian",
  "Russian",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Albanian",
  "Serbian",
  "Swati",
  "Sundanese",
  "Swedish",
  "Swahili",
  "Tamil",
  "Thai",
  "Tagalog",
  "Tswana",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Wolof",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Chinese",
  "Zulu",
];
