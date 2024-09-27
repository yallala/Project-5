

const productCache = [];
/**
 * Retrieves the cart data from local storage.
 *
 * This function checks if there is any stored cart data under the key "product" in localStorage.
 * If the data exists, it parses the JSON string and returns the cart array. If no data is found,
 * it returns an empty array.
 *
 * @function getCartFromLocalStorage
 * @returns {Array} An array containing the cart items, or an empty array if no items are found.
 */

function getCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("product")) || [];
    return cart;
}

/**
 * Saves the cart data to local storage.
 *
 * This function converts the cart array into a JSON string and stores it
 * under the key "product" in localStorage. It overwrites any existing data
 * associated with the key.
 *
 * @function saveCartToLocalStorage
 * @param {Array} cart - The array of cart items to be saved in local storage.
 * @returns {void}
 */

function saveCartToLocalStorage(cart) {
    localStorage.setItem("product", JSON.stringify(cart));
}
/**
 * Fetches product data from an API or cache.
 *
 * This function first checks if the product data is available in the cache (`productCache`).
 * If the product is found in the cache, it returns the cached data. Otherwise, it fetches
 * the product data from the API using the provided product ID, caches the result, and returns it.
 *
 * @async
 * @function fetchProductData
 * @param {string} productId - The unique identifier for the product.
 * @returns {Promise<Object>} A promise that resolves to the product data object.
 */
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
/**
 * Updates the total quantity and total price in the shopping cart.
 *
 * This function calculates the total quantity and total price of all items in the cart.
 * It retrieves product information from the cache, multiplies the product price by its quantity,
 * and updates the DOM elements that display the total quantity and total price.
 *
 * @function updateTotals
 * @param {Array} cart - The array of cart items, each containing an id and quantity.
 * @returns {void}
 */
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


/**
 * Handles the change in quantity of a cart item and updates the cart.
 *
 * This function is returned as an event handler for when the quantity of a cart item is modified.
 * It updates the cart with the new quantity, saves the updated cart to local storage, and recalculates
 * the total quantity and price of the cart.
 *
 * @function handleQuantityChange
 * @param {Array} cart - The array of cart items, where each item contains an id and quantity.
 * @param {number} index - The index of the cart item in the cart array to be updated.
 * @returns {Function} A function that handles the input event for changing the item quantity.
 */

function handleQuantityChange(cart, index) {
    return function (event) {
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

/**
 * Displays the contents of the shopping cart on the page.
 *
 * This function retrieves the cart data from local storage, fetches product information from an API,
 * and dynamically updates the DOM to display each cart item. For each item, it generates an HTML
 * structure that includes the product image, name, color, price, quantity, and a delete button.
 * The function also attaches event listeners for handling quantity changes and item deletion.
 *
 * @async
 * @function displayCart
 * @returns {Promise<void>} A promise that resolves once the cart display logic is complete.
 */

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
            handleDeleteItem
        );

    }

    updateTotals(cart);
}

displayCart();
/**
 * Validates form fields for an order submission and handles the order process.
 *
 * This function validates the user's input in the form fields (first name, last name, address, city, email)
 * using regular expressions. It displays error messages for invalid inputs in real-time as the user types.
 * Once the order button is clicked, the function validates all fields again. If all fields are valid,
 * it retrieves the product information from localStorage, sends the order details to the server via a POST request,
 * and redirects the user to the confirmation page upon success.
 *
 * @function validateOrder
 * @returns {void}
 */
functi
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
