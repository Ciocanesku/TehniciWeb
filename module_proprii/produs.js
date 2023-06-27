/**
 * Clasa pentru un produs.
 */
class Produs {
    /**
     * Constructorul clasei Produs.
     * @param {Object} parametri - Parametrii produsului.
     * @param {number} parametri.id - ID-ul produsului.
     * @param {string} parametri.nume - Numele produsului.
     * @param {string} parametri.descriere - Descrierea produsului.
     * @param {number} parametri.pret - Pretul produsului.
     * @param {number} parametri.gramaj - Gramajul produsului.
     * @param {string} parametri.tip_produs - Tipul produsului.
     * @param {number} parametri.calorii - Numarul de calorii al produsului.
     * @param {string} parametri.categorie - Categorie produsului.
     * @param {string} parametri.ingrediente - Ingrediente ale produsului.
     * @param {boolean} parametri.pt_diabetici - Indica daca produsul este destinat diabeticilor.
     * @param {string} parametri.imagine - Calea catre imaginea produsului.
     * @param {Date} parametri.data_adaugare - Data adaugarii produsului.
     */
    constructor({
      id,
      nume,
      descriere,
      pret,
      gramaj,
      tip_produs,
      calorii,
      categorie,
      ingrediente,
      pt_diabetici,
      imagine,
      data_adaugare
    } = {}) {
      for (let prop in arguments[0]) {
        this[prop] = arguments[0][prop];
      }
    }
  }
  
  module.exports = Produs;