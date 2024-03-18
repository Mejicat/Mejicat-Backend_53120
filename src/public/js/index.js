const socket = io()

socket.emit("message", "Mensaje recibido desde el cliente")

getProducts()

socket.on("receiveProducts", (products) => {
  renderProducts(products)
})

function addProduct() {
  const titleInput = document.getElementById("title")
  const descriptionInput = document.getElementById("description")
  const priceInput = document.getElementById("price")
  const codeInput = document.getElementById("code")
  const stockInput = document.getElementById("stock")
  const thumbnailsInput = document.getElementById("thumbnails")

  // Verifico si algún elemento es null antes de acceder a su propiedad value
  if (!titleInput || !descriptionInput || !priceInput || !codeInput || !stockInput || !thumbnailsInput) {
    console.error("Uno o más elementos del formulario no existen en el DOM.")
    return;
  }

  const formData = new FormData()
  formData.append("title", titleInput.value)
  formData.append("description", descriptionInput.value)
  formData.append("price", priceInput.value)
  formData.append("code", codeInput.value)
  formData.append("stock", stockInput.value)
  formData.append("thumbnails", thumbnailsInput.value)

  socket.emit("addProduct", formData)

  // Reseteo los campos del formulario
  titleInput.value = ""
  descriptionInput.value = ""
  priceInput.value = "";
  thumbnailsInput.value = ""
  codeInput.value = ""
  stockInput.value = ""
}

function deleteProduct(productId) {
  socket.emit("deleteProduct", +productId)
  getProducts()
}

function getProducts() {
  socket.emit("getProducts")
}

function renderProducts(products) {
  const productsContainer = document.getElementById("products-container");
  let productCardsHTML = ""

  products.forEach((product) => {
    productCardsHTML += `
    <div class="product-card">
      <img class="product-thumbnail" src="${product.thumbnails}" alt="Product Thumbnail">
      <div class="product-details">
        <p class="product-title">${product.title}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-code">Code: ${product.code}</p>
      </div>
      <div class="product-actions">
        <button class="delete-button" onclick="deleteProduct(${product.id})">Borrar</button>
      </div>
    </div>
    `
  })

  productsContainer.innerHTML = productCardsHTML;
}