window.onload = function() {
    var formular = document.getElementById("form_inreg");
    if (formular) {
    formular.onsubmit = function() {
    // Verificare completare câmpuri required
    var nume = document.getElementById("inp-nume").value;
    var prenume = document.getElementById("inp-prenume").value;
    var username = document.getElementById("inp-username").value;
    var parola = document.getElementById("parl").value;
    var rparola = document.getElementById("rparl").value;
    var email = document.getElementById("inp-email").value;
            if (nume === "" || prenume === "" || username === "" || parola === "" || rparola === "" || email === "") {
                alert("Vă rugăm să completați toate câmpurile obligatorii.");
                return false;
            }
    
            // Verificare egalitate parolă și reintroducere parolă
            if (parola !== rparola) {
                alert("Nu ați introdus același șir pentru câmpurile \"parolă\" și \"reintroducere parolă\".");
                return false;
            }
    
            // Verificare nume și prenume cu RegEx
            var numePattern = /^[A-Za-z -]+$/;
            if (!nume.match(numePattern)) {
                alert("Numele poate conține doar litere, spații și linii de despărțire (-).");
                return false;
            }
    
            if (!prenume.match(numePattern)) {
                alert("Prenumele poate conține doar litere, spații și linii de despărțire (-).");
                return false;
            }
    
            // Alte verificări personalizate
    
            // Verificare existență user înregistrat (la server)
            // TODO: Adăugați codul necesar pentru a verifica dacă userul există deja
    
            // Dacă toate verificările sunt valide, se trimite formularul
            return true;
        };
    }
    };