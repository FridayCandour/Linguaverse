function Rhoda(l) {
  const fg = new DocumentFragment();
  for (let ch of l) {
    if (Array.isArray(ch)) {
      fg.appendChild(Rhoda(ch));
    } else {
      if (typeof ch === "function") {
        ch = ch();
        if (typeof ch === "function") {
          ch = ch();
        }
      }
      if (typeof ch === "string" || typeof ch === "number") {
        fg.appendChild(document.createTextNode(ch));
        continue;
      }
      if (ch instanceof HTMLElement || ch instanceof DocumentFragment) {
        fg.appendChild(ch);
      } else {
        if (typeof ch !== "undefined") {
          throw new Error(
            "  \u2718  Cradova err:  invalid child type: " +
              ch +
              " (" +
              typeof ch +
              ")"
          );
        }
      }
    }
  }
  return fg;
}
function $if(condition, ...elements) {
  if (condition) {
    return elements;
  }
}
function $ifelse(condition, ifTrue, ifFalse) {
  if (condition) {
    return ifTrue;
  }
  return ifFalse;
}
function $case(value, ...elements) {
  return (key) => {
    if (key === value) {
      return elements;
    }
    return;
  };
}
function $switch(key, ...cases) {
  if (cases.length) {
    for (let i = 0; i < cases.length; i++) {
      const case_N = cases[i];
      const elements = case_N(key);
      if (elements) {
        return elements;
      }
    }
  }
  return;
}
function loop(datalist, component) {
  if (typeof component !== "function") {
    throw new Error(
      " \u2718  Cradova err :  Invalid component type, must be a function that returns html  "
    );
  }
  return Array.isArray(datalist) ? datalist.map(component) : undefined;
}
var makeElement = (element, ElementChildrenAndPropertyList) => {
  let props = {},
    text = null;
  if (ElementChildrenAndPropertyList.length !== 0) {
    for (let i = 0; i < ElementChildrenAndPropertyList.length; i++) {
      let child = ElementChildrenAndPropertyList[i];
      if (typeof child === "function") {
        child = child();
      }

      if (child instanceof HTMLElement || child instanceof DocumentFragment) {
        element.appendChild(child);
        continue;
      }
      if (Array.isArray(child)) {
        element.appendChild(Rhoda(child));
        continue;
      }
      if (typeof child === "string" || typeof child === "number") {
        text = child;
        continue;
      }
      if (typeof child === "object") {
        props = Object.assign(props, child);
        continue;
      }
    }
  } else {
    return element;
  }
  if (typeof props === "object" && element) {
    for (const [prop, value] of Object.entries(props)) {
      if (prop === "style" && typeof value === "object") {
        Object.assign(element.style, value);
        continue;
      }
      if (prop.includes("data-")) {
        element.setAttribute(prop, value);
        continue;
      }
      if (prop.includes("aria-")) {
        element.setAttribute(prop, value);
        continue;
      }
      if (prop === "href" && typeof value === "string") {
        element.setAttribute(prop, value);
        continue;
      }
      if (typeof element.style[prop] !== "undefined" && prop !== "src") {
        element.style[prop] = value;
        continue;
      }

      element[prop] = value;
    }
  }
  if (text) {
    element.appendChild(document.createTextNode(text));
  }
  return element;
};
var cra = (tag) => {
  const extend = (...Children_and_Properties) =>
    makeElement(document.createElement(tag), Children_and_Properties);
  return extend;
};

// src/primitives/dom-objects.ts
var a = cra("a");
var article = cra("article");
var audio = cra("audio");
var br = cra("br");
var button = cra("button");
var canvas = cra("canvas");
var caption = cra("caption");
var col = cra("col");
var colgroup = cra("colgroup");
var datalist = cra("datalist");
var details = cra("details");
var dialog = cra("dialog");
var div = cra("div");
var figure = cra("figure");
var footer = cra("footer");
var form = cra("form");
var h1 = cra("h1");
var h2 = cra("h2");
var h3 = cra("h3");
var h4 = cra("h4");
var h5 = cra("h5");
var h6 = cra("h6");
var head = cra("head");
var header = cra("header");
var hr = cra("hr");
var i = cra("i");
var iframe = cra("iframe");
var img = cra("img");
var input = cra("input");
var label = cra("label");
var li = cra("li");
var main = cra("main");
var nav = cra("nav");
var ol = cra("ol");
var optgroup = cra("optgroup");
var option = cra("option");
var p = cra("p");
var progress = cra("progress");
var q = cra("q");
var section = cra("section");
var select = cra("select");
var source = cra("source");
var span = cra("span");
var strong = cra("strong");
var summary = cra("summary");
var table = cra("table");
var tbody = cra("tbody");
var td = cra("td");
var template = cra("template");
var textarea = cra("textarea");
var th = cra("th");
var title = cra("title");
var tr = cra("tr");
var track = cra("track");
var u = cra("u");
var ul = cra("ul");
var video = cra("video");
var svg = (svg2, properties) => {
  const span2 = document.createElement("span");
  span2.innerHTML = svg2;
  return makeElement(span2, properties || []);
};
var raw = (html) => {
  const div2 = document.createElement("div");
  div2.innerHTML = html;
  const df = new DocumentFragment();
  df.append(...Array.from(div2.children));
  return df;
};
