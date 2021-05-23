import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./MenuLink.module.scss";

const LinkOrP = ({ to, children, active, disableLink, ...props }) => {
  if (active || !to || disableLink) {
    return <p {...props}>{children}</p>;
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
  // return null;
};

const MenuLink = ({
  children,
  active,
  to,
  className = "",
  onClick = false,
  // disableLink = false,
  audioName = false,
  muteHover = false,
  onMouseLeave = false,
  ...props
}) => {
  const playByName = () => {}; // FIXME

  const onClickHandler = useCallback(
    (e) => {
      playByName(audioName, "click");
      if (onClick) {
        e.preventDefault();
        onClick();
      }
      if (onMouseLeave) {
        onMouseLeave();
      }
    },
    [playByName, audioName, onClick, onMouseLeave]
  );

  const onMouseOver = useCallback(() => {
    if (muteHover) return;
    playByName(audioName, "hover");
  }, [muteHover, playByName, audioName]);

  return (
    <LinkOrP
      to={to}
      active={active}
      onClick={(e) => onClickHandler(e)}
      className={classNames(
        styles["g-menu-txt"],
        { [styles["g-menu-txt"]]: active },
        className.split(" ")
      )}
      onMouseOver={onMouseOver}
      {...props}
    >
      {children}
    </LinkOrP>
  );
};

export default MenuLink;
