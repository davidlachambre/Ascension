var Ennemi1 = (function() {
    //Constructeur
    var Ennemi1 = function(jeu) {//Constructeur...
        
        //Fonction qui détermine la position en Y de l'ennemi généré de façon semi-alléatoire (2 options possibles).
        var positionEnnemiY = function () {
            var chiffreRandom = Math.random();//Chiffre random entre 0 et 1.
            if (chiffreRandom < 0.5) {//Si le chiffre random est dans sa moitié inférieure...
                return jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.positionY.yHaut;//Possibilité 1.
            }
            else {//Sinon...
                return jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.positionY.yBas;//Possibilité 2.
            }
        }
        Phaser.Sprite.call(this, jeu, jeu.camera.x + jeu.camera.width + jeu.decalageEnnemi,  positionEnnemiY(), jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.image);//Création du sprite de l'ennemi.
        this.animations.add('animOiseau', Phaser.Animation.generateFrameNames('animOiseau', 0, 15, '', 4), 30, true);//param: (key, (prefix, start, stop, suffix, zeroPad), framerate, loop)
        this.animations.play('animOiseau', 60, true);
        
        this.scale = new Phaser.Point(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.x, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.y);//Grosseur de l'ennemi.
        jeu.physics.enable(this);//Création du body.
        this.body.gravity.y = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.gravite;//Gravité du body.
        this.body.velocity.x = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.vitesse;//Vitesse de l'ennemi.
        this.body.immovable = true;//Pour que les ennemis ne changent pas de vélocité lors d'une collision.        
        
        this.jeu = jeu;
	}
    
	Ennemi1.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype de l'ennemi.
	Ennemi1.prototype.constructor = Ennemi1;//Définition du constructeur à partir de la fonction plus haut.
    
    Ennemi1.prototype.update = function() {

         if (this.jeu.niveauActuel != 1 || (this.x + this.width < this.jeu.camera.x && this.jeu.perso.distanceRestante > 0)) {//Si niveau n'est pas 1 OU (ennemi plus loin qu'un décalage derrière le perso ET perso n'a pas franchi la ligne d'arrivée)...
            this.detruire();
        }
        else if (!this.collision && this.jeu.perso.distanceRestante > 0 && this.x - this.jeu.perso.x < this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.decalageCreation) {//S'il n'y a pas déjà eu une collision entre cet ennemi et le perso, que le perso n'a pas franchi la ligne d'arrivée et que cet ennemi est à moins de 300 pixels du perso...
            
            //On vérifie si le personnage et ce projectile sont en contact.
            this.jeu.physics.arcade.overlap([this.jeu.perso, this.jeu.perso.ballonBleu, this.jeu.perso.ballonVert, this.jeu.perso.ballonRouge], this, this.collisionEnnemis, null, this);
        }
    };
    
    Ennemi1.prototype.collisionEnnemis = function (partieTouchee) {
        this.collision = true;
        if (partieTouchee.key == "ballonBleu" || partieTouchee.key == "ballonVert" || partieTouchee.key == "ballonRouge") {//Si l'ennemi touche un ballon...
            this.jeu.perso.ballonTouche = true;//Pour éclater un ballon.
        } 
        else {//Cockpit touché...
            this.jeu.perso.cockpitTouche = true;//Pour que les commandes ne répondent plus.
        }

    };
    
    Ennemi1.prototype.detruire = function() {//Destruction de l'instance.
        this.destroy();  
    };
    return Ennemi1;
})();