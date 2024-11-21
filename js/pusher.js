let channelName = null;

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

// Click event for the #join-channel-button
$("#join-channel-button").on("click", function () {
  const input = $("#channel-name").val().trim(); // Get input value and trim spaces
  const isValid = /^[a-z]{1,10}$/.test(input); // Validate single word, lowercase, max 10 chars

  if (isValid) {
    channelName = input; // Set the valid channel name
    $("#channel-prompt").hide(); // Hide the prompt
    console.log("Channel name set to:", channelName); // Debugging

    //pusher listener
    const pusher = new Pusher("1a9bdce7a7af99367d6d", {
      cluster: "us2",
    });
    const channel = pusher.subscribe(channelName);
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
  } else {
    $("#error-message").show(); // Show error message if invalid
  }
});

// Optional: Hide error message when user starts typing again
$("#channel-name").on("input", function () {
  $("#error-message").hide();
});
