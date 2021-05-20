import React from "react";
import Scrollbars from "react-custom-scrollbars";
import styles from "./Layout.scss";

const Layout = ({ children, className }) => {
  return (
    <div className={`${styles["g-layout-wrap"]} ${className ? className : ""}`}>
      <Scrollbars className={styles["g-scroll"]}>{children}</Scrollbars>
    </div>
  );
};

export default Layout;
