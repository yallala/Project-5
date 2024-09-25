
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");


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

