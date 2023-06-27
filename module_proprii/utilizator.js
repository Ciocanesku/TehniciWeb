const AccesBD = require('./accesbd.js');
const parole = require('./parole.js');

const { RolFactory } = require('./roluri.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Clasa pentru reprezentarea unui utilizator.
 *
 * @typedef {Object} Utilizator
 * @property {number} id - ID-ul utilizatorului.
 * @property {string} username - Numele de utilizator.
 * @property {string} nume - Numele utilizatorului.
 * @property {string} prenume - Prenumele utilizatorului.
 * @property {string} email - Adresa de email a utilizatorului.
 * @property {string} parola - Parola utilizatorului.
 * @property {Rol} rol - Rolul utilizatorului.
 * @property {string} culoare_chat - Culoarea utilizată în chat (implicit "black").
 * @property {string} poza - Calea către poza utilizatorului.
 * @property {function} checkName - Verifică validitatea unui nume.
 * @property {function} setareNume - Setează numele utilizatorului.
 * @property {function} setareUsername - Setează numele de utilizator.
 * @property {function} checkUsername - Verifică validitatea unui nume de utilizator.
 * @property {function} static criptareParola - Criptează parola dată.
 * @property {function} salvareUtilizator - Salvează utilizatorul în baza de date și trimite un email de confirmare.
 * @property {function} trimiteMail - Trimite un email către utilizator.
 * @property {function} static getUtilizDupaUsernameAsync - Obține utilizatorul din baza de date după numele de utilizator (asincron).
 * @property {function} static getUtilizDupaUsername - Obține utilizatorul din baza de date după numele de utilizator.
 * @property {function} areDreptul - Verifică dacă utilizatorul are un drept specificat.
 */
class Utilizator {
  static tipConexiune = "local";
  static tabel = "utilizatori";
  static parolaCriptare = "tehniciweb";
  static emailServer = "proiectwebckn@gmail.com";
  static lungimeCod = 64;
  static numeDomeniu = "localhost:8080";
  #eroare;

  /**
   * Constructor pentru clasa Utilizator.
   * @param {Object} options - Opțiuni pentru inițializarea utilizatorului.
   * @param {number} options.id - ID-ul utilizatorului.
   * @param {string} options.username - Numele de utilizator.
   * @param {string} options.nume - Numele utilizatorului.
   * @param {string} options.prenume - Prenumele utilizatorului.
   * @param {string} options.email - Adresa de email a utilizatorului.
   * @param {string} options.parola - Parola utilizatorului.
   * @param {Rol|string} options.rol - Rolul utilizatorului sau codul rolului.
   * @param {string} [options.culoare_chat="black"] - Culoarea utilizată în chat.
   * @param {string} options.poza - Calea către poza utilizatorului.
   */
  constructor({ id, username, nume, prenume, email, parola, rol, culoare_chat = "black", poza } = {}) {
    this.id = id;

    try {
      if (this.checkUsername(username))
        this.username = username;
    } catch (e) {
      this.#eroare = e.message;
    }

    for (let prop in arguments[0]) {
      this[prop] = arguments[0][prop];
    }

    if (this.rol)
      this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);

    this.#eroare = "";
  }

  /**
   * Verifică validitatea unui nume.
   * @param {string} nume - Numele de verificat.
   * @returns {boolean} - `true` dacă numele este valid, `false` în caz contrar.
   */
  checkName(nume) {
    return nume !== "" && nume.match(new RegExp("^[A-Z][a-z]+$"));
  }

  /**
   * Setează numele utilizatorului.
   * @param {string} nume - Noul nume pentru utilizator.
   * @throws {Error} - Erorare generată în cazul în care numele este greșit.
   */
  set setareNume(nume) {
    if (this.checkName(nume))
      this.nume = nume;
    else {
      throw new Error("Nume gresit");
    }
  }

  /**
   * Setează numele de utilizator.
   * @param {string} username - Noul nume de utilizator.
   * @throws {Error} - Erorare generată în cazul în care numele de utilizator este greșit.
   */
  set setareUsername(username) {
    if (this.checkUsername(username))
      this.username = username;
    else {
      throw new Error("Username gresit");
    }
  }

  /**
   * Verifică validitatea unui nume de utilizator.
   * @param {string} username - Numele de utilizator de verificat.
   * @returns {boolean} - `true` dacă numele de utilizator este valid, `false` în caz contrar.
   */
  checkUsername(username) {
    return username !== "" && username.match(new RegExp("^[A-Za-z0-9#_./]+$"));
  }

  /**
   * Criptează parola dată.
   * @param {string} parola - Parola de criptat.
   * @returns {string} - Parola criptată.
   */
  static criptareParola(parola) {
    return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
  }

  /**
   * Salvează utilizatorul în baza de date și trimite un email de confirmare.
   */
  salvareUtilizator() {
    let parolaCriptata = Utilizator.criptareParola(this.parola);
    let utiliz = this;
    let token = parole.genereazaToken(100);

    AccesBD.getInstanta(Utilizator.tipConexiune).insert({
      tabel: Utilizator.tabel,
      campuri: {
        username: this.username,
        nume: this.nume,
        prenume: this.prenume,
        parola: parolaCriptata,
        email: this.email,
        culoare_chat: this.culoare_chat,
        cod: token,
        poza: this.poza
      }
    }, function (err, rez) {
      if (err)
        console.log(err);

      utiliz.trimiteMail("Bine ai venit în comunitatea CKN Sneakers", "Username-ul tau este " + utiliz.username,
        `<h1>Salut!</h1><p style='color:green; font-weight: bold;'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`
      );
    });
  }

  /**
   * Trimite un email către utilizator.
   * @param {string} subiect - Subiectul emailului.
   * @param {string} mesajText - Mesajul text al emailului.
   * @param {string} mesajHtml - Mesajul HTML al emailului.
   * @param {Array} [atasamente=[]] - Atașamentele emailului.
   */
  async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
    var transp = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: Utilizator.emailServer,
        pass: "cxnbfslqrsazffzs"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transp.sendMail({
      from: Utilizator.emailServer,
      to: this.email,
      subject: subiect,
      text: mesajText,
      html: mesajHtml,
      attachments: atasamente
    });

    console.log("Trimis mail");
  }

  /**
   * Obține utilizatorul din baza de date după numele de utilizator (asincron).
   * @param {string} username - Numele de utilizator.
   * @returns {Promise<Utilizator|null>} - Utilizatorul obținut sau `null` dacă nu a fost găsit.
   */
  static async getUtilizDupaUsernameAsync(username) {
    if (!username) return null;

    try {
      let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
        tabel: "utilizatori",
        campuri: ['*'],
        conditiiAnd: [`username='${username}'`]
      });

      if (rezSelect.rowCount !== 0) {
        return new Utilizator(rezSelect.rows[0]);
      } else {
        console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Obține utilizatorul din baza de date după numele de utilizator.
   * @param {string} username - Numele de utilizator.
   * @param {Object} obparam - Obiectul parametru.
   * @param {function} proceseazaUtiliz - Funcția de procesare a utilizatorului.
   */
  static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
    if (!username) return null;

    AccesBD.getInstanta(Utilizator.tipConexiune).select(
      {
        tabel: "utilizatori",
        campuri: ['*'],
        conditiiAnd: [`username='${username}'`]
      },
      function (err, rezSelect) {
        if (err) {
          console.log(err);
          return null;
        }

        if (rezSelect.rowCount !== 0) {
          proceseazaUtiliz(rezSelect.rows[0], obparam);
        } else {
          console.log("Nu am gasit utilizatorul");
          return null;
        }
      }
    );
  }

  /**
   * Verifică dacă utilizatorul are un drept specificat.
   * @param {string} drept - Dreptul de verificat.
   * @returns {boolean} - `true` dacă utilizatorul are dreptul specificat, `false` în caz contrar.
   */
  areDreptul(drept) {
    return this.rol ? this.rol.areDreptul(drept) : false;
  }
}

module.exports = Utilizator;
