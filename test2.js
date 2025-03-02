const apiURL = 'https://dummyjson.com/products?limit=15';
const productGrid = document.getElementById('product-grid');
let products = [];


const fetchProducts = async () => {
  try {
  const response = await fetch(apiURL);
  const data = await response.json();
  products = data.products;
  displayProducts(products);
  } catch (error) {
    console.error(error);
  }
};


const displayProducts = (products) => {
  productGrid.innerHTML = '';  
  if (products.length <= 0 || null )
  {
    productGrid.innerHTML = "<h1> NO PRODUCT FOUND </h1>";
  }
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    productCard.innerHTML = `
      
    <img src="${product.images[0]}" alt="${product.title}" class="main-image">
    <h3 class="product-title">${product.title}</h3>
    <div class="thumbnail-container">
      <img src="${product.thumbnail}" alt="Thumbnail" class="thumbnail">
    </div>
    <p class="original-price">Rs. <s>${product.price}</s></p>
    <p class="discounted-price">Rs. ${(product.price - (product.price * product.discountPercentage / 100)).toFixed(2)}</p>
    <span class="discount-badge">save ${product.discountPercentage}%</span>
    <div class="rating">
      ${'⭐'.repeat(Math.round(product.rating))}
    </div>
    <button class="show-description">Show Description</button>
    <div class="description" style="display: none;">${product.description}</div>
    <button class="less-description" style="display: none;">Less Description</button>
    <button class="add-to-cart">Add to cart</button>

    `;

    const showDescriptionButton = productCard.querySelector('.show-description');
    const lessDescriptionButton = productCard.querySelector('.less-description');
    const description = productCard.querySelector('.description');

    showDescriptionButton.addEventListener('click', () => {
      description.style.display = 'block';
      showDescriptionButton.style.display = 'none';
      lessDescriptionButton.style.display = 'inline-block';
    });

    lessDescriptionButton.addEventListener('click', () => {
      description.style.display = 'none';
      showDescriptionButton.style.display = 'inline-block';
      lessDescriptionButton.style.display = 'none';
    });

    productGrid.appendChild(productCard);
  });
};


const sortByPriceLowToHigh = () => {
  const sortedProducts = [...products].sort((a, b) => a.price - b.price);
  displayProducts(sortedProducts);
};


const sortByPriceHighToLow = () => {
  const sortedProducts = [...products].sort((a, b) => b.price - a.price);
  displayProducts(sortedProducts);
};


const sortByRatingHighToLow = () => {
  const sortedProducts = [...products].sort((a, b) => b.rating - a.rating);
  displayProducts(sortedProducts);
};


const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search');

const searchProducts = async () => {
  const query = searchInput.value.trim();
  if (query) {
    const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const data = await response.json();
    displayProducts(data.products);
  }
};


const clearSearch = () => {
  searchInput.value = '';
  fetchProducts();
};


const categoriesList = document.getElementById('categories-list');
const clearCategoriesButton = document.getElementById('clear-categories');

const fetchCategories = async () => {
  const response = await fetch('https://dummyjson.com/products/categories');
  const categories = await response.json();
  displayCategories(categories);
};


const displayCategories = (categories) => {
  categoriesList.innerHTML = '';
  categories.forEach(category => {
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'category';
    radioButton.value = category;
    radioButton.id = category.name;

    const label = document.createElement('label');
    label.setAttribute('for', category.name);
    label.innerText = category.name;

    const div = document.createElement('div');
    div.classList.add('categories-list-items');
    div.appendChild(radioButton);
    div.appendChild(label);

    categoriesList.appendChild(div);

    radioButton.addEventListener('change', () => filterByCategory(category.name));
  });
};


const filterByCategory = async (category) => {
  const response = await fetch(`https://dummyjson.com/products/category/${category}`);
  const data = await response.json();
  displayProducts(data.products);
};


const clearCategories = () => {
  const radioButtons = document.querySelectorAll('input[type="radio"][name="category"]');
  radioButtons.forEach(button => {
    button.checked = false;  
  });
  fetchProducts();
};


document.getElementById('sort-low-high').addEventListener('click', sortByPriceLowToHigh);
document.getElementById('sort-high-low').addEventListener('click', sortByPriceHighToLow);
document.getElementById('sort-rating').addEventListener('click', sortByRatingHighToLow);


searchButton.addEventListener('click', searchProducts);
clearSearchButton.addEventListener('click', clearSearch);


clearCategoriesButton.addEventListener('click', clearCategories);


fetchProducts();
fetchCategories();
