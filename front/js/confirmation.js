/**
 * Retrieves the order ID from the URL and updates the HTML element with the order ID.
 *
 * This code extracts the `orderid` parameter from the current window URL and updates
 * the inner HTML of the element with the ID "orderId" to display the retrieved order ID.
 *
 * @constant {Location} str - The current window location object.
 * @constant {URL} url - A new URL object created from the window location.
 * @constant {string} id - The value of the "orderid" parameter from the URL's query string.
 * @constant {HTMLElement} orderId - The DOM element that will display the order ID.
 */

const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("orderid");

const orderId = document.getElementById("orderId");
orderId.innerHTML = id;