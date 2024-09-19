// TODO Get product id from URL query parameter

// TODO Look at the resources in milestone 5

// TODO Continue javascript course. Spend time on course work this weekend. It is required for milestone #6

// TODO use fetch api for only one product 

// TODO Insert product details in page 

// REFERENCE use the commented out code from insertProducts.html as guide
// fetch('http://localhost:3000/api/products')
//     .then(data => {
//         return data.json();
//     })

// example:
// const website = 'freeCodeCamp'
// const message = `Welcome to ${website}`

// console.log(message)

//Milestone#5 -Collecting the ID of a product you wish to display
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

// Milestone#6 - Inserting a product and its details into a product page
let productData = [];



// Display product information on the product page
const fetchProduct = async () => {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => res.json())
        .then((promise) => {
            productData = promise;

            // Product image
            let productImg = document.querySelector(".item__img").innerHTML = `
            <img src="${productData.imageUrl}" alt="${productData.altTxt}">`;

            // Product title
            let productTitle = document.getElementById("title").innerText = `${productData.name}`;

            // Product price 
            let productPrice = document.getElementById("price").innerText = `${productData.price}`;

            // Product description 
            let productDescription = document.getElementById("description").innerText = `${productData.description}`;

            // Product options (colors)
            for (let i = 0; i < productData.colors.length; i++) {
                let productOption = document.getElementById("colors").innerHTML += `
            <option value="${productData.colors[i]}">${productData.colors[i]}</option>`;
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

    // If the cart already contains a product, then simply update the quantity of existing product
    } else {
        const findProduct = productArray.find(product => product.id === id && product.color === color)
        if (findProduct != undefined) {

            let newQuantity = Number(findProduct.quantity);
            newQuantity += quantity;
            findProduct.quantity = newQuantity;
            localStorage.setItem("product", JSON.stringify(productArray));

        } else {
            productArray.push(productInfos)
            localStorage.setItem("product", JSON.stringify(productArray));
        }
    }
});

