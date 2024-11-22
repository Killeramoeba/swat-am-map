$("#help").on("click", function (e) {
  e.preventDefault();
  $("#help-info").css("display", "flex");
});

// Get the modal
var modal = document.getElementById("help-info");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$("#help-info").on("click", function (event) {
  // Only trigger if clicking the modal backdrop (not its children)
  if (event.target.id === "help-info") {
    $(this).hide();
  }
});
