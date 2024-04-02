const userName = document.querySelector(".userName")
const socket = io()

let nameUser = ""

Swal.fire({
    title: "Ingrese su nombre",
    input: "text",
    inputAttributes: {
        autocapitalize: "on"
    },
    showCancelButton: false,
    confirmButtonText: "Ingresar",
}).then((result) => {
    userName.textContent = result.value
    nameUser = result.value
    socket.emit("userConnection", {
        user: result.value,
    })
})

const chatMessage = document.querySelector(".chatMessage")
let idUser = ""

const messageInnerHTML = (data) => {
    let message = ""

    for (let i = 0; i < data.length; i++) {
        if (data[i].info === "connection") {
            message += `<p class="connection">${data[i].message}</p>`
        }
        if (data[i].info === "message") {
            message += `
          <div class="messageUser">
              <h5>${data[i].name}</h5>
              <p>${data[i].message}</p>
          </div>
          `
        }
    }
    return message
}
socket.on("userConnection", (data) => {
    chatMessage.innerHTML = ""
    const connection = messageInnerHTML(data)
    chatMessage.innerHTML = connection
})

const inputMessage = document.getElementById("inputMessage")
const btnMessage = document.getElementById("btnMessage")

btnMessage.addEventListener("click", (e) => {
    e.preventDefault()
    socket.emit("userMessage", {
        message: inputMessage.value,
    })
})

/*socket.on("userMessage", (data) => {
    chatMessage.innerHTML = ""
    const message = messageInnerHTML(data)
    chatMessage.innerHTML = message
})*/

socket.on('userMessage', (data) => {
    // Mostrar el mensaje en el chat
    const chatMessage = document.querySelector(".chatMessage");
    chatMessage.innerHTML += `
        <div class="messageUser">
            <h5>${data.name}</h5>
            <p>${data.message}</p>
        </div>
    `;
});

inputMessage.addEventListener("keypress", () => {
    socket.emit("typing", { nameUser })
})

const typing = document.querySelector(".typing");
socket.on("typing", (data) => {
    typing.textContent = `${data.nameUser} escribiendo...`
})

socket.emit("message", "Mensaje recibido desde el cliente")

getProducts()

socket.on("receiveProducts", (products) => {
    renderProducts(products)
})

socket.on("productAdded", () => {
    getProducts()
})

socket.on("productDeleted", (productId) => {
    removeProduct(productId)
})

function addProduct() {
    const titleInput = document.getElementById("title")
    const descriptionInput = document.getElementById("description")
    const priceInput = document.getElementById("price")
    const codeInput = document.getElementById("code")
    const stockInput = document.getElementById("stock")
    const thumbnailsInput = document.getElementById("thumbnails")

    if (!titleInput || !descriptionInput || !priceInput || !codeInput || !stockInput) {
        console.error("Uno o más elementos del formulario no existen en el DOM")
        return
    }

    const obj = {
        title: titleInput.value,
        description: descriptionInput.value,
        price: priceInput.value,
        code: codeInput.value,
        stock: stockInput.value,
        thumbnails: thumbnailsInput.value
    }

    socket.emit("addProduct", obj)

    // Reseteo los campos del formulario
    titleInput.value = "";
    descriptionInput.value = "";
    priceInput.value = "";
    thumbnailsInput.value = "";
    codeInput.value = "";
    stockInput.value = "";
}

function deleteProduct(productId) {
    socket.emit("deleteProduct", productId)
}

function getProducts() {
    socket.emit("getProducts")
}

function renderProducts(products) {
    const productsContainer = document.getElementById("products-container")
    productsContainer.innerHTML = ""
    products.forEach((product) => {
        renderProduct(product)
    })
}

function renderProduct(product) {
    const productsContainer = document.getElementById("products-container")
    const productCardHTML = `
    <div class="product-card" id="product-${product.id}">
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
    productsContainer.insertAdjacentHTML("beforeend", productCardHTML)
}

function removeProduct(productId) {
    const productElement = document.getElementById(`product-${productId}`)
    if (productElement) {
        productElement.remove()
    }
}

