// overlay effect
function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
  if (document.getElementById("hmCheck").checked) {
    document.getElementById("hmCheck").checked = false;
  }
}

function toggleOverlay() {
  let ele = document.getElementById("hmCheck");
  if (ele.checked) {
    on();
  } else {
    off();
  }
}

$(function () {
  // Set button to click.
  const button = document.getElementById("menu-toggle");

  // Click the button.
  button.onclick = function () {
    // Toggle class "opened". Set also aria-expanded to true or false.
    if (-1 !== button.className.indexOf("opened")) {
      button.className = button.className.replace(" opened", "");
      button.setAttribute("aria-expanded", "false");
    } else {
      button.className += " opened";
      button.setAttribute("aria-expanded", "true");
    }
  };

  // reset the hamburger Menu
  off();
});
