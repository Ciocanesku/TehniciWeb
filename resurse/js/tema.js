let tema=localStorage.getItem("tema")
    if(tema)
    document.body.classList.add("dark");
   

window.addEventListener("DOMContentLoaded", function(){  //IN LOC DE LOAD "DOMContentLoaded" pt a scapa de delay tema la refresh
       document.getElementById("tema").onclick=function(){     
        if(document.body.classList.contains("dark"))
        {
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        }
        else{
            document.body.classList.toggle("dark");
            localStorage.setItem("tema","dark");
        }
    }
        
    }
)
