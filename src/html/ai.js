import { li, div, img, span, p, $if } from "./dom-helpers";

class MessageBox {
  constructor(option) {
    this.option = option;

    this.msgBoxArea = document.querySelector("#msgbox-area");

    if (this.msgBoxArea === null) {
      this.msgBoxArea = document.createElement("DIV");
      this.msgBoxArea.setAttribute("id", "msgbox-area");
      this.msgBoxArea.classList.add("msgbox-area");

      document.body.appendChild(this.msgBoxArea);
    }
  }

  show(msg, callback, closeLabel) {
    if (msg === "" || msg === undefined || msg === null) {
      // If the 'msg' parameter is not set, throw an error

      throw "Message is empty or not defined.";
    }

    if (closeLabel === undefined || closeLabel === null) {
      // Of the close label is undefined, or if it is null

      closeLabel = "Close";
    }

    const option = this.option;

    const msgboxBox = document.createElement("DIV");
    const msgboxContent = document.createElement("DIV");
    const msgboxCommand = document.createElement("DIV");
    const msgboxClose = document.createElement("A");

    // Content area of the message box
    msgboxContent.classList.add("msgbox-content");
    msgboxContent.innerText = msg;

    // Command box or the button container
    msgboxCommand.classList.add("msgbox-command");

    // Close button of the message box
    msgboxClose.classList.add("msgbox-close");
    msgboxClose.setAttribute("href", "#");
    msgboxClose.innerText = closeLabel;

    // Container of the Message Box element
    msgboxBox.classList.add("msgbox-box");
    msgboxBox.appendChild(msgboxContent);

    if (
      option.hideCloseButton === false ||
      option.hideCloseButton === undefined
    ) {
      // If the hideCloseButton flag is false, or if it is undefined

      // Append the close button to the container
      msgboxCommand.appendChild(msgboxClose);
      msgboxBox.appendChild(msgboxCommand);
    }

    this.msgBoxArea.appendChild(msgboxBox);

    msgboxClose.onclick = (evt) => {
      evt.preventDefault();

      if (msgboxBox.classList.contains("msgbox-box-hide")) {
        return;
      }

      clearTimeout(this.msgboxTimeout);

      this.msgboxTimeout = null;

      this.hide(msgboxBox, callback);
    };

    if (option.closeTime > 0) {
      this.msgboxTimeout = setTimeout(() => {
        this.hide(msgboxBox, callback);
      }, option.closeTime);
    }
  }

  hideMessageBox(msgboxBox) {
    return new Promise((resolve) => {
      msgboxBox.ontransitionend = () => {
        resolve();
      };
    });
  }

  async hide(msgboxBox, callback) {
    if (msgboxBox !== null) {
      // If the Message Box is not yet closed

      msgboxBox.classList.add("msgbox-box-hide");
    }

    await this.hideMessageBox(msgboxBox);

    this.msgBoxArea.removeChild(msgboxBox);

    clearTimeout(this.msgboxTimeout);

    if (typeof callback === "function") {
      // If the callback parameter is a function

      callback();
    }
  }
}
const msgboxNoClose = new MessageBox({
  closeTime: 2000,
  hideCloseButton: true,
});

const searchParams = new URLSearchParams(location.search);
let I_text = searchParams.get("text");
let model = searchParams.get("model");
const I_image = searchParams.get("image");
const I_select = searchParams.get("select");
const generate = async ({ image, text, model }) => {
  try {
    const cs = new AbortController();
    const to = setTimeout(() => {
      cs.abort();
    }, 2 * 60 * 1000);
    const res = await fetch(
      "https://api734623.ctrlecosystem.com/generate/" + model,
      {
        headers: { "Content-Type": "application/json" },
        signal: cs.signal,
        credentials: "include",
        body: JSON.stringify(
          image
            ? {
                prompt: text?.trim(),
                img: image,
              }
            : {
                prompt: text?.trim(),
              }
        ),
        method: "POST",
      }
    );
    clearTimeout(to);
    const out = await res.json();

    if (!out.ok) {
      if (res.status !== 400) {
        document.getElementById("words").style.display = "flex";
        document.getElementById("login-loader").style.display = "none";
        document.getElementById("login").style.display = "block";
      } else {
        msgboxNoClose.show("An error happened. Please try again!", null, "OK");
      }
    }
    // console.log({ out: out.message });
    return {
      image:
        out.message?.endsWith(".jpg") || out.message?.endsWith(".png")
          ? out.message
          : "",
      text: !(out.message?.endsWith(".jpg") || out.message?.endsWith(".png"))
        ? out.message
        : "",
    };
  } catch (error) {
    console.log(error);
    msgboxNoClose.show("An error happened. Please try again!", null, "OK");
    return {
      text: "An error happened. Please try again!",
    };
  }
};

const addUserMSG = ({ image, text }) => {
  // console.log({ image, text, model });
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
        src: "./images/user.png",
        alt: "AI",
        className: "chatter",
      }),
      span("You")
    ),
    div(
      { className: "msg" },
      $if(text, () => p(text)),
      $if(image, () =>
        img({
          src: image,
          alt: "image prompt",
          onerror() {
            // this.src = image;
          },
        })
      )
    )
  );
  history.appendChild(msg);
  msg.scrollIntoView({ behavior: "smooth", block: "start" });
  addAIMSG({ text, image, model: model.toLowerCase() });
};
const addAIMSG = async ({ image, text, model }) => {
  const history = document.getElementById("chat-history");
  // show loader
  const loader = document.getElementById("loader");
  loader.style.display = "inline-grid";
  history.appendChild(loader);
  loader.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("loader").style.display = "inline-grid";
  let data;
  switch (model) {
    case "mistralai":
      data = await generate({ text, model });
      break;
    case "llama":
      data = await generate({ text, model });
      break;
    case "stable-diffusion":
      data = await generate({ text, model });
    case "sdxl":
      data = await generate({ text, model });
      break;
    case "sdxl-emoji":
      data = await generate({ text, model });
      break;
    case "openjourney":
      data = await generate({ text, model });
      break;
    case "anything":
      data = await generate({ text, image, model });
      break;
    case "swinir":
      data = await generate({ image, model });
      break;
    case "rembg-enhance":
      data = await generate({ image, model });
      break;
    case "cartoonify":
      data = await generate({ image, model });
      break;
    case "object-removal":
      data = await generate({ text, image, model });
      break;
    case "text-extract-ocr":
      data = await generate({ image, model });
      break;
    default:
      model = "sdxl";
      data = await generate({ text, model });
      break;
  }

  // call api
  const msg = ({ image, text }) =>
    li(
      { className: "ai-message" },
      div(
        { className: "user" },
        img({ src: "./images/icon.png", alt: "AI", className: "chatter" }),
        span("Browser AI")
      ),
      div(
        { className: "msg" },
        $if(text, () => p(text)),
        $if(!text && !image, () => p("An error happened. Please try again!")),
        $if(image, () =>
          img({
            src: image,
            alt: "image prompt",
            onerror() {
              this.src = image;
            },
          })
        )
      )
    );
  // console.log({ data, model, text, image });
  document.getElementById("loader").style.display = "none";
  const msgHtml = msg(data);
  history.appendChild(msgHtml);
  msgHtml.scrollIntoView({ behavior: "smooth", block: "start" });
};

const ai = (e) => {
  e?.preventDefault();
  const usersInput = document.getElementById("user-message");
  if (usersInput?.value) {
    addUserMSG({ text: usersInput.value });
    usersInput.value = "";
  } else {
    if (I_text || I_image) {
      addUserMSG({ text: I_text || "", image: I_image });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button-proc").onclick = (e) => {
    ai(e);
  };
  document.getElementById("button-process").onclick = (e) => {
    e?.preventDefault();
    const usersInput = document.getElementById("user-message-1");
    addUserMSG({
      text: `${usersInput.value} ${I_text ? `"${I_text}"` : ""}`,
      image: I_image,
    });
    usersInput.value = "";
    document.getElementById("select").style.display = "none";
    document.getElementById("model-2").style.display = "flex";
    document.getElementById("chat-form").classList.remove("hide");
  };
  document.getElementById("button-process-2").onclick = (e) => {
    document.getElementById("chat-form").classList.remove("hide");

    e?.preventDefault();
    const usersInput = document.getElementById("user-message-1");
    addUserMSG({
      text: `${usersInput.value} ${I_text ? `"${I_text}"` : ""}`,
      image: I_image,
    });
    usersInput.value = "";
    document.getElementById("select").style.display = "none";
    document.getElementById("model-2").style.display = "flex";
    document.getElementById("chat-form").classList.remove("hide");
  };
  if ((I_image || I_text) && !I_select) {
    ai();
  }
});

const buttons = document.querySelectorAll(".button");
let modelled = false;
buttons.forEach((but) => {
  but.addEventListener("click", () => {
    document.querySelector(".button.active")?.classList.remove("active");
    document.querySelector(".button.active")?.classList.remove("active");
    but.classList.add("active");
    model = but.innerText;
    if (but.classList.contains("chat-1")) {
      document.getElementById("chat-form-1").classList.remove("hide");
      document.getElementById("button-process-2").classList.add("hide");
    } else {
      document.getElementById("chat-form-1").classList.add("hide");
      document.getElementById("button-process-2").classList.remove("hide");
    }
  });
  if (but.innerText === model) {
    but.classList.add("active");
    modelled = true;
  }
});

if (!modelled) {
  model = buttons[0].innerText;
  buttons[0].classList.add("active");
  buttons[12].classList.add("active");
}
if (I_select) {
  if (I_image) {
    buttons.forEach((b) => {
      if (b.classList.contains("fx-txt")) {
        b.classList.add("hide");
      } else {
        b.classList.remove("hide");
      }
    });
  } else {
    buttons.forEach((b) => {
      if (b.classList.contains("fx-img")) {
        b.classList.add("hide");
      } else {
        b.classList.remove("hide");
      }
    });
  }
  if (I_image) {
    document.getElementById("selimage").style.display = "block";
    document.getElementById("selimage").src = I_image;
    document.getElementById("model-2").style.display = "none";
    document.getElementById("chat-form-1").classList.add("hide");
  }
  if (I_text) {
    document.getElementById("seltext").style.display = "block";
    document.getElementById(
      "seltext"
    ).innerHTML = `<h3>Selected</h3><div class="selected">${I_text}</div>`;
    document.getElementById("model-2").style.display = "none";
    document.getElementById("button-process-2").style.display = "none";
    document.getElementById("chat-form-1").classList.remove("hide");
  }
  document.getElementById("select").style.display = "flex";
} else {
  document.getElementById("chat-form").classList.remove("hide");
}

// http://127.0.0.1:5500/index.html?text=&image=http://127.0.0.1:5500/images/icon.png&model=Cartoonify
