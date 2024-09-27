
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

/**
 * Fetches product data from an API and updates the product page with its details.
 *
 * This function sends a request to the API to retrieve the product data using a product ID.
 * Once the product data is fetched, it updates the DOM with the product image, title, price, description,
 * and available color options. The colors are dynamically added as options to a select dropdown.
 *
 * @async
 * @function fetchProduct
 * @returns {Promise<void>} A promise that resolves once the product data has been fetched and the DOM has been updated.
 */

const fetchProduct = async () => {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((product) => {

            let productImg = document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
            let productTitle = document.getElementById("title").innerText = `${product.name}`;
            let productPrice = document.getElementById("price").innerText = `${product.price}`;
            let productDescription = document.getElementById("description").innerText = `${product.description}`;

            for (let i = 0; i < product.colors.length; i++) {
                let productOption = document.getElementById("colors").innerHTML += `
            <option value="${product.colors[i]}">${product.colors[i]}</option>`;
            }

        });
};
fetchProduct();

/**
 * Adds a selected product to the shopping cart and saves it to local storage.
 *
 * This function handles the "Add to Cart" button click event. It retrieves the selected
 * product's color and quantity, and adds the product to the cart. If the product already
 * exists in the cart (same id and color), it updates the quantity. If it's a new product,
 * it adds the product to the cart array in local storage. It also performs basic validation
 * to ensure the color and quantity are specified before proceeding.
 *
 * @constant {HTMLElement} cartButton - The button element that triggers the addition of a product to the cart.
 * @event click - Event listener for handling the button click.
 */

let cartButton = document.getElementById("addToCart");

cartButton.addEventListener("click", () => {

    let productArray = JSON.parse(localStorage.getItem("product"))
    let color = document.getElementById("colors").value;
    let quantity = Number(document.getElementById("quantity").value);
    let productInfos = {
        id: id,
        color: color,
        quantity: quantity
    }

    if (color == "" || quantity == "") {
        alert("Please specify the color and quantity");

    } else if (productArray == null) {
        productArray = [];
        productArray.push(productInfos)
        localStorage.setItem("product", JSON.stringify(productArray));
        alert("Product is successfully added");

    } else {
        const findProduct = productArray.find(product => product.id === id && product.color === color)
        if (findProduct != undefined) {

            let newQuantity = Number(findProduct.quantity);
            newQuantity += quantity;
            findProduct.quantity = newQuantity;
            localStorage.setItem("product", JSON.stringify(productArray));
            alert("Product is successfully added");
        } else {
            productArray.push(productInfos)
            localStorage.setItem("product", JSON.stringify(productArray));
            alert("Product is successfully added");
        }
    }
});

