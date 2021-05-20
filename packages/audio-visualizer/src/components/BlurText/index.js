import React from "react";
import { default as classNames } from "classnames";
import styles from "./BlurText.scss";

const BlurText = ({ children, hovered, active }) => {
  return (
    <span
      className={classNames(styles["g-blur-txt"], {
        [styles["g-blur-hovered"]]: hovered || active,
      })}
    >
      {children}
    </span>
  );
};

export default BlurText;
