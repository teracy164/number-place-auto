const express = require("express");
const bodyParser = require("body-parser");
const questionService = require("./services/questions");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイル公開用
app.use(express.static('public'));

// 初期表示画面
app.get("/", (req, res) => {
  // 全マスからの状態で表示
  // MEMO:デフォルトで解答のある問題を設定しておく
  const inputs = [
    [1, 7, 4, null, null, 8, 6, null, 5],
    [6, 3, null, null, null, null, 2, null, null],
    [null, 8, null, 1, 9, null, 7, 3, null],
    [null, null, null, 8, null, null, null, null, null],
    [5, null, null, null, 1, null, 8, null, null],
    [null, 6, 3, null, null, 9, 1, 4, null],
    [null, null, 1, 3, 8, null, null, null, 9],
    [null, null, 8, null, null, null, 4, 2, null],
    [null, null, null, null, 5, null, null, 1, null],
  ];
  // for (let row = 0; row < 9; row++) {
  //   const cols = [];
  //   for (let col = 0; col < 9; col++) {
  //     cols.push(null);
  //   }
  //   inputs.push(cols);
  // }

  // 初期データで画面を表示
  res.render("index.ejs", {
    inputs,
    result: "",
    runtime: "",
  });
});

// 解答
app.post("/resolve", (req, res) => {
  const start = new Date().getTime();
  // インプットパラメータの取り出し
  const inputValues = req.body.inputs.map(value => Number(value));

  // 2次元配列に変換
  const inputs = questionService.to2DArray(inputValues);

  let result = '';
  try {
    const resolve = require('./services/auto-resolver');
    const completed = resolve(inputs);
    inputs.splice(0, inputs.length, ...completed);
    result = '解答終了';
  } catch (err) {
    console.error(err);
    result = err.message;
  }

  const end = new Date().getTime();
  const runtime = (end - start) + "ミリ秒";

  // 結果をHTMLに組み込んで返却
  res.render("index.ejs", {
    inputs: inputs,
    result: result,
    runtime: runtime,
  });
});

app.listen(process.env.PORT || 3000);
console.log("listen: http://localhost:3000");
