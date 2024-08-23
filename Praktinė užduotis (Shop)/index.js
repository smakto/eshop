let pageSelectButtons = document.querySelectorAll("footer button");
let currentPage = 1;
let searchForm = document.forms[0];
let dropListMainElem = document.querySelector("select");

///////
// Functions
///////

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
}
createCards(getProducts(12, 0));

pageSelectButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let pageNum = Number(button.innerText);
    let setLimit = 12;
    let setSkip = (pageNum - 1) * 12;
    if (button.innerText !== "Previous" && button.innerText !== "Next") {
      currentPage = pageNum;
      if (pageNum === 1) {
        setSkip = 0;
      } else setSkip;
    } else if (button.innerText === "Previous") {
      if (currentPage === 1) {
        currentPage = 1;
      } else currentPage -= 1;
      setSkip = currentPage * 12 - 12;
    } else if (button.innerText === "Next") {
      if (currentPage === 9) {
        currentPage = 9;
      } else currentPage += 1;
      setSkip = currentPage * 12 - 12;
    }
    document.querySelector("main").innerHTML = "";
    createCards(getProducts(setLimit, setSkip));
  });
});

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

///////
// Event listeners
///////

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
