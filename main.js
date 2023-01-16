// Setting Up Variables
let countOfAsks = document.querySelector("div.count span");
let mainTitle = document.querySelector("strong.answer");
let counter = 0;
let button = document.querySelector("button");
let ul = document.querySelector("ul");
let answersArea = document.querySelector(".answer-area");
let counting = document.querySelector(".counter");
let correctAnswer = 0;
let countdown;

server();

// countDown
let countDown = function (min, sec) {
  fetch("./questions.json")
    .then((res) => res.json())
    .then((re) => {
      let countD = setInterval(() => {
        sec < 10
          ? (counting.innerHTML = `0${min}:0${sec}`)
          : (counting.innerHTML = `0${min}:0${sec}`);

        if (--sec === -1) {
          clearInterval(countD);
          button.click();
          if (counter < re.length) {
            countDown(0, 5);
          }
          if (counter == re.length) {
            clearInterval(countD);
          }
        }
      }, 1000);
    });
};

// Server
function server() {
  counter++;
  if (counter < 7) {
    fetch("./questions.json")
      .then((res) => res.json())
      .then((re) => creating(re[counter], re));

    document.forms[0].innerHTML = "";
    mainTitle.innerHTML = "";
  } else {
    corrects();
    document.forms[0].innerHTML = "";
    ul.remove();
    answersArea.remove();
    document.forms[0].remove();
  }
}

// creating Answers
function creating(re, len) {
  if (counter < 7) {
    countOfAsks.textContent = len.length;
    mainTitle.textContent = re.title;
    for (let i = 1; i <= 4; i++) {
      let inp = document.createElement("input");
      let mainDiv = document.createElement("div");
      let label = document.createElement("label");
      let text = document.createTextNode(`${re[`answer${i}`]}`);
      let correct = document.createElement("span");

      document.forms[0].appendChild(mainDiv);
      mainDiv.appendChild(inp);
      mainDiv.appendChild(label);
      label.appendChild(text);
      mainDiv.appendChild(correct);

      inp.type = "radio";
      inp.name = "answer";
      inp.id = `answer${i}`;
      inp.dataset.answer = `${re[`answer${i}`]}`;
      correct.dataset.answer = `${re[`correct`]}`;
      label.htmlFor = `answer${i}`;
      if (i == 1) {
        inp.checked = true;
      }

      let inputs = document.querySelectorAll("input");
      btn(inputs, correct);
    }
    bullets(len);
  }
}

// bullets
function bullets(len) {
  let ul = document.getElementsByTagName("ul")[0];
  for (let j = 0; j < len.length; j++) {
    let li = document.createElement("li");
    ul.appendChild(li);
  }
  if (ul.childElementCount > len.length) {
    ul.innerHTML = "";
    for (let j = 1; j < len.length; j++) {
      let li = document.createElement("li");
      ul.appendChild(li);
    }
  }
  let lis = Array.from(ul.children);
  lis.forEach((li, index) => {
    if (counter - 1 == index) {
      li.classList.add("active");
    } else if (counter > index) {
      li.classList.add("active");
    }
  });
}

countDown(0, 5);

// btn submit
function btn(inputs, correct) {
  button.onclick = () => {
    inputs.forEach((inp) => {
      if (inp.checked) {
        if (inp.dataset.answer == correct.dataset.answer) {
          server();
          correctAnswer++;
        } else {
          server();
        }
      }
    });
  };
}

// corrects
function corrects() {
  fetch("./questions.json")
    .then((res) => res.json())
    .then((re) => {
      let div = document.createElement("div");
      let textDiv = document.createTextNode(
        `Your Perfect The Result Is ${correctAnswer + 1} of ${re.length}`
      );
      if (correctAnswer === re.length - 1) {
        document.body.appendChild(div);
        div.appendChild(textDiv);
      } else if (correctAnswer < re.length - 1) {
        let textDiv2 = document.createTextNode(
          `Your Good the Result Is ${correctAnswer + 1} of ${re.length}`
        );
        div.appendChild(textDiv2);
        document.body.appendChild(div);
      } else {
        let textDiv3 = document.createTextNode(
          `Your Bad the Result Is ${correctAnswer + 1} of ${re.length}`
        );
        div.appendChild(textDiv3);
        document.body.appendChild(div);
      }
    });
}
