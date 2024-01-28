window.onload = function() {
    
    //Alter berechnen
    function calculateAge() {
    let geburtsdatum = new Date("2003-12-09"); // Ihr Geburtsdatum
    let heute = new Date();
    let alter = heute.getFullYear() - geburtsdatum.getFullYear();
    let m = heute.getMonth() - geburtsdatum.getMonth();
    if (m < 0 || (m === 0 && heute.getDate() < geburtsdatum.getDate())) {
        alter--;
    }
    return alter;
}

    document.getElementById("alter").textContent = " (" + calculateAge() + " Jahre alt)";
    
    
    
    
    //Lightbox für Karten
    const lb = document.getElementById('lightbox')
    
    lb.addEventListener('click', function() {
        this.classList.remove("flexvisible")
    })
    
    const pics = document.getElementsByClassName('KartenFoto')
    
    for ( let i = 0; i < pics.length; i++){
        let pic = pics[i];
        
        pic.addEventListener('click', function(event) {
            event.preventDefault();
            
            lb.firstElementChild.src = this.src;
            
            lb.classList.add("flexvisible")
        })
        
    }
    
    //Hamburger Menü
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")
    
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    })
    
    
    
    
    
    //SchachSpiel Code

    
    let legaleFelder = [];
    let isWhiteTurn = true;
    const brettFelder = document.getElementsByClassName("feld")
    const figuren = document.getElementsByClassName("figur")
    const figurenBilder = document.getElementsByClassName("figurenBild")
    
    brettFelderAufstellen();
    figurenAufstellen();
    
    function brettFelderAufstellen() {
        for (let i = 0; i < brettFelder.length; i++) {
            brettFelder[i].addEventListener("dragover", allowDrop);
            brettFelder[i].addEventListener("drop", drop);
            let row = 8 - Math.floor(i / 8);
            let column = String.fromCharCode(97+(i%8));
            let square = brettFelder[i];
            square.id = column + row;
        }
    }
    
    function figurenAufstellen() {
        for (let i = 0; i < figuren.length; i++) {
            figuren[i].addEventListener("dragstart", drag);
            figuren[i].setAttribute("draggable", true);
            figuren[i].id = figuren[i].className.split(" ")[1]+figuren[i].parentElement.id;
        }
        for (let i = 0 ; i < figurenBilder.length; i++) {
            figurenBilder[i].setAttribute("draggable", false);
        }
    }
    
    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drag(ev) {
        const figur = ev.target;
        const isBlack = figur.classList.contains("black1");
        const isWhite = figur.classList.contains("white1");

        if((isWhiteTurn && isWhite) || (!isWhiteTurn && isBlack)) {
            ev.dataTransfer.setData("text", figur.id);
        }
    }

    function drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        const figur = document.getElementById(data);
        const zielFeld = ev.currentTarget;
        let zielFeldId = zielFeld.id;
        if(istFeldBelegt(zielFeld) === "blank") {
            zielFeld.appendChild(figur);
            isWhiteTurn = !isWhiteTurn;   
            return;
        }
        if(istFeldBelegt(zielFeld) !== "blank") {
            while (zielFeld.firstChild){
                zielFeld.removeChild(zielFeld.firstChild)    
            }
            zielFeld.appendChild(figur);
            isWhiteTurn = !isWhiteTurn;   
            return;
        }
    }
    
    function istFeldBelegt(feld) {
        const figur = feld.querySelector(".figur");
        if(figur) {
            if (figur.classList.contains("black")) {
                return "black";
            } else if (figur.classList.contains("white")) {
                return "white";
            }
        } else {
            return "blank";
        }
    }     
    
    
    //Shooter Game
    
    let backgroundmusic = new Audio('hintergrundmusikshootergame.mp3');
        backgroundmusic.loop = true;
        backgroundmusic.volume = 0.1; // Lautstärke von 0.0 bis 1.0
    
    let schuss = new Audio('schusssound.mp3');
        schuss.loop = false;
        schuss.volume = 0.1;
    
    window.iShoot = function(enemy) {
        enemy.classList.add("dead");
        enemy.src = "dead.png"
        schuss.play();
        
        if(!livingEnemies().length) {
            alert("Game Over! Du hast gewonnen");
            window.location.reload();
        }
        
    }
    
    function enemyAttacksMe(enemy) {
        enemy.classList.add("showing");
        
        setTimeout( ()=> {
            enemyShootsMe(enemy);
        }, 1000)
        
        setTimeout( ()=> {
            enemy.classList.remove("showing");
        },3000)
    }
    
    function enemyShootsMe(enemy) {
        if(!enemy.classList.contains("dead")) {
        enemy.classList.add("shooting");
        enemy.src = "shoot2.png";
        schuss.play();
        updateHealthPoints(healthPoints - 20);
        
        setTimeout( ()=> {
            enemy.classList.remove("shooting");
            enemy.src = "shoot.png"
        }, 200)
            
        }
    }
    
    function livingEnemies() {
        return document.querySelectorAll(".enemy:not(.dead)");
    }
    
    
    function randomEnemyAttacks() {
        let randomEnemyNo = Math.random() * livingEnemies().length;
        randomEnemyNo = Math.floor(randomEnemyNo);
        let enemy = livingEnemies()[randomEnemyNo];
        
        let randomDelay = Math.random() * 2000 + 1000;
        
        setTimeout( ()=> {
            enemyAttacksMe(enemy);
            randomEnemyAttacks();
        }, randomDelay)
    }
    
    let healthPoints = 100;
    
    function updateHealthPoints(points) {
        healthPoints = points;
        let healthBar = document.querySelector("#healthBar");
        
        healthBar.style.width = points + "%";
        
        if(healthPoints < 1) {
            alert("Game Over! Du hast verloren");
            window.location.reload();
        }
    }
    
    window.newGame = function() {
        randomEnemyAttacks();
        document.querySelector("#SpielStarten").style.display = "none";
        backgroundmusic.play();
        
        
    }
    
    
   
}






