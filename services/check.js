/**
 * @typedef {Object} Error
 * @property {number} row 行
 * @property {number} col 列
 * @property {string} message エラー内容
 * @property {"empty"|"row"|"col"|"block"} type エラー種別
 */

/**
 * 未入力マスのチェック
 * @param {number[][]} inputs
 * @returns {Error[]} 
 */
const checkEmpty = function (inputs) {
  const errors = [];
  for (let row = 0; row < inputs.length; row++) {
    for (let col = 0; col < inputs[row].length; col++) {
      if (!inputs[row][col]) {
        errors.push({ row: row + 1, col: col + 1, message: '入力されてません', type: 'empty' });
      }
    }
  }
  return errors;
}

/**
 * 行方向の重複チェック
 * @param {number[][]} inputs
 * @returns {Error[]} 
 */
const checkDuplicateRow = function (inputs) {
  const errors = [];
  // 行単位で数字の重複がないかチェック
  for (let row = 0; row < inputs.length; row++) {
    for (let col = 0; col < inputs[row].length; col++) {
      if (inputs[row][col]) {
        for (let i = 0; i < inputs[row].length; i++) {
          if (i !== col && inputs[row][col] === inputs[row][i]) {
            errors.push({ row: row + 1, col: col + 1, message: '行で重複しています', type: 'row' });
          }
        }
      }
    }
  }
  return errors;
}

/**
 * 列方向の重複チェック
 * @param {number[][]} inputs
 * @returns {Error[]} 
 */
const checkDuplicateCol = function (inputs) {
  const errors = [];
  // 列単位で数字の重複がないかチェック
  for (let col = 0; col < inputs[0].length; col++) {
    for (let row = 0; row < inputs.length; row++) {
      if (inputs[row][col]) {
        for (let i = 0; i < inputs[row].length; i++) {
          if (i !== row && inputs[row][col] === inputs[i][col]) {
            errors.push({ row: row + 1, col: col + 1, message: '列で重複しています', type: 'col' });
          }
        }
      }
    }
  }
  return errors;
}

/**
 * 3x3マス内の重複チェック
 * @param {number[][]} inputs
 * @returns {Error[]} 
 */
const checkDuplicateBlock = function (inputs) {
  const errors = [];
  // 3x3マス単位で数字の重複がないかチェック
  const blockCellNum = 3;
  for (let block = 0; block < 9; block++) {
    const baseRow = Math.floor(block / blockCellNum) * blockCellNum;
    const baseCol = (block % blockCellNum) * blockCellNum;
    for (let row = baseRow; row < baseRow + blockCellNum; row++) {
      for (let col = baseCol; col < baseCol + blockCellNum; col++) {
        if (inputs[row][col]) {
          for (let i = 0; i < blockCellNum * blockCellNum; i++) {
            const r = baseRow + Math.floor(i / blockCellNum);
            const c = baseCol + (i % blockCellNum);
            if ((row !== r && col !== c) && inputs[row][col] === inputs[r][c]) {
              errors.push({ row: row + 1, col: col + 1, message: 'ブロック内で重複しています', type: 'block' });
            }
          }
        }
      }
    }
  }
  return errors;
}


/**
 * 判定処理
 * @param {number[][]} inputs 
 * @returns {Error[]} エラー内容（エラーなしの場合は空配列を返却）
 */
module.exports = function (inputs, options = { check: { empty: true, row: true, col: true, block: true } }) {
  const errors = [];

  if (options?.check?.empty !== false) {
    // 未入力チェック
    errors.push(...checkEmpty(inputs));
  }
  if (options?.check?.row !== false) {
    // 行方向の重複チェック
    errors.push(...checkDuplicateRow(inputs));
  }
  if (options?.check?.col !== false) {
    // 列方向の重複チェック
    errors.push(...checkDuplicateCol(inputs));
  }
  if (options?.check?.block !== false) {
    // 3x3マス内の重複チェック
    errors.push(...checkDuplicateBlock(inputs));
  }

  return errors;
}