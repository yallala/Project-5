

const productCache = [];

function getCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("product")) || [];
    return cart;
}

function saveCartToLocalStorage(cart) {
    localStorage.setItem("product", JSON.stringify(cart));
}

async function fetchProductData(productId) {
    const cachedProduct = productCache.find((p) => p._id === productId);
    if (cachedProduct) {
        return cachedProduct;
    }

    const response = await fetch(
        `http://localhost:3000/api/products/${productId}`
    );
    const productData = await response.json();

    productCache.push(productData);
    return productData;
}

function updateTotals(cart) {
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((cartItem) => {
        const productData = productCache.find((p) => p._id === cartItem.id);
        totalQuantity += Number(cartItem.quantity);
        totalPrice += productData.price * cartItem.quantity;
    });

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

function handleQuantityChange(cart, index) {
    return function (event) {
        // console.log(JSON.stringify(cart));
        const newQuantity = event.target.value;
        cart[index].quantity = parseInt(newQuantity);
        saveCartToLocalStorage(cart);
        updateTotals(cart);
    };
}

/**
 * Handle deleting an item
 * 
 * @param {object} $event - event information
 */
function handleDeleteItem($event) {
    const articleElement = $event.target.closest("article");
    const productId = articleElement.dataset.id;
    const productColor = articleElement.dataset.color;
    let cart = getCartFromLocalStorage();

    cart = cart.filter(cartItem => !(cartItem.id === productId && cartItem.color === productColor));
    saveCartToLocalStorage(cart);
    articleElement.remove();
    updateTotals(cart);
};

async function displayCart() {
    const cart = getCartFromLocalStorage();
    if (cart.length === 0) {
        document.querySelector("#cartAndFormContainer > h1").textContent +=
            " is empty";
        return;
    }

    document.getElementById("cart__items").innerHTML = "";

    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const productData = await fetchProductData(cartItem.id);

        const cartItemElement = document.createElement("article");
        cartItemElement.classList.add("cart__item");
        cartItemElement.setAttribute("data-id", productData._id);
        cartItemElement.setAttribute("data-color", cartItem.color);

        cartItemElement.innerHTML = `
        <div class="cart__item__img">
          <img src="${productData.imageUrl}" alt="${productData.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${productData.name}</h2>
            <p>${cartItem.color}</p>
            <p>${productData.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantity: </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Delete</p>
            </div>
          </div>
        </div>`;

        document.getElementById("cart__items").appendChild(cartItemElement);

        const quantityInput = cartItemElement.querySelector(".itemQuantity");
        quantityInput.addEventListener("input", handleQuantityChange(cart, i));



        const deleteButton = cartItemElement.querySelector(".deleteItem");
        deleteButton.addEventListener(
            "click",
            // handleDeleteItem(cartItemElement, cartItem.id)
            handleDeleteItem
        );

    }

    updateTotals(cart);
}

displayCart();

/**
 * Validate the fields in the form
 */
function validateOrder() {
    const formFields = {
        firstName: {
            element: document.getElementById("firstName"),
            regex: /^[a-zA-Zèé\-]+$/,
            errorId: "firstNameErrorMsg",
            errorMsg: "First name should only contain letters",
        },
        lastName: {
            element: document.getElementById("lastName"),
            regex: /^[a-zA-Zèé\-]+$/,
            errorId: "lastNameErrorMsg",
            errorMsg: "Last name should only contain letters",
        },
        address: {
            element: document.getElementById("address"),
            regex: /^[a-z0-9A-Zèé\- ]+$/,
            errorId: "addressErrorMsg",
            errorMsg: "The address format is incorrect",
        },
        city: {
            element: document.getElementById("city"),
            regex: /^[a-zA-Zèé\-]+$/,
            errorId: "cityErrorMsg",
            errorMsg: "The city name is incorrect",
        },
        email: {
            element: document.getElementById("email"),
            regex: /^[a-zA-Z\.-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
            errorId: "emailErrorMsg",
            errorMsg: "The email format is incorrect",
        },
    };
    const validateField = (field) => {
        const { element, regex, errorId, errorMsg } = field;
        const isValid = regex.test(element.value);
        document.getElementById(errorId).textContent = isValid ? "" : errorMsg;
        return isValid;
    };

    Object.values(formFields).forEach((field) =>
        field.element.addEventListener("input", () => validateField(field))
    );

    document.getElementById("order").addEventListener("click", (e) => {
        e.preventDefault();
        const allValid = Object.values(formFields).every((field) =>
            validateField(field)
        );

        if (allValid) {
            const productArray = JSON.parse(localStorage.getItem("product"));
            const products = productArray.map((product) => product.id);

            const orderInfos = {
                contact: {
                    firstName: formFields.firstName.element.value,
                    lastName: formFields.lastName.element.value,
                    address: formFields.address.element.value,
                    city: formFields.city.element.value,
                    email: formFields.email.element.value,
                },
                products,
            };

            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderInfos),
            })
                .then((res) => res.json())
                .then((data) => {
                    localStorage.clear();
                    window.location = `confirmation.html?orderid=${data.orderId}`;
                })
                .catch(console.error);
        } else {
            alert("Please check the form information");
        }
    });
}

validateOrder();
