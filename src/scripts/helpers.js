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
