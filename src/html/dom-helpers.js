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
export function $if(condition, ...elements) {
  if (condition) {
    return elements;
  }
}
export function $ifelse(condition, ifTrue, ifFalse) {
  if (condition) {
    return ifTrue;
  }
  return ifFalse;
}
export function $case(value, ...elements) {
  return (key) => {
    if (key === value) {
      return elements;
    }
    return;
  };
}
export function $switch(key, ...cases) {
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
export function loop(datalist, component) {
  if (typeof component !== "function") {
    throw new Error(
      " \u2718  Cradova err :  Invalid component type, must be a function that returns html  "
    );
  }
  return Array.isArray(datalist) ? datalist.map(component) : undefined;
}
export var makeElement = (element, ElementChildrenAndPropertyList) => {
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
export var cra = (tag) => {
  const extend = (...Children_and_Properties) =>
    makeElement(document.createElement(tag), Children_and_Properties);
  return extend;
};

// src/primitives/dom-objects.ts
export var a = cra("a");
export var article = cra("article");
export var audio = cra("audio");
export var br = cra("br");
export var button = cra("button");
export var canvas = cra("canvas");
export var caption = cra("caption");
export var col = cra("col");
export var colgroup = cra("colgroup");
export var datalist = cra("datalist");
export var details = cra("details");
export var dialog = cra("dialog");
export var div = cra("div");
export var figure = cra("figure");
export var footer = cra("footer");
export var form = cra("form");
export var h1 = cra("h1");
export var h2 = cra("h2");
export var h3 = cra("h3");
export var h4 = cra("h4");
export var h5 = cra("h5");
export var h6 = cra("h6");
export var head = cra("head");
export var header = cra("header");
export var hr = cra("hr");
export var i = cra("i");
export var iframe = cra("iframe");
export var img = cra("img");
export var input = cra("input");
export var label = cra("label");
export var li = cra("li");
export var main = cra("main");
export var nav = cra("nav");
export var ol = cra("ol");
export var optgroup = cra("optgroup");
export var option = cra("option");
export var p = cra("p");
export var progress = cra("progress");
export var q = cra("q");
export var section = cra("section");
export var select = cra("select");
export var source = cra("source");
export var span = cra("span");
export var strong = cra("strong");
export var summary = cra("summary");
export var table = cra("table");
export var tbody = cra("tbody");
export var td = cra("td");
export var template = cra("template");
export var textarea = cra("textarea");
export var th = cra("th");
export var title = cra("title");
export var tr = cra("tr");
export var track = cra("track");
export var u = cra("u");
export var ul = cra("ul");
export var video = cra("video");
export var svg = (svg2, properties) => {
  const span2 = document.createElement("span");
  span2.innerHTML = svg2;
  return makeElement(span2, properties || []);
};
export var raw = (html) => {
  const div2 = document.createElement("div");
  div2.innerHTML = html;
  const df = new DocumentFragment();
  df.append(...Array.from(div2.children));
  return df;
};
