import React, { useState } from "react";
import MenuLink from "../MenuLink";
import styles from "./TrackSlider.module.scss";

const toMMSS = (secondsRaw) => {
  var secs = parseInt(secondsRaw, 10);
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor((secs - hours * 3600) / 60);
  var seconds = secs - hours * 3600 - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};

const TrackSlider = ({
  currentTime = 0,
  duration = 0,
  playing = false,
  onVolumeUp,
  onVolumeDown,
  onTogglePlay,
  onSeeking,
  onSeeked,
  artist = {},
}) => {
  const [hovered, setHovered] = useState(false);

  const valuePercent = (currentTime / duration) * 100;

  return (
    <div className={styles["g-track-slider"]}>
      <div className={styles["g-slider-container"]}>
        <MenuLink disableLink active={hovered}>
          {toMMSS(currentTime)}
        </MenuLink>
        <input
          type="range"
          min={0}
          max={100}
          value={valuePercent || 0}
          className={styles["g-slider"]}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseDown={onSeeking}
          onChange={(e) => {
            onSeeked(e.target.value);
            setHovered(false);
          }}
        />
        <MenuLink disableLink active={hovered}>
          {toMMSS(duration)}
        </MenuLink>
      </div>
      <div className={styles["g-slider-btns"]}>
        <div className={styles["g-slider-volumes"]}>
          <MenuLink muteHover onClick={onVolumeDown} audioName={artist.name}>
            V-
          </MenuLink>
          <MenuLink muteHover onClick={onVolumeUp} audioName={artist.name}>
            V+
          </MenuLink>
        </div>
        <MenuLink
          muteHover
          onClick={onTogglePlay}
          className={styles["g-slider-toggle"]}
          audioName={artist.name}
        >
          {playing ? "Pause" : "Play"}
        </MenuLink>
      </div>
    </div>
  );
};

export default TrackSlider;
