import { postData } from "../frontend_utils/fetch_api.js"

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
const radioContainer = document.getElementById('radio-container');

async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 1) {
    document.getElementById("nav_auth").style.display = "none";
    document.getElementById("nav_logout").style.display = "block";
  } else {
    document.getElementById("nav_auth").style.display = "block";
    document.getElementById("nav_logout").style.display = "none";
  }
}
function createNotification(message,type,time) {
  const notification = document.createElement('div');
  notification.classList.add(type);
  notification.innerHTML = message;

  document.getElementById('notificationContainer').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, time);
}

document.getElementById('nav_logout').addEventListener('click',async()=>{
  const result=await postData('/logout',{});
 await validate_user()
})
validate_user();

// Add event listener to the container element
radioContainer.addEventListener('change', handleCategoryChange);

async function handleCategoryChange(event) {
  const category = event.target.value;
  createNotification("Category Changed Successfully","success_notification",5000)
  await fetch_products("prod1",`/products/category/${category}`)
}


  
function open_product(id){
    return ()=>{
      location.href = `/product/webpage/${id}`
    }
}
function add_to_cart(id){
    return async()=>{
      const result = await postData('/add_to_cart',{"items" : [{"productId" : id,"quantity" :1} ]})
      if(result.validate != null && result.validate==0){
        createNotification('Authenticate to perform this action',"alert_notification",5000);
      }
      else{
        createNotification('Added to cart',"success_notification",5000);
      }
    }
}

async function fetch_products(id,url) {
    const response= await fetch(url)
    const result = await response.json()
    const products = result.products
    console.log(products)
    if(products.length == 0 )
    {
        document.getElementById(id).innerHTML = "No products under this category";
        return;
    }
    document.getElementById(id).innerHTML=""
    for (let i = 0; i < products.length; i++) {
      const star = `<i class="fas fa-star"></i>`;
      document.getElementById(id).innerHTML += `
    <div class="pro" >
    <img src="${products[i].Image[0]}" alt="" id="${products[i]._id}">
    <div class="des">
        <span>${products[i].Attributes.Brand}</span>
        <h3>${products[i].Name}</h3>
        <div class="star">
            ${star.repeat(products[i].Rating)}
        </div>
        <h4>$${products[i].Price}</h4></div>
        <div Style="dispaly:flex; flex-direction: row; width:100%; margin-top:15px; border-radius: 25px; background-color:
        rgb(235, 243, 232); justify-content: left;  align-items: left;">
        <a href="https://developers.google.com/ar" Style="text-decoration:None; color:black; font: 15px Arial, sans-serif; ">AR-VIEW</a></div>
    <i id="${products[i]._id}cart" class="fa-sharp fa-solid fa-cart-shopping cart" style="width: 40px;height: 20px;"></i>
  </div>`;
    }
    for (let i = 0; i < products.length; i++) {
      if (products.includes(products[i])) {
      let element1 = document.getElementById(`${products[i]._id}`)
      element1.addEventListener("click", open_product(products[i]._id));
      let element2 = document.getElementById(`${products[i]._id}cart`)
      element2.addEventListener("click", add_to_cart(products[i]._id));
      }
    }
  }
fetch_products("prod1",'/products')