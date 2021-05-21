import React, { useEffect, useState, useRef, useCallback } from "react";
import AudioSpectrum from "react-audio-spectrum";
import { isSafari } from "react-device-detect";
import TrackSlider from "./components/TrackSlider";
import Layout from "./components/Layout";
// import Loader from './components/Loader'
import styles from "./AudioVisualizer.scss";

const meterColor = [
  { stop: 0, color: "transparent" },
  { stop: 1, color: "transparent" },
];

const menuVH = 25;
const spectrumPercent = (100 - menuVH * 2) / 100;

export default function AudioVisualizer({ id = 1, src, artist = {} }) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const audioPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canPlay, setCanplay] = useState(false);

  const onTogglePlay = useCallback(() => {
    const element = audioPlayer.current;
    if (!element) return;

    playing
      ? element.pause()
      : element
          .play()
          .catch((e) => console.warn("failed to play audio visualizer", e));
  }, [audioPlayer, playing]);

  const onVolumeUp = useCallback(() => {
    const element = audioPlayer.current;
    if (!element) return;

    element.volume = Math.min(element.volume + 0.1, 1);
  }, [audioPlayer]);

  const onVolumeDown = useCallback(() => {
    const element = audioPlayer.current;
    if (!element) return;

    element.volume = Math.max(element.volume - 0.1, 0);
  }, [audioPlayer]);

  useEffect(() => {
    setWidth(Math.ceil((window.innerWidth * 0.7) / 20) * 20);
    setHeight(window.innerHeight * spectrumPercent);
  }, []);

  const onSeeking = () => {
    setSeeking(true);
    audioPlayer.current?.pause();
  };

  const onSeeked = (value) => {
    setSeeking(false);
    audioPlayer.current
      ?.play()
      .catch(() => console.warn("failed to play audio visualizer"));

    const total = audioPlayer.current?.duration;
    const newTime = total * (value / 100);
    if (audioPlayer.current && newTime >= 0) {
      audioPlayer.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    audioPlayer.current.crossOrigin = "anonymous";

    audioPlayer.current
      .play()
      .catch(() => console.warn("failed to play audioPlayer background"));
  }, [audioPlayer]);

  useEffect(() => {
    if (canPlay) {
      audioPlayer.current.crossOrigin = "anonymous";
      audioPlayer.current
        .play()
        .catch(() => console.warn("failed to play audioPlayer background"));
    }
  }, [audioPlayer, canPlay]);

  return (
    <Layout>
      <div className={styles["g-spectrum-wrap"]}>
        <audio
          crossOrigin="anonymous"
          autoPlay={false}
          muted={false}
          ref={audioPlayer}
          id={`audio-${id}`}
          onCanPlay={() => setCanplay(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e?.target?.currentTime)}
          onDurationChange={(e) => setDuration(e?.target?.duration)}
          onLoadStart={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
        >
          <source src={src} />
        </audio>

        {!isSafari && (
          <AudioSpectrum
            id={`spectrum-${id}`}
            height={height}
            width={width}
            audioId={`audio-${id}`}
            capColor="rgba(177,1,90,1)"
            capHeight={10}
            meterWidth={20}
            meterCount={512}
            meterColor={meterColor}
            gap={0}
          />
        )}

        {loading && (
          <div className={styles["g-audio-loader"]}>
            {/* <Loader /> */}
            Loading…
          </div>
        )}

        <TrackSlider
          currentTime={currentTime}
          duration={duration}
          playing={playing || seeking}
          onVolumeUp={onVolumeUp}
          onVolumeDown={onVolumeDown}
          onTogglePlay={onTogglePlay}
          onSeeking={onSeeking}
          onSeeked={onSeeked}
          artist={artist}
        />
      </div>
    </Layout>
  );
}
