let nextAndPreviousButtons = document.querySelectorAll("footer > button");
let numberedButtons = document.querySelectorAll("footer div button");
let currentPage = 1;
let searchForm = document.forms[0];
let dropListMainElem = document.querySelector("select");
let totalProductCount;

async function countProducts() {
  try {
    let allProducts = await fetch("https://dummyjson.com/products");
    allProducts = await allProducts.json();
    totalProductCount = allProducts.total;
  } catch (e) {
    console.error("Error", e);
  }
}

let getProducts = async function (limit, skip) {
  try {
    let productArray = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price,category,description,thumbnail,brand,rating,id`
    );

    productArray = await productArray.json();
    return productArray;
  } catch (e) {
    console.error("getProducts()", e);
  }
};

async function createCards(productSource) {
  let mainCardsArea = document.querySelector("main");
  let productList = await productSource;
  console.log(productList);
  productList.products.forEach((product) => {
    let createMainCardDiv = document.createElement("div");
    let createCardBody = document.createElement("div");
    let createImgDiv = document.createElement("div");
    let createImg = document.createElement("img");
    let createInfoDiv = document.createElement("div");
    let itemBrand = document.createElement("h4");
    let itemtitle = document.createElement("h6");
    let itemPrice = document.createElement("h5");

    createMainCardDiv.className = "card w-auto m-1";
    createCardBody.className = "card-body";
    createImg.className = "img-fluid";

    mainCardsArea.appendChild(createMainCardDiv);
    createMainCardDiv.appendChild(createCardBody);
    createCardBody.appendChild(createImgDiv);
    createImgDiv.appendChild(createImg);
    createCardBody.appendChild(createInfoDiv);

    createInfoDiv.appendChild(itemBrand);
    createInfoDiv.appendChild(itemtitle);
    createInfoDiv.appendChild(itemPrice);

    product.brand === undefined ? headlineOption1() : headlineOption2();

    function headlineOption1() {
      itemBrand.innerText = product.title;
      itemtitle.innerText = "";
    }

    function headlineOption2() {
      itemBrand.innerText = product.brand;
      itemtitle.innerText = product.title;
    }

    createImg.src = product.thumbnail;
    itemPrice.innerText = `Price: ${product.price} Eur`;
    createMainCardDiv.addEventListener("click", () => {
      window.location.href = `index(product).html?id=${product.id}`;
    });
  });
  pageButtonsFunction();
}

createCards(getProducts(12, 0));

async function searchFunction(searchInput) {
  try {
    let searchedProducts = await fetch(
      `https://dummyjson.com/products/search?q=${searchInput}`
    );
    searchedProducts = await searchedProducts.json();
    return searchedProducts;
  } catch (e) {
    console.error("searchFunction()", e);
  }
}

async function getCategories() {
  try {
    let categoriesNames = await fetch(
      `https://dummyjson.com/products/categories`
    );
    categoriesNames = await categoriesNames.json();
    return categoriesNames;
  } catch (e) {
    console.error("getCategories()", e);
  }
}

async function createCategoryOptions(source) {
  let catList = await source;
  catList.sort();

  catList.forEach((item) => {
    let categoryOption = document.createElement("option");
    categoryOption.innerText = item.name;
    dropListMainElem.appendChild(categoryOption);
  });
}

createCategoryOptions(getCategories());

async function getCategoryProducts(category) {
  try {
    let categoryProducts = await fetch(
      `https://dummyjson.com/products/category/${category}`
    );
    categoryProducts = await categoryProducts.json();
    document.querySelector("main").innerHTML = "";
    document.querySelector("footer").innerHTML = "";
    createCards(categoryProducts);

    return categoryProducts;
  } catch (e) {
    console.error("categoryProducts", e);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("main").innerHTML = "";
  document.querySelector("footer").innerHTML = "";
  let theSearch = searchForm.elements.searchbar.value;
  createCards(searchFunction(theSearch));
});

document.getElementById("reset").addEventListener("click", (event) => {
  location.reload();
});

dropListMainElem.addEventListener("change", async () => {
  let selectedCategory = dropListMainElem.value.toLowerCase();

  if (selectedCategory.includes(" "))
    selectedCategory = selectedCategory.replace(" ", "-");

  selectedCategory === "all categories"
    ? location.reload()
    : getCategoryProducts(selectedCategory);
});

async function generateButtons() {
  await countProducts();
  const buttonCount = Math.ceil(totalProductCount / 12);
  for (let i = 0; i < buttonCount; i++) {
    let buttonDiv = document.querySelector(".numberedButtons");
    let newButton = document.createElement("button");
    newButton.type = "button";
    newButton.className = "m-1 btn btn-primary";
    buttonDiv.append(newButton);
    newButton.innerText = i + 1;
  }
}

async function pageButtonsFunction() {
  await generateButtons();
  let allPageButtons = document.querySelectorAll("footer *:not(div)");

  allPageButtons.forEach((button) => {
    button.addEventListener("click", () => {});
  });
}
