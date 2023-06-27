/**
 * Clasa de baza pentru un rol.
 */
class Rol {
    /**
     * Returneaza tipul de rol.
     * @returns {string} - Tipul de rol.
     */
    static get tip() {
      return "generic";
    }
  
    /**
     * Returneaza drepturile asociate rolului.
     * @returns {Array} - Drepturile asociate rolului.
     */
    static get drepturi() {
      return [];
    }
  
    /**
     * Constructorul clasei Rol.
     */
    constructor() {
      this.cod = this.constructor.tip;
    }
  
    /**
     * Verifica daca rolul are un drept specificat.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} - `true` daca rolul are dreptul specificat, `false` in caz contrar.
     */
    areDreptul(drept) {
      return this.constructor.drepturi.includes(drept);
    }
  }
  
  /**
   * Clasa pentru rolul de admin.
   * Extinde clasa Rol.
   */
  class RolAdmin extends Rol {
    /**
     * Returneaza tipul de rol.
     * @returns {string} - Tipul de rol (admin).
     */
    static get tip() {
      return "admin";
    }
  
    /**
     * Constructorul clasei RolAdmin.
     * Apeleaza constructorul parinte.
     */
    constructor() {
      super();
    }
  
    /**
     * Verifica daca rolul are un drept specificat.
     * @returns {boolean} - `true` pentru orice drept (deoarece este admin).
     */
    areDreptul() {
      return true;
    }
  }
  
  /**
   * Clasa pentru rolul de moderator.
   * Extinde clasa Rol.
   */
  class RolModerator extends Rol {
    /**
     * Returneaza tipul de rol.
     * @returns {string} - Tipul de rol (moderator).
     */
    static get tip() {
      return "moderator";
    }
  
    /**
     * Returneaza drepturile asociate rolului de moderator.
     * @returns {Array} - Drepturile asociate rolului de moderator.
     */
    static get drepturi() {
      return [Drepturi.vizualizareUtilizatori, Drepturi.stergereUtilizatori];
    }
  
    /**
     * Constructorul clasei RolModerator.
     * Apeleaza constructorul parinte.
     */
    constructor() {
      super();
    }
  }
  
  /**
   * Clasa pentru rolul de client.
   * Extinde clasa Rol.
   */
  class RolClient extends Rol {
    /**
     * Returneaza tipul de rol.
     * @returns {string} - Tipul de rol (comun).
     */
    static get tip() {
      return "comun";
    }
  
    /**
     * Returneaza drepturile asociate rolului de client.
     * @returns {Array} - Drepturile asociate rolului de client.
     */
    static get drepturi() {
      return [Drepturi.cumparareProduse];
    }
  
    /**
     * Constructorul clasei RolClient.
     * Apeleaza constructorul parinte.
     */
    constructor() {
      super();
    }
  }
  
  /**
   * Clasa factory pentru crearea de roluri.
   */
  class RolFactory {
    /**
     * Creeaza un obiect de tipul specificat.
     * @param {string} tip - Tipul de rol.
     * @returns {Rol} - Obiectul de tipul specificat.
     */
    static creeazaRol(tip) {
      switch (tip) {
        case RolAdmin.tip:
          return new RolAdmin();
        case RolModerator.tip:
          return new RolModerator();
        case RolClient.tip:
          return new RolClient();
      }
    }
  }
  
  module.exports = {
    RolFactory: RolFactory,
    RolAdmin: RolAdmin
  };