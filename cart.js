const closeCart = document.getElementById('cart-close');

const cartContent = document.querySelector('.cart-content');

closeCart.addEventListener("click", function() {
  const overlay = document.getElementById("cart-fade-overlay");
  overlay.style.opacity = 1;
  setTimeout(() =>window.location.href= "index.html", 500);
});

document.addEventListener("DOMContentLoaded", () => {
  const cartContent = document.querySelector('.cart-content');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  cartItems.forEach(item => {
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
      <img src="${item.img}" class="cart-product-image">
      <div class="cart-detail">
        <h2 class="cart-product-title">${item.title}</h2>
        <span class="cart-product-price">${item.price}</span>
        <span class="cart-product-description">${item.description}</span>
        <div class="quantity-and-remove-section">
          <div class="cart-product-quantity">
            <button id="decrement">-</button>
            <span class="quantity-number">${item.quantity}</span>
            <button id="increment">+</button>
          </div>
          <i class="ri-delete-bin-7-line cart-remove"></i>
        </div>
      </div>
    `;
    cartContent.appendChild(cartBox);

    updateTotalPrice();


    cartBox.querySelector('.cart-remove').addEventListener("click", () => {
      cartBox.remove();
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      const itemDescription = cartBox.querySelector('.cart-product-description').textContent;
      cartItems = cartItems.filter(item => item.description !== itemDescription);

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateTotalPrice();
      updateCartCount(-1);
    });

    cartBox.querySelector(".cart-product-quantity").addEventListener("click", event =>{
      const numberElement = cartBox.querySelector('.quantity-number');
      const decrementButton = cartBox.querySelector('#decrement');
      const title = cartBox.querySelector('.cart-product-title').textContent;
      let quantity = numberElement.textContent;

      const updateQtyDisplay = () => {
        updateCartQuantity(title, quantity); // ✅ Sync with cart
      };


      if(event.target.id === "decrement" && quantity >1){
        quantity--;
        if(quantity ===1){
          decrementButton.style.color = '#999';
        }
        updateQtyDisplay();
      }
      else if(event.target.id ==="increment"){
        quantity++;
        decrementButton.style.color = '#333';
        updateQtyDisplay();
      }

      numberElement.textContent = quantity;

      updateTotalPrice();
    });

  });

  const buyNowButton = document.querySelector('.buy-btn');
    buyNowButton.addEventListener('click', () => {
      const cartBoxes = cartContent.querySelectorAll('.cart-box');
      if(cartBoxes.length ===0){
        alert("Your cart is empty!, Please add items to your cart before proceeding to buy.");
        return;
      }
      cartBoxes.forEach(cartBox => cartBox.remove());
      localStorage.removeItem('cartItems');
      updateTotalPrice();
      cartItemCount = 0;
      updateCartCount(0);
      alert("Thank you for your purchase!");
    });

  
});

const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector('.total-price');
  const cartBoxes = cartContent.querySelectorAll('.cart-box')
  
  let total = 0;
  cartBoxes.forEach(cartBox =>{
    const quantityElement = cartBox.querySelector('.quantity-number');
    const priceElement = cartBox.querySelector('.cart-product-price')
    const price = priceElement.textContent.replace('$', '');
    const quantity = quantityElement.textContent;
    total += price * quantity;

  });

  totalPriceElement.textContent = `$${total}`;

};

let cartItemCount = 0;
const updateCartCount = change => {
  const cartItemCountBadge = document.querySelector('.cart-item-count');
  cartItemCount += change;
  if(cartItemCount > 0){
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  }
  else{
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent ='';
  }

  localStorage.setItem('cartItemCount', cartItemCount);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCount = parseInt(localStorage.getItem('cartItemCount')) || 0;
  cartItemCount = savedCount;
  updateCartCount(0); // Update the badge based on saved count
} );

function updateCartQuantity(title, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems.find(item => item.title === title);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //const mainSearch = document.getElementById("main-search");
  const cartSearch = document.getElementById("cart-search");

//   if (mainSearch) {
//     mainSearch.addEventListener("input", () => {
//       const query = mainSearch.value.toLowerCase();
//       filterMainProducts(query);
//     });
//   }

  if (cartSearch) {
    cartSearch.addEventListener("input", () => {
      const query = cartSearch.value.toLowerCase();
      filterCartItems(query);
    });
  }
});

function filterCartItems(query) {
  const cartBoxes = document.querySelectorAll(".cart-box");
  cartBoxes.forEach(box => {
    const title = box.querySelector(".cart-product-title").textContent.toLowerCase();
    box.style.display = title.includes(query) ? "block" : "none";
  });
}