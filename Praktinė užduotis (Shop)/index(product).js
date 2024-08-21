function getTheId() {
  let getParams = new URL(window.location).searchParams;
  let theID = getParams.get("id");
  return theID;
}

let getSelectedProduct = async function (id) {
  try {
    let singleProduct = await fetch(`https://dummyjson.com/products/${id}`);
    singleProduct = await singleProduct.json();
    console.log(singleProduct);

    renderProductPage(singleProduct);
  } catch (e) {
    console.log("getSelectedProduct", e);
  }
};

function renderProductPage(product) {
  let finalPrice = Math.floor(
    product.price - (product.price / 100) * product.discountPercentage
  );

  document.querySelector("img").src = product.images[0];
  document.querySelector(
    "h2"
  ).innerText = `${product.title} (${product.brand})`;
  document.getElementById("productDescription").innerText = product.description;
  document.querySelector(
    "h5"
  ).innerText = `Previous price ${product.price} Eur`;
  document.querySelector(
    "h6"
  ).innerText = `Discount ${product.discountPercentage}%`;
  document.querySelector("h4").innerText = `Current price ${finalPrice} Eur`;
}

getSelectedProduct(getTheId());
