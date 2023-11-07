import { postData } from "../frontend_utils/fetch_api.js";

const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');

// load all event listners
allEventListners();

// functions of all event listners
function allEventListners() {
  // toggler icon click event
  navToggler.addEventListener('click', togglerClick);
  // nav links click event
  navLinks.forEach( elem => elem.addEventListener('click', navLinkClick));
}

// togglerClick function
function togglerClick() {
  navToggler.classList.toggle('toggler-open');
  navMenu.classList.toggle('open');
}

// navLinkClick function
function navLinkClick() {
  if(navMenu.classList.contains('open')) {
    navToggler.click();
  }
}
async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 1) {
    document.getElementById("nav_auth").style.display = "none";
    document.getElementById("nav_logout").style.display = "block";
  } else {
    createNotification("Authenticate to access cart","alert_notification",5000);
    document.getElementById("nav_auth").style.display = "block";
    document.getElementById("nav_logout").style.display = "none";
    document.getElementById("cart-items").innerHTML =""
    document.getElementById("cart-subtotal").innerHTML =""
    document.getElementById("cart-total").innerHTML =""
  }
}

document.getElementById('nav_logout').addEventListener('click',async()=>{
  const result=await postData('/logout',{});
 await validate_user()
})
validate_user();

function createNotification(message,type,time) {
  const notification = document.createElement('div');
  notification.classList.add(type);
  notification.textContent = message;

  document.getElementById('notificationContainer').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, time);
}
function change_listner(Currentkey, price) {
  return async function () {
    const new_quantity = document.getElementById(`${Currentkey}quantity`).value;
    const result = await postData("/change_quantity", {
      productId: Currentkey,
      quantity: parseInt(new_quantity),
    });
    const new_total = new_quantity * price;
    document.getElementById(`${Currentkey}total`).innerText = `${new_total}`;
    document.getElementById('cart-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('cart-total').innerHTML = `${result.TotalPrice}`
    createNotification("Quantity Updated Successfully","success_notification",3000);
  };
}
function remove_listner(Currentkey) {
  return async function () {
    const result = await postData("/remove_from_cart", {
      productId: Currentkey,
    });
    document.getElementById('cart-subtotal').innerHTML = `${result.TotalPrice}`
    document.getElementById('cart-total').innerHTML = `${result.TotalPrice}`
    fetch_cart();
    createNotification("Item Removed successfully","success_notification",3000);
  };
}
async function fetch_cart() {
  const response= await fetch(`/fetch_cart`)
  const result = await response.json()
  const cart_data = result.cart
  const cart_items = cart_data.items
  const success = result.success;
  if (success == 0 || cart_data.total==0) {
    document.getElementById("cart-items").innerHTML =
      "This user has no elements in his cart";
      document.getElementById("cart-items").style.textAlign="center"
      document.getElementById("cart-items").style.marginTop= "25px";
  } else if (success == 1) {
    document.getElementById('cart-subtotal').innerHTML = `${cart_data.total}`
    document.getElementById('cart-total').innerHTML = `${cart_data.total}`
    document.getElementById("cart-items").innerHTML = "";
    
    for (let key in cart_items) {
      const quantity = cart_items[key];
      const response= await fetch(`/products/${key}`)
      const product = await response.json()
      const result = product.product
      const subtotal = quantity * result.Price;
      document.getElementById("cart-items").innerHTML += `
      <div class="product">
          <div class="product-image">
            <img src="${result.Image[0]}" />
          </div>
          <div class="product-details">
            <div class="product-title">${result.Name}</div>
          </div>
          <div class="product-price">${result.Price}</div>
          <div class="product-quantity">
            <input type="number" id="${key}quantity" value="${quantity}" min="1" />
          </div>
          <div class="product-removal">
            <button class="remove-product" id="${key}remove">Remove</button>
          </div>
          <div class="product-line-price" id="${key}total" >${subtotal}</div>
        </div>
      `;
    }
    // Doing it to resolve closure related issues(otherwise only last event listner is executed)
    for (let key in cart_items) {
      const response= await fetch(`/products/${key}`)
      const product = await response.json()
      const result = product.product
      if (cart_items.hasOwnProperty(key)) {
        const element1 = document.getElementById(`${key}quantity`);
        element1.addEventListener("change", change_listner(key, result.Price));
        const element2 = document.getElementById(`${key}remove`);
        element2.addEventListener("click", remove_listner(key));
      }
    }
    document.getElementById('checkout').addEventListener('click',async()=>
    {
      location.href = `/checkout?source=cart`
   })
  }
}

fetch_cart()
