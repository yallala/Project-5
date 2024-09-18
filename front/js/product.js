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


let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
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

// {
//     "colors": [
//         "Red",
//         "Silver"
//     ],
//     "_id": "034707184e8e4eefb46400b5a3774b5f",
//     "name": "Kanap Thyoné",
//     "price": 1999,
//     "imageUrl": "http://localhost:3000/images/kanap07.jpeg",
//     "description": "EMauris imperdiet tellus ante, sit amet pretium turpis molestie eu. Vestibulum et egestas eros. Vestibulum non lacus orci.",
//     "altTxt": "Photo of a red sofa, two seats"




