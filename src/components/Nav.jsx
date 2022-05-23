import React from "react";
import styles from "./Styles/Game.module.css";

function Nav({
  iniciar,
  toggle,
  toggle2,
  active,
  reset,
  setTime,
  setGrilla,
  generation,
  play,
  setPattern,
  pattern
}) {
  return (
    <div className={styles.nav}>
      <div>
        <button disabled={iniciar} onClick={() => toggle()}>
          Iniciar
        </button>
        <button disabled={!play} onClick={() => toggle2()}>
          {active ? "Detener" : "Reanudar"}
        </button>
        <button disabled={!play} onClick={() => reset()}>
          Reiniciar
        </button>
        <select
          disabled={iniciar}
          className={styles.select}
          name="time"
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="default">3 segundos</option>
          <option value="5segundos">5 segundos</option>
          <option value="10segundos">10 segundos</option>
        </select>
        <select
          disabled={iniciar || pattern !== ""}
          className={styles.select}
          name="grilla"
          onChange={(e) => setGrilla(e.target.value)}
        >
          <option value="default">50 X 30</option>
          <option value="60X40">60 X 40</option>
          <option value="70X50">70 X 50</option>
        </select>
        <select
        disabled={iniciar}
        className={styles.select}
        name="grilla"
        onChange={(e) => setPattern(e.target.value)}
      >
        <option value="default">Selecciona un patrón</option>
        <option value="lineal">Lineal</option>
        <option value="lineal2">Lineal 2</option>
      </select>
      </div>
      <div>
        <span>Generation #{generation}</span>
      </div>
    </div>
  );
}

export default Nav;
