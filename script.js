// script.js
function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");
  var dropdownses = document.getElementById("Dropdown");
  dropdownses.classList.toggle("show");
}

// Close the dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if (!event.target.matches('.drop') && !event.target.closest('.dropdown-contenido')) {
    var dropdownsess = document.getElementsByClassName("dropdown-contenido");
    for (var i = 0; i < dropdownsess.length; i++) {
      var openDropdown = dropdownsess[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};
