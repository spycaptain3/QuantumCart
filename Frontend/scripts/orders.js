import { postData } from "../frontend_utils/fetch_api.js";

const navToggler = document.querySelector(".nav-toggler");
const navMenu = document.querySelector(".site-navbar ul");
const navLinks = document.querySelectorAll(".site-navbar a");

// load all event listners
allEventListners();

// functions of all event listners
function allEventListners() {
  // toggler icon click event
  navToggler.addEventListener("click", togglerClick);
  // nav links click event
  navLinks.forEach((elem) => elem.addEventListener("click", navLinkClick));
}

// togglerClick function
function togglerClick() {
  navToggler.classList.toggle("toggler-open");
  navMenu.classList.toggle("open");
}

// navLinkClick function
function navLinkClick() {
  if (navMenu.classList.contains("open")) {
    navToggler.click();
  }
}

async function validate_user() {
  const result = await postData("/validate", {});
  if (result.validate == 1) {
    document.getElementById("nav_auth").style.display = "none";
    document.getElementById("nav_logout").style.display = "block";
  } else {
    createNotification(
      "Login Before Seing Your orders",
      "alert_notification",
      5000
    );
    document.getElementById("nav_auth").style.display = "block";
    document.getElementById("nav_logout").style.display = "none";
    document.getElementById("prev-orders").innerHTML = "";
  }
}

document.getElementById("nav_logout").addEventListener("click", async () => {
  const result = await postData("/logout", {});
  console.log(result);
  await validate_user();
});
validate_user();

function createNotification(message, type, time) {
  const notification = document.createElement("div");
  notification.classList.add(type);
  notification.textContent = message;
  document.getElementById("notificationContainer").appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 5500);
}
function print_receipt(id) {
  return async function () {
    const response = await fetch(`/receipt/${id}`, {}); // Replace with your backend URL
    const htmlContent = await response.text();
    const filename = 'receipt.html';


    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };
}

function cancel_order(id) {
  return async function () {
    if (
      confirm(
        "Warning: Cancelling your order may result in missing out on exclusive deals and limited stock. Are you sure you want to cancel?"
      ) == true
    ) {
      const response = await postData(`/orders/cancel/${id}`, {});
      await fetch_orders();
      createNotification(
        `Order with id: ${id} Canceled Successfully`,
        "success_notification",
        5000
      );
      createNotification(
        `Your payment has been refunded Successfully`,
        "success_notification",
        5000
      );
    }
  };
}

async function fetch_orders() {
  const result = await postData("/orders", {});
  const orders = result.orders;
  if (orders.length == 0) {
    document.getElementById(
      "prev-orders"
    ).innerHTML = `There are no orders associated with this user`;
    return;
  }
  document.getElementById("prev-orders").innerHTML = ``;
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    document.getElementById("prev-orders").innerHTML += `
    <tr>
    <td scope="row">${item._id}</th>
    <td data-title="Total">${item.totalAmount}</td>
    <td data-title="Delievery Location">${item.shippingAddress}</td>
    <td data-title="Order Status" >${item.status}</td>
    <td data-title="Cancel">${
      item.status == "Inventory" ||
      item.status == "Shipped" ||
      item.status == "OutForDelievery"
        ? `<a href='#' id='${item._id}cancel'>Cancel</a>`
        : "NA"
    }</td>
    <td data-title="Receipt" style="color:blue;cursor:pointer" id="${
      item._id
    }receipt">Receipt</td>
    </tr>
      `;
  }
  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];
    if (orders.includes(orders[i])) {
      const element1 = document.getElementById(`${item._id}receipt`);
      element1.addEventListener("click", print_receipt(item._id));
      if (
        item.status == "Inventory" ||
        item.status == "Shipped" ||
        item.status == "OutForDelievery"
      ) {
        const element2 = document.getElementById(`${item._id}cancel`);
        element2.addEventListener("click", cancel_order(item._id));
      }
    }
  }
}
fetch_orders();
