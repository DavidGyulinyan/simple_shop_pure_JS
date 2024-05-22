class Product {
    constructor(imageFile, title, price) {
        this.imageFile = imageFile;
        this.title = title;
        this.price = price;
    }

    render() {
        const storeElement = document.querySelector(".store");
        const productCard = document.createElement("div");
        productCard.classList.add("productCard");

        const imgElement = document.createElement("img");
        imgElement.src = this.imageFile;
        imgElement.alt = this.title;
        productCard.appendChild(imgElement);

        const titleElement = document.createElement("h3");
        titleElement.textContent = this.title;
        productCard.appendChild(titleElement);

        const priceElement = document.createElement("p");
        priceElement.textContent = `$${this.price}`;
        productCard.appendChild(priceElement);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("deleteButton");
        deleteButton.addEventListener("click", () => this.delete());
        productCard.appendChild(deleteButton);

        storeElement.appendChild(productCard);
    }

    delete() {
        // Remove product from local storage
        this.removeFromLocalStorage();

        // Remove product card from the UI
        const productCard = document.querySelector(`.productCard img[src="${this.imageFile}"]`).parentElement;
        productCard.remove();
    }

    removeFromLocalStorage() {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(product => product.imageFile !== this.imageFile);
        localStorage.setItem('products', JSON.stringify(products));
    }
}

const addProductButton = document.querySelector(".addNewProductButton");

function addProductToStore(event) {
    event.preventDefault();

    const imageInput = document.querySelector(".imageInput");
    const titleInput = document.querySelector(".titleInput");
    const priceInput = document.querySelector(".priceInput");

    const imageFile = imageInput.files[0];
    const title = titleInput.value;
    const price = priceInput.value;

    if (!imageFile || !title || !price) {
        alert("Please fill in all fields");
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        const product = new Product(imageUrl, title, price);
        product.render();
        // Save product to local storage after image is loaded
        saveProductToLocalStorage(product);
    }
    reader.readAsDataURL(imageFile);

    // Reset input fields
    imageInput.value = '';
    titleInput.value = '';
    priceInput.value = '';
}

function saveProductToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(productData => {
        const product = new Product(productData.imageFile, productData.title, productData.price);
        product.render();
    });
}

// Load products from local storage when the page loads
window.addEventListener('load', loadProductsFromLocalStorage);

addProductButton.addEventListener("click", addProductToStore);
