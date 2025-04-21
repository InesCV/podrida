let scores = {};
let currentRound = 1;
let playerNames = [];

// Función para establecer el número de jugadores
document.getElementById('setPlayers').addEventListener('click', function() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    if (numPlayers >= 3 && numPlayers <= 6) {
        setupPlayerInputs(numPlayers);
        document.getElementById('playerNamesContainer').classList.remove('hidden');
    } else {
        alert("Por favor, establece un número de jugadores entre 3 y 6.");
    }
});

// Función para configurar los inputs de los nombres de los jugadores
function setupPlayerInputs(numPlayers) {
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = ''; // Limpiar entradas anteriores

    for (let i = 1; i <= numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre del Jugador ${i}`;
        input.id = `player-${i}`;
        playerInputs.appendChild(input);
    }
    const startButton = document.createElement('button');
    startButton.innerText = 'Iniciar Juego';
    startButton.addEventListener('click', startGame);
    console.log('Contador de juego preaparado');
    playerInputs.appendChild(startButton);
}

// Función para iniciar el juego
function startGame() {
  console.log('Contador de juego iniciado');
  document.getElementById('numPlayersDefinition').classList.add('hidden');
  document.getElementById('playerNamesContainer').classList.add('hidden');
  document.getElementById('scoreManager').classList.remove('hidden');
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
  const scoreTableBody = document.querySelector('#scoreTable tbody');
  const handTableBody = document.querySelector('#handTable tbody');
  const totalPointsContainer = document.getElementById('listPlayerTotalPoints');

  // Limpiar entradas anteriores
  scoreTableBody.innerHTML = ''; // Limpiar cuerpo de la tabla de puntuaciones
  handTableBody.innerHTML = ''; // Limpiar cuerpo de la tabla de bazas
  scores = {}; // Reiniciar puntajes
  playerNames = []; // Reiniciar nombres de jugadores

  // Inicializar puntajes y encabezados de la tabla
  for (let i = 1; i <= numPlayers; i++) {
      const playerName = document.getElementById(`player-${i}`).value || `Jugador ${i}`;
      playerNames.push(playerName);
      scores[playerName] = []; // Inicializar puntajes como un array

      // Agregar encabezados a la tabla de puntuaciones
      const th = document.createElement('th');
      th.innerText = playerName;
      document.querySelector('#scoreTable thead tr').appendChild(th);

      // Inicializar el total de puntos
      const totalPointsItem = document.createElement('li');
      totalPointsItem.id = `total-${playerName}`;
      totalPointsItem.innerText = `${playerName}: 0`;
      totalPointsContainer.appendChild(totalPointsItem);

      // Agregar fila a la tabla de bazas
      const row = document.createElement('tr');
      const playerCell = document.createElement('td');
      playerCell.innerText = playerName;
      row.appendChild(playerCell);

      const pointsCell = document.createElement('td');
      pointsCell.innerText = 0; // Inicializar puntos en 0
      pointsCell.classList.add('points-cell'); // Clase para facilitar la actualización
      row.appendChild(pointsCell);

      const fulfilledCell = document.createElement('td');
      const fulfilledCheckbox = document.createElement('input');
      fulfilledCheckbox.type = 'checkbox';
      fulfilledCheckbox.onchange = () => updatePoints(row); // Actualizar puntos al cambiar el checkbox
      fulfilledCell.appendChild(fulfilledCheckbox);
      row.appendChild(fulfilledCell);

      const bazaCell = document.createElement('td');
      
      // Campo de entrada para el número de bazas
      const bazaInput = document.createElement('input');
      bazaInput.type = 'number';
      bazaInput.value = 0; // Inicializar en 0
      bazaInput.min = -10; // Ajustar según sea necesario
      bazaInput.max = 10; // Ajustar según sea necesario
      bazaInput.oninput = () => updatePoints(row); // Actualizar puntos al cambiar el valor
      bazaCell.appendChild(bazaInput);

      // Botones para ajustar el número de bazas
      const bazaPlusButton = document.createElement('button');
      bazaPlusButton.innerText = '+';
      bazaPlusButton.onclick = () => {
          bazaInput.value = parseInt(bazaInput.value) + 1; // Incrementar el valor
          updatePoints(row); // Actualizar puntos
      };

      const bazaMinusButton = document.createElement('button');
      bazaMinusButton.innerText = '-';
      bazaMinusButton.onclick = () => {
          bazaInput.value = parseInt(bazaInput.value) - 1; // Decrementar el valor
          updatePoints(row); // Actualizar puntos
      };

      bazaCell.appendChild(bazaPlusButton);
      bazaCell.appendChild(bazaMinusButton);
      row.appendChild(bazaCell);

      handTableBody.appendChild(row);
  }

  // Iniciar la primera ronda
  currentRound = 0;
  updateScoreTable();
}

// Función para actualizar los puntos
function updatePoints(row) {
  const pointsCell = row.querySelector('.points-cell');
  const fulfilledCheckbox = row.querySelector('input[type="checkbox"]');
  const bazaInput = row.querySelector('input[type="number"]');
  const bazaCount = parseInt(bazaInput.value) || 0; // Obtener el valor del input

  let points = 0;
  if (fulfilledCheckbox.checked) {
      points += 10; // Sumar 10 puntos si se ha cumplido
  }
  points += bazaCount * 3; // Sumar 3 puntos por cada baza positiva
  points -= (bazaCount < 0 ? Math.abs(bazaCount) * 3 : 0); // Restar 3 puntos por cada baza negativa

  pointsCell.innerText = points; // Actualizar la celda de puntos
}

// Función para actualizar el número de bazas
function updateBazas(playerName, change, row) {
  const handTableBody = document.querySelector('#handTable tbody');
  const bazaCountCell = row.querySelector('td:last-child');
  const currentBazaCount = parseInt(bazaCountCell.dataset.count) || 0;
  const newBazaCount = currentBazaCount + change;
  bazaCountCell.dataset.count = newBazaCount;
  bazaCountCell.innerText = newBazaCount;

  updatePoints(row); // Actualizar puntos después de cambiar las bazas
}

// Función para actualizar la tabla de puntuaciones
function updateScoreTable() {
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    scoreTableBody.innerHTML = ''; // Limpiar el cuerpo de la tabla

    // Agregar fila para la ronda actual
    const roundRow = document.createElement('tr');
    const roundCell = document.createElement('td');
    roundCell.innerText = `Ronda ${currentRound + 1}`;
    roundRow.appendChild(roundCell);

    const handTableBody = document.querySelector('#handTable tbody');
    const rows = handTableBody.querySelectorAll('tr');

    playerNames.forEach(playerName => {
        let points = 0;

        rows.forEach(row => {
            const playerCell = row.querySelector('td:first-child');
            if (playerCell.innerText === playerName) {
                const pointsInput = row.querySelector('input[type="number"]');
                const fulfilledCheckbox = row.querySelector('input[type="checkbox"]');

                points += parseInt(pointsInput.value) || 0;
                if (fulfilledCheckbox.checked) {
                    points += 10; // Sumar 10 puntos si se ha cumplido
                }

                const bazaCount = parseInt(row.querySelector('td:last-child').dataset.count) || 0;
                points += bazaCount * 3; // Sumar 3 puntos por cada baza positiva
                points -= (bazaCount < 0 ? Math.abs(bazaCount) * 3 : 0); // Restar 3 puntos por cada baza negativa
            }
        });

        scores[playerName][currentRound] = points; // Guardar puntos en la ronda actual
        const cell = document.createElement('td');
        cell.innerText = points;
        roundRow.appendChild(cell);
    });

    scoreTableBody.appendChild(roundRow);
    updateTotalPoints();
}

// Función para actualizar el total de puntos de cada jugador
function updateTotalPoints() {
    const totalRow = document.getElementById('totalRow');
    totalRow.innerHTML = ''; // Limpiar la fila de totales
    playerNames.forEach(playerName => {
        const totalPoints = scores[playerName].reduce((acc, curr) => acc + (curr || 0), 0);
        totalRow.innerHTML += `<td>${totalPoints}</td>`;
        document.getElementById(`total-${playerName}`).innerText = `${playerName}: ${totalPoints}`;
    });
}

// Función para iniciar una nueva baza
function nextRound() {
    currentRound++;
    updateScoreTable(); // Actualiza la tabla al iniciar una nueva ronda
}

// Función para manejar la anterior baza (opcional)
document.getElementById('prevHand').addEventListener('click', function() {
    if (currentRound > 0) {
        currentRound--;
        updateScoreTable(); // Actualiza la tabla al retroceder una ronda
    }
});