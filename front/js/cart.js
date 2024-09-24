// const productCache = []; //empty product cache and ready to use

//TODO Get the cart from the local storage

//TODO Display the cart (very high abstraction here) - By iterating (loop. gong through each item in cart) 

//over the items in the cart

//TODO  Inside the loop for each item 
//      * For each cart item, get ID
//      * Fetch request for product for that id (async. fetch product like product.js). Add to cache if not there
//      * Insert the html for the cart to the page
//      * Update the page totals


const productCache = []; // empty product cache, ready to store fetched products

// Get the cart from local storage
function getCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("product")) || []; // Retrieve the cart from localStorage, or an empty array if not present
    return cart;
}

// Save the updated cart to local storage
function saveCartToLocalStorage(cart) {
    localStorage.setItem("product", JSON.stringify(cart));
}

// Fetch product data by ID and add to the cache if it's not already there
async function fetchProductData(productId) {
    const cachedProduct = productCache.find((p) => p._id === productId); // Check if the product is already in the cache

    if (cachedProduct) {
        return cachedProduct; // Return cached product if it exists
    }

    // Fetch product data from API if not in cache
    const response = await fetch(
        `http://localhost:3000/api/products/${productId}`
    );
    const productData = await response.json();

    productCache.push(productData); // Add fetched product to cache for future use
    return productData;
}

// Function to calculate and update totals
function updateTotals(cart) {
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((cartItem) => {
        const productData = productCache.find((p) => p._id === cartItem.id); // Get product data from cache

        totalQuantity += Number(cartItem.quantity);
        totalPrice += productData.price * cartItem.quantity;
    });

    // Update total quantity and price on the page
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

// Function to handle quantity change
function handleQuantityChange(cart, index) {
    return function (event) {
        console.log(JSON.stringify(cart));
        const newQuantity = event.target.value;
        cart[index].quantity = parseInt(newQuantity); // Update the quantity in the cart array

        // Save the updated cart back to localStorage
        saveCartToLocalStorage(cart);

        // Recalculate the totals
        updateTotals(cart);

    };
}

function handleDeleteItem(cartItemElement, productId) {
    return function () {
        // Fetch the updated cart from localStorage again
        let cart = getCartFromLocalStorage();

        // Filter out the item to be deleted by comparing product IDs
        cart = cart.filter((cartItem) => cartItem.id !== productId);

        // Save the updated cart back to localStorage
        saveCartToLocalStorage(cart);

        // Remove the cart item element from the DOM
        cartItemElement.remove();

        // Update the totals after deletion
        updateTotals(cart);
    };
}

// Function to handle deleting an item
// function handleDeleteItem(cart, index, cartItemElement) {
//     console.log(index);
//     return function () {
//         cart.splice(index, 1); // Remove the item at the specified index

//         // Save the updated cart back to localStorage
//         saveCartToLocalStorage(cart);

//         // Remove the cart item element from the DOM
//         cartItemElement.remove();

//         // Update the totals after deletion
//         updateTotals(cart);
//     };
// }

// Display the cart items on the page
async function displayCart() {
    const cart = getCartFromLocalStorage(); // Retrieve cart from localStorage

    // Check if the cart is empty
    if (cart.length === 0) {
        document.querySelector("#cartAndFormContainer > h1").textContent +=
            " is empty"; // If no items, show "Cart is empty"
        return;
    }

    // Clear any existing items in the cart HTML to avoid duplicate renders
    document.getElementById("cart__items").innerHTML = "";

    // Loop over each item in the cart
    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const productData = await fetchProductData(cartItem.id); // Fetch product data using its ID (will use cache if available)

        // Create an HTML element for each cart item
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

        // Append the cart item element to the DOM
        document.getElementById("cart__items").appendChild(cartItemElement);

        // Add event listener to handle quantity changes for each item
        const quantityInput = cartItemElement.querySelector(".itemQuantity");
        quantityInput.addEventListener("input", handleQuantityChange(cart, i));

        // Add event listener to handle item deletion
        // const deleteButton = cartItemElement.querySelector(".deleteItem");

        // deleteButton.addEventListener(
        //   "click",
        //   handleDeleteItem(cart, i, cartItemElement) 

        const deleteButton = cartItemElement.querySelector(".deleteItem");
        deleteButton.addEventListener(
            "click",
            handleDeleteItem(cartItemElement, cartItem.id)
        );


        // becaust of closoure scope. Might be an issue with changing quantity. Currently it is working
        //TODO Cart get the current state from local storage
        //TODO cartitemelement: Use method closoure. Resouce is available in Milestone -9. There is a recommendation to use element closes. To get color and id of element
        //TODO Two or more items in cart. It is not deleting properly. Delete first and middle and see the logs
        //TODO research why i
        // similar issues with quantity could happen. Double check and test

    }

    // Update totals initially after rendering the cart
    updateTotals(cart);
}

// Initialize the cart display process
displayCart(); // Call the displayCart function to fetch, cache, and render the cart items

// Form Validation Functionalities
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
        regex: /^[a-zA-Zèé\-]+$/,
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
  //Validating and pasting the error 
    const validateField = (field) => {
      const { element, regex, errorId, errorMsg } = field;
      const isValid = regex.test(element.value);
      document.getElementById(errorId).textContent = isValid ? "" : errorMsg;
      return isValid;
    };
  // we are getting values from formFields above like, fist name , last name..etc

    Object.values(formFields).forEach((field) =>
      field.element.addEventListener("input", () => validateField(field))
    );
  
    // Posting the data to backend server
    document.getElementById("order").addEventListener("click", (e) => {
        // Not to let the page refresh when I click on order button
      e.preventDefault();
      const allValid = Object.values(formFields).every((field) =>
        validateField(field)
      );
  
      //Getting the product data and mapping with array and storing product id
      if (allValid) {
        const productArray = JSON.parse(localStorage.getItem("product"));
        const productId = productArray.map((product) => product.id);
        //Map function is like for loop. 
  
        //Storing field values and product id in order infos 
        const orderInfos = {
          contact: {
            firstName: formFields.firstName.element.value,
            lastName: formFields.lastName.element.value,
            address: formFields.address.element.value,
            city: formFields.city.element.value,
            email: formFields.email.element.value,
          },
          products: productId,
        };
  
        // POST Method to post data. Nothing but posting in the backend server
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