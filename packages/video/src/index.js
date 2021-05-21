import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { OrbitControls, Plane, Html } from "drei";
import { isMobileSafari } from "react-device-detect";
import TrackSlider from "./components/TrackSlider";
import styles from "./Video.scss";

const SafariFallback = ({ video, loading }) => {
  const divVideo = useRef(null);

  useEffect(() => {
    if (!video.current || !divVideo.current) return;

    divVideo.current.appendChild(video.current);
  }, [video, divVideo]);

  // if (loading) return <Loader centerScreen />
  if (loading) return <div>Loading…</div>;
  return <div ref={divVideo} className={styles["safari-video"]} />;
};

const Video3d = ({ video, sizes, loading }) => {
  const texture = useMemo(() => {
    const videoElement = video.current;
    if (!videoElement) return false;

    const newTexture = new THREE.VideoTexture(videoElement);
    newTexture.minFilter = THREE.LinearFilter;
    newTexture.magFilter = THREE.LinearFilter;

    return newTexture;
  }, [video]);

  return (
    <Suspense fallback={null}>
      <Canvas
        id="canvas-video"
        className={styles["g-video"]}
        camera={{ aspect: window.innerWidth / window.innerHeight }}
      >
        <OrbitControls
          minPolarAngle={0.5}
          maxPolarAngle={2.5}
          minAzimuthAngle={-Math.PI * 0.4}
          maxAzimuthAngle={Math.PI * 0.4}
          rotateSpeed={0.2}
          zoomSpeed={0.2}
          minDistance={1}
          maxDistance={5}
        />
        {texture && (
          <Plane args={[...sizes, 0.1]} rotate={[0, 1, 0]}>
            <meshBasicMaterial
              side={THREE.DoubleSide}
              attach="material"
              map={texture}
              color="#fff"
            ></meshBasicMaterial>
          </Plane>
        )}
        {loading && (
          <Html center>
            {/* <Loader /> */}
            <div>Loading…</div>
          </Html>
        )}
      </Canvas>
    </Suspense>
  );
};

export default function Video({ src, artist = {}, sizes = [] }) {
  const video = useRef(document.createElement("video"));
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const onTogglePlay = useCallback(() => {
    const element = video.current;
    if (!element) return;

    playing
      ? element.pause()
      : element.play().catch(() => console.warn("failed to play video"));
  }, [video, playing]);

  const onVolumeUp = useCallback(() => {
    const element = video.current;
    if (!element) return;

    element.volume = Math.min(element.volume + 0.1, 1);
  }, [video]);

  const onVolumeDown = useCallback(() => {
    const element = video.current;
    if (!element) return;

    element.volume = Math.max(element.volume - 0.1, 0);
  }, [video]);

  useEffect(() => {
    const videoElement = video.current;

    if (!videoElement) return;

    videoElement.crossOrigin = "anonymous";
    videoElement.src = src;
    videoElement.playsInline = true;
    videoElement.load();
    videoElement.play();

    const onPlay = () => setPlaying(true);

    const onPause = () => setPlaying(false);

    const onTimeUpdate = (e) => setCurrentTime(e?.target?.currentTime);

    const onDurationchange = (e) => setDuration(e?.target?.duration);

    const onLoadStart = () => setLoading(true);

    const onPlaying = () => setLoading(false);

    videoElement?.addEventListener("timeupdate", onTimeUpdate);
    videoElement?.addEventListener("seeking", onSeeking);
    videoElement?.addEventListener("seeked", onSeeked);
    videoElement?.addEventListener("durationchange", onDurationchange);
    videoElement?.addEventListener("pause", onPause);
    videoElement?.addEventListener("play", onPlay);
    videoElement?.addEventListener("loadstart", onLoadStart);
    videoElement?.addEventListener("playing", onPlaying);

    return () => {
      videoElement.pause();

      videoElement?.removeEventListener("timeupdate", onTimeUpdate);
      videoElement?.removeEventListener("seeking", onSeeking);
      videoElement?.removeEventListener("seeked", onSeeked);
      videoElement?.removeEventListener("durationchange", onDurationchange);
      videoElement?.removeEventListener("pause", onPause);
      videoElement?.removeEventListener("play", onPlay);
      videoElement?.removeEventListener("loadstart", onLoadStart);
      videoElement?.removeEventListener("playing", onPlaying);

      videoElement.remove();
    };
  }, [video, src]);

  const onSeeking = () => {
    setSeeking(true);
    video.current?.pause();
  };

  const onSeeked = (value) => {
    setSeeking(false);
    video.current?.play();

    const total = video.current?.duration;
    const newTime = total * (value / 100);
    if (video.current && newTime >= 0) {
      video.current.currentTime = newTime;
    }
  };

  return (
    <>
      {isMobileSafari ? (
        <SafariFallback video={video} />
      ) : (
        <Video3d video={video} sizes={sizes} loading={loading} />
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
    </>
  );
}
