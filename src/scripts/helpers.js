const navigateTo = (id) => {
  //? hide other pages;
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hide");
  });
  //? show the needed page
  const page = document.getElementById(id);
  page.classList.remove("hide");
  if (id === "vocabulary") {
    renderVocab();
    Domtts.wrap(page);
  }
};

const PlayTTs = (selfs) => {
  Domtts.wrap(selfs);
  Domtts.iterate();
};
const PlayTTs2 = () => {
  Domtts.wrap(document.getElementById("chat-history"));
  Domtts.iterate();
};

// ? a powerful function that executes and loads html files via network when needed
const loadHTML = async function (parent, url) {
  const xhres = await fetch(url);
  const html = await xhres.text();
  const element = document.getElementById(parent);
  const tc = document.createElement("div");
  tc.innerHTML = html;
  element.append(...tc.children);
  if (html.includes("<script")) {
    const ses = tc.querySelectorAll("script");
    ses.forEach((se) => {
      const jsCode = se.textContent?.trim();
      const ns = document.createElement("script");
      ns.textContent = jsCode || "";
      console.log({ jsCode });
      // ? kinda works
      document.body.appendChild(ns);
      // ns.remove();
    });
  }
  // if (html.includes("<style")) {
  //   const ses = tc.querySelectorAll("style");
  //   ses.forEach((se) => {
  //     const jsCode = se.textContent?.trim();
  //     const ns = document.createElement("style");
  //     ns.textContent = jsCode || "";
  //     // ? kinda works as well
  //     document.head.appendChild(ns);
  //   });
  // }
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

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("sections", "/src/html/home.html").then(() => {
    loadHTML("user", "/src/html/lang.html");
  });
  loadHTML("sections", "/src/html/progress.html");
  loadHTML("sections", "/src/html/chat.html");
  loadHTML("sections", "/src/html/vocabulary.html");
});
