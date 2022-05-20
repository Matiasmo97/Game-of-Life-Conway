import React, { useEffect, useState } from "react";
import styles from "./Styles/Game.module.css";
const { v4: uuidv4 } = require("uuid");

function Game() {
  const [ready, setReady] = useState(true);
  let [cells, setCells] = useState([]);
  let [generation, setGeneration] = useState(0);
  let [play, setPlay] = useState(false);
  let [iniciar, setIniciar] = useState(false);
  let [active, setActive] = useState(false);
  let [resetState] = useState(false);
  let [time, setTime] = useState(3);
  let [grilla, setGrilla] = useState("");
  let [rows, setRows] = useState(30);
  let [columns, setColumns] = useState(50);
  let [pause, setPause] = useState(false);
  let board;

  let initialBoard = new Array(30).fill(0).map(() => new Array(50).fill(0));

  useEffect(() => {
    let interval = null;
    if (play) {
      initial();
    }

    if (active) {
      if (pause) {
        interval = setInterval(() => {
          drawBoard(cells);
          setGeneration((generation) => ++generation);
        }, time * 1000);
      } else {
        interval = setInterval(() => {
          drawBoard(board);
          setCells(board);
          setGeneration((generation) => ++generation);
        }, time * 1000);
      }
    }


    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, resetState, play, pause]);

  //Funcion que inicializa el tablero de celulas
  async function initial() {
    //Creamos el tablero
    board = newCells(rows, columns);

    //Iniciamos el tablero
    await startGame(board);
  }

  //Función para iniciar/detener el juego
  function toggle() {
    setActive(!active);
    setPlay(true);
    setPause(true);
  }
  function toggle2() {
    setActive(!active);
    //Cambiamos el stado de Ready
    setReady(false);

    setIniciar(true);

    setPlay(true);
  }
  //Función para reiniciar el tablero de células
  function reset() {
    setGeneration(0);
    setReady(true);
    setActive(false);
    setIniciar(false);
  }

  //Creamos un useEffect para actualizar el tiempo,
  // dependiendo de lo que elija el usuario
  useEffect(() => {
    if (time !== "") {
      if (time === "default") {
        setTime(3);
      }
      if (time === "5segundos") {
        setTime(5);
      }
      if (time === "10segundos") {
        setTime(10);
      }
    }
  }, [time]);

  //Creamos un useEffect para actualizar el tamaño de las grillas,
  // dependiendo de lo que elija el usuario
  useEffect(() => {
    if (grilla !== "") {
      if (grilla === "default") {
        setRows(30);
        setColumns(50);
      }
      if (grilla === "60X40") {
        setRows(40);
        setColumns(60);
      }
      if (grilla === "70X50") {
        setRows(50);
        setColumns(70);
      }
    }
  }, [grilla]);

  //====== CÉLULAS ======
  // Objeto de Células(Le pasamos por parametro sus condenadas, y su estado)
  class Cells {
    constructor(x, y, state) {
      //Cordenadas
      this.x = x;
      this.y = y;
      this.id = uuidv4();

      //Condición(vivo o muerto)
      this.condition = state; //vivo = 1, muerto = 0
      this.conditionProx = this.condition;

      //Creamos un array para guardar los vecinos
      this.neighbours = [];

      //Creamos una función que añada los vecinos
      this.addNeighbours = function () {
        let neighboursX;
        let neighboursY;

        //Creamos el dos bucles for para identificar los vecinos de mi célula
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            neighboursX = (this.x + j + columns) % columns;
            neighboursY = (this.y + i + rows) % rows;

            //Descartamos la célula actual
            if (i !== 0 || j !== 0) {
              this.neighbours.push(board[neighboursY][neighboursX]);
            }
          }
        }
      };

      //Las leyes de Conway
      this.newCycle = function () {
        let allNeighbours = 0;

        //Recorremos el array de vecinos para sumarlos y saber cuantos tiene la célula
        for (let i = 0; i < this.neighbours.length; i++) {
          allNeighbours += this.neighbours[i].condition;
        }

        //====== APLICAMOS LAS LEYES DE CONWAY ======
        //Por defecto va a tener el estado anterior
        this.conditionProx = this.condition;

        //Si tiene menos de 2 o más de 3 muere
        if (allNeighbours < 2 || allNeighbours > 3) {
          this.conditionProx = 0;
        }
        //Si tiene 3 vecinos nacé o se mantiene vivo
        if (allNeighbours === 3) {
          this.conditionProx = 1;
        }
      };

      this.mutation = function () {
        this.condition = this.conditionProx;
      };
    }
  }

  // ====== FUNCIONES DEL JUEGO ======
  //Función que calcula los proximos estados
  function drawBoard(obj) {
    //Calculamos el siguiente ciclo
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        obj[y][x].newCycle();
      }
    }

    //Aplicamos la mutacion
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        obj[y][x].mutation();
      }
    }
  }

  //Creamos el array de Celulas
  function newCells(r, c) {
    //Creamos un array
    let cells = new Array(r);
    //Por cada indice del array creamos otro array
    for (let y = 0; y < r; y++) {
      cells[y] = new Array(c);
    }

    return cells;
  }

  //Función que llena el tablero de celulas
  function startGame(obj) {
    let state;

    //Creamos la célula
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        //Creamos un estado para la celula aleatorio
        state = Math.floor(Math.random() * 2);
        //Creamos un nuevo agente y le pasamos sus cordenadas y su condición
        obj[y][x] = new Cells(x, y, state);
      }
    }

    //Le añadimos sus vecinos
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        obj[y][x].addNeighbours();
      }
    }
  }
  // ================================
  return (
    <div>
      <div className={styles.nav}>
        <div>
          <button disabled={iniciar} onClick={() => toggle2()}>
            Iniciar
          </button>
          <button onClick={() => toggle()}>
            {active ? "Detener" : "Reanudar"}
          </button>
          <button onClick={() => reset()}>Reiniciar</button>
          <select
            className={styles.select}
            name="time"
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="default">3 segundos</option>
            <option value="5segundos">5 segundos</option>
            <option value="10segundos">10 segundos</option>
          </select>
          <select
            className={styles.select}
            name="grilla"
            onChange={(e) => setGrilla(e.target.value)}
          >
            <option value="default">50 X 30</option>
            <option value="60X40">60 X 40</option>
            <option value="70X50">70 X 50</option>
          </select>
        </div>
        <div>
          <span>Generation #{generation}</span>
        </div>
      </div>
      {ready ? (
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
      ) : (
        <div>
          <div className={styles.board}>
            {cells?.map((row) => (
              <div key={row[0].id} className={styles.play}>
                {row.map((cell, i) => (
                  <div
                    key={cell.id}
                    className={
                      cell.condition === 1
                        ? styles.cells_alive
                        : styles.cells_dead
                    }
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
