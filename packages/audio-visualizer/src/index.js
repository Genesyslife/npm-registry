import React, { useEffect, useState, useRef, useCallback } from "react";
import AudioSpectrum from "react-audio-spectrum";
import { isSafari } from "react-device-detect";
import TrackSlider from "./components/TrackSlider";

const meterColor = [
  { stop: 0, color: "transparent" },
  { stop: 1, color: "transparent" },
];

const menuVH = 25;
const spectrumPercent = (100 - menuVH * 2) / 100;

export default function AudioVisualizer({ id = 1, src, color }) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const audioPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

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
    setWidth(window.innerWidth * 0.8);
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

  return (
    <>
      <audio
        crossOrigin="anonymous"
        autoPlay={false}
        muted={false}
        ref={audioPlayer}
        id={`audio-${id}`}
        onCanPlay={() => {}}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e?.target?.currentTime)}
        onDurationChange={(e) => setDuration(e?.target?.duration)}
        onLoadStart={() => {}}
        onPlaying={() => {}}
      >
        <source src={src} />
      </audio>
      <TrackSlider
        currentTime={currentTime}
        duration={duration}
        playing={playing || seeking}
        onVolumeUp={onVolumeUp}
        onVolumeDown={onVolumeDown}
        onTogglePlay={onTogglePlay}
        onSeeking={onSeeking}
        onSeeked={onSeeked}
        artist={{}}
      />

      {!isSafari && (
        <AudioSpectrum
          id={`spectrum-${src}`}
          height={height}
          width={width}
          audioId={`audio-${id}`}
          capColor={color}
          capHeight={10}
          meterWidth={20}
          meterCount={512}
          meterColor={meterColor}
          gap={0}
        />
      )}
    </>
  );
}
