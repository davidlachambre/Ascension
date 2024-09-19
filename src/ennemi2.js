var Ennemi2 = (function() {
    //Constructeur
    var Ennemi2 = function(jeu) {//Constructeur...
        //Fonction qui détermine la position en Y de l'ennemi généré de façon semi-alléatoire (2 options possibles).

        var grosseurEnnemi = function () {//Pour changer la grosseur de chaque nuage lors de la création.
            var chiffreRandom = Math.abs(Math.random() - 0.5) + 0.5;//Grosseur random entre 0.5 et 1.
            var calculGrosseur = {x: chiffreRandom * jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.x, y: chiffreRandom * jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.y}
            return calculGrosseur;
        }
        var grosseurNuage = grosseurEnnemi();
        var calculDoublageNuage = function() {//La durée entre la création d'un premier et deuxième nuage de façon très rapproché. Utilisé dans le jouer.js.
            var resultat = (Math.random() + 1) * 500;
            if (resultat < 500) {
                resultat = 500;
            }
            return resultat;
        }
        Phaser.Sprite.call(this, jeu, jeu.camera.x + jeu.camera.width + jeu.decalageEnnemi,  (-jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.hauteurSprite * grosseurNuage.y) / 3, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.image);//Création du sprite de l'ennemi.
        
        this.scale = new Phaser.Point(grosseurNuage.x, grosseurNuage.y);//Grosseur de l'ennemi.
        
        this.nouveauProjectile = true;//Demande un nouveau projectile à la création.
        
        this.son = jeu.add.audio(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.son);//Son de l'éclair.
        this.son.volume = 0.7;//Volume du son de l'éclair.
        
        jeu.groupeEclairs = jeu.add.physicsGroup();
        
        //Création d'un pool de projectiles.
        for(var i=0; i<4; i++) {
            
            var eclair = new Eclair (jeu, 0, 0);//Nouvel éclair.
            jeu.groupeEclairs.add(eclair);//Éclair ajouté au groupe.
            eclair.kill();
        }
        
        this.jeu = jeu;
	}
    
	Ennemi2.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype de l'ennemi.
	Ennemi2.prototype.constructor = Ennemi2;//Définition du constructeur à partir de la fonction plus haut.
    
    Ennemi2.prototype.update = function() {
        
        if (this.jeu.niveauActuel != 2 || (this.x + this.width < this.jeu.camera.x && this.jeu.perso.distanceRestante > 0)) {//Si niveau n'est pas 2 OU (ennemi plus loin qu'un décalage derrière le perso ET perso n'a pas franchi la ligne d'arrivée)...
            this.detruire();
        }
        else if (this.nouveauProjectile && this.x < this.jeu.camera.x + this.jeu.camera.width) {//Si un projectile est en banque et que le nuage commence à apparaître à l'écran...
            this.genererProjectile();//Appel de fonction pour générer un nouveau projectile.
        }
    };
    
    //Méthode pour générer un nouveau projectile.
    Ennemi2.prototype.genererProjectile = function() {

        this.nouveauProjectile = false;//Booléen qui contrôle la vitesse de création des ennemis avec le timer.

        this.projectile = this.jeu.groupeEclairs.getFirstDead();//Récupère un projectile "tué".
        if (this.projectile) {//S'il y a un projectile...
            this.projectile.reset(this.x + (this.width / 2), this.y + this.height);//Reset au lieu de revive pour régler un bug de désinchronisation entre les coordonnées du sprite et son body.
            this.projectile.body.velocity.y = this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.vitesse;//Vitesse du projectile.

            this.son.play();//Joue le son.
        }
        this.jeu.time.events.add(this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.tempsCreationEclair2, function() {//Timer pour créer un 2e éclair..
            this.projectile = this.jeu.groupeEclairs.getFirstDead();//Récupère un projectile "tué".

            if (this.projectile) {//S'il y a un projectile...

                this.projectile.reset(this.x + (this.width / 2), this.y + this.height);//Reset au lieu de revive pour régler un bug de désinchronisation entre les coordonnées du sprite et son body.
                this.projectile.body.velocity.y = this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.vitesse;//Vitesse du projectile.
                this.son.play();//Joue le son.
            }

        }, this);

        this.jeu.time.events.add(this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.interval, function() {
            this.nouveauProjectile = true;//Peut à nouveau générer des projectiles après un délai.
        }, this);
    };
    
    Ennemi2.prototype.detruire = function() {//Destruction de l'instance.
        this.destroy();
        
    };
    return Ennemi2;
})();