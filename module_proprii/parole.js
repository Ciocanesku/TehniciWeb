/**
 * Variabilă globală pentru a stoca caracterele alfanumerice.
 * Include caracterele de la '0' la '9', literele mari de la 'A' la 'Z' și literele mici de la 'a' la 'z'.
 * Utilizată pentru generarea de token-uri.
 * @type {string}
 */
let sirAlphaNum = "";

/**
 * Array-ul de intervale pentru caracterele alfanumerice.
 * Intervalul [48, 57] corespunde cifrelor (0-9).
 * Intervalul [65, 90] corespunde literelor mari (A-Z).
 * Intervalul [97, 122] corespunde literelor mici (a-z).
 * @type {Array<Array<number>>}
 */
const v_intervale = [[48, 57], [65, 90], [97, 122]];

// Construirea sirului alfanumeric
for (let interval of v_intervale) {
  for (let i = interval[0]; i <= interval[1]; i++) {
    sirAlphaNum += String.fromCharCode(i);
  }
}

console.log(sirAlphaNum);

/**
 * Generează un token alfanumeric aleator cu lungimea specificată.
 * @param {number} n - Lungimea token-ului generat.
 * @returns {string} - Token-ul generat.
 */
function genereazaToken(n) {
  let token = "";
  for (let i = 0; i < n; i++) {
    token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
  }
  return token;
}

module.exports.genereazaToken = genereazaToken;