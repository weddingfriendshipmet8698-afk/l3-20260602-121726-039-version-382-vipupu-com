(function () {
  window.initVideoPage = function (videoId, buttonId, streamUrl) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const Hls = window.Hls;

    if (!video || !streamUrl) {
      return;
    }

    let ready = false;
    let hls = null;

    function hideButton() {
      if (button) {
        button.classList.add('is-hidden');
      }
    }

    function attach(callback) {
      if (ready) {
        callback();
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        callback();
        return;
      }

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          callback();
        });
        hls.on(Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
        return;
      }

      video.src = streamUrl;
      callback();
    }

    function playVideo() {
      attach(function () {
        const result = video.play();
        if (result && typeof result.catch === 'function') {
          result.catch(function () {});
        }
      });
      hideButton();
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', hideButton);
    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
