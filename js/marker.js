//initial data
var markerData = [];
var index = 0;
var colorclass = "crate";
var text = "";

$("#map").on("click", function (e) {
  if (colorclass) {
    e.preventDefault();
    var x = e.pageX - $(this).offset().left - 10;
    var y = e.pageY - $(this).offset().top - 10;
    getTimestamp().then((timestamp) => {
      addMarker(x, y, colorclass, text, timestamp, true);
    });
  }
});

//keyboard delete event
$(document).keydown(function (event) {
  if (event.which === 46) {
    // Delete key code
    var focused = $(document.activeElement);
    var i = focused.data("index");
    markerData[i].colorclass = "hidden";
    if (focused.hasClass("marker")) {
      getTimestamp().then((timestamp) => {
        updateMarker(markerData[i], i, timestamp);
        publishEvent("my-channel", "my-event", markerData);
      });
    }
  }
});

function addMarker(x, y, colorclass, text, timestamp, push) {
  var newE = $("<a/>", {
    href: "#",
    class: "marker " + colorclass,
    style: "left:" + x + ";top:" + y + ";",
    text: text,
    "data-index": index,
    "data-timestamp": timestamp,
  });

  newE.appendTo("body");
  newE.focus();

  //add events to element
  newE.draggable({
    stop: function (event, ui) {
      getTimestamp().then((timestamp) => {
        var i = newE.data("index");
        markerData[i].x = ui.position.left;
        markerData[i].y = ui.position.top;
        updateMarker(markerData[i], i, timestamp);
        publishEvent("my-channel", "my-event", markerData);
      });
    },
  });
  newE.on("click", function (e) {
    e.preventDefault();
  });
  newE.dblclick(function () {
    getTimestamp().then((timestamp) => {
      var i = newE.data("index");
      markerData[i].colorclass = "hidden";
      updateMarker(markerData[i], i, timestamp);
      publishEvent("my-channel", "my-event", markerData);
    });
  });

  if (push) {
    markerData.push({ x, y, colorclass, text, timestamp, index });
    publishEvent("my-channel", "my-event", markerData);
  }
  index++;
}

//updated marker data, index
function updateMarker(d, i, timestamp) {
  console.log("updateMarker");

  d.timestamp = timestamp;
  var marker = $('.marker[data-index="' + i + '"]');
  marker.css({
    left: d.x,
    top: d.y,
  });
  marker.attr({
    "data-text": d.text,
    "data-timestamp": timestamp,
  });
  marker.addClass(d.colorclass);
  console.log(d.colorclass);
  markerData[i] = d;
}

function clearAll() {
  markerData = [];
  index = 0;
  publishEvent("my-channel", "my-event", markerData);
}

//timestamps
async function getTimestamp() {
  const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
  const data = await response.json();
  const utcDatetime = data.utc_datetime;
  const dateString = new Date(utcDatetime).toISOString();
  return dateString;
}
