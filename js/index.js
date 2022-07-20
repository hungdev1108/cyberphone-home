function getEle(id) {
  return document.getElementById(id);
}

let listProduct = [];
let listCart = [];

function getListProduct() {
  //pending
  getEle("lds-roller").style.display = "block";

  axios({
    url: "https://62c2438e2af60be89ed4b593.mockapi.io/productAPI/Products",
    method: "GET",
  })
    .then((result) => {
      listProduct = result.data;
      getEle("lds-roller").style.display = "none";
      renderProduct(result.data);
    })
    .catch((error) => {
      getEle("lds-roller").style.display = "none";
      console.log(error);
    });
}

getListProduct(renderProduct);

// renderProduct
function renderProduct(data) {
  let contentHTML = "";

  for (let i = 0; i < data.length; i++) {
    let productImg = data[i].img.includes("https")
      ? data[i].img
      : `./../../assets/img/${data[i].img}`;

    let cartJSON = JSON.stringify(data[i]);
    contentHTML += `
    <tr>
        <th scope="row"><b>${i + 1}</b></th>
        <td>${data[i].name}</td>
        <td>
            <img width="50px" 
            src="${productImg}" 
            alt="${data[i].name}"
            >
        </td>
        <td>${data[i].price}$</td>
        <td>
            <p>${data[i].desc}</p>
            <p>Screen: ${data[i].screen} inch</p>
            <p>Back Camera: ${data[i].backCamera}</p>
            <p>Front Camera: ${data[i].frontCamera}</p>
        </td>
        <td>${data[i].type}</td>
        <td>
            <button onclick='addToCart(${cartJSON})' class="btn btn-primary btn-block text-uppercase btn-addcart">
            Add to cart
        </button>
        </td>
  </tr>
      `;
  }
  getEle("tblProducts").innerHTML = contentHTML;
}

// filter Product
function filterProduct() {
  let typeProduct = document.getElementById("typeProduct").value;
  if (typeProduct == "All") return renderProduct(listProduct);

  let filterList = listProduct.filter((item) => {
    return item.type.toLowerCase() === typeProduct.toLowerCase();
  });
  renderProduct(filterList);
}

// addCart
function addToCart(cart) {
  let index = findId(cart.id);

  if (index !== -1) {
    listCart[index].quantity = ++listCart[index].quantity;
  } else {
    listCart.push({ ...cart, quantity: 1 });
  }
  saveCartLocal();
  showListCart();
}

// showListCart
function showListCart() {
  getCartLocal();
  let contentHTML = "";

  for (let i = 0; i < listCart.length; i++) {
    let productImg = listCart[i].img.includes("https")
      ? listCart[i].img
      : `./../../assets/img/${listCart[i].img}`;

    contentHTML += `
                <tr>
                    <td>${listCart[i].name}</td>
                    <td>
                      <img
                        src="${productImg}"
                        alt="${listCart[i].name}"
                      />
                    </td>
                    <td>${listCart[i].price}$</td>
                    <td>${listCart[i].quantity}</td>
                    <td>
                        <button
                            onClick="delCart(${listCart[i].id})"
                            type="button"
                            class="btn btn-danger"
                            aria-label="Close">
                        X
                        </button>
                    </td>
                </tr>   
      `;
  }
  getEle("tblCart").innerHTML = contentHTML;
  getEle("totalProduct").innerHTML = listCart.reduce((acc, current) => {
    return (acc += current.price * current.quantity);
  }, 0);
  getEle("cartAmount").innerHTML = listCart.reduce((acc, current) => {
    return (acc += current.quantity);
  }, 0);
}

// delCart
function delCart(id) {
  let index = findId(id);

  listCart.splice(index, 1);
  saveCartLocal();
  showListCart();
}

// checkout
function checkout() {
  listCart = [];
  saveCartLocal();
  showListCart();
  document.getElementById("closeModal").click();
}

function findId(id) {
  const index = listCart.findIndex((cartItem) => {
    return cartItem.id === id;
  });
  return index;
}

// getCartLocal
function getCartLocal() {
  let cartLocalJSON = localStorage.getItem("listCart");

  if (cartLocalJSON == null) return;

  listCart = JSON.parse(cartLocalJSON);
}

// saveCartLocal
function saveCartLocal() {
  let cartJSON = JSON.stringify(listCart);

  localStorage.setItem("listCart", cartJSON);
}

showListCart();
