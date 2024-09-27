

/**
 * Fetches a list of products from an API and inserts them into the DOM.
 *
 * This function sends a GET request to the specified API endpoint to retrieve product data.
 * Once the data is successfully fetched and parsed as JSON, it logs the product data to the console
 * and calls the `insertProducts` function to display the products on the page.
 * If an error occurs during the fetch process, it logs the error to the console and throws the error.
 *
 * @function
 * @returns {void}
 */

fetch('http://localhost:3000/api/products')
    .then(data => {
        return data.json();
    })
    .then(products => {
        console.log(products)
        insertProducts(products);
    })

    .catch(err => {
        console.log(err);
        throw err;
    });

 /**
 * Inserts product cards into the DOM.
 *
 * This function generates HTML product cards based on the provided product data and appends
 * them to the "items" section of the page. Each product card contains an image, name, and description
 * and links to the product detail page using the product's ID.
 *
 * @function insertProducts
 * @param {Array} products - An array of product objects, where each object contains product details like _id, imageUrl, altTxt, name, and description.
 * @returns {void}
 */
   
function insertProducts(products) {
    const items = document.getElementById('items');
    for (let i = 0; i < products.length; i++) {
        const itemsCards = `<a href="./product.html?id=${products[i]._id}"> 
                <article> 
                <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
                <h3 class="productName">${products[i].name}</h3>
                <p class="productDescription">${products[i].description}</p>
                </article>
                </a>`;
        items.innerHTML += itemsCards;
    }
}

