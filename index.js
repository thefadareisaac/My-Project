const cartIcon = document.getElementById('cart-icon');
//const closeCart = document.getElementById('cart-close');


cartIcon.addEventListener("click", function() {
    const overlay = document.getElementById("fade-overlay");
    overlay.style.opacity = 1;
    // Delay the redirect until after the transition
    setTimeout(() => window.location.href = "cart.html", 500);
});


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

let productData = [];
let defaultFeatured = [];
let recommended = [];

//document.addEventListener("DOMContentLoaded", () => {
  const mainSearch = document.getElementById("main-search");
  mainSearch.addEventListener("input", () => {
    const query = mainSearch.value.toLowerCase();
    if (query == ''){
      renderProducts([],'search-grid');
      renderProducts(recommended.splice(0,12), 'featured-products-grid');
    }
    else{
      const filtered = productData.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
      
      renderProducts(filtered.splice(0,12), 'search-grid');
      recommended = filtered;
      renderProducts(recommended.splice(0,12), 'featured-products-grid');
      
    };

  });
  
//});



function updateCartQuantity(title, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems.find(item => item.title === title);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('.product-title').textContent;
    const AddButton = card.querySelector('.addtocart-button');

    const exists = cartItems.some(item => item.title === title);

    if (exists) {
      AddButton.textContent = "Added to Cart";
      AddButton.classList.add("added");
    }
  });
});

// Load JSON and render products
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    productData = data;
    const TechandElectronics = data.filter(product => product.category === 'Tech & Electronics') || [];
    const HomeandKitchen = data.filter(product => product.category === 'Home & Kitchen') || [];
    const FashionandAccessories = data.filter(product => product.category === 'Fashion & Accessories') || [];
    defaultFeatured = getRandomSubset(productData, 12);
    renderProducts(defaultFeatured, 'featured-products-grid');

    //getting random products based on category
    const randomTechandElectronics = getRandomSubset(TechandElectronics, 12) || []; // Show 18 random products
    const randomHomeandKitchen = getRandomSubset(HomeandKitchen, 12) || [];
    const randomFashionandAccessories = getRandomSubset(FashionandAccessories, 12) || [];
    const randomproductData = getRandomSubset(productData, 12) || [];

    // product rendering
    renderProducts(randomproductData,'featured-products-grid' );
    renderProducts(randomTechandElectronics,'tech-&-electronics' );
    renderProducts(randomHomeandKitchen, "homeandkitchen");
    renderProducts(randomFashionandAccessories, "fashion-&-accessories");
  });

// Shuffle and select N products
function getRandomSubset(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
   return shuffled.slice(0, count); 
  //   return shuffled.slice(0, count);
}

// Render products into grid
function renderProducts(products, gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = ''; // Clear existing content

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image-info">
        <img class="product-image" src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <div>
          <p class="product-title">${product.title}</p> 
          <span class="product-price">${product.price}</span>
          <p class="product-description">${product.description}</p>
        </div>

        <div class="adjusting-quantity-section">
          <div class="quantity-section">
            <button id="decrement">-</button>
            <span class="quantity-box">1</span>
            <button id="increment">+</button>
          </div>
          <div class="addtocart">
            <button class="addtocart-button">Add to Cart</button>
          </div>
        </div> 
      </div>              
    `;
    grid.appendChild(card);

    const title = card.querySelector('.product-title').textContent;
    const qtyCount = card.querySelector('.quantity-box');
    const incrementBtn = card.querySelector('#increment');
    const decrementBtn = card.querySelector('#decrement');
    const addButton = card.querySelector('.addtocart-button');
    const ProductBox = card;

    // 🔍 Load quantity from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.title === title);
    let quantity = existingItem ? existingItem.quantity : 1;

    // ✅ Display initial quantity
    qtyCount.textContent = quantity;


    const updateQtyDisplay = () => {
      qtyCount.textContent = quantity;
      updateCartQuantity(title, quantity); // ✅ Sync with cart
    };

    incrementBtn.addEventListener('click', () => {
      quantity++;
      updateQtyDisplay();
      decrementBtn.style.color = '#333';
    });

    decrementBtn.addEventListener('click', () => {
      if (quantity === 1){
        decrementBtn.style.color = '#999';
      }
      if (quantity > 1) {
        quantity--;
        updateQtyDisplay();
      }
    });

    addButton.addEventListener('click', () => {
      AddtoCart(ProductBox);
    });

    
  });

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('.product-title').textContent;
    const AddButton = card.querySelector('.addtocart-button');

    const exists = cartItems.some(item => item.title === title);

    if (exists) {
      AddButton.textContent = "Added to Cart";
      AddButton.classList.add("added");
    }
  });
}

const AddtoCart = ProductBox => {
  const title = ProductBox.querySelector('.product-title').textContent;
  const AddButton = ProductBox.querySelector('.addtocart-button')
        
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const existingItem = cartItems.find(item => item.title === title);
  if (existingItem) {
    alert("Item is already in the cart!");
    return; // Stop here if it's a duplicate
  }

  if (!existingItem) {
    const product = {
      img: ProductBox.querySelector('img').src,
      title,
      price: ProductBox.querySelector('.product-price').textContent,
      description: ProductBox.querySelector('.product-description').textContent,
      quantity: parseInt(ProductBox.querySelector('.quantity-box').textContent)
    };
    cartItems.push(product);
  };
  
  updateCartCount(1);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  // alert("Item added to cart!");
  AddButton.textContent = "Added to Cart";
  AddButton.classList.add("added");


};