/**
 * 
 * @param {string} level questionsディレクトリ内のファイル名と一致すること
 * @param {number} questionNum 問題番号（インデックス）
 * @returns {[number[][], number[][]]} 問題、固定マス情報
 */
const getQuestion = function (level, questionNum) {
    const questions = require('../questions/' + level);
    const q = questions[questionNum];

    // 固定マス情報の作成
    const fixed = [];
    for (let row = 0; row < q.length; row++) {
        const cols = [];
        for (let col = 0; col < q[row].length; col++) {
            // 数値がセットされているマスは変更できないように固定
            cols.push(q[row][col] ? true : false);
        }
        fixed.push(cols);
    }
    return [q, fixed];
};

/**
 * 2次元配列変換
 * @param {number[]} inputs 1次元配列
 * @returns {number[][]} 変換後の2次元配列
 */
const to2DArray = function (inputs) {
    const arr = [];
    for (let row = 0; row < 9; row++) {
        const cols = [];
        for (let col = 0; col < 9; col++) {
            const inputValue = inputs[row * 9 + col] || null;
            cols.push(inputValue);
        }
        arr.push(cols);
    }
    return arr;
}

module.exports = {
    getQuestion,
    to2DArray,
};