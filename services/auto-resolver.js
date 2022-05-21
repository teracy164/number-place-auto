const check = require('./check');
const logger = require('./logger');

/** オブジェクトのディープコピー */
const deepCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

/** 盤面のシャローコピー */
const copyInputs = function (srcInputs, dstInputs) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            dstInputs[r][c] = srcInputs[r][c];
        }
    }
}

/**
 *  候補が一番少ないマスに数値を配置 */
/**
 * 解答
 * @param {number[][]} inputs 
 * @param {boolean[][][]} candidate 
 * @param {number} nest 無限再帰回避用
 * @returns {boolean} true:解答成功, false:解答失敗
 */
const resolve = function (inputs, candidate, nest = 0) {
    // 無限再帰回避用
    if (nest > 10000) throw new Error("over limit.");

    // 候補が最小のマスを探索
    const cand = { row: -1, col: -1, num: 999 };
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            // 入力済みのマスの場合は飛ばす
            if (inputs[r][c]) continue;

            // 入力候補の数を算出
            const count = candidate[r][c].filter(candidate => candidate).length;

            if (count === 1) {
                // 候補が1つしかないマスは確定
                cand.row = r;
                cand.col = c;
                cand.num = count;
                break;
            } else if (count < cand.num) {
                // 入力候補を更新
                cand.row = r;
                cand.col = c;
                cand.num = count;
            } else if (count === 0) {
                // 入力してないのに入力候補が0個となるのは誤った入力がある場合
                throw new Error("not resolve.");
            }
        }

        // 確定している場合は抜ける
        if (cand.num === 1) break;
    }

    if (cand.row < 0 || cand.col < 0) {
        throw new Error("not resolve.");
    }

    const tmpValues = [];
    for (let i = 0; i < candidate[cand.row][cand.col].length; i++) {
        if (candidate[cand.row][cand.col][i]) {
            tmpValues.push(i + 1);
        }
    }

    // 候補を1つずつ試す
    for (const tmpValue of tmpValues) {
        // 仮置きした状態の盤面を別途作成し、さらに続きを進めていく
        const tmpInputs = deepCopy(inputs);
        const tmpCandidate = deepCopy(candidate);
        try {
            // 入力候補を仮置き
            put(cand.row, cand.col, tmpValue, tmpInputs, tmpCandidate);
            // クリア判定
            const errors = check(tmpInputs);
            // クリアできてない場合はさらに仮置きの状態で進める
            const result = errors.length === 0 ? true : resolve(tmpInputs, tmpCandidate, nest + 1);
            if (result) {
                // 進めていって解答できた場合は終了
                copyInputs(tmpInputs, inputs);
                return true;
            }
        } catch (err) {
            // 次の候補
        }
    }

    return false;
}

/** 数値を配置し、候補を更新 */
const put = function (row, col, value, inputs, candidate) {
    // 値を配置
    inputs[row][col] = value;

    // 配置位置を基準に入力候補を更新
    const cIndex = value - 1;
    // 対象行から候補を削除
    for (let i = 0; i < 9; i++) candidate[row][i][cIndex] = false;
    // 対象列から候補を削除
    for (let i = 0; i < 9; i++) candidate[i][col][cIndex] = false;
    // 対象ブロックから候補を削除
    const block = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    for (let i = 0; i < 9; i++) {
        const tmpRow = Math.floor(block / 3) * 3 + Math.floor(i / 3);
        const tmpCol = (block % 3) * 3 + i % 3;
        candidate[tmpRow][tmpCol][cIndex] = false;
    }
}

/** 入力候補情報を作成 */
const createCandidate = function (inputs) {
    const candidate = [];

    // 全マスに1～9まで入力候補として初期化
    // 3次元配列で各マスごとに1～9までをbooleanで保持（trueの場合は入力候補）
    for (let r = 0; r < 9; r++) {
        const cols = [];
        for (let c = 0; c < 9; c++) {
            const colCandidates = [];
            // 入力済みのマスは入力候補なしとする
            const value = inputs[r][c] ? false : true;
            for (let i = 0; i < 9; i++) colCandidates.push(value);
            cols.push(colCandidates);
        }
        candidate.push(cols);
    }

    // 入力された値から入力候補を削っていく
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (inputs[r][c]) {
                put(r, c, inputs[r][c], inputs, candidate);
            }
        }
    }

    return candidate;
}

/**
 * 自動解答プログラム
 * @param {number[][]} inputs 
 * @returns {number[][]} 自動解答後の盤面
 * @throws 解答がない場合
 */
module.exports = function (inputs) {
    // 最初に重複がないかチェック（未入力チェックは除外）
    const errors = check(inputs);
    if (errors.length === 0) {
        // クリアできている
        return inputs;
    } else {
        const notEmptyErrors = errors.filter(e => e.type !== 'empty');
        if (notEmptyErrors.length) {
            // 未入力以外のエラーが存在する場合は入力値に誤りがあるため、解答しない
            console.warn(errors);
            throw new Error('invalid input.');
        }
    }

    const tmpInputs = deepCopy(inputs);
    const candidate = createCandidate(inputs);

    console.log('resolve start.')
    logger.inputs(inputs);
    const result = resolve(tmpInputs, candidate);
    console.log('resolve end.')
    if (result) {
        console.log('*****clear*****');
        logger.inputs(tmpInputs);
        return tmpInputs;
    } else {
        throw new Error('not resolve');
    }
};