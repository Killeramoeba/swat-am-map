$(".button").on("click", function (e) {
  e.preventDefault();
  colorclass = $(this).data("color");
  text = $(this).data("text");
  $(".button").removeClass("active");
  $(this).addClass("active");
});

$(document).ready(function () {
  $(".button[data-color]").each(function () {
    var colorClass = $(this).data("color"); // Get the value of data-color
    $(this).find("div").attr("class", colorClass); // Set the class of the child div
  });
});
