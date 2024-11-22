//initial data
var markerData = [];
var index = 0;
var colorclass = "context-menu";
var text = "";
var x = 0;
var y = 0;
var timestamp = "";

$("#map").on("click", function (e) {
  if (!inputEnabled) return;

  if (colorclass) {
    e.preventDefault();
    x = e.pageX - $(this).offset().left - 10;
    y = e.pageY - $(this).offset().top - 10;
    getTimestamp().then((timestamp) => {
      addMarker(x, y, colorclass, text, timestamp, true);
    });
  }
});

//keyboard delete event
/*
$(document).keydown(function (event) {
  if (event.which === 46) {
    // Delete key code
    var focused = $(document.activeElement);
    var i = focused.data("index");
    markerData[i].colorclass = "hidden";
    if (focused.hasClass("marker")) {
      getTimestamp().then((timestamp) => {
        updateMarker(markerData[i], i, timestamp);
        publishEvent(channelName, "my-event", markerData);
      });
    }
  }
});
*/

function addMarker(x, y, colorclass, text, timestamp, push) {
  if (colorclass == "context-menu") {
    contextMenu = $(".context-menu");
    $("#context-menu-modal").show();
  } else {
    var newE = $("<a/>", {
      href: "#",
      class: "marker " + colorclass,
      style: "left:" + x + ";top:" + y + ";",
      text: text,
      "data-index": index,
      "data-text": text,
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
          publishEvent(channelName, "my-event", markerData);
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
        publishEvent(channelName, "my-event", markerData);
      });
    });

    if (push) {
      markerData.push({ x, y, colorclass, text, timestamp, index });
      publishEvent(channelName, "my-event", markerData);
    }
    index++;
  }
}

//updated marker data, index
function updateMarker(d, i, timestamp) {
  d.timestamp = timestamp;
  var marker = $('.marker[data-index="' + i + '"]');
  marker.css({
    left: d.x,
    top: d.y,
  });
  marker.attr({
    "data-text": d.text,
    "data-timestamp": timestamp,
    class: "marker " + d.colorclass + " ui-draggable ui-draggable-handle",
  });
  marker.text(d.text);
  markerData[i] = d;
}

//timestamps
async function getTimestamp() {
  try {
    const response = await fetch(
      "https://worldtimeapi.org/api/timezone/Etc/UTC"
    );
    const data = await response.json();
    const utcDatetime = data.utc_datetime;
    const dateString = new Date(utcDatetime).toISOString();
    timestamp = dateString;
    return dateString;
  } catch (error) {
    console.error("Error fetching timestamp:", error);
    return timestamp;
  }
}
