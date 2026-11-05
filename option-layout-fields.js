import { cleanText, textAttribute } from "./attribute-text.js";

// tangy-form's `layout` (radio buttons, radio blocks, checkboxes) and `image-display` (radio blocks,
// checkboxes) as editor fields. The defaults ("list", "beside") are what tangy-form does with no
// attribute, so they are never written into the form.
const LAYOUTS = [
  ["list", "List (one option per line)"],
  ["wrap", "Wrap (options side by side, wrapping)"],
  ["squares", "Squares (equal tiles)"],
  ["fit", "Fit (all options on one row)"],
];
const IMAGE_DISPLAYS = [
  ["beside", "Picture beside the text"],
  ["top", "Picture above the text"],
  ["fill", "Picture fills the tile"],
];

export function upcastOptionLayout(element) {
  return {
    layout: cleanText(element.getAttribute("layout")) || "list",
    imageDisplay: cleanText(element.getAttribute("image-display")) || "beside",
  };
}

export function downcastOptionLayout(config) {
  const layout = config.layout === "list" ? "" : config.layout;
  const imageDisplay = config.imageDisplay === "beside" ? "" : config.imageDisplay;
  return [textAttribute("layout", layout), textAttribute("image-display", imageDisplay)]
    .filter(Boolean)
    .join(" ");
}

const select = (name, label, value, choices) => `
  <label for="${name}" style="font-weight: bold; font-size: 1.2em;">${label}:</label>
  <tangy-select name="${name}" value="${value}">
    ${choices.map(([choice, text]) => `<option value="${choice}">${text}</option>`).join("")}
  </tangy-select>`;

export function renderEditOptionLayout(config, { imageDisplay = false } = {}) {
  return (
    select("layout", "Layout", cleanText(config.layout) || "list", LAYOUTS) +
    (imageDisplay
      ? select("imageDisplay", "Option pictures", cleanText(config.imageDisplay) || "beside", IMAGE_DISPLAYS)
      : "")
  );
}

export function onSubmitOptionLayout(formEl, { imageDisplay = false } = {}) {
  const value = (name) => formEl.querySelector(`tangy-select[name=${name}]`).value;
  return imageDisplay
    ? { layout: value("layout"), imageDisplay: value("imageDisplay") }
    : { layout: value("layout") };
}
