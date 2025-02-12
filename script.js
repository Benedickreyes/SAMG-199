// Product data
const products = {
  "SET A": {
    price: 900.0,
    contents: [
      "200g POTATO MARBLE",
      "200g SWEETENED BANANA",
      "150g LETTUCE",
      "150g GOCHUJANG SAUCE",
      "150g SSAMJANG SAUCE",
    ],
  },
  "SET B": {
    price: 1260.0,
    contents: ["200g KIMCHI", "200g FISHCAKE", "200g POTATO MARBLE", "200g SWEETENED BANANA", "150g LETTUCE"],
  },
  "SET C": {
    price: 1450.0,
    contents: ["200g KIMCHI", "200g POTATO MARBLE", "200g SWEETENED BANANA", "150g LETTUCE"],
  },
  "TEST ITEM": {
    price: 1.0,
    contents: ["Test item for PayPal integration"],
  },
}

// Image paths for each product
const productImages = {
  "SET A": "FamilysetA.jpg",
  "SET B": "FamilysetB.jpg",
  "SET C": "FamilysetC.jpg",
  "TEST ITEM": "placeholder.jpg",
}

let cart = {}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadCart()
  displayProducts()
  updateCartDisplay()
  setupEventListeners()
})

// Load cart from local storage
function loadCart() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Display products
function displayProducts() {
  const productsGrid = document.getElementById("products-grid")
  for (const [name, details] of Object.entries(products)) {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
            <h3>${name} - ₱${details.price.toFixed(2)}</h3>
            <ul class="product-contents">
                ${details.contents.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <form class="add-to-cart-form">
                <input type="hidden" name="product" value="${name}">
                <input type="number" name="quantity" value="1" min="1" class="quantity-input">
                <button type="submit" class="add-to-cart-button">Add to Cart</button>
            </form>
        `
    productsGrid.appendChild(productCard)
  }
}

// Update cart display
function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-container")
  const cartBody = document.getElementById("cart-body")
  cartBody.innerHTML = ""

  let total = 0
  for (const [product, qty] of Object.entries(cart)) {
    const price = products[product].price
    const subtotal = price * qty
    total += subtotal

    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${product}</td>
            <td><input type="number" name="cart_quantity[${product}]" value="${qty}" min="1" class="quantity-input"></td>
            <td>₱${subtotal.toFixed(2)}</td>
            <td><button type="button" class="remove-button" data-product="${product}">Remove</button></td>
        `
    cartBody.appendChild(row)
  }

  const totalRow = document.createElement("tr")
  totalRow.innerHTML = `
        <td colspan="2"><strong>Total:</strong></td>
        <td colspan="2"><strong>₱${total.toFixed(2)}</strong></td>
    `
  cartBody.appendChild(totalRow)

  cartContainer.style.display = Object.keys(cart).length > 0 ? "block" : "none"
}

// Setup event listeners
function setupEventListeners() {
  document.addEventListener("submit", handleAddToCart)
  document.getElementById("update-cart-button").addEventListener("click", updateCart)
  document.getElementById("checkout-button").addEventListener("click", handleCheckout)
  document.addEventListener("click", handleRemoveItem)

  const closeButtons = document.getElementsByClassName("close")
  for (const button of closeButtons) {
    button.addEventListener("click", closeModal)
  }

  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal()
    }
  })
}

// Handle adding items to cart
function handleAddToCart(event) {
  if (!event.target.classList.contains("add-to-cart-form")) return
  event.preventDefault()

  const form = event.target
  const product = form.elements.product.value
  const quantity = Number.parseInt(form.elements.quantity.value)

  if (cart[product]) {
    cart[product] += quantity
  } else {
    cart[product] = quantity
  }

  saveCart()
  updateCartDisplay()
}

// Update cart quantities
function updateCart() {
  const inputs = document.querySelectorAll('#cart-body input[type="number"]')
  inputs.forEach((input) => {
    const product = input.name.match(/\[(.*?)\]/)[1]
    const quantity = Number.parseInt(input.value)
    if (quantity > 0) {
      cart[product] = quantity
    } else {
      delete cart[product]
    }
  })

  saveCart()
  updateCartDisplay()
}

// Handle checkout process
function handleCheckout() {
  if (cart["TEST ITEM"] && Object.keys(cart).length === 1) {
    window.location.href = "https://www.paypal.com/ncp/payment/J89L76QGH9HJ6"
  } else {
    showError("This payment link is only available for the Test Item. Please only have the Test Item in your cart.")
  }
}

// Handle removing items from cart
function handleRemoveItem(event) {
  if (!event.target.classList.contains("remove-button")) return

  const product = event.target.dataset.product
  delete cart[product]
  saveCart()
  updateCartDisplay()
}

// Show error modal
function showError(message) {
  document.getElementById("errorMessage").textContent = message
  document.getElementById("errorModal").style.display = "flex"
}

// Close modal
function closeModal() {
  document.getElementById("errorModal").style.display = "none"
  document.getElementById("successModal").style.display = "none"
}

