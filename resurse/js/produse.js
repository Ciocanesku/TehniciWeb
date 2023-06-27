window.addEventListener("load", function() {
  let iduriProduse=localStorage.getItem("cos_virtual");
  iduriProduse=iduriProduse?iduriProduse.split(","):[];      //["3","1","10","4","2"]

  for(let idp of iduriProduse){
      let ch = document.querySelector(`[value='${idp}'].select-cos`);
      if(ch){
          ch.checked=true;
      }
      else{
          console.log("id cos virtual inexistent:", idp);
      }
  }
  

  //----------- adaugare date in cosul virtual (din localStorage)
  let checkboxuri= document.getElementsByClassName("select-cos");
  for(let ch of checkboxuri){
      ch.onchange=function(){
          let iduriProduse=localStorage.getItem("cos_virtual");
          iduriProduse=iduriProduse?iduriProduse.split(","):[];

          if( this.checked){
              iduriProduse.push(this.value)
          }
          else{
              let poz= iduriProduse.indexOf(this.value);
              if(poz != -1){
                  iduriProduse.splice(poz,1);
              }
          }

          localStorage.setItem("cos_virtual", iduriProduse.join(","))
      }
      
  }


  document.getElementById("inp-pret").onchange=function(){
      document.getElementById("infoRange").innerHTML=`(${this.value})`
  }
  


  document.getElementById("filtrare").onclick= function(){
     FiltreazaProd();
    }
  
  
  document.getElementById("inp-pret").onchange = function() {
      document.getElementById("infoRange").innerHTML = `(${this.value})`;
      FiltreazaProd();
    };

    document.getElementById("checkbox-stoc").onchange = function() {
      FiltreazaProd();
    };
  

    document.getElementById("inp-nume").oninput = function() {
      FiltreazaProd();
    };
  
    var gr_radio = document.getElementsByName("gr_rad");
    for (var i = 0; i < gr_radio.length; i++) {
      gr_radio[i].onchange = function() {
        FiltreazaProd();
      };
    }
  
    document.getElementById("inp-gen_produs").onchange = function() {
      FiltreazaProd();
    };

    document.getElementById("inp-categorie").onchange = function() {
        FiltreazaProd();
    };

    document.getElementById("inp-culori").onchange = function() {
        FiltreazaProd();
    };
  
    function FiltreazaProd() {
      let produseAfisate=0
      var val_nume = document.getElementById("inp-nume").value.toLowerCase();
      var val_greutate;
      var gr_radio = document.getElementsByName("gr_rad");
      for (var i = 0; i < gr_radio.length; i++) {
        if (gr_radio[i].checked) {
          val_greutate = gr_radio[i].value;
          break;
        }
      }
      let checkbox = document.getElementById("checkbox-stoc");
      let bifat = checkbox.checked;
      var val_pret = document.getElementById("inp-pret").value;
      var val_gen = document.getElementById("inp-gen_produs").value;
      var val_categorie = document.getElementById("inp-categorie").value;
      var val_culoare = document.getElementById("inp-culori").value;
      var val_marimi=document.getElementById("inp-marimi");		
      let marimi_selectate= [];
      for (let option of val_marimi.selectedOptions) {
        marimi_selectate.push(option.value);
        console.log(option.value);
    }
      
      var produse = document.getElementsByClassName("produs");
  
      for (var i = 0; i < produse.length; i++) {
        var prod = produse[i];
        prod.style.display = "none";
        var nume = prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
        var cond1 = nume.startsWith(val_nume);
        var cond2 = true;
        if (val_greutate != "toate") {
          var [nra, nrb] = val_greutate.split(":");
          nra = parseInt(nra);
          nrb = parseInt(nrb);
          var greutate = parseInt(prod.getElementsByClassName("val-greutate")[0].innerHTML);
          cond2 = (nra <= greutate && greutate < nrb);
        }
        var pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
        var cond3 = (val_pret <= pret);
        var gen = prod.getElementsByClassName("val-gen")[0].innerHTML;
        var categorie= prod.getElementsByClassName("val-categorie")[0].innerHTML;
        var cond4 = (val_gen == gen || val_gen == "toate");
        var cond5 = (val_categorie==categorie || val_categorie=="toate")
        var culori= prod.getElementsByClassName("val-culori")[0].innerHTML;
        var cond6 = (val_culoare==culori || val_culoare=="toate")
        let prod_stoc = prod.getElementsByClassName("val-stoc")[0].innerHTML === "true";
        let cond7 = !bifat || (bifat && prod_stoc);//testat

        let prod_marimi = prod.getElementsByClassName("val-marimi")[0].innerHTML;

            let prod_marimi_vector = prod_marimi.split(",").map(marimi => marimi.trim());
           
             let cond8 =(marimi_selectate.length == 0 || marimi_selectate.some(marimi => prod_marimi_vector.includes(marimi)));//materiale
           

        if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
          prod.style.display = "block";
          produseAfisate++;
        }

        const filters = {
          val_nume,
          val_greutate,
          val_pret,
          val_categorie,
          val_gen,
          val_marimi,
          prod_stoc,
          val_culoare
      };
      if (getCookie("acceptat_banner"))
          setLastFiltersCookie(filters);
        
      }
      let messageContainer = document.getElementById("message-container");

      if (produseAfisate === 0) {
        if (!messageContainer) {
            messageContainer = document.createElement("div");
            messageContainer.id = "message-container";
            document.getElementById("loc-afișare-produse").appendChild(messageContainer);
        }

        messageContainer.innerHTML = "Nu există produse conform filtrării curente.";
    } else if (messageContainer) {
        messageContainer.remove();
    }
    }
  
    document.getElementById("resetare").onclick = function() {
      document.getElementById("inp-nume").value = "";
      document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
      document.getElementById("inp-gen_produs").value = "toate";
      document.getElementById("i_rad4").checked = true;
      var produse = document.getElementsByClassName("produs");
      for (var i = 0; i < produse.length; i++) {
        produse[i].style.display = "block";
      }
    };
  
    function sorteaza(semn) {
      var produse = document.getElementsByClassName("produs");
      var v_produse = Array.from(produse);
  
      v_produse.sort(function(a, b) {
        var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
        var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
        if (pret_a == pret_b) {
          var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
          var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
          return semn * nume_a.localeCompare(nume_b);
        }
        return (pret_a - pret_b) * semn;
      });
  
      for (var i = 0; i < v_produse.length; i++) {
        v_produse[i].parentNode.appendChild(v_produse[i]);
      }
    }
  
    document.getElementById("sortCrescNume").onclick = function() {
      sorteaza(1);
    };
  
    document.getElementById("sortDescrescNume").onclick = function() {
      sorteaza(-1);
    };
  
    window.onkeydown = function(e) {
      if (e.key == "c" && e.altKey == true) {
        if (document.getElementById("info-suma")) {
          return;
        }
        var produse = document.getElementsByClassName("produs");
        var suma = 0;
        for (var i = 0; i < produse.length; i++) {
          var prod = produse[i];
          if (prod.style.display != "none") {
            var pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            suma += pret;
          }
        }
        var p = document.createElement("p");
        p.innerHTML = suma;
        p.id = "info-suma";
  
        var ps = document.getElementById("p-suma");
        var container = ps.parentNode;
        var frate = ps.nextElementSibling;
        container.insertBefore(p, frate);
        setTimeout(function() {
          var info = document.getElementById("info-suma");
          if (info) info.remove();
        }, 1000);
      }
    };
  });