/**
 * Plantilla base para cualquier cuadricula con filas y columnas
 * @MarcosDominguezVega <228@cifceuta.es>
 * @method create_tablero()
 * @function get_casillasVacias()
 * @method show_casilla()
 * @method show_tablero()
*/
class Tablero {
  /** 
   * Función constructura del objeto Tablero que toma como parametro las filas y columnas de una tabla cualquiera.
   * @param {Number} filas - filas del tablero
   * @param {Number} columnas - columnas del tablero
   * @return {void} esta función retorna una intancia de el objeto Tablero.
  */
  constructor(filas, columnas) {
    this.filas = filas;
    this.columnas = columnas;
    this.tablero = [];
  }

  /*
   * Actualiza la matriz tablero
  */
  set_tablero(tablero) {
    this.tablero = tablero;
  }

  /*
   * Obtiene numero de filas del tablero.
  */
  get_filas() {
    return this.filas;
  }

  /*
   * Obtiene numero de columnas del tablero.
  */
  get_columnas() {
    return this.columnas;
  }

  /*
   * Obtiene la matriz del tablero.
  */
  get_tablero() {
    return this.tablero;
  }

  /*
   * Obtiene el número total de minas en el tablero.
  */
  get_numeroMinas() {
    let tablero = this.get_tablero();
    let minas = 0;

    tablero.forEach((fila) => {
      for (let columna of fila) {
        if (Number(columna) == 9) {
          minas++;
        }
      }
      return minas;
    });
    return minas;
  }

  /*
   * Añade el número de casillas totales.
  */
  set_casillas() {
    let casillas = 0;
    for (let iterador = 0; iterador < this.get_filas(); iterador++) {
      for (let iterador2 = 0; iterador2 < this.get_columnas(); iterador2++) {
        casillas++;
      }
    }
    return casillas;
  }

  /** 
   * Función que crea el tablero con el número de filas y columnas especificadas.
   * @return {void} Setea la propiedad tablero a un array multidimensional de filasXcolumnas.
  */
  create_tablero() {
    let tableroActual = new Array();
    for (let fila = 0; fila < this.get_filas(); fila++) {
      let filas = new Array();
      for (let columna = 0; columna < this.get_columnas(); columna++) {
        filas.push(0);
      }
      tableroActual.push(filas);
    }
    this.set_tablero(tableroActual);
  }

  /** 
   * Función que obtine todas las casillas vacías
   * @return {String} Retorna una cadena con el número de la casilla vacía.
  */
  get_casillasVacias() {
    let tablero = this.get_tablero();
    let botonActual = 0;
    let botones = tablero.map((fila) => {
      let filaVacia = new Array();
      for (let columna of fila) {
        if (columna == 0) {
          filaVacia.push(botonActual);
        }
        botonActual++;
      }
      return filaVacia.join(",");
    });
    return botones.join(",");
  }

  /** 
   * Función que si el valor de la casilla del tablero si:
   *  - es 9 (bomba) fin de la partida.
   *  - es 0 (vacio) despeja la zona.
   *  - es cualquier otro número despeja esa casilla.
   * 
   * @param {Element} botonPulsado - El boton pulsado.
   * @return {void} finaliza la partida o despeja todas las zonas vacías.
  */
  show_casilla(botonPulsado) {
    let botonesVacios = this.get_casillasVacias();
    if (botonPulsado.value == 9) {
      Partida.partidaPerdida(botonPulsado);
    } else {
      botonPulsado.style = "display: none;";
    }

    if (botonPulsado.value == 0) {
      let botones = document.querySelectorAll(".boton-casilla");
      botonesVacios = botonesVacios.split(",");
      for (let boton in botones) {
        if (botonesVacios.includes(boton)) {
          botones[boton].style = "display: none;";
        }
      }
    }

  }

  /** 
   * Función que recoge el boton pulsado con el contextmenu y selecciona una posible bomba, estas no pueden ser superior al numero de minas totales del tablero.
   * @param {Element} boton - El boton pulsado referenciado con (this)
   * @return {void} Añade el icono de selección o envia una alerta.
  */
  select_casilla(boton) {
    let icono = document.createElement("i");
    icono.setAttribute("class", "bx bxs-flag-alt");
    console.log(boton);
    if (boton.localName != "i") {
      boton.appendChild(icono);
      boton.onclick = () => { return false };
    } else {
      boton.parentNode.onclick = (elemento) => this.show_casilla(elemento.target);
      boton.remove();
    }
  }

  /** 
   * Función que dibuja la tabla segun sus filas y columnas de forma dinámica incluyendo los botones y minas y valor de las casillas.
   * @return {Element} Devuelve un elemento HTML tabla.
  */
  show_tablero() {
    /*-----------------------Contador minas--------------------------------*/
    let parrafo = document.createElement("p");
    parrafo.textContent = `0${this.get_numeroMinas()}`;
    document.getElementById("bombas-restantes").appendChild(parrafo);
    /*---------------------------------------------------------------------*/

    let tablero = this.get_tablero();
    /*-----------------------Elemento <table>--------------------------------*/
    // Se crea un elemento tabla y se setean las propiedades de id y class.
    let plantilla = document.createElement("table");
    plantilla.setAttribute("id", "plantilla-buscaminas");
    plantilla.setAttribute("class", "plantilla-buscaminas");

    /*-----------------------Elemento <tr>--------------------------------*/
    tablero.forEach((fila, indiceFila) => {
      // Por cada fila del tablero se crea un elemento <tr></tr>.
      let filaPlantilla = document.createElement("tr");

      fila.forEach((valor, indiceColumna) => {
        /*-----------------------Elemento <td>--------------------------------*/
        // Por cada columna de la fila se crea un elemnto <td></td>.
        let columnaPlantilla = document.createElement("td");

        /*-----------------------Elemento <button>--------------------------*/
        let botonPlantilla = document.createElement("button");
        botonPlantilla.setAttribute("class", "boton-casilla");

        botonPlantilla.onclick = (elemento) => this.show_casilla(elemento.target);
        botonPlantilla.oncontextmenu = (elemento) => this.select_casilla(elemento.target);

        botonPlantilla.setAttribute("value", `${valor}`);
        // En cada columna de la fila hay un <button></button>
        columnaPlantilla.appendChild(botonPlantilla);
        /*------------------------------------------------------------------*/

        /*--------------------------Elemento <p>----------------------------*/
        let parrafoPlantilla = document.createElement("p");
        let bomba = document.createElement("i");
        bomba.setAttribute("class", "bx bxs-bomb");
        let contenido = valor;

        if (contenido == 0) {
          contenido = " ";
        }

        if (valor == 9) {
          parrafoPlantilla.appendChild(bomba)
        } else {
          parrafoPlantilla.textContent = contenido;
        }
        // En cada columna de la fila hay <p></p> además del <button></button>
        columnaPlantilla.appendChild(parrafoPlantilla);
        /*------------------------------------------------------------------*/
        filaPlantilla.appendChild(columnaPlantilla);
        /*--------------------------------------------------------------------*/
      });

      plantilla.appendChild(filaPlantilla);
      /*----------------------------------------------------------------------*/
    });
    /*------------------------------------------------------------------------*/

    return plantilla;
  }
}

/**
 * Objeto con todas la características que del juego del buscaminas.
 * @extends Tablero.
 * @function set_minas()
 * @function get_minasEnZona()
 * @method set_valoresTablero()
 * @method get_escaneoTablero()
 * @function get_casillaBomba()
 * @function get_banderasPuestas()
 * @function sonN_minasValidas()
 * @function is_completadoTablero()
 * @MarcosDominguezVega <228@cifceuta.es>
*/
class Buscaminas extends Tablero {
  /**
   * @method constructor()
   * Función constructora del objeto buscaminas que toma como entrada las filas y columnas del tablero e instancia el objeto a partir del prototipo del objeto Tablero.
   * @param {Number} filas - Cantidad de filas que posee el tablero de buscaminas.
   * @param {Number} columnas - Cantidad de columnas que posee el tablero de buscaminas.
   * @return {void} retorna una llamada a la instancia del objeto Buscaminas.
 */
  constructor(filas = 8, columnas = 8) {
    super(filas, columnas);
    this.minas = 0;
    this.banderas = 0;
    this.casillas = this.set_casillas();
  }

  /*
   * Obtiene la minas del buscaminas.
  */
  get_minas() {
    return this.minas;
  }

  /*
   * Obtiene la banderas colocadas en el tablero.
  */
  get_banderas() {
    return this.banderas;
  }

  /*
   * Actualiza el valor de la bandera por cada una que se inserte.
  */
  set_banderas(clicks) {
    this.banderas = clicks;
  }

  /*
   * Obtiene el número total de casillas en el tablero.
  */
  get_casillas() {
    return this.casillas;
  }

  /** 
   * Función que seleciona casillas aleatorias y coloca minas en ellas sin que esta posición se vuelva a repetir.
   * @param {Number} minas - El número de minas que tendrá la tabla, default 16.
   * @return {Boolean} Llama al método set_tablero que actualiza la tabla que se muestra.
  */
  set_minas(minas) {
    let tablero = this.get_tablero();
    let estanPuestas = false;
    let minasPuestas = 0;

    if (this.sonN_minasValidas(this.get_filas(), this.get_columnas(), minas)) {
      while (minasPuestas < minas) {
        let posMinaX = parseInt(Math.random() * this.get_filas());
        let posMinaY = parseInt(Math.random() * this.get_columnas());

        if (tablero[posMinaX][posMinaY] != 9) {
          tablero[posMinaX][posMinaY] = 9;
          minasPuestas++;
        }

      }
      estanPuestas = true;
      this.set_tablero(tablero);
    }
    return estanPuestas;
  }

  /** 
  * Función que obtiene el numero de minas en un area de 3x3 de la casilla posicionada en un numero de fila y columna concreto.
  * @param {Number} fila - La fila a la que pertenece la casilla.
  * @param {Number} columna - La columna a la que pertenece la casilla.
  * @param {Array} matriz - Array multidimensional con el scaneo de cada casilla del tablero.
  * @return {Number} retorna un numero de minas totales en la matriz 3x3.
 */
  get_minasEnZona(indiceFila, indiceColumna, matriz) {
    let zonaEscaneada = matriz[indiceFila][indiceColumna];
    let minasObtenidas = 0;

    for (let fila of zonaEscaneada) {
      for (let columna in fila) {
        if (fila[columna] == 9) {
          minasObtenidas++;
        }
      }
    }
    return minasObtenidas;
  }

  /** 
   * Función que setea las casillas que no tengan minas por el número de minas que hay en un area de 3x3.
   * @param {Array} zonaEscaneada - La matriz que ha mapeado todo el tablero que tiene matrices de 3x3 en su interior.
   * @return {void} Actualiza la propiedad tablero heredada del padre
  */
  set_valoresTablero(zonaEscaneada) {
    let tablero = this.get_tablero();
    let valorVacio = /0/;

    for (let fila = 0; fila < this.get_filas(); fila++) {
      for (let columna = 0; columna < this.get_columnas(); columna++) {
        let minasObtenidas = this.get_minasEnZona(columna, fila, zonaEscaneada);
        if (valorVacio.test(tablero[fila][columna])) {
          tablero[fila][columna] = minasObtenidas;
        }
      }
    }

    this.set_tablero(tablero);

  }

  /** 
   * Función que por cada casilla recoge una matriz de 3x3 partiendo desde la primera casilla hasta la última.
   * @return {Array} Retorna un array cuyo contenido es una array multidimensional de 3 capas y en la última se encuentra la matriz de 3x3 de cada elemento.
  */
  get_escaneoTablero() {
    let tablero = this.get_tablero();

    // Seleccion de todas las matrices 8x3x3 de cada fila.
    let columnasEscaneadas = tablero.map((fila, indice) => {
      let filaEscaneada = new Array();
      for (let columna = 0; columna < fila.length; columna++) {
        filaEscaneada.push(
          fila.slice(
            (columna == 0) ? columna : columna - 1,
            (columna >= fila.length) ? columna - 1 : columna + 2
          ));

      }
      return filaEscaneada;
    });

    // Reorganizacion de todas las filasXcolumnas 8x8x3x3;
    let filasEscaneadas = columnasEscaneadas.map((fila, indice) => {
      let elementosEscaneados = new Array();
      for (let iterador = 0; iterador < fila.length; iterador++) {
        elementosEscaneados.push(columnasEscaneadas[iterador][indice]);
      }
      return elementosEscaneados;
    });

    // Creación de la matriz multidimenional con todas las posibles matrices de 3x3 de la plantilla.
    let tableroEscaneado = tablero.map((fila, indice) => {
      let mapeado = new Array();
      for (let columna = 0; columna < fila.length; columna++) {
        mapeado.push(filasEscaneadas[indice].slice(
          (columna == 0) ? columna : columna - 1,
          (columna >= fila.length) ? columna - 1 : columna + 2));
      }
      return mapeado;
    });
    return tableroEscaneado;
  }

  /** 
   * Función que obtine todas las casillas con bombas
   * @return {String} Retorna una cadena con el número de la casilla con bomba.
  */
  get_casillaBomba() {
    let tablero = this.get_tablero();
    let botonActual = 0;
    let botones = tablero.map((fila) => {
      let filaVacia = new Array();
      for (let columna of fila) {
        if (columna == 9) {
          filaVacia.push(botonActual);
        }
        botonActual++;
      }
      return filaVacia;
    });

    botones = botones.filter((fila) => {
      let filaPasada = fila;
      if (filaPasada.length > 0) {
        return filaPasada;
      }
    });

    return botones;
  }

  /*
   * Obtiene las banderas colocadas en el tablero.
  */
  get_banderasPuestas() {
    let banderas = new Array();
    let posicionBandera = 0;
    document.querySelectorAll(".boton-casilla").forEach((boton) => {
      if (boton.childElementCount > 0) {
        banderas.push(posicionBandera);
      }
      posicionBandera++;
    });
    return banderas;
  }

  /** 
   * Función que válida si el número de minas del objeto se corresponde con dos criterios matemáticos.
   * @param {Number} filas - Número de filas totales del tablero.
   * @param {Number} columnas - Número de columnas por fila del tablero.
   * @param {Number} minas - Número de minas del tablero.
   * @return {Boolean} Retorna un true o false.
  */
  sonN_minasValidas(filas, columnas, minas) {
    let criterio1 = parseInt((columnas * filas) / 3);
    let criterio2 = parseInt(((columnas * filas) * 2) / 3);
    if (minas < criterio1 && minas <= criterio2) {
      return true;
    } else {
      alert(`Numero de minas incorrecto debe ser menor que ${formula} y ${formula2}`);
      return false;
    }
  }

  /*
   * Función que determina si el tablero esta al descubierto completamente o no.
   * @param {Boolean} - true o false.
  */
  is_completadoTablero(clicks) {
    let casillasVacias = this.get_casillasVacias().split(",").length;
    let casillasAPulsar = (this.get_casillas() - casillasVacias - this.get_minas());
    console.log("Casillas para acabar partida: " + casillasAPulsar);
    return (clicks == casillasAPulsar) ? true : false;
  }
}

/**
 * Esta clase se corresponde con toda la partida asi como la incialización de ella como toda la configuración de enventos y variables.
 * @exports Partida
 * @static @method partidaPerdida()
 * @method startGame()
 * @function get_modoJuego()
 * @static @method iniciarPartida()
 * @static @method get_eventoOnclick()
 * @static @method get_eventoContextMenu()
 * @MarcosDominguezVega <228@cifceuta.es>
*/
export class Partida {
  /** 
   * Función que instancia la partida creando el tablero, y habilitando el buscaminas
   * @return {void} retorna la llamada a una instancia del objeto partida
  */
  constructor() {}

  /** 
   * Función que instancia el objeto buscaminas y lo retorna o falso en caso contrario además da cominezo a la partida.
   * @param {Number} filas - Número de filas que tendrá la tabla, default 8.
   * @param {Number} columnas Número de columnas que tendrá la tabla, default 8.
   * @param {Number} minas - El número de minas que tendrá la tabla, default 20.
   * @return {Buscaminas|Boolean} Devuelve el objeto propio usado o falso al fallo.
  */
  startGame(filas = 8, columnas = 8, minas = 20) {
    // Se instancia el objeto Buscaminas.
    let buscaminas = new Buscaminas(filas, columnas);
    // Se crea el tablero.
    buscaminas.create_tablero();
    // Se añaden las minas al tablero.
    if (buscaminas.set_minas(minas)) {
      // Se procede al escaneo de la matriz.
      let matrizEscaneada = buscaminas.get_escaneoTablero();
      // Se actualiza el valor de las casillas del tablero.
      buscaminas.set_valoresTablero(matrizEscaneada);
      buscaminas.get_casillasVacias();
      return buscaminas;

    } else {
      return false;
    }
  }

  /** 
   * Función que destaca la última bomba pulsada y que muestra la pantalla final del juego y el tablero completamente despejado.
   * @param {Element} botonPulsado - Boton en que fue llamada la función en un evento
   * @return {void} Finaliza la posibilidad de seguir jugando.
  */
  static partidaPerdida(botonPulsado) {
    botonPulsado.style.backgrounColor = "var(--rojo-imperial)";
    /*-----------------------------Elemento <i>------------------------------*/
    let bomba = document.createElement("i");
    bomba.setAttribute("class", "bx bxs-bomb bomba-pulsada");
    botonPulsado.appendChild(bomba);
    /*-----------------------------------------------------------------------*/

    /*---------------------------Elemento <div>-------------------------------*/
    let pantallaFinalPartida = document.getElementById("pantalla-final");
    pantallaFinalPartida.classList.remove("invisible");
    pantallaFinalPartida.classList.add("visible");
    /*------------------------------------------------------------------------*/

    // Array de los elementos con clase "boton-casilla";
    let botones = document.querySelectorAll(".boton-casilla");
    botones.forEach((boton) => {
      console.log(boton);
      console.log(botonPulsado);
      if (boton != botonPulsado) {
        boton.style = "display: none;";
      }
    });
  }
  
  /** 
    * Función que comprueba la respuesta del usuario y si es correcta devuelve el objeto en cuestion o false en caso de error.
    * @param {String} modo - El modo de juego del buscaminas que puede ser facil, intermedio, dificil o personalizado.
   * @return {Buscaminas|Boolean} Retorna el objeto buscaminas o un falso.
  */
  get_modoJuego(modo) {
    let modosJuego = [/f[aá]cil|1/, /normal|2/, /d[ií]ficil|3/, /personalizado|4/];
    let buscaminas;
    if (modosJuego[0].test(modo)) {
      /* ------------------------------------------------------------*/
      /* ---------------------- MODO FÁCIL --------------------------*/
      /* ------------------------------------------------------------*/
      buscaminas = this.startGame();
    } else if (modosJuego[1].test(modo)) {
      /* ------------------------------------------------------------*/
      /* ---------------------- MODO NORMAL --------------------------*/
      /* ------------------------------------------------------------*/
      buscaminas = this.startGame(16, 16, 84);
    } else if (modosJuego[2].test(modo)) {
      /* ------------------------------------------------------------*/
      /* ---------------------- MODO DÍFICIL ------------------------*/
      /* ------------------------------------------------------------*/
      buscaminas = this.startGame(20, 20, 132);
    } else {
      /* ------------------------------------------------------------*/
      /* -------------------- MODO PERSONALIZADO---------------------*/
      /* ------------------------------------------------------------*/
      let estaIniciada = false;
      while (!estaIniciada) {
        let filasIntroducidas = prompt("Introduce el número de filas: ");
        let columnasIntroducidas = prompt("Introduce el número de columnas: ");
        let minasIntroducidas = prompt("Introduce el número de minas: ");
        buscaminas = this.startGame(
          filasIntroducidas, 
          columnasIntroducidas, 
          minasIntroducidas
        );

        if (
          typeof buscaminas == "object" &&
          filasIntroducidas <= 20 && filasIntroducidas >= 10 &&
          columnasIntroducidas <= 20 && columnasIntroducidas >= 10
        ) {
          estaIniciada = true;
        }
      }
    }

    return (typeof buscaminas == "object") ? buscaminas : false;
  }


  static iniciarPartida() {
    let container = document.getElementById("container-buscaminas");
    let opcionIntroducida;
    let opcionCorrecta = false;
    let buscaminas = new Partida();
    
    while (!opcionCorrecta) {
      opcionIntroducida = prompt("Elige dificultad: (1) Fácil, (2) Normal, (3) Díficil, (4) Personalizado").toLowerCase();
      
      buscaminas = buscaminas.get_modoJuego(opcionIntroducida);
      if (typeof buscaminas == "object") {
        opcionCorrecta = true;
      } else {
        alert("Introduce una opción correcta");
      }
    }

    Partida.get_eventoOnclick(buscaminas);
    Partida.get_eventoContextMenu(buscaminas);


    // DIBUJAMOS EL TABLERO EN PANTALLA.
    container.appendChild(buscaminas.show_tablero());
  }

  /** 
   * Función estática que inicia el temporizador de partida además de controlar cada casilla del tablero pulsada.
   * @param {Object} buscaminas objeto buscaminas.
   * @return {void}
  */
  static get_eventoOnclick(buscaminas) {
    let clicks = 0;
    let minutos = 0;
    let segundos = 0;

    /*----------------------Temporizador de partida---------------------------*/
    let boxTemporizador = document.getElementById("tiempo-de-partida");
    let parrafo = document.createElement("p");
    parrafo.textContent = "00:00";
    boxTemporizador.appendChild(parrafo);
    /*------------------------------------------------------------------------*/

    document.addEventListener("click", (event) => {
      let condicionFinal = false;
      // El temporizador solo se iniciará una vez en la partida
      if (clicks == 0) {

        setInterval(function () {
          if (segundos == 60) {
            segundos = 0;
            minutos++;
          } else {
            segundos++;
          }
          // Actualiza el valor del tiempo cada segundo
          if (segundos > 9) {
            parrafo.textContent = minutos + ':' + segundos;
          } else {
            parrafo.textContent = minutos + ':0' + segundos;
          }
        }, 1000);
      }

      // Al superar los 2.400.000 milisegundos == 30minutos finaliza el temporizador
      setTimeout(function () {
        clearInterval(temporizador);
        parrafo.textContent = "00:00";
        segundos = 0;
        minutos = 0;
      }, 2400000);


      if (event.target.localName == "button" && !condicionFinal) {
        clicks++;
      }

      if (buscaminas.is_completadoTablero(clicks)) {
        let minas = buscaminas.get_casillaBomba();
        let banderas = buscaminas.get_banderasPuestas();
        for (let casilla in banderas) {
          condicionFinal = (minas[casilla] == banderas[casilla]) ? true : false;
        }
      }

      if (condicionFinal) {
        console.log("HAS GANADO");
      }
    });
  }

  /** 
   * Función estática que añade al tablero el icono de una posible bomba.
   * @return {void}
  */
  static get_eventoContextMenu(buscaminas) {
    let banderas = 0;
    /*------------------------------BANDERAS-------------------------------- */
    let banderasPuestas = document.getElementById("banderas-puestas");
    let parrafo = document.createElement("p");
    parrafo.textContent = "000";
    banderasPuestas.appendChild(parrafo);
    /*-------------------------------------------------------------------- */

    /*-------------------------------MINAS--------------------------------- */
    let parrafo2 = document.getElementById("bombas-restantes").children;
    /*-------------------------------------------------------------------- */
    
    document.addEventListener("contextmenu", (event) => {
      buscaminas.set_banderas(banderas);
      banderas = (event.target.childNodes.length == 0) ? banderas - 1 : banderas + 1;

      parrafo2[1].textContent = `0${buscaminas.get_numeroMinas()-banderas}`;
      
      parrafo.textContent = (banderas < 10) ? "00" + banderas : banderas;
      botonPulsado = event.target;
    });
  }
}