
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

