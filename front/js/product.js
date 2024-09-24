
//Milestone#5 -Collecting the ID of a product you wish to display
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

// Milestone#6 - Inserting a product and its details into a product page
// let productData = [];

// Display product information on the product page
const fetchProduct = async () => {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((product) => {

            // Product image
            let productImg = document.querySelector(".item__img").innerHTML = `
            <img src="${product.imageUrl}" alt="${product.altTxt}">`;

            // Product title
            let productTitle = document.getElementById("title").innerText = `${product.name}`;

            // Product price 
            let productPrice = document.getElementById("price").innerText = `${product.price}`;

            // Product description 
            let productDescription = document.getElementById("description").innerText = `${product.description}`;

            // Product options (colors)
            for (let i = 0; i < product.colors.length; i++) {
                let productOption = document.getElementById("colors").innerHTML += `
            <option value="${product.colors[i]}">${product.colors[i]}</option>`;
            }

        });
};
fetchProduct();

// Milestone #7: Adding products to the cart

// Define the cartButton variable
let cartButton = document.getElementById("addToCart");

// Listen for the click event
cartButton.addEventListener("click", () => {

    // Retrieve the current contents of the local storage
    let productArray = JSON.parse(localStorage.getItem("product"))

    // Define the variables color and quantity
    let color = document.getElementById("colors").value;
    let quantity = Number(document.getElementById("quantity").value);

    // Create a JS object with the product information
    let productInfos = {
        id: id,
        color: color,
        quantity: quantity
    }

    // If the color or quantity is not selected
    if (color == "" || quantity == "") {
        alert("Please specify the color and quantity");

        //If the product is not in the cart page then push it
    } else if (productArray == null) {
        productArray = [];
        productArray.push(productInfos)
        localStorage.setItem("product", JSON.stringify(productArray));
        alert("Product is successfully added");

        //TODO Add alert for user so they know their product is added.  Product is succesfully added

        // If the cart already contains a product, then simply update the quantity of existing product
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

