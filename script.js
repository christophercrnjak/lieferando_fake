let menus = ["Tonkotsu Ramen", "Spicy Miso Ramen", "Shio Ramen"];
let menuDescriptions = [
  "Tonkotsu Ramen ist ein Ramengericht, das seinen Ursprung in Fukuoka in der Präfektur Fukuoka auf der japanischen Insel Kyushu hat und sowohl in Fukuoka als auch in Kyushu ein Spezialgericht ist. Die Brühe für Tonkotsu-Ramen basiert auf Schweineknochen, und Tonkotsu bedeutet auf Japanisch „Schweineknochen“.",
  "Spicy Miso Ramen ist eine würzige Variante des klassischen japanischen Ramens. Es besteht aus Ramen-Nudeln in einer herzhaften Brühe aus Miso-Paste, Gewürzen und Sojasauce. Häufig werden Knoblauch, Ingwer, Frühlingszwiebeln und Fleischbeilagen wie Chashu (gebratenes Schweinefleisch) hinzugefügt. Das Gericht ist bekannt für seinen pikanten Geschmack und seine köstliche Aromenvielfalt.",
  "Shio Ramen ist eine traditionelle japanische Nudelsuppe mit einer klaren, salzbasierten Brühe. Im Gegensatz zu anderen Ramen-Varianten zeichnet sich Shio Ramen durch seinen leichten und salzigen Geschmack aus. Die Brühe wird aus Hühner- oder Schweineknochen zubereitet und mit Salz gewürzt. Die Nudeln werden zusammen mit Zutaten wie Gemüse, Nori-Algen und Frühlingszwiebeln serviert. Das Ergebnis ist eine erfrischende Ramen-Variante mit einem ausgewogenen Geschmack.",
];
let menuPrices = [8.99, 9.99, 10.99];

let basketMenus = [];
let basketPrices = [];
let basketAmounts = [];


function init() {
  renderMenus();
}

function render() {
  renderMenus();
  renderBasketItems();
  renderBasketSum();
  renderMobileBasketItems();
  renderMobileBasketSum();
  renderMenusBasketButton()
}

function renderMenus() {
  let content = document.getElementById("__menuDiv__");
  content.innerHTML = "";

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    const menuDescription = menuDescriptions[i];
    const menuPrice = menuPrices[i];
    content.innerHTML += renderMenusHTML(menu, menuDescription, menuPrice);
  }
}

function renderMenusBasketButton() {
  let content = document.getElementById("__menuDiv__");
  if (calcWholeAmount() != 0) {
    content.innerHTML += /*html*/`
      <button onclick="showMobileBasket()" class="__basketButton__">Warenkorb(${calcWholeAmount()})</button>
    `;
  } else {
    content.classList.add("__dNone");
    content.classList.remove("__basketButton__");
  }
}

function calcWholeAmount() {
  if (basketAmounts != 0) {
    let sum = basketAmounts.reduce(adding);
    return sum;
  } else {
    return 0;
  }
}

function renderMenusHTML(menu, menuDescription, menuPrice) {
  return /*html*/ `
    <div class = "__menu__">
      <div class="__menuContent__">
        <div class="__bold__">
          ${menu}
        </div>
        <div class="__font12__">
          ${menuDescription}
        </div>
        <div class="__bold__">
          ${menuPrice} €
        </div>
      </div>
      <button onclick="addToBasket('${menu}', ${menuPrice})">+</button>
    </div>
  `;
}

function addToBasket(menu, menuPrice) {
  let index = getMenuIndex(menu);
  if (index != -1) {
    basketAmounts[index]++;
    let menuPriceSum = basketAmounts[index] * menuPrice;
    basketPrices[index] = menuPriceSum;
  } else {
    basketMenus.push(menu);
    basketPrices.push(menuPrice);
    basketAmounts.push(1);
  }
  render();
}

function getMenuIndex(menu) {
  let index = basketMenus.indexOf(menu);
  return index;
}

function renderBasketItems() {
  let content = document.getElementById('aside');
  content.innerHTML = "";

  for (let i = 0; i < basketMenus.length; i++) {
    const basketMenu = basketMenus[i];
    const basketPrice = basketPrices[i].toFixed(2);
    const basketAmount = basketAmounts[i];
    content.innerHTML += renderBasketHTML(i, basketMenu, basketPrice, basketAmount);
  }
}

function renderBasketHTML(i, basketMenu, basketPrice, basketAmount) {
  return /*html*/ `
    <div class="__shoppingBasketItem__" id="__shoppingBasketItem__${i}">
      <div class="__shoppingBasketItemAmount __bold__">${basketAmount}</div>
      <div class="__shoppingBasketItemContent__">
        <div class="__shoppingBasketItemInfo__">
          <div class="__bold__">${basketMenu}</div>
          <div id="basketprice${i}">${basketPrice} €</div>
        </div>
        <div class="__shoppingBasketItemAmountChanger__">
          <div class="__round__ __noborder__ __bgGrey__ __cursor__ __font24__ __32x32__ __textCentered__ __buttons__" onclick="reduceShoppingBasket(${i}, ${basketAmount}, ${basketPrice})">-</div>
          <div class="__bold__">${basketAmount}</div>
          <div class="__round__ __noborder__ __bgGrey__ __cursor__ __font24__ __32x32__ __textCentered__ __buttons__" onclick="increaseShoppingBasket(${i}, ${basketPrice})">+</div>
        </div>
      </div>
    </div>
    `;
}

function renderMobileBasketItems() {
  let content = document.getElementById("__mobileBasket__");
  content.innerHTML = "";

  for (let i = 0; i < basketMenus.length; i++) {
    const basketMenu = basketMenus[i];
    const basketPrice = basketPrices[i].toFixed(2);
    const basketAmount = basketAmounts[i];
    content.innerHTML += renderBasketHTML(i, basketMenu, basketPrice, basketAmount);
  }
}

function reduceShoppingBasket(i, basketAmount, basketPrice) {
  if (basketAmount > 1) {
    basketAmounts[i]--;
    basketPrices[i] = menuPrices[i] * basketAmounts[i];

    render();
  } else {
    // splice from array
    basketPrices.splice([i], 1);
    basketMenus.splice([i], 1);
    basketAmounts.splice([i], 1);
    // remove element from DOM
    // to-do: not close mobileBasketView if just 1 menu has amount of 0
    const elementToRemove = document.getElementById(`__shoppingBasketItem__${i}`)
    elementToRemove.remove();
    showWholePage(); //no need to render();
  }
}

function checkAllBasketArraysAmount() {
}

function increaseShoppingBasket(i, basketPrice) {
  basketAmounts[i]++;

  basketPrices[i] = menuPrices[i] * basketAmounts[i];

  render();
}

function adding(total, num) {
  return total + num;
}

function renderBasketSum() {
  let content = document.getElementById("aside");

  if (basketPrices != 0) {
    let sum = basketPrices.reduce(adding);
    let roundedSum = sum.toFixed(2);
    content.innerHTML += renderBasketSumHTML(roundedSum);
  }
}

function renderBasketSumHTML(sum) {
  return /*html*/ `
    <div class="__shoppingBasketItem__">
      <b>Gesamtsumme:</b>
      ${sum} €
    </div>
    <div>
      <button onclick="showMessageExecuteOrder()">BESTELLEN</button>
    </div>
  `;
}

function renderMobileBasketSum() {
  let content = document.getElementById("__mobileBasket__");

  if (basketPrices != 0) {
    let sum = basketPrices.reduce(adding);
    let roundedSum = sum.toFixed(2);
    content.innerHTML += renderMobileBasketSumHTML(roundedSum);
  }
}

function renderMobileBasketSumHTML(sum) {
  return /*html*/ `
    <div class="__shoppingBasketItem__">
      <b>Gesamtsumme:</b>
      ${sum} €
    </div>
    <div>
      <button onclick="showMessageExecuteOrder()">BESTELLEN</button>
      <button onclick="showWholePage()">ZURÜCK</button>
    </div>
  `;
}

function showMessageExecuteOrder() {
  const mobileBasket = document.getElementById("__mobileBasket__");
  const wrapper = document.getElementById("wrapper");
  const header = document.getElementById("header");
  const executedOrder = document.getElementById("__executedOrder__");
  mobileBasket.classList.add("__dNone__");
  mobileBasket.classList.remove("__mobileBasket__")
  wrapper.classList.add("__dNone__");
  wrapper.classList.remove("wrapper")
  header.classList.add("__dNone__");
  executedOrder.classList.remove("__dNone__");
  executedOrder.classList.add("__executedOrder__");
  clearBasketArrays();
}

function clearBasketArrays() {
  if (basketMenus != 0) {
    basketMenus = [];
  }
  if (basketPrices != 0) {
    basketPrices = [];
  }
  if (basketAmounts != 0) {
    basketAmounts = [];
  }
}

function showMobileBasket() {
  const mobileBasket = document.getElementById("__mobileBasket__");
  const wrapper = document.getElementById("wrapper");
  const header = document.getElementById("header");
  mobileBasket.classList.remove("__dNone__");
  mobileBasket.classList.add("__mobileBasket__");
  wrapper.classList.remove("wrapper");
  wrapper.classList.add("__dNone__");
  header.classList.add("__dNone__");
  if (basketMenus.length == 0) {
    fillMobileBasketNoAmount();
  }
}

function fillMobileBasketNoAmount() {
  let content = document.getElementById("__mobileBasket__");
  content = "";

  content.innerHTML += fillMobileBasketNoAmountHTML();
}

function fillMobileBasketNoAmountHTML() {
  return /*html*/`
    <div>Es existieren noch keine Gerichte in deinem Warenkorb!</div>
    <button onclick="showWholePage()">Schließen</button>
    `;
}

function showWholePage() {
  const mobileBasket = document.getElementById("__mobileBasket__");
  const wrapper = document.getElementById("wrapper");
  const header = document.getElementById("header");
  const executedOrder = document.getElementById("__executedOrder__");
  mobileBasket.classList.add("__dNone__");
  mobileBasket.classList.remove("__mobileBasket__");
  wrapper.classList.add("wrapper");
  wrapper.classList.remove("__dNone__");
  header.classList.remove("__dNone__");
  executedOrder.classList.add("__dNone__");
  executedOrder.classList.remove("__executedOrder__");
  render();
}