module.exports.inputs = function (inputs) {
    console.log('=================');
    inputs.forEach(cols => console.log(cols.map(c => c || ' ').join(',')));
    console.log('=================');
};

module.exports.candidate = function (candidate) {
    console.log('=================');
    candidate.forEach(cols => {
        const tmp = cols.map(col => '[' + col.map((candidate, i) => candidate ? (i + 1) : ' ').join(',') + ']');
        console.log(tmp.join(','));
    });
    console.log('=================');

}
