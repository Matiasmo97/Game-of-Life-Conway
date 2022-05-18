let canvas;
let ctx;
let fps = 30;

let canvasX = 700; //pixels ancho
let canvasY = 700; //pixels alto
let tileX, tileY;

//Variables relacionadas con el tablero de juego
let tablero;
let filas = 100; //100
let columnas = 100; //100

let blanco = "#FFFFFF";
let negro = "#000000";

export function creaArray2D(f, c) {
  let obj = new Array(f);
  for (let y = 0; y < f; y++) {
    obj[y] = new Array(c);
  }

  return obj;
}

//OBJETO AGENTE O TURMITA
export const Agente = function (x, y, estado) {
  this.x = x;
  this.y = y;
  this.estado = estado; //vivo = 1, muerto = 0
  this.estadoProx = this.estado; //estado que tendrá en el siguiente ciclo

  this.vecinos = []; //guardamos el listado de sus vecinos

  //Método que añade los vecinos del objeto actual
  this.addVecinos = function () {
    let xVecino;
    let yVecino;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        xVecino = (this.x + j + columnas) % columnas;
        yVecino = (this.y + i + filas) % filas;

        //descartamos el agente actual (yo no puedo ser mi propio vecino)
        if (i !== 0 || j !== 0) {
          this.vecinos.push(tablero[yVecino][xVecino]);
        }
      }
    }
  };

  this.dibuja = function () {
    let color;

    if (this.estado === 1) {
      color = blanco;
    } else {
      color = negro;
    }

    ctx.fillStyle = color;
    ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
  };

  //Programamos las leyes de Conway
  this.nuevoCiclo = function () {
    let suma = 0;

    //calculamos la cantidad de vecinos vivos
    for (let i = 0; i < this.vecinos.length; i++) {
      suma += this.vecinos[i].estado;
    }

    //APLICAMOS LAS NORMAS DE CONWAY

    //Valor por defecto lo dejamos igual
    this.estadoProx = this.estado;

    //MUERTE: tiene menos de 2 o más de 3
    if (suma < 2 || suma > 3) {
      this.estadoProx = 0;
    }

    //VIDA/REPRODUCCIÓN: tiene exactamente 3 vecinos
    if (suma === 3) {
      this.estadoProx = 1;
    }
  };

  this.mutacion = function () {
    this.estado = this.estadoProx;
  };
};

function inicializaTablero(obj) {
  let estado;

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      estado = Math.floor(Math.random() * 2);
      obj[y][x] = new Agente(x, y, estado);
    }
  }

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].addVecinos();
    }
  }
}

function borraCanvas() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}

function inicializa() {
  //Asociamos el canvas
  canvas = document.getElementById("pantalla");
  ctx = canvas.getContext("2d");

  //Ajustamos el tamaño del canvas
  canvas.width = canvasX;
  canvas.height = canvasY;

  //calculamos tamaño tiles
  tileX = Math.floor(canvasX / filas);
  tileY = Math.floor(canvasY / columnas);

  //creamos el tablero
  tablero = creaArray2D(filas, columnas);
  //Lo inicializamos
  inicializaTablero(tablero);

  //Ejecutamos el bucle principal
  setInterval(function () {
    principal();
  }, 1000 / fps);
}

function dibujaTablero(obj) {
  //DIBUJA LOS AGENTES
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].dibuja();
    }
  }

  //CALCULA EL SIGUIENTE CICLO
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      obj[y][x].nuevoCiclo();
    }
  }

  //APLICA LA MUTACIÓN
  for (let y = 0; y < filas; y++) {
    for ( let x = 0; x < columnas; x++) {
      obj[y][x].mutacion();
    }
  }
}

function principal() {
  borraCanvas();
  dibujaTablero(tablero);
}
