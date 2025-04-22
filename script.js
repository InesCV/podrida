let scores = {};
let currentRound = 0;
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

function transformPlayerNameToId(playerName) {
  playerId = playerName.split(" ").join("-").toLowerCase(); // create kebab-case
  return playerId
}

// Función para configurar los inputs de los nombres de los jugadores
function setupPlayerInputs(numPlayers) {
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = ''; // Limpiar entradas anteriores

    for (let i = 1; i <= numPlayers; i++) {
        const input = document.createElement('input');
        input.classList.add("mb-10")
        input.type = 'text';
        input.placeholder = `Nombre del Jugador ${i}`;
        input.id = `player-${i}`;
        playerInputs.appendChild(input);
    }
    const startButton = document.createElement('button');
    startButton.innerText = 'Iniciar Juego';
    startButton.classList.add('stepButton')
    startButton.addEventListener('click', startGame);
    playerInputs.appendChild(startButton);
}

// Función para iniciar el juego
function startGame() {
  document.getElementById('numPlayersDefinition').classList.add('hidden');
  document.getElementById('playerNamesContainer').classList.add('hidden');
  document.getElementById('scoreManager').classList.remove('hidden');
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
  const scoreTableBody = document.querySelector('#scoreTable tbody');
  const handTableBody = document.querySelector('#handTable tbody');
  const roundTitle = document.getElementById('round-title');
  roundTitle.innerText = `Puntos de Ronda ${currentRound + 1}`;

  // Limpiar entradas anteriores
  scoreTableBody.innerHTML = ''; // Limpiar cuerpo de la tabla de puntuaciones
  handTableBody.innerHTML = ''; // Limpiar cuerpo de la tabla de bazas
  scores = {}; // Reiniciar puntajes
  playerNames = []; // Reiniciar nombres de jugadores

  // Inicializar puntajes y encabezados de la tabla
  for (let i = 1; i <= numPlayers; i++) {
      const playerName = document.getElementById(`player-${i}`).value || `Jugador ${i}`;
      const playerId = transformPlayerNameToId(playerName);
      playerNames.push(playerName);
      scores[playerName] = []; // Inicializar puntajes como un array

      startScoreTable(playerName, playerId);
      startHandTable(playerName, playerId, handTableBody);
  }
}

function startScoreTable(playerName, playerId) {
  // Agregar encabezados a la tabla de puntuaciones
  const totalPointsRow = document.getElementById('totalRow');
  const th = document.createElement('th');
  th.innerText = playerName;
  document.querySelector('#scoreTable thead tr').appendChild(th);

  // Inicializar el total de puntos
  const totalPointsItem = document.createElement('td');
  totalPointsItem.id = `total-${playerId}`;
  totalPointsItem.innerText = 0; // Al inicio todos los jugadores tienen un total de 0 puntos
  totalPointsRow.appendChild(totalPointsItem);
}

// Función para crear la tabla de Bazas
function startHandTable(playerName, playerId, handTableBody) {  
  // Agregar fila a la tabla de bazas
  const row = document.createElement('tr');
  const playerCell = document.createElement('td');
  playerCell.innerText = playerName;
  row.appendChild(playerCell);

  const pointsCell = document.createElement('td');
  pointsCell.innerText = 0; // Inicializar puntos en 0
  pointsCell.classList.add('pointsCell'); // Clase para facilitar la actualización
  pointsCell.id = `current-round-${playerId}`; // Asignar ID a los puntos por jugador de la mano
  row.appendChild(pointsCell);

  const fulfilledCell = document.createElement('td');
  fulfilledCell.classList.add('checkboxCell')
  const fulfilledCheckbox = document.createElement('input');
  fulfilledCheckbox.type = 'checkbox';
  fulfilledCheckbox.onchange = () => updatePoints(row); // Actualizar puntos al cambiar el checkbox
  fulfilledCell.appendChild(fulfilledCheckbox);
  row.appendChild(fulfilledCell);

  const bazaCell = document.createElement('td');
  bazaCell.classList.add("bazaCell");
  
  // Campo de entrada para el número de bazas
  const bazaInput = document.createElement('input');
  bazaInput.type = 'number';
  bazaInput.value = 0; // Inicializar en 0
  bazaInput.min = -13; // Ajustar según sea necesario
  bazaInput.max = 13; // Ajustar según sea necesario
  bazaInput.oninput = () => updatePoints(row); // Actualizar puntos al cambiar el valor
  bazaCell.appendChild(bazaInput);

  // Botones para ajustar el número de bazas
  const bazaPlusButton = document.createElement('button');
  bazaPlusButton.classList.add("bazaButton")
  bazaPlusButton.innerText = '+';
  bazaPlusButton.onclick = () => {
      bazaInput.value = parseInt(bazaInput.value) + 1; // Incrementar el valor
      updatePoints(row); // Actualizar puntos
  };

  const bazaMinusButton = document.createElement('button');
  bazaMinusButton.innerText = '-';
  bazaMinusButton.classList.add("bazaButton")
  bazaMinusButton.onclick = () => {
      bazaInput.value = parseInt(bazaInput.value) - 1; // Decrementar el valor
      updatePoints(row); // Actualizar puntos
  };

  bazaCell.appendChild(bazaMinusButton);
  bazaCell.appendChild(bazaPlusButton);
  row.appendChild(bazaCell);

  handTableBody.appendChild(row);
}

// Función para iniciar una nueva baza
function nextHand() {
  // Guardar la puntuación de la ronda actual en la tabla de puntuaciones
  const scoreTableBody = document.querySelector('#scoreTable tbody');
  const roundRow = document.createElement('tr');
  const roundCell = document.createElement('td');
  roundCell.innerText = `Ronda ${currentRound + 1}`; // Mostrar el número de ronda correctamente
  roundRow.appendChild(roundCell);

  playerNames.forEach(playerName => {
      const playerId = transformPlayerNameToId(playerName);
      const currentRoundPlayerId = `current-round-${playerId}`;
      console.log(currentRoundPlayerId);
      const points = document.getElementById(currentRoundPlayerId).innerText || 0; // Obtener puntos de la ronda actual
      scores[playerName][currentRound] = points; // Guardar puntos en el objeto scores
      const cell = document.createElement('td');
      cell.innerText = points;
      roundRow.appendChild(cell);
  });

  scoreTableBody.appendChild(roundRow); // Agregar la fila de la ronda actual

  // Actualizar la fila de totales
  updateTotalPointsRow();

  // Limpiar el handTable para la nueva ronda
  const handTableBody = document.querySelector('#handTable tbody');
  handTableBody.innerHTML = ''; // Limpiar la tabla de bazas

  // Incrementar la ronda actual
  currentRound++;
}

// Función para actualizar los puntos
function updatePoints(row) {
  const pointsCell = row.querySelector('.pointsCell');
  const fulfilledCheckbox = row.querySelector('input[type="checkbox"]');
  const bazaInput = row.querySelector('input[type="number"]');
  const bazaCount = parseInt(bazaInput.value) || 0; // Obtener el valor del input

  let points = 0;
  if (fulfilledCheckbox.checked) {
      points += 10; // Sumar 10 puntos si se ha cumplido
  }
  points += bazaCount * 3; // Sumar 3 puntos positivos o negativos por cada baza
  pointsCell.innerText = points; // Actualizar la celda de puntos

  // Actualizar el total en la celda correspondiente
  const playerName = row.querySelector('td').id; // Suponiendo que el primer <td> es el nombre del jugador
  const playerId = transformPlayerNameToId(playerName);
  const totalPointsCell = document.getElementById(`current-round-${playerId}`);
  if (totalPointsCell) {
      totalPointsCell.innerText = points; // Actualizar el total de puntos
  }
}

// Función para crear la fila de totales
function createTotalPointsRow() {
  const totalRow = document.getElementById('totalRow');

  // Agregar celda para el encabezado "Total"
  const totalHeaderCell = document.createElement('td');
  totalHeaderCell.innerText = 'Total';
  totalRow.appendChild(totalHeaderCell);

  playerNames.forEach((playerName, index) => {
      const totalCell = document.createElement('td');
      totalCell.id = `total-player-${index + 1}`; // Asignar ID a cada celda de total
      totalCell.innerText = 0; // Inicializar en 0
      totalRow.appendChild(totalCell);
  });
}

// Función para actualizar la fila de totales
function updateTotalPointsRow(roundId) {
  playerNames.forEach((playerName, index) => {
      const pointsForRound = scores[playerName][roundId] || 0; // Obtener puntos de la ronda actual
      const totalCell = document.getElementById(`total-player-${index + 1}`);
      const currentTotal = parseInt(totalCell.innerText) || 0; // Obtener el total actual

      // Actualizar el total sumando los puntos de la ronda actual
      totalCell.innerText = currentTotal + pointsForRound;
  });
}