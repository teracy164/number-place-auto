window.onload = function () {
    // 1マスにつき、1文字鹿入力できないように制御
    const inputs = document.getElementsByClassName('cell');
    for (const input of inputs) {
        input.addEventListener('input', event => {
            if (event.target.value.length > 1) {
                event.target.value = event.target.value.substr(0, 1);
            }
        });
    }
};