let channelName = null;
let inputEnabled = false;

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
    $("#channel-name-indicator").text(channelName);

    // Add loading indicator
    $("#loading-status").html('<div class="loader"></div>').show();

    //pusher listener
    const pusher = new Pusher("1a9bdce7a7af99367d6d", {
      cluster: "us2",
    });
    const channel = pusher.subscribe(channelName);

    // Request current state when joining
    const requestId = Date.now(); // Unique ID for this request
    let stateResponses = [];
    let stateTimeout = null;

    // Request the current state
    publishEvent(channelName, "request-state", { requestId });

    stateTimeout = setTimeout(() => {
      inputEnabled = true;
      $("#loading-status").html("Ready!").fadeOut(2000);
    }, 5000);

    // Handle state responses
    channel.bind("state-response", function (data) {
      if (data.requestId === requestId) {
        stateResponses.push(data.markers);

        // Clear existing timeout if any
        if (stateTimeout) clearTimeout(stateTimeout);

        // Wait a short period for all responses to arrive
        stateTimeout = setTimeout(() => {
          if (stateResponses.length > 0) {
            // Process all responses and keep the most up-to-date markers
            const latestMarkers = {};

            stateResponses.forEach((markers) => {
              markers.forEach((marker) => {
                const existing = latestMarkers[marker.index];
                if (!existing || marker.timestamp > existing.timestamp) {
                  latestMarkers[marker.index] = marker;
                }
              });
            });

            // Convert back to array and update markers
            const finalMarkers = Object.values(latestMarkers);
            finalMarkers.forEach((marker) => {
              addMarker(
                marker.x,
                marker.y,
                marker.colorclass,
                marker.text,
                marker.timestamp,
                false
              );
            });
            markerData = finalMarkers;
          }
          // Clear responses after processing
          stateResponses = [];

          // Re-enable input after processing
          inputEnabled = true;
          $("#loading-status").html("Ready!").fadeOut(2000);
        }, 1000); // Wait 1 second for responses
      }
    });

    // Handle state requests from others
    channel.bind("request-state", function (data) {
      if (markerData.length > 0) {
        publishEvent(channelName, "state-response", {
          requestId: data.requestId,
          markers: markerData,
        });
      }
    });

    channel.bind("my-event", function (data) {
      console.log("Marker data:", markerData);
      console.log("Received data:", data);

      for (let i = 0; i < markerData.length; i++) {
        if (data[i]?.timestamp > markerData[i]?.timestamp) {
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
