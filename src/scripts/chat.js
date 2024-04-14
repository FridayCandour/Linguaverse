const generate = async ({ text, lang }) => {
  try {
    const cs = new AbortController();
    const to = setTimeout(() => {
      cs.abort();
    }, 2 * 60 * 1000);
    const res = await fetch(
      "https://linguaverse-api.uiedbook.workers.dev/chat",
      {
        headers: { "Content-Type": "application/json" },
        signal: cs.signal,
        body: JSON.stringify({
          message: text,
          lang,
        }),
        method: "POST",
      }
    );
    clearTimeout(to);
    const out = await res.json();

    return {
      text: out?.response?.response,
    };
  } catch (error) {
    console.log({ error });
    msgboxNoClose.show("An error happened. Please try again!", null, "OK");
    return {
      text: "An error happened. Please try again!",
    };
  }
};

const addUserMSG = ({ text }) => {
  console.log({ text });
  const history = document.getElementById("chat-history");
  const empty = document.getElementById("empty");
  if (empty) {
    empty.remove();
  }
  const msg = li(
    { className: "user-message" },
    div(
      { className: "user" },
      img({
        src: "./assets/user.png",
        alt: "AI",
        className: "chatter",
      }),
      span("You")
    ),
    div(
      { className: "msg" },
      $if(text, () => p(text))
    )
  );
  history.appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth", block: "start" });
  addAIMSG({ text });
};
const addAIMSG = async ({ text }) => {
  const history = document.getElementById("chat-history");
  // show loader
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  history.appendChild(loader);
  loader.scrollIntoView({ behavior: "smooth", block: "start" });
  let data = await generate({ text });
  // call api
  const msg = ({ text }) =>
    li(
      { className: "ai-message" },
      div(
        { className: "user" },
        img({
          src: "./assets/apple-touch-icon.png",
          alt: "AI",
          className: "chatter",
        }),
        span("Browser AI")
      ),
      div(
        { className: "msg" },
        $if(text, () => p(text)),
        $if(!text, () => p("An error happened. Please try again!"))
      )
    );
  document.getElementById("loader").style.display = "none";
  const msgHtml = msg(data);
  history.appendChild(msgHtml);
  msgHtml.scrollIntoView({ behavior: "smooth", block: "start" });
};

const fromC = (e) => {
  e?.preventDefault();
  const usersInput = document.getElementById("user-message");
  addUserMSG({
    text: usersInput.value,
  });
  usersInput.value = "";
};
