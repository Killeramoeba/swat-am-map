$(".button").on("click", function (e) {
  e.preventDefault();
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
    colorclass = "context-menu";
    text = "";
  } else {
    colorclass = $(this).data("color");
    text = $(this).data("text");
    $(".button").removeClass("active");
    $(this).addClass("active");
  }
});

$(document).ready(function () {
  $(".button[data-color]").each(function () {
    var colorClass = $(this).data("color"); // Get the value of data-color
    $(this).find("div").attr("class", colorClass); // Set the class of the child div
  });
});

$(".context-menu-buttons .button").off("click");
$(".modal-options #crates").on("click", function (e) {
  e.preventDefault;
  $(".modal-options").hide();
  $(".context-menu-crates").show();
});
$(".modal-options #items").on("click", function (e) {
  e.preventDefault;
  $(".modal-options").hide();
  $(".context-menu-items").show();
});
$(".modal-options #objectives").on("click", function (e) {
  e.preventDefault;
  $(".modal-options").hide();
  $(".context-menu-objectives").show();
});

$(".context-menu-buttons .button").on("click", function (e) {
  e.preventDefault;
  colorclass = $(this).data("color");
  text = $(this).data("text");
  getTimestamp().then((timestamp) => {
    addMarker(x, y, colorclass, text, timestamp, true);
    $("#context-menu-modal").hide();
    $(".modal-options").show();
    $(".context-menu-buttons").hide();
    colorclass = "context-menu";
  });
});

$("#context-menu-modal").on("click", function (event) {
  // Only trigger if clicking the modal backdrop (not its children)
  if (event.target.id === "context-menu-modal") {
    $(this).hide();
    $(".modal-options").show();
    $(".context-menu-buttons").hide();
    colorclass = "context-menu";
  }
});
