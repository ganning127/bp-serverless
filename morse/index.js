const morse = require("morse-code-converter");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let plaintext = req.query.plaintext;

    if (typeof plaintext === 'undefined') {
        context.res = {
            body: "Please enter some text to convert."
        }
        return;
    }
    const code = morse.textToMorse(plaintext);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: code
    };
}