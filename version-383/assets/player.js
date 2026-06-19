import { H as Hls } from './hls.js';

const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
};

export function initMoviePlayer(src) {
  ready(() => {
    const video = document.querySelector('[data-player]');
    const cover = document.querySelector('[data-play-cover]');
    let attached = false;
    let hls = null;

    if (!video || !src) {
      return;
    }

    const attach = () => {
      if (attached) {
        return;
      }

      attached = true;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    };

    const play = () => {
      attach();
      cover?.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      const playback = video.play();

      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {});
      }
    };

    cover?.addEventListener('click', play);
    video.addEventListener('click', () => {
      if (video.paused) {
        play();
      }
    });

    window.addEventListener('pagehide', () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  });
}
