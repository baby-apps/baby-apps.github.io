const canvas = document.querySelector("#drawingCanvas");
const ctx = canvas.getContext("2d");
const templateSvg = document.querySelector("#templateSvg");
const topicTabs = document.querySelector("#topicTabs");
const templateSelect = document.querySelector("#templateSelect");
const templateStrip = document.querySelector("#templateStrip");
const colorGrid = document.querySelector("#colorGrid");
const brushSize = document.querySelector("#brushSize");
const brushOutput = document.querySelector("#brushOutput");
const templateName = document.querySelector("#templateName");
const templateHint = document.querySelector("#templateHint");
const statusPill = document.querySelector("#statusPill");
const drawMode = document.querySelector("#drawMode");
const eraseMode = document.querySelector("#eraseMode");
const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const clearButton = document.querySelector("#clearButton");
const saveButton = document.querySelector("#saveButton");
const sidebarToggle = document.querySelector("#sidebarToggle");
const sidebarScrim = document.querySelector("#sidebarScrim");
const settingsOpen = document.querySelector("#settingsOpen");
const settingsPanel = document.querySelector("#settingsPanel");
const settingsClose = document.querySelector("#settingsClose");
const backgroundSelect = document.querySelector("#backgroundSelect");
const themeSelect = document.querySelector("#themeSelect");
const languageSelect = document.querySelector("#languageSelect");
const samplePanel = document.querySelector("#samplePanel");
const sampleToggle = document.querySelector("#sampleToggle");
const sampleSvg = document.querySelector("#sampleSvg");

const colors = ["#17211d", "#e84135", "#f39c12", "#1f9d55", "#1d73e8", "#7c4dff", "#f06292", "#00a6a6", "#8d5a34", "#ffffff", "#6f7c85", "#ffd54f"];
const svgStyles = `
  <style>
    .template-line{fill:none;stroke:#24352f;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2 22;opacity:.58}
    .template-shape{fill:rgba(255,213,91,.12);stroke:#24352f;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:2 21;opacity:.6}
    .sample-line,.sample-shape{fill:none;stroke:#2f7f75;stroke-width:12;stroke-linecap:round;stroke-linejoin:round}
    .sample-shape{fill:rgba(255,213,91,.2)}
    .guide-fill{fill:rgba(47,127,117,.06);stroke:none}
  </style>
`;

const i18n = {
  en: {
    settings: "Settings",
    topic: "Topic",
    template: "Template",
    color: "Color",
    brush: "Brush",
    background: "Background",
    theme: "Theme",
    language: "Language",
    loginSoon: "Login coming later",
    sample: "Sample",
    ready: "Ready",
    newTemplate: "New template",
    savedStroke: "Saved stroke",
    undo: "Undo",
    redo: "Redo",
    cleared: "Cleared",
    savedPng: "Saved PNG",
    showTools: "Show tools",
    hideTools: "Hide tools",
    showSample: "Show sample",
    hideSample: "Hide sample"
  },
  vi: {
    settings: "Cai dat",
    topic: "Chu de",
    template: "Mau ve",
    color: "Mau",
    brush: "Co but",
    background: "Nen",
    theme: "Giao dien",
    language: "Ngon ngu",
    loginSoon: "Dang nhap de sau",
    sample: "Mau goi y",
    ready: "San sang",
    newTemplate: "Mau moi",
    savedStroke: "Da ve",
    undo: "Hoan tac",
    redo: "Lam lai",
    cleared: "Da xoa",
    savedPng: "Da luu PNG",
    showTools: "Hien cong cu",
    hideTools: "An cong cu",
    showSample: "Hien mau goi y",
    hideSample: "An mau goi y"
  }
};

const settings = {
  background: localStorage.getItem("dottedDrawBackground") || "grid",
  theme: localStorage.getItem("dottedDrawTheme") || "light",
  language: localStorage.getItem("dottedDrawLanguage") || "en",
  sampleVisible: localStorage.getItem("dottedDrawSampleVisible") !== "false"
};

function shapeTemplate(id, name, hint, markup) {
  return { id, name, hint, markup };
}

const letterLinePaths = {
  A: "M260 600 L450 115 L640 600 M330 420 L570 420",
  B: "M300 105 L300 600 M300 110 C590 95 610 340 300 350 M300 350 C630 350 610 610 300 600",
  C: "M650 170 C530 70 260 105 210 330 C150 580 455 675 655 515",
  D: "M295 105 L295 600 M295 105 C650 115 720 580 295 600",
  E: "M620 110 L300 110 L300 600 L625 600 M300 350 L550 350",
  F: "M300 600 L300 110 L625 110 M300 350 L550 350",
  G: "M650 175 C530 70 260 100 210 330 C150 585 455 680 655 515 L655 395 L510 395",
  H: "M270 110 L270 600 M630 110 L630 600 M270 350 L630 350",
  I: "M300 110 L600 110 M450 110 L450 600 M300 600 L600 600",
  J: "M300 110 L620 110 M500 110 L500 515 C500 650 250 650 250 500",
  K: "M290 110 L290 600 M640 110 L290 360 L660 600",
  L: "M300 110 L300 600 L630 600",
  M: "M230 600 L230 110 L450 430 L670 110 L670 600",
  N: "M270 600 L270 110 L630 600 L630 110",
  O: "M450 105 C185 105 185 605 450 605 C715 605 715 105 450 105Z",
  P: "M300 600 L300 110 M300 110 C620 90 620 360 300 360",
  Q: "M450 105 C185 105 185 605 450 605 C715 605 715 105 450 105Z M535 510 L660 625",
  R: "M300 600 L300 110 M300 110 C620 90 620 350 300 350 L650 600",
  S: "M640 165 C520 70 280 95 260 245 C235 410 640 330 625 505 C610 665 340 650 245 545",
  T: "M220 110 L680 110 M450 110 L450 600",
  U: "M270 110 L270 455 C270 650 630 650 630 455 L630 110",
  V: "M245 110 L450 600 L655 110",
  W: "M190 110 L310 600 L450 260 L590 600 L710 110",
  X: "M260 110 L640 600 M640 110 L260 600",
  Y: "M245 110 L450 350 L655 110 M450 350 L450 600",
  Z: "M250 110 L650 110 L250 600 L650 600"
};

const numberLinePaths = {
  0: "M450 105 C215 105 215 605 450 605 C685 605 685 105 450 105Z M330 545 L570 165",
  1: "M360 230 L450 110 L450 600 M335 600 L565 600",
  2: "M270 235 C300 95 635 85 640 250 C645 410 325 405 280 600 L650 600",
  3: "M285 150 C430 70 650 115 600 315 C720 390 625 650 300 565",
  4: "M600 600 L600 110 L240 430 L680 430",
  5: "M635 110 L305 110 L275 330 C470 285 665 365 610 520 C565 650 360 650 250 545",
  6: "M610 150 C390 75 250 265 270 445 C290 650 630 650 625 450 C620 300 360 300 275 445",
  7: "M250 110 L650 110 L390 600",
  8: "M450 340 C250 305 270 105 450 105 C630 105 650 305 450 340 C220 380 250 605 450 605 C650 605 680 380 450 340Z",
  9: "M625 260 C625 90 285 90 275 275 C265 460 545 470 625 275 C625 475 520 625 300 560"
};

function lineTemplate(id, name, path, hint) {
  return {
    id,
    name,
    hint,
    markup: `<path class="template-line" d="${path}"/>`
  };
}

const templates = {
  ABC: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) =>
    lineTemplate(`letter-${letter.toLowerCase()}`, `Letter ${letter}`, letterLinePaths[letter], `Trace uppercase ${letter}.`)
  ),
  Numbers: "0123456789".split("").map((number) =>
    lineTemplate(`number-${number}`, `Number ${number}`, numberLinePaths[number], `Trace number ${number}.`)
  ),
  Animal: [
    shapeTemplate("cat", "Cat", "Trace the ears, face, whiskers, and tail.", `
        <path class="guide-fill" d="M255 260 L315 135 L390 250 Q455 220 520 250 L595 135 L655 260 Q720 385 625 515 Q535 635 360 585 Q215 545 200 390 Q195 320 255 260Z"/>
        <path class="template-shape" d="M255 260 L315 135 L390 250 Q455 220 520 250 L595 135 L655 260 Q720 385 625 515 Q535 635 360 585 Q215 545 200 390 Q195 320 255 260Z"/>
        <path class="template-line" d="M365 360 Q385 345 405 360"/>
        <path class="template-line" d="M505 360 Q525 345 545 360"/>
        <path class="template-line" d="M455 410 L455 445"/>
        <path class="template-line" d="M300 420 L175 385 M305 460 L175 465 M600 420 L735 385 M595 460 L735 465"/>
      `),
    shapeTemplate("dog", "Dog", "Trace the floppy ears, face, and collar.", `
        <path class="guide-fill" d="M250 310 C230 180 350 135 420 240 Q450 220 480 240 C550 135 670 180 650 310 C710 420 640 585 450 585 C260 585 190 420 250 310Z"/>
        <path class="template-shape" d="M250 310 C230 180 350 135 420 240 Q450 220 480 240 C550 135 670 180 650 310 C710 420 640 585 450 585 C260 585 190 420 250 310Z"/>
        <path class="template-line" d="M350 365 Q370 350 390 365 M510 365 Q530 350 550 365"/>
        <path class="template-line" d="M450 405 Q420 435 450 465 Q480 435 450 405"/>
        <path class="template-line" d="M340 530 Q450 585 560 530"/>
      `),
    shapeTemplate("fish", "Fish", "Trace the body, tail, fin, and eye.", `
        <path class="guide-fill" d="M165 350 C285 185 555 185 680 350 C560 515 285 515 165 350Z"/>
        <path class="template-shape" d="M165 350 C285 185 555 185 680 350 C560 515 285 515 165 350Z"/>
        <path class="template-shape" d="M680 350 L805 240 L805 460 Z"/>
        <path class="template-line" d="M405 350 Q455 285 515 350 Q455 405 405 350"/>
        <circle class="template-shape" cx="285" cy="320" r="22"/>
      `),
    shapeTemplate("bird", "Bird", "Trace the rounded bird, wing, beak, and little legs.", `
        <path class="guide-fill" d="M245 350 C250 200 430 130 570 225 C710 320 665 555 460 575 C300 590 215 480 245 350Z"/>
        <path class="template-shape" d="M245 350 C250 200 430 130 570 225 C710 320 665 555 460 575 C300 590 215 480 245 350Z"/>
        <path class="template-shape" d="M585 315 L745 370 L585 425"/>
        <path class="template-line" d="M380 370 C455 300 560 375 500 455 C450 520 350 465 380 370"/>
        <circle class="template-shape" cx="485" cy="285" r="18"/>
        <path class="template-line" d="M395 575 L370 640 M495 575 L520 640"/>
      `),
    shapeTemplate("rabbit", "Rabbit", "Trace the long ears, round face, and paws.", `
        <path class="template-shape" d="M355 270 C300 70 390 55 430 265"/>
        <path class="template-shape" d="M470 265 C510 55 600 70 545 270"/>
        <path class="guide-fill" d="M260 390 C260 245 640 245 640 390 C640 570 260 570 260 390Z"/>
        <path class="template-shape" d="M260 390 C260 245 640 245 640 390 C640 570 260 570 260 390Z"/>
        <path class="template-line" d="M375 370 L375 370 M525 370 L525 370 M450 420 L450 455 M365 500 Q450 555 535 500"/>
      `),
    shapeTemplate("butterfly", "Butterfly", "Trace the wings, body, and antennae.", `
        <path class="template-shape" d="M445 180 C280 70 145 220 255 355 C105 455 245 660 445 470"/>
        <path class="template-shape" d="M455 180 C620 70 755 220 645 355 C795 455 655 660 455 470"/>
        <path class="template-line" d="M450 180 L450 545"/>
        <path class="template-line" d="M450 180 C410 110 360 95 325 115 M450 180 C490 110 540 95 575 115"/>
      `),
    shapeTemplate("turtle", "Turtle", "Trace the shell, head, feet, and tail.", `
        <path class="guide-fill" d="M250 375 C300 210 600 210 650 375 C595 540 305 540 250 375Z"/>
        <path class="template-shape" d="M250 375 C300 210 600 210 650 375 C595 540 305 540 250 375Z"/>
        <path class="template-shape" d="M650 350 C745 310 770 420 665 425"/>
        <path class="template-line" d="M335 375 L565 375 M450 250 L450 500 M315 490 L245 560 M585 490 L655 560 M315 260 L245 190 M585 260 L655 190"/>
      `),
    shapeTemplate("snail", "Snail", "Trace the spiral shell and little body.", `
        <path class="template-shape" d="M300 390 C300 225 555 225 555 390 C555 535 360 535 360 395 C360 295 495 300 495 390 C495 455 420 455 420 395"/>
        <path class="template-shape" d="M535 455 L705 455 Q760 455 760 395 Q760 335 700 335 L650 335"/>
        <path class="template-line" d="M700 335 L670 235 M735 350 L785 260"/>
        <circle class="template-shape" cx="665" cy="225" r="12"/>
        <circle class="template-shape" cx="790" cy="250" r="12"/>
      `)
  ],
  Fruit: [
    shapeTemplate("apple", "Apple", "Trace the apple body, stem, and leaf.", `
        <path class="guide-fill" d="M445 245 C360 175 215 240 205 405 C195 590 380 650 450 560 C520 650 705 590 695 405 C685 240 540 175 455 245Z"/>
        <path class="template-shape" d="M445 245 C360 175 215 240 205 405 C195 590 380 650 450 560 C520 650 705 590 695 405 C685 240 540 175 455 245Z"/>
        <path class="template-line" d="M450 245 C440 190 455 145 500 105"/>
        <path class="template-shape" d="M505 150 C585 95 645 150 600 225 C540 225 515 195 505 150Z"/>
      `),
    shapeTemplate("banana", "Banana", "Trace the long crescent from tip to tip.", `
        <path class="guide-fill" d="M150 360 C335 555 635 565 775 325 C585 470 330 440 220 235 C210 310 185 345 150 360Z"/>
        <path class="template-shape" d="M150 360 C335 555 635 565 775 325 C585 470 330 440 220 235 C210 310 185 345 150 360Z"/>
        <path class="template-line" d="M220 235 C340 400 560 430 775 325"/>
      `),
    shapeTemplate("strawberry", "Strawberry", "Trace the leafy top and the heart-shaped fruit.", `
        <path class="guide-fill" d="M450 640 C260 500 210 315 330 245 C390 210 430 250 450 290 C470 250 510 210 570 245 C690 315 640 500 450 640Z"/>
        <path class="template-shape" d="M450 640 C260 500 210 315 330 245 C390 210 430 250 450 290 C470 250 510 210 570 245 C690 315 640 500 450 640Z"/>
        <path class="template-shape" d="M335 250 L300 155 L395 210 L450 120 L505 210 L600 155 L565 250"/>
        <path class="template-line" d="M360 365 L360 365 M450 390 L450 390 M540 365 L540 365 M410 500 L410 500 M500 500 L500 500"/>
      `),
    shapeTemplate("orange", "Orange", "Trace the round orange and small leaf.", `
        <circle class="guide-fill" cx="450" cy="385" r="215"/>
        <circle class="template-shape" cx="450" cy="385" r="215"/>
        <path class="template-shape" d="M470 185 C540 95 645 135 625 245 C540 245 495 225 470 185Z"/>
        <path class="template-line" d="M450 170 L450 105"/>
      `),
    shapeTemplate("pear", "Pear", "Trace the narrow top and big round bottom.", `
        <path class="guide-fill" d="M450 120 C555 130 570 260 530 325 C665 435 610 640 450 640 C290 640 235 435 370 325 C330 260 345 130 450 120Z"/>
        <path class="template-shape" d="M450 120 C555 130 570 260 530 325 C665 435 610 640 450 640 C290 640 235 435 370 325 C330 260 345 130 450 120Z"/>
        <path class="template-line" d="M450 120 C450 80 470 60 505 45"/>
      `),
    shapeTemplate("grapes", "Grapes", "Trace each grape circle and the leaf.", `
        <circle class="template-shape" cx="410" cy="270" r="55"/><circle class="template-shape" cx="500" cy="270" r="55"/>
        <circle class="template-shape" cx="365" cy="365" r="55"/><circle class="template-shape" cx="455" cy="365" r="55"/><circle class="template-shape" cx="545" cy="365" r="55"/>
        <circle class="template-shape" cx="410" cy="460" r="55"/><circle class="template-shape" cx="500" cy="460" r="55"/><circle class="template-shape" cx="455" cy="555" r="55"/>
        <path class="template-line" d="M455 215 C455 155 490 120 550 105"/>
        <path class="template-shape" d="M545 125 C630 70 700 130 655 215 C595 220 560 185 545 125Z"/>
      `),
    shapeTemplate("pineapple", "Pineapple", "Trace the leaves, oval body, and crisscross lines.", `
        <path class="template-shape" d="M450 90 L405 220 L450 175 L495 220 Z M370 125 L410 250 M530 125 L490 250"/>
        <path class="guide-fill" d="M290 355 C290 210 610 210 610 355 L570 620 L330 620Z"/>
        <path class="template-shape" d="M290 355 C290 210 610 210 610 355 L570 620 L330 620Z"/>
        <path class="template-line" d="M335 320 L565 580 M430 275 L590 455 M565 320 L335 580 M470 275 L310 455"/>
      `),
    shapeTemplate("watermelon", "Watermelon", "Trace the melon slice and seeds.", `
        <path class="guide-fill" d="M170 520 C270 180 630 180 730 520Z"/>
        <path class="template-shape" d="M170 520 C270 180 630 180 730 520Z"/>
        <path class="template-line" d="M220 500 L680 500"/>
        <path class="template-line" d="M350 390 C330 425 370 425 350 390 M450 340 C430 375 470 375 450 340 M550 390 C530 425 570 425 550 390"/>
      `)
  ],
  Vehicles: [
    shapeTemplate("car", "Car", "Trace the car body, roof, and wheels.", `
        <path class="guide-fill" d="M160 440 L245 310 L570 310 L675 440 L740 440 L740 535 L160 535Z"/>
        <path class="template-shape" d="M160 440 L245 310 L570 310 L675 440 L740 440 L740 535 L160 535Z"/>
        <circle class="template-shape" cx="285" cy="535" r="58"/><circle class="template-shape" cx="620" cy="535" r="58"/>
        <path class="template-line" d="M315 330 L285 430 L565 430 L520 330"/>
      `),
    shapeTemplate("bus", "Bus", "Trace the bus, windows, and wheels.", `
        <path class="guide-fill" d="M145 250 L755 250 L755 545 L145 545Z"/>
        <path class="template-shape" d="M145 250 L755 250 L755 545 L145 545Z"/>
        <path class="template-shape" d="M205 305 L330 305 L330 400 L205 400Z M380 305 L505 305 L505 400 L380 400Z M555 305 L680 305 L680 400 L555 400Z"/>
        <circle class="template-shape" cx="285" cy="545" r="55"/><circle class="template-shape" cx="625" cy="545" r="55"/>
      `),
    shapeTemplate("train", "Train", "Trace the train engine, cars, and wheels.", `
        <path class="template-shape" d="M140 405 L280 405 L280 300 L415 300 L415 530 L140 530Z"/>
        <path class="template-shape" d="M415 360 L760 360 L760 530 L415 530Z"/>
        <path class="template-line" d="M315 300 L315 215 L380 215 L380 300"/>
        <circle class="template-shape" cx="230" cy="540" r="38"/><circle class="template-shape" cx="500" cy="540" r="38"/><circle class="template-shape" cx="680" cy="540" r="38"/>
      `),
    shapeTemplate("airplane", "Airplane", "Trace the wings, body, and tail.", `
        <path class="template-shape" d="M115 365 L790 315 Q835 350 790 385 L115 365Z"/>
        <path class="template-shape" d="M420 340 L280 160 L385 160 L555 330"/>
        <path class="template-shape" d="M420 390 L280 570 L385 570 L555 400"/>
        <path class="template-shape" d="M160 360 L95 260 L170 285"/>
      `),
    shapeTemplate("boat", "Boat", "Trace the sail, mast, and curved boat.", `
        <path class="template-line" d="M450 130 L450 450"/>
        <path class="template-shape" d="M450 150 L235 430 L450 430Z"/>
        <path class="template-shape" d="M470 180 L680 430 L470 430Z"/>
        <path class="template-shape" d="M180 470 C285 625 615 625 720 470Z"/>
      `),
    shapeTemplate("bike", "Bike", "Trace both wheels, frame, seat, and handle.", `
        <circle class="template-shape" cx="275" cy="505" r="105"/><circle class="template-shape" cx="625" cy="505" r="105"/>
        <path class="template-line" d="M275 505 L410 330 L505 505 L275 505 L445 505 L625 505 L500 305"/>
        <path class="template-line" d="M410 330 L515 330 M370 290 L450 290 M500 305 L610 250 L665 280"/>
      `)
  ],
  Nature: [
    shapeTemplate("tree", "Tree", "Trace the leafy top and trunk.", `
        <path class="guide-fill" d="M450 105 C575 105 620 220 570 300 C690 335 665 510 520 505 C490 610 350 610 380 505 C235 510 210 335 330 300 C280 220 325 105 450 105Z"/>
        <path class="template-shape" d="M450 105 C575 105 620 220 570 300 C690 335 665 510 520 505 C490 610 350 610 380 505 C235 510 210 335 330 300 C280 220 325 105 450 105Z"/>
        <path class="template-shape" d="M395 500 L505 500 L525 640 L375 640Z"/>
      `),
    shapeTemplate("flower", "Flower", "Trace the petals, center, stem, and leaves.", `
        <circle class="template-shape" cx="450" cy="270" r="50"/>
        <path class="template-shape" d="M450 220 C390 100 510 100 450 220 M500 270 C620 210 620 330 500 270 M450 320 C510 440 390 440 450 320 M400 270 C280 330 280 210 400 270"/>
        <path class="template-line" d="M450 320 L450 635"/>
        <path class="template-shape" d="M445 455 C320 390 300 515 445 500 M455 535 C590 465 610 600 455 580"/>
      `),
    shapeTemplate("sun", "Sun", "Trace the circle and sunshine rays.", `
        <circle class="template-shape" cx="450" cy="350" r="135"/>
        <path class="template-line" d="M450 90 L450 180 M450 520 L450 610 M190 350 L280 350 M620 350 L710 350 M265 165 L330 230 M570 470 L635 535 M635 165 L570 230 M330 470 L265 535"/>
      `),
    shapeTemplate("cloud", "Cloud", "Trace the soft cloud bumps.", `
        <path class="guide-fill" d="M205 455 C135 455 125 335 230 325 C235 215 390 195 445 285 C540 210 680 275 660 390 C765 395 750 525 640 525 L230 525 C180 525 160 475 205 455Z"/>
        <path class="template-shape" d="M205 455 C135 455 125 335 230 325 C235 215 390 195 445 285 C540 210 680 275 660 390 C765 395 750 525 640 525 L230 525 C180 525 160 475 205 455Z"/>
      `),
    shapeTemplate("mountain", "Mountain", "Trace the mountain peaks and snow lines.", `
        <path class="template-shape" d="M120 600 L355 185 L475 390 L570 250 L790 600Z"/>
        <path class="template-line" d="M305 275 L355 350 L405 275 M535 320 L570 375 L610 320"/>
      `),
    shapeTemplate("leaf", "Leaf", "Trace the leaf outline and center vein.", `
        <path class="guide-fill" d="M180 560 C245 210 555 95 740 155 C690 455 440 640 180 560Z"/>
        <path class="template-shape" d="M180 560 C245 210 555 95 740 155 C690 455 440 640 180 560Z"/>
        <path class="template-line" d="M205 545 C360 420 495 285 720 165 M405 390 L390 275 M470 335 L590 335"/>
      `),
    shapeTemplate("rainbow", "Rainbow", "Trace each rainbow arc.", `
        <path class="template-line" d="M150 565 C175 185 725 185 750 565"/>
        <path class="template-line" d="M235 565 C260 295 640 295 665 565"/>
        <path class="template-line" d="M320 565 C335 405 565 405 580 565"/>
      `)
  ],
  Shapes: [
    shapeTemplate("circle", "Circle", "Trace one smooth circle.", `<circle class="template-shape" cx="450" cy="350" r="230"/>`),
    shapeTemplate("square", "Square", "Trace all four sides.", `<path class="template-shape" d="M225 125 L675 125 L675 575 L225 575Z"/>`),
    shapeTemplate("triangle", "Triangle", "Trace all three sides.", `<path class="template-shape" d="M450 110 L720 590 L180 590Z"/>`),
    shapeTemplate("rectangle", "Rectangle", "Trace the long rectangle.", `<path class="template-shape" d="M150 210 L750 210 L750 510 L150 510Z"/>`),
    shapeTemplate("heart", "Heart", "Trace both bumps and the bottom point.", `<path class="guide-fill" d="M450 620 C225 455 150 295 270 210 C350 150 420 205 450 280 C480 205 550 150 630 210 C750 295 675 455 450 620Z"/><path class="template-shape" d="M450 620 C225 455 150 295 270 210 C350 150 420 205 450 280 C480 205 550 150 630 210 C750 295 675 455 450 620Z"/>`),
    shapeTemplate("star", "Star", "Trace each point around the star.", `<path class="template-shape" d="M450 90 L535 275 L735 295 L585 430 L630 625 L450 525 L270 625 L315 430 L165 295 L365 275 Z"/>`),
    shapeTemplate("diamond", "Diamond", "Trace the four diamond points.", `<path class="template-shape" d="M450 90 L735 350 L450 610 L165 350Z"/>`),
    shapeTemplate("oval", "Oval", "Trace the wide oval.", `<ellipse class="template-shape" cx="450" cy="350" rx="290" ry="190"/>`)
  ],
  Home: [
    shapeTemplate("house", "House", "Trace the roof, walls, door, and window.", `
        <path class="guide-fill" d="M190 360 L450 135 L710 360 L665 360 L665 610 L235 610 L235 360Z"/>
        <path class="template-shape" d="M190 360 L450 135 L710 360"/>
        <path class="template-shape" d="M235 360 L235 610 L665 610 L665 360"/>
        <path class="template-shape" d="M395 610 L395 455 L505 455 L505 610"/>
        <path class="template-shape" d="M285 410 L365 410 L365 490 L285 490Z"/>
        <path class="template-shape" d="M535 410 L615 410 L615 490 L535 490Z"/>
      `),
    shapeTemplate("chair", "Chair", "Trace the back, seat, and legs.", `
        <path class="template-shape" d="M330 150 L570 150 L570 410 L330 410Z"/>
        <path class="template-shape" d="M265 410 L635 410 L635 505 L265 505Z"/>
        <path class="template-line" d="M320 505 L285 640 M580 505 L615 640"/>
      `),
    shapeTemplate("bed", "Bed", "Trace the bed frame, pillow, and blanket.", `
        <path class="template-shape" d="M150 360 L750 360 L750 555 L150 555Z"/>
        <path class="template-shape" d="M185 280 L375 280 L375 360 L185 360Z"/>
        <path class="template-line" d="M150 555 L150 625 M750 555 L750 625 M390 360 L390 555"/>
      `),
    shapeTemplate("lamp", "Lamp", "Trace the shade, pole, and base.", `
        <path class="template-shape" d="M330 170 L570 170 L640 365 L260 365Z"/>
        <path class="template-line" d="M450 365 L450 565"/>
        <path class="template-shape" d="M330 565 L570 565 L625 635 L275 635Z"/>
      `),
    shapeTemplate("cup", "Cup", "Trace the cup body and handle.", `
        <path class="guide-fill" d="M285 215 L590 215 L555 595 L320 595Z"/>
        <path class="template-shape" d="M285 215 L590 215 L555 595 L320 595Z"/>
        <path class="template-shape" d="M590 300 C735 285 735 505 570 485"/>
      `),
    shapeTemplate("book", "Book", "Trace the open book and page lines.", `
        <path class="template-shape" d="M450 220 C340 140 220 160 150 220 L150 570 C255 505 350 505 450 570Z"/>
        <path class="template-shape" d="M450 220 C560 140 680 160 750 220 L750 570 C645 505 550 505 450 570Z"/>
        <path class="template-line" d="M450 220 L450 570 M230 285 C310 255 370 270 430 315 M230 375 C310 345 370 360 430 405 M670 285 C590 255 530 270 470 315 M670 375 C590 345 530 360 470 405"/>
      `)
  ],
  Space: [
    shapeTemplate("rocket", "Rocket", "Trace the rocket body, fins, window, and flame.", `
        <path class="guide-fill" d="M450 85 C545 175 585 340 545 510 L450 555 L355 510 C315 340 355 175 450 85Z"/>
        <path class="template-shape" d="M450 85 C545 175 585 340 545 510 L450 555 L355 510 C315 340 355 175 450 85Z"/>
        <circle class="template-shape" cx="450" cy="270" r="55"/>
        <path class="template-shape" d="M355 455 L245 565 L370 545"/>
        <path class="template-shape" d="M545 455 L655 565 L530 545"/>
        <path class="template-shape" d="M415 555 C375 625 430 665 450 610 C470 665 525 625 485 555"/>
      `),
    shapeTemplate("moon", "Moon", "Trace the crescent moon.", `<path class="guide-fill" d="M560 110 C390 155 310 345 400 505 C455 605 575 640 690 590 C515 555 430 390 505 235 C540 165 590 130 560 110Z"/><path class="template-shape" d="M560 110 C390 155 310 345 400 505 C455 605 575 640 690 590 C515 555 430 390 505 235 C540 165 590 130 560 110Z"/>`),
    shapeTemplate("planet", "Planet", "Trace the planet and ring.", `<circle class="guide-fill" cx="450" cy="350" r="165"/><circle class="template-shape" cx="450" cy="350" r="165"/><ellipse class="template-shape" cx="450" cy="350" rx="330" ry="90" transform="rotate(-15 450 350)"/>`),
    shapeTemplate("comet", "Comet", "Trace the comet head and tail.", `<circle class="template-shape" cx="625" cy="280" r="90"/><path class="template-line" d="M545 320 C410 345 295 430 170 560 M560 255 C410 225 285 260 145 330 M575 360 C435 435 340 535 250 640"/>`),
    shapeTemplate("ufo", "UFO", "Trace the dome, saucer, and lights.", `<path class="template-shape" d="M330 330 C350 190 550 190 570 330"/><ellipse class="guide-fill" cx="450" cy="390" rx="315" ry="95"/><ellipse class="template-shape" cx="450" cy="390" rx="315" ry="95"/><path class="template-line" d="M300 425 L300 425 M450 455 L450 455 M600 425 L600 425"/>`)
  ]
};

let currentTopic = "ABC";
let currentTemplate = templates[currentTopic][0];
let currentColor = colors[0];
let mode = "draw";
let isDrawing = false;
let lastPoint = null;
let undoStack = [];
let redoStack = [];
let lastStatusKey = "ready";

function renderTopics() {
  topicTabs.innerHTML = "";
  Object.keys(templates).forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `topic-button${topic === currentTopic ? " active" : ""}`;
    button.textContent = topic;
    button.addEventListener("click", () => selectTopic(topic));
    topicTabs.append(button);
  });
}

function renderTemplates() {
  templateSelect.innerHTML = "";
  templateStrip.innerHTML = "";

  templates[currentTopic].forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.append(option);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `template-chip${template.id === currentTemplate.id ? " active" : ""}`;
    chip.title = template.name;
    chip.ariaLabel = template.name;
    chip.innerHTML = `<svg viewBox="0 0 900 700">${svgStyles}${template.markup}</svg>`;
    chip.addEventListener("click", () => selectTemplate(template.id));
    templateStrip.append(chip);
  });

  templateSelect.value = currentTemplate.id;
}

function renderColors() {
  colorGrid.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-swatch${color === currentColor ? " active" : ""}`;
    button.style.background = color;
    button.title = color;
    button.ariaLabel = `Use color ${color}`;
    button.addEventListener("click", () => {
      currentColor = color;
      mode = "draw";
      renderColors();
      renderModeButtons();
    });
    colorGrid.append(button);
  });
}

function selectTopic(topic) {
  currentTopic = topic;
  currentTemplate = templates[topic][0];
  renderTopics();
  renderTemplates();
  loadTemplate();
}

function selectTemplate(templateId) {
  currentTemplate = templates[currentTopic].find((template) => template.id === templateId);
  renderTemplates();
  loadTemplate();
}

function loadTemplate() {
  templateName.textContent = currentTemplate.name;
  templateHint.textContent = currentTemplate.hint;
  templateSvg.innerHTML = `${svgStyles}${currentTemplate.markup}`;
  sampleSvg.innerHTML = `${svgStyles}${makeSampleMarkup(currentTemplate.markup)}`;
  setStatus("newTemplate");
  clearDrawing(false);
}

function makeSampleMarkup(markup) {
  return markup
    .replaceAll("template-line", "sample-line")
    .replaceAll("template-shape", "sample-shape")
    .replaceAll("guide-fill", "sample-guide");
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  redrawFromUndoStack();
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startDrawing(event) {
  event.preventDefault();
  isDrawing = true;
  lastPoint = getPoint(event);
  redoStack = [];
  undoStack.push({
    mode,
    color: currentColor,
    size: Number(brushSize.value),
    points: [lastPoint]
  });
  drawPoint(lastPoint, undoStack.at(-1));
  updateHistoryButtons();
}

function continueDrawing(event) {
  if (!isDrawing) return;
  event.preventDefault();
  const point = getPoint(event);
  const stroke = undoStack.at(-1);
  drawLine(lastPoint, point, stroke);
  stroke.points.push(point);
  lastPoint = point;
}

function endDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  lastPoint = null;
  setStatus("savedStroke");
  updateHistoryButtons();
}

function prepareStroke(stroke) {
  ctx.globalCompositeOperation = stroke.mode === "erase" ? "destination-out" : "source-over";
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function drawPoint(point, stroke) {
  prepareStroke(stroke);
  ctx.beginPath();
  ctx.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawLine(from, to, stroke) {
  prepareStroke(stroke);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

function redrawFromUndoStack() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack.forEach((stroke) => {
    if (stroke.points.length === 1) {
      drawPoint(stroke.points[0], stroke);
      return;
    }
    for (let index = 1; index < stroke.points.length; index += 1) {
      drawLine(stroke.points[index - 1], stroke.points[index], stroke);
    }
  });
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(undoStack.pop());
  redrawFromUndoStack();
  setStatus("undo");
  updateHistoryButtons();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(redoStack.pop());
  redrawFromUndoStack();
  setStatus("redo");
  updateHistoryButtons();
}

function clearDrawing(showStatus = true) {
  undoStack = [];
  redoStack = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (showStatus) setStatus("cleared");
  updateHistoryButtons();
}

function renderModeButtons() {
  drawMode.classList.toggle("active", mode === "draw");
  eraseMode.classList.toggle("active", mode === "erase");
}

function updateHistoryButtons() {
  undoButton.disabled = undoStack.length === 0;
  redoButton.disabled = redoStack.length === 0;
}

function setStatus(key) {
  lastStatusKey = key;
  statusPill.textContent = i18n[settings.language][key] || key;
}

function saveImage() {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 900;
  exportCanvas.height = 700;
  const exportCtx = exportCanvas.getContext("2d");
  const svgData = new XMLSerializer().serializeToString(templateSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    exportCtx.fillStyle = "#fffdf7";
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(image, 0, 0, 900, 700);
    exportCtx.drawImage(canvas, 0, 0, 900, 700);
    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.download = `${currentTemplate.id}-drawing.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    setStatus("savedPng");
  };

  image.src = url;
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  sidebarToggle.setAttribute("aria-expanded", "true");
  sidebarToggle.setAttribute("aria-label", i18n[settings.language].hideTools);
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebarToggle.setAttribute("aria-label", i18n[settings.language].showTools);
}

function openSettings() {
  settingsPanel.classList.add("open");
  settingsPanel.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsPanel.setAttribute("aria-hidden", "true");
}

function applySettings() {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.background = settings.background;
  backgroundSelect.value = settings.background;
  themeSelect.value = settings.theme;
  languageSelect.value = settings.language;
  samplePanel.classList.toggle("hidden", !settings.sampleVisible);
  sampleToggle.setAttribute("aria-label", settings.sampleVisible ? i18n[settings.language].hideSample : i18n[settings.language].showSample);
  translateUi();
}

function translateUi() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = i18n[settings.language][key] || element.textContent;
  });
  setStatus(lastStatusKey);
  closeSidebar();
}

function saveSetting(key, value) {
  settings[key] = value;
  localStorage.setItem(`dottedDraw${key[0].toUpperCase()}${key.slice(1)}`, value);
  applySettings();
}

templateSelect.addEventListener("change", (event) => selectTemplate(event.target.value));
brushSize.addEventListener("input", () => {
  brushOutput.textContent = brushSize.value;
});
drawMode.addEventListener("click", () => {
  mode = "draw";
  renderModeButtons();
});
eraseMode.addEventListener("click", () => {
  mode = "erase";
  renderModeButtons();
});
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
clearButton.addEventListener("click", () => clearDrawing());
saveButton.addEventListener("click", saveImage);
sidebarToggle.addEventListener("click", () => {
  if (document.body.classList.contains("sidebar-open")) closeSidebar();
  else openSidebar();
});
sidebarScrim.addEventListener("click", closeSidebar);
settingsOpen.addEventListener("click", openSettings);
settingsClose.addEventListener("click", closeSettings);
settingsPanel.addEventListener("click", (event) => {
  if (event.target === settingsPanel) closeSettings();
});
backgroundSelect.addEventListener("change", (event) => saveSetting("background", event.target.value));
themeSelect.addEventListener("change", (event) => saveSetting("theme", event.target.value));
languageSelect.addEventListener("change", (event) => saveSetting("language", event.target.value));
sampleToggle.addEventListener("click", () => {
  settings.sampleVisible = !settings.sampleVisible;
  localStorage.setItem("dottedDrawSampleVisible", String(settings.sampleVisible));
  applySettings();
});
canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", continueDrawing);
canvas.addEventListener("pointerup", endDrawing);
canvas.addEventListener("pointercancel", endDrawing);
canvas.addEventListener("pointerleave", endDrawing);
window.addEventListener("resize", resizeCanvas);

renderTopics();
renderTemplates();
renderColors();
loadTemplate();
renderModeButtons();
updateHistoryButtons();
applySettings();
requestAnimationFrame(resizeCanvas);
