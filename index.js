const express = require("express");
const fs = require("fs");
const obj = require("./obj");
const app = express();

app.listen(4444, () => {
  console.log("server run in http://127.0.0.1:4444");
});
app.use(express.json());
app.get("/", async (req, res) => {
  const text = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js"></script>
    <style>
      .square {
        border: 1px solid darkgray;
        height: 75px;
        width: 75px;
        background-color: white;
        font-size: 48px;
        text-align: center;
        color: cadetblue;
        float: left;
      }

      .row::after {
        content: "";
        clear: both;
        display: table;
      }

      .row:first-child .square {
        border-top: 0;
      }

      .row:nth-child(3) .square {
        border-bottom: 0;
      }

      .square:first-child {
        border-left: 0;
      }

      .square:nth-child(3) {
        border-right: 0;
      }
    </style>
    <title>Document</title>
    <script src="https://requirejs.org/docs/release/2.3.5/minified/require.js"></script>
    </head>
    <body>
    <h1 id="winner"></h1>
    <div>
      <div class="row">
        <button class="square" id="num0" onClick="handle('num0')"></button>
        <button class="square" id="num1" onClick="handle('num1')"></button>
        <button class="square" id="num2" onClick="handle('num2')"></button>
      </div>
      <div class="row">
      <button class="square" id="num3" onClick="handle('num3')"></button>
        <button class="square" id="num4" onClick="handle('num4')"></button>
        <button class="square" id="num5" onClick="handle('num5')"></button>
      </div>
      <div class="row">
        <button class="square" id="num6" onClick="handle('num6')"></button>
        <button class="square" id="num7" onClick="handle('num7')"></button>
        <button class="square" id="num8" onClick="handle('num8')"></button>
      </div>
      <button onclick="handleReset()">Reset</button>
      </div>
      <script>
      const obj = ${JSON.stringify(obj)}
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const id = document.getElementById(key);
          if (id) {
            id.innerText = obj[key];
          }
        }
      }
      const handle = (num) => {
        axios.put('/', {
          num
        })    
        if (obj.user === "1") {
          obj[num] = "O";
          obj.user = "2";
        } else if (obj.user === "2") {
          obj[num] = "X";
          obj.user = "1";
        }
        const id = document.getElementById(num);
        id.innerText = obj[num];
        const win = calculateWinner(obj);
        if (win) {
          obj.winner = win;
          const winner = document.getElementById("winner");
          winner.innerText = obj.winner;
        }
        console.table(obj);
      };
      const calculateWinner = (obj) => {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8], // rows
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8], // columns
          [0, 4, 8],
          [2, 4, 6], // diagonals
        ];
  
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
  
          if (
            obj["num" + a] &&
            obj["num" + a] === obj["num" + b] &&
            obj["num" + a] === obj["num" + c]
          ) {
            return "Winner is " + obj["num" + a];
          }
        }
  
        return null;
      };
      const handleReset = () => {
        axios.delete("/");
      };
      setTimeout(()=>{
        location.reload();
      },3000)
      </script>
      </body>
</html>
`;
  res.send(text);
});

app.put("/", async (req, res) => {
  console.log(req.body);
  const { num } = req.body;
  if (obj[num] || obj.winner) {
    return;
  }
  if (obj.user === "1") {
    obj[num] = "O";
    obj.user = "2";
  } else if (obj.user === "2") {
    obj[num] = "X";
    obj.user = "1";
  }
  const calculateWinner = (obj) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (
        obj["num" + a] &&
        obj["num" + a] === obj["num" + b] &&
        obj["num" + a] === obj["num" + c]
      ) {
        return "Winner is " + obj["num" + a];
      }
    }

    return null;
  };
  const win = calculateWinner(obj);
  if (win) {
    obj.winner = win;
  }
  console.log(obj);
});
app.delete("/", async (req, res) => {
  fs.writeFile('obj.js', `let obj = {
    user: "1",
    num0: null,
    num1: null,
    num2: null,
    num3: null,
    num4: null,
    num5: null,
    num6: null,
    num7: null,
    num8: null,
    winner: null,
  };
  // exports  obj ;
  module.exports = obj;
  `, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
