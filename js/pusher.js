//pusher
async function publishEvent(channel, event, data) {
  try {
    const response = await fetch("/api/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, event, data }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Event published successfully!");
    } else {
      console.error("Failed to publish event:", result.error);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

//pusher listener
const pusher = new Pusher("1a9bdce7a7af99367d6d", {
  cluster: "us2",
});
const channel = pusher.subscribe("my-channel");
channel.bind("my-event", function (data) {
  console.log("Received data:", data);
  console.log("Marker data:", markerData);

  for (let i = 0; i < markerData.length; i++) {
    if (data[i].timestamp > markerData[i].timestamp) {
      updateMarker(data[i], i, data[i].timestamp);
    }
  }
  for (let i = markerData.length; i < data.length; i++) {
    markerData[i] = data[i];
    addMarker(
      data[i].x,
      data[i].y,
      data[i].colorclass,
      data[i].text,
      data[i].timestamp,
      false
    );
  }
});
