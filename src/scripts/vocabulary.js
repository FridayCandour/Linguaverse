const vocabularies = {
  Greetings: ["Hello", "Hi", "Good morning", "Good afternoon", "Good evening"],
  Numbers: ["One", "Two", "Three", "Four", "Five"],
  Colors: ["Red", "Blue", "Yellow", "Green", "Purple"],
  "Days of the Week": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "Months of the Year": ["January", "February", "March", "April", "May"],
  "Common Objects": ["Table", "Chair", "Book", "Pen", "Car"],
  "Food and Drinks": ["Apple", "Banana", "Bread", "Water", "Coffee"],
  "Family Members": ["Mother", "Father", "Brother", "Sister", "Grandmother"],
  Animals: ["Dog", "Cat", "Bird", "Elephant", "Lion"],
  Clothing: ["Shirt", "Pants", "Shoes", "Dress", "Hat"],

  Technology: ["Computer", "Smartphone", "Internet", "Software", "Website"],
  Science: ["Biology", "Chemistry", "Physics", "Experiment", "Scientist"],
  Business: ["Entrepreneur", "Marketing", "Sales", "Finance", "Strategy"],
  "Art and Culture": ["Painting", "Music", "Literature", "Theater", "Dance"],
  Geography: ["Continent", "Ocean", "Mountain", "River", "Desert"],
  Environment: [
    "Climate Change",
    "Recycling",
    "Renewable Energy",
    "Pollution",
    "Conservation",
  ],
  "Health and Wellness": [
    "Exercise",
    "Nutrition",
    "Meditation",
    "Stress Management",
    "Sleep",
  ],
  Politics: ["Democracy", "Government", "Election", "Policy", "Diplomacy"],
  History: [
    "Revolution",
    "War",
    "Renaissance",
    "Industrialization",
    "Colonialism",
  ],
  Philosophy: ["Ethics", "Morality", "Existentialism", "Logic", "Rationality"],

  Cuisine: ["Sushi", "Pizza", "Curry", "Tacos", "Pasta"],
  Festivals: ["Carnival", "Diwali", "Oktoberfest", "Thanksgiving"],
  Traditions: ["Wedding", "Birthday", "New Year", "Graduation", "Funeral"],
  Sports: ["Soccer", "Basketball", "Cricket", "Rugby", "Sumo Wrestling"],
  "Music Genres": ["Rock", "Jazz", "Reggae", "Hip-hop", "Classical"],
};

const renderVocab = () => {
  const html = div(
    { className: "" },
    Object.keys(vocabularies).map((category) => {
      return div(
        { className: "category" },
        h3(category),
        ul(
          vocabularies[category].map((word) =>
            li(word, {
              className: "word",
              onclick() {
                PlayTTs();
              },
            })
          )
        )
      );
    })
  );
  const cat = document.getElementById("container");
  cat.innerHTML = "";
  cat.append(html);
};
