import React from "react";
import styles from "./Styles/Game.module.css";

let initialBoard = new Array(30).fill(0).map(() => new Array(50).fill(0));

function InitialBoard() {
  return (
    <div>
      <div className={styles.board}>
        {initialBoard?.map((row, i) => (
          <div key={i} className={styles.stop}>
            {row.map((cell, i) => (
              <div key={i} className={styles.cells_dead}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InitialBoard;
