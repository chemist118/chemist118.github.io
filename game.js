var table = document.getElementById('table');  //  игровое поле
var counter = document.getElementById('counter');  //  счеткик очков
var timeCounter = document.getElementById('timer');  //  таймер
var recTable = document.getElementById('records');  //  таблица рекордов
var size = 2; //  начальный размер
var dif = 100;  //  начальная разница в цвете
var x = 10; // разница будет уменьшаться на это значение
var time = 20;  // время уровня
var recTime = 0;  //  время рекода
var records = [];
var username = prompt("Введите своё имя:");

//localStorage.clear();  // очистка хранения данных

// загрузка сохранённых данных
load();
// инициализация игры
initGame();

// функция запуска игры с текущим уровнем
function initGame() {
    save();
    checkRec();
    loadRec();
    time = 20.0;
    timeCounter.innerHTML = time;
    stop();
    start();
    counter.innerHTML = 'Счёт: ' + (size - 2)
    table.innerHTML = ''
    colArr = randColor();
    color = rgbToHex(colArr[0], colArr[1], colArr[2]);
    var cells = createCells(color, colArr, color);
    addActivateHandler(cells, color);
}

// установка обработчиков событий клика мыши
function addActivateHandler(cells, color) {
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', function () {
            check(this, color);
        });
    }
}

// перезапустить игру с начала
function restart() {
    stop();
    size = 2;
    dif = 100;
    recTime = 0;
    initGame();
}

// сохранить текущий результат в локальные данные
function save() {
    localStorage.username = username;
    localStorage.size = size;
    localStorage.dif = dif;
    localStorage.recTime = recTime;
    localStorage.setItem("records", JSON.stringify(records));
}

// загрузить текущий результат из локалльных данных
function load() {
    if (localStorage.username && localStorage.recTime && localStorage.size && localStorage.dif && localStorage.getItem("records")) {
        if (localStorage.username == username) {
            size = localStorage.size;
            dif = localStorage.dif;
            recTime = recTime;
        }
        records = JSON.parse(localStorage.getItem("records"));
    }
}

// инициализировать таблицу рекордов
function loadRec() {
    recTable.innerHTML = '';
    var tr = document.createElement('tr');
    var td = document.createElement('td'); td.width = 150;
    td.innerHTML = "СЧЁТ"; tr.appendChild(td);
    var td = document.createElement('td'); td.width = 150;
    td.innerHTML = "ВРЕМЯ"; tr.appendChild(td);
    var td = document.createElement('td');
    td.innerHTML = "ИМЯ"; tr.appendChild(td);
    recTable.appendChild(tr);
    for (var i = 0; i < records.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < records[i].length; j++) {
            var td = document.createElement('td');
            td.innerHTML = records[i][j];
            tr.appendChild(td);
        }
        recTable.appendChild(tr);
    }
}

// проверить ответ пользователя
function check(cell, color) {
    var td = document.createElement('td');
    td.style.backgroundColor = color;
    if (cell.style.backgroundColor != td.style.backgroundColor) {
        stop();
        recTime += 20 - time;
        checkRec();
        size++;
        if (dif > x)
            dif -= x;
        else
            dif = 0;
        if (dif <= 0)
            alert("Все квадраты одинаковые, шоу - Интуиция !");
        initGame();
    }
    else
        restart();
}

// проверить установлен ли новый рекорд
function checkRec() {
    var Inserted = false;
    for (var i = 0; i < records.length; i++) {
        if (records[i][2] == username)
            Inserted = true;

        if (records[i][2] == username) {
            if (records[i][0] < size - 2 || (records[i][0] == size - 2) && records[i][1] > recTime) {
                records[i][1] = truncated(recTime, 2);
                records[i][0] = size - 2;
            }
        }
    }
    if (!Inserted) {
        records.push([size - 2, truncated(recTime, 2), username]);
    }
}

// сгенерировать игровые ячейки
function createCells(color, colArr, color) {
    var cells = [];
    var Xi = Math.floor(Math.random() * (size));
    var Xj = Math.floor(Math.random() * (size));

    for (var i = 0; i < size; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < size; j++) {
            var td = document.createElement('td');
            td.style.backgroundColor = color;
            if (i == Xi && j == Xj)
                td.style.backgroundColor = rgbToHex(Math.abs(colArr[0] - dif), Math.abs(colArr[1] - dif), Math.abs(colArr[2] - dif));

            tr.appendChild(td);
            cells.push(td);
        }
        table.appendChild(tr);
    }
    return cells;
}

// число в hex
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// RGB в HEX
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// получить случайный набор RGB
function randColor() {
    var r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256));
    return [r, g, b];
}

//Эта функция запускает таймер
function start() {
    window.timerId = window.setInterval(timer, 100);
}
//Эта функция останавливает таймер
function stop() {
    window.clearInterval(window.timerId);
}

//Эта функция меняет value для инпута
function timer() {
    time = truncated(time - 0.1, 1);
    if (time <= 0)
        restart();
    else
        timeCounter.innerHTML = time;
}

// округлить вещественное число
function truncated(num, decimalPlaces) {
    var numPowerConverter = Math.pow(10, decimalPlaces);
    return ~~(num * numPowerConverter) / numPowerConverter;
}