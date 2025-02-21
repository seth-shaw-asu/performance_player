(function () {

    // Select all the elements in the HTML page
    // and assign them to a variable

    let seek_slider = document.querySelector(".seek_slider");
    let volume_slider = document.querySelector(".volume_slider");
    let curr_time = document.querySelector(".current-time");
    let total_duration = document.querySelector(".total-duration");

    // Specify globally used values
    let track_index = 0;
    let isPlaying = false;
    let updateTimer;
    let track_list = drupalSettings.performance_player.track_list;
    // Create the audio element for the player
    let curr_track = document.createElement('audio');

    function loadTrack(track_index) {
        // Clear the previous seek timer
        clearInterval(updateTimer);
        resetValues();

        // Load a new track
        curr_track.src = track_list[track_index].trackUrl;
        curr_track.load();

        // Update details of the track
        document.querySelector(".track-name").innerHTML = track_list[track_index].title;
        document.querySelector(".composers").innerHTML = track_list[track_index].artists;
        document.querySelector(".now-playing").textContent =
           "PLAYING " + (track_index + 1) + " OF " + track_list.length;
        let playlist_curr_track = document.querySelector("#tracks-playlist-track-" + track_index);
        playlist_curr_track?.classList.add('playing');
	
        // Set an interval of 1000 milliseconds
        // for updating the seek slider
        updateTimer = setInterval(function () {
            let seekPosition = 0;

            // Check if the current track duration is a legible number
            if (!isNaN(curr_track.duration)) {
              seekPosition = curr_track.currentTime * (100 / curr_track.duration);
              seek_slider.value = seekPosition;

              // Calculate the time left and the total duration
              let currentMinutes = Math.floor(curr_track.currentTime / 60);
              let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
              let durationMinutes = Math.floor(curr_track.duration / 60);
              let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

              // Add a zero to the single digit time values
              if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
              if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
              if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
              if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

              // Display the updated duration
              curr_time.textContent = currentMinutes + ":" + currentSeconds;
              total_duration.textContent = durationMinutes + ":" + durationSeconds;
            }
          }, 1000);

        // Move to the next track if the current finishes playing
        // using the 'ended' event
        curr_track.addEventListener("ended", nextTrack);
    }
    let loadPlaylistTrack = function () {
      track_index = parseInt(this.getAttribute("id").split('-').pop());
      loadTrack(track_index);
      playTrack();
    };
    Array.from(document.getElementsByClassName("tracks-playlist-track")).forEach(
        function (element) {
          element.addEventListener('click',loadPlaylistTrack)
	}
    );
    function resetValues() {
        curr_time.textContent = "00:00";
        total_duration.textContent = "00:00";
        seek_slider.value = 0;
        document.querySelector(".tracks-playlist-track.playing")?.classList.remove("playing");
    }

    document.querySelector(".play-pause").onclick = function playpauseTrack() {
        // Switch between playing and pausing
        // depending on the current state
        if (!isPlaying) { playTrack();
        } else { pauseTrack();
        }
    }

  function playTrack() {
    // Play the loaded track
    curr_track.play();
    isPlaying = true;

    // Replace icon with the pause icon
    document.querySelector(".play-pause").innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
  }

  function pauseTrack() {
    // Pause the loaded track
    curr_track.pause();
    isPlaying = false;

    // Replace icon with the play icon
    document.querySelector(".play-pause").innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
  }

  function nextTrack() {
    // Go back to the first track if the
    // current one is the last in the track list
    if (track_index < track_list.length - 1) {
      track_index += 1;
    } else { track_index = 0;
    }

    // Load and play the new track
    loadTrack(track_index);
    playTrack();
  }
  document.querySelector(".next-track").onclick = nextTrack;

  document.querySelector(".prev-track").onclick = function prevTrack() {
    // Go back to the last track if the
    // current one is the first in the track list
    if (track_index > 0) {
      track_index -= 1;
    } else { track_index = track_list.length - 1;
    }

    // Load and play the new track
    loadTrack(track_index);
    playTrack();
  }

document.querySelector('.seek_slider').onchange = function seekTo() {
    // Calculate the seek position by the
    // percentage of the seek slider
    // and get the relative duration to the track
    seekto = curr_track.duration * (seek_slider.value / 100);

    // Set the current track position to the calculated seek position
    curr_track.currentTime = seekto;
  }

  function setVolume() {
    // Set the volume according to the
    // percentage of the volume slider set
    curr_track.volume = volume_slider.value / 100;
  }
  document.querySelector(".volume_slider").onchange = setVolume;

  function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
      seekPosition = curr_track.currentTime * (100 / curr_track.duration);
      seek_slider.value = seekPosition;

      // Calculate the time left and the total duration
      let currentMinutes = Math.floor(curr_track.currentTime / 60);
      let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
      let durationMinutes = Math.floor(curr_track.duration / 60);
      let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

      // Add a zero to the single digit time values
      if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
      if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
      if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
      if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

      // Display the updated duration
      curr_time.textContent = currentMinutes + ":" + currentSeconds;
      total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
  }
  loadTrack(track_index);
}())
