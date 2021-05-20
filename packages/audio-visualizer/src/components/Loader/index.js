import React, { useState, useEffect, useMemo } from "react";
import { useProgress } from "drei";
// import BarLoader from 'react-spinners/BarLoader'
import classNames from "classnames";
import BlurText from "../BlurText";
import styles from "./Loader.scss";

const audios = {
  "XIAO QUAN": {
    // Box
    hover: new Audio("/assets/sounds/SFX/mo_cubo.wav"),
    click: new Audio("/assets/sounds/SFX/c_cubo.wav"),
  },
  Podeserdesligado: {
    // Sphere
    hover: new Audio("/assets/sounds/SFX/mo_esfera.wav"),
    click: new Audio("/assets/sounds/SFX/c_esfera.wav"),
  },
  Mexa: {
    // TorusKnot
    hover: new Audio("/assets/sounds/SFX/mo_torusknot.wav"),
    click: new Audio("/assets/sounds/SFX/c_torusknot.wav"),
  },
  "Miss Tacacá": {
    // Torus
    hover: new Audio("/assets/sounds/SFX/mo_torus.wav"),
    click: new Audio("/assets/sounds/SFX/c_torus.wav"),
  },
  Diaz: {
    // Cone
    hover: new Audio("/assets/sounds/SFX/mo_piramide.wav"),
    click: new Audio("/assets/sounds/SFX/c_piramide.wav"),
  },
  ótimoKaráter: {
    // Dodecahedron
    hover: new Audio("/assets/sounds/SFX/mo_dodecaedro.wav"),
    click: new Audio("/assets/sounds/SFX/c_dodecaedro.wav"),
  },
  Menu: {
    hover: new Audio("/assets/sounds/SFX/mo_genesys.wav"),
    click: new Audio("/assets/sounds/SFX/c_genesys.wav"),
  },
  Info: {
    hover: new Audio("/assets/sounds/SFX/mo_info.wav"),
    click: new Audio("/assets/sounds/SFX/c_info.wav"),
  },
};

const Loader = (/* { fullscreen = false, centerScreen = false } */) => {
  const [hasLoaded, setLoaded] = useState([]);
  const [audiosLoaded, setAudiosLoaded] = useState([]);
  const [skipLoading, setSkipLoading] = useState(false);
  const { active, item, errors } = useProgress();

  useEffect(() => {
    setTimeout(() => setSkipLoading(false), 10000);
  }, []);

  useEffect(() => {
    if (errors.length) console.error("load fail", errors);
  }, [errors]);

  useEffect(() => {
    const keys = Object.keys(audios);

    const onLoadAudio = (e) => {
      setAudiosLoaded((prev) => [...new Set([...prev, e.target.src])]);
    };

    const audiosElements = keys
      .map((key) => {
        const audioClick = audios[key].click;
        const audioHover = audios[key].hover;

        return [audioClick, audioHover];
      })
      .flat();

    audiosElements.forEach((audio) => {
      audio.load();
      audio.addEventListener("canplaythrough", onLoadAudio, false);
    });

    return () => {
      audiosElements.forEach((audio) => {
        audio.removeEventListener("canplaythrough", onLoadAudio, false);
      });
    };
  }, [audios]);

  useEffect(() => setLoaded((prev) => [...new Set([...prev, item])]), [item]);

  const inProgress = useMemo(() => {
    if (skipLoading) return false;
    if (active) return true;

    const canvasLoading = hasLoaded.length <= 19; // MAX 23
    const audiosLoading = audiosLoaded.length <= 10; // MAX 16

    return canvasLoading || audiosLoading;
  }, [hasLoaded.length, audiosLoaded.length, active, skipLoading]);

  if (!inProgress) return null;

  const loaderClasses = classNames(styles["loader-center"], {
    "loader-content": styles.fullscreen,
    "loader-center-screen": styles.centerScreen,
  });

  return (
    <div className={loaderClasses}>
      {/* <BarLoader color="#b1015a" loading /> */}
      <div>Bar loader</div>
      <div className={styles["loader-text"]}>
        <BlurText active>Loading...</BlurText>
      </div>
    </div>
  );
};

export default Loader;
