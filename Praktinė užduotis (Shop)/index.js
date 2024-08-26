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
  mainCardsArea.innerHTML = "";
  let productList = await productSource;
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

  selectedCategory === "all-categories"
    ? location.reload()
    : getCategoryProducts(selectedCategory);
});

async function generateButtons() {
  await countProducts();
  document.querySelector("footer").innerHTML = "";
  let buttonDiv = document.createElement("div");
  buttonDiv.className = "numberedButtons";

  let firstButton = document.createElement("button");
  let previousButton = document.createElement("button");
  let nextButton = document.createElement("button");
  let lastButton = document.createElement("button");
  firstButton.innerText = "First";
  previousButton.innerText = "Previous";
  nextButton.innerText = "Next";
  lastButton.innerText = "Last";

  const stepButtons = [firstButton, previousButton, nextButton, lastButton];
  stepButtons.forEach((button) => {
    document.querySelector("footer").append(button);
    button.className = "m-1 btn btn-primary";
  });

  document
    .querySelector("footer")
    .insertBefore(
      buttonDiv,
      document.querySelector("footer button:nth-last-child(2)")
    );

  const buttonCount = Math.ceil(totalProductCount / 12);
  for (let i = 0; i < buttonCount; i++) {
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

  let pageNumber;
  let toSkip;

  allPageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.innerText !== "Previous" &&
      button.innerText !== "Next" &&
      button.innerText !== "First" &&
      button.innerText !== "Last"
        ? (pageNumber = parseInt(button.innerText))
        : button.innerText === "Next"
        ? (pageNumber = "Next")
        : button.innerText === "Previous"
        ? (pageNumber = "Previous")
        : button.innerText === "First"
        ? (pageNumber = "First")
        : (pageNumber = "Last");

      if (typeof pageNumber === "number") {
        currentPage = pageNumber;
        toSkip = pageNumber * 12 - 12;
      }

      if (pageNumber === "Previous") {
        pageNumber = currentPage;
        if (currentPage === 1) {
          toSkip = 0;
        } else {
          currentPage -= 1;
          pageNumber -= 1;
          toSkip = pageNumber * 12 - 12;
        }
      } else if (pageNumber === "Next") {
        pageNumber = currentPage;
        if (currentPage === Math.ceil(totalProductCount / 12)) {
          toSkip = pageNumber * 12 - 12;
        } else {
          currentPage += 1;
          pageNumber += 1;
          toSkip = pageNumber * 12 - 12;
        }
      } else if (pageNumber === "First") {
        pageNumber = 1;
        currentPage = 1;
        toSkip = 0;
      } else if (pageNumber === "Last") {
        const pageCount = Math.ceil(totalProductCount / 12);
        currentPage = pageCount;
        pageNumber = pageCount;
        toSkip = pageNumber * 12 - 12;
      }

      createCards(getProducts(12, toSkip));
    });

    if (Number(button.innerText) === currentPage) {
      button.className = "btn btn-outline-primary";
    }

    if (
      Number(button.innerText) > currentPage + 3 ||
      Number(button.innerText) < currentPage - 3
    ) {
      button.style.display = "none";
    }
  });
}
