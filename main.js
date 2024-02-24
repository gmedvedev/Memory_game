(() => {
  let counter = 0;
  let compList = [];
  let gameOver = false;

  const timer = document.getElementById("timer");
  const backBtn = document.getElementById("back-btn");
  const setMenu = document.getElementById("set-menu");

  // функция, генерирующая массив парных чисел
  function createPairArray(numOfPairs = 8) {
    let pairArr = [];
    for (let i = 1; i <= numOfPairs; i++) {
      pairArr.push(i);
      pairArr.push(i);
    }
    return pairArr;
  }

  // функция, перемешивающая массив
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  //функция, создающая карточку игры
  function createCard(list, cardFill, cardId, victoryList) {
    const li = document.createElement("li");
    const card = document.createElement("button");

    li.classList.add("card-wrap");
    card.classList.add("card");
    card.textContent = cardFill;

    card.setAttribute("id", cardId);
    li.append(card);
    list.append(li);

    card.addEventListener("click", () => {
      card.classList.add("card-open");
      card.toggleAttribute("disabled");

      if (compList.value != [] && compList[0] !== card.getAttribute("id")) {
        compList.push(card.getAttribute("id"));
        counter++;
      }

      if (counter === 2) {
        compareCards(compList, victoryList);
      }
    });
    return { card, victoryList };
  }

  // функция, создающее сообщение в конце игры
  function endGameMessage(gameOver) {
    const span = document.createElement("span");
    const text = document.createElement("p");
    const link = document.createElement("a");
    const btn = document.createElement("button");
    if (gameOver) {
      text.classList.add("lose");
      text.textContent = "Время вышло :(";
    } else {
      text.classList.add("win");
      text.textContent = "Вы победили!";
    }
    btn.classList.add("back-btn", "btn-reset", "end-btn");
    btn.textContent = "Играть еще раз";
    span.classList.add("message");

    link.append(btn);
    link.setAttribute("href", "index.html");
    span.append(text, link);
    document.getElementById("card-game").append(span);
    document.getElementsByClassName("card-list")[0].remove();
    backBtn.classList.toggle("hidden");
  }

  //функция, сравнения двух карт
  function compareCards(list, victoryList) {
    const cardA = document.getElementById(list[0]);
    const cardB = document.getElementById(list[1]);

    const valueA = cardA.textContent;
    const valueB = cardB.textContent;
    if (valueA === valueB) {
      cardA.classList.add("card-has-pair");
      cardB.classList.add("card-has-pair");
      let delEl = victoryList.indexOf(Number(valueA));
      victoryList.splice(delEl, 1);
      delEl = victoryList.indexOf(Number(valueA));
      victoryList.splice(delEl, 1);
      if (victoryList.length === 0) {
        endGameMessage(gameOver);
        clearInterval(start);
      }
    } else {
      setTimeout(function () {
        cardA.classList.remove("card-open");
        cardA.toggleAttribute("disabled");
        cardB.classList.remove("card-open");
        cardB.toggleAttribute("disabled");
      }, 500);
    }
    counter = 0;
    compList = [];
    return { victoryList };
  }

  //функция запуска таймера
  function startTimer(minutes, seconds) {
    let minute = minutes;
    let sec = seconds;
    let displaySec = sec;
    let displayMinute = minute;

    if (sec < 10) {
      displaySec = "0" + sec;
    }
    if (minute < 10) {
      displayMinute = "0" + minute;
    }

    timer.innerHTML = displayMinute + " : " + displaySec;
    if (minute === 0 && sec === 0) {
      gameOver = true;
    }

    if (sec === 0) {
      --minute;
      sec = 60;
    }
    --sec;

    start = setInterval(function () {
      let displaySec = sec;
      let displayMinute = minute;
      if (sec < 10) {
        displaySec = "0" + sec;
      }
      if (minute < 10) {
        displayMinute = "0" + minute;
      }

      timer.innerHTML = displayMinute + " : " + displaySec;
      if (minute === 0 && sec === 0) {
        gameOver = true;
      }

      if (sec === 0) {
        --minute;
        sec = 60;
      }
      --sec;

      if (gameOver) {
        endGameMessage(gameOver);
        clearInterval(start);
      }
    }, 1000);
  }

  // Функция, записывающая значения инпута в хранилище
  function setInput(inputId) {
    const input = document.getElementById(inputId);
    sessionStorage.setItem(inputId, JSON.stringify(input.value));
  }

  // Настройки поля при первом запуске
  if (sessionStorage.getItem("size") === null) {
    sessionStorage.setItem("size", "4");
    sessionStorage.setItem("timerMin", "1");
    sessionStorage.setItem("timerSec", "0");
  }

  // событие открытия меню настроек
  const setBtn = document.getElementById("set-link");
  setBtn.addEventListener("click", () => {
    setMenu.classList.toggle("settings-menu_active");
    document.getElementById("size").value = JSON.parse(
      sessionStorage.getItem("size")
    );
    document.getElementById("timerMin").value = JSON.parse(
      sessionStorage.getItem("timerMin")
    );
    document.getElementById("timerSec").value = JSON.parse(
      sessionStorage.getItem("timerSec")
    );
  });

  function createStartButton(container) {
    let form = document.getElementById("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setMenu.classList.toggle("settings-menu_active");
      if (
        document.getElementById("size").value < 2 ||
        document.getElementById("size").value > 10 ||
        document.getElementById("size").value % 2 != 0
      ) {
        sessionStorage.setItem("size", "4");
        sessionStorage.setItem("timerMin", "1");
        sessionStorage.setItem("timerSec", "0");
      } else {
        setInput("size");
        setInput("timerMin");
        setInput("timerSec");
      }
    });

    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    buttonWrapper.classList.add("btn-wrap");
    button.classList.add("start-btn", "btn-reset");
    button.textContent = "Начать игру";

    buttonWrapper.append(button);
    container.append(buttonWrapper);

    button.addEventListener("click", () => {
      buttonWrapper.remove();
      backBtn.classList.toggle("hidden");
      timer.classList.toggle("hidden");
      if (setMenu.classList.contains("settings-menu_active")) {
        setMenu.classList.toggle("settings-menu_active");
      }
      document.getElementById("set-link").toggleAttribute("disabled");

      const minutes = JSON.parse(sessionStorage.getItem("timerMin"));
      const seconds = JSON.parse(sessionStorage.getItem("timerSec"));
      const size = JSON.parse(sessionStorage.getItem("size"));
      const numOfPairs = size ** 2 / 2;
      const arr = shuffle(createPairArray(numOfPairs));
      const ul = document.createElement("ul");

      let victoryList = arr.slice(0);

      document.documentElement.style.setProperty("--size", size);

      ul.classList.add("card-list", "list-reset", "flex");
      container.append(ul);

      for (let i = 0; i <= arr.length - 1; i++) {
        createCard(ul, arr[i], i, victoryList);
      }

      startTimer(minutes, seconds);
    });
  }
  3;

  window.createStartButton = createStartButton;
})();
