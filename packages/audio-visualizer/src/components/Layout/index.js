import React from "react";
import styles from "./Layout.scss";

const Scrollbars = ({ children }) => children;

const Layout = ({ children, className }) => {
  return (
    <div className={`${styles["g-layout-wrap"]} ${className ? className : ""}`}>
      <Scrollbars className={styles["g-scroll"]}>{children}</Scrollbars>
    </div>
  );
};

export default Layout;
