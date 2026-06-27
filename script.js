const header = document.querySelector(".site-header");
const ownerPassword = "welday2026";
const productsStorageKey = "welday-products";
const maxProductImageSize = 2 * 1024 * 1024;
const ownerOpenButton = document.querySelector("[data-owner-open]");
const ownerCloseButton = document.querySelector("[data-owner-close]");
const ownerModal = document.querySelector("[data-owner-modal]");
const ownerLogin = document.querySelector("[data-owner-login]");
const ownerError = document.querySelector("[data-owner-error]");
const productForm = document.querySelector("[data-product-form]");
const productError = document.querySelector("[data-product-error]");
const productList = document.querySelector("[data-product-list]");
const emptyProducts = document.querySelector("[data-empty-products]");

window.addEventListener("scroll", () => {
  if (window.scrollY > 32) {
    header.style.background = "rgba(17, 23, 25, 0.9)";
  } else {
    header.style.background = "rgba(17, 23, 25, 0.66)";
  }
});

function getProducts() {
  return JSON.parse(localStorage.getItem(productsStorageKey) || "[]");
}

function saveProducts(products) {
  localStorage.setItem(productsStorageKey, JSON.stringify(products));
}

function readProductImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name) {
      resolve("");
      return;
    }

    if (file.size > maxProductImageSize) {
      reject(new Error("A imagem precisa ter até 2 MB."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Não foi possível carregar a imagem.")));
    reader.readAsDataURL(file);
  });
}

function renderProducts() {
  const products = getProducts();
  productList.innerHTML = "";
  emptyProducts.hidden = products.length > 0;

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    if (product.image) {
      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.image;
      image.alt = product.name;
      card.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "product-card-content";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const price = document.createElement("strong");
    price.className = "product-price";
    price.textContent = product.price;

    const description = document.createElement("p");
    description.textContent = product.description || "Consulte disponibilidade, cores e tamanhos na loja.";

    content.append(title, price, description);
    card.appendChild(content);
    productList.appendChild(card);
  });
}

function openOwnerModal() {
  ownerModal.hidden = false;
  ownerError.textContent = "";
  productError.textContent = "";
  ownerLogin.hidden = false;
  productForm.hidden = true;
  ownerLogin.reset();
  productForm.reset();
  ownerLogin.querySelector("input").focus();
}

function closeOwnerModal() {
  ownerModal.hidden = true;
  ownerError.textContent = "";
  productError.textContent = "";
  ownerLogin.reset();
  productForm.reset();
}

ownerOpenButton.addEventListener("click", openOwnerModal);
ownerCloseButton.addEventListener("click", closeOwnerModal);

ownerModal.addEventListener("click", (event) => {
  if (event.target === ownerModal) {
    closeOwnerModal();
  }
});

ownerLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = new FormData(ownerLogin).get("password");

  if (password !== ownerPassword) {
    ownerError.textContent = "Senha incorreta.";
    return;
  }

  ownerLogin.hidden = true;
  productForm.hidden = false;
  productForm.querySelector("input").focus();
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const products = getProducts();
  const imageFile = formData.get("image");
  let image = "";

  try {
    image = await readProductImage(imageFile);
  } catch (error) {
    productError.textContent = error.message;
    return;
  }

  products.unshift({
    name: formData.get("name").trim(),
    price: formData.get("price").trim(),
    description: formData.get("description").trim(),
    image,
  });

  saveProducts(products);
  renderProducts();
  productForm.reset();
  productError.textContent = "";
  productForm.querySelector("input").focus();
});

renderProducts();
