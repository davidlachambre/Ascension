var Eclair = (function() {
    //Constructeur
    var Eclair = function(jeu, positionX, positionY) {//Constructeur...

        Phaser.Sprite.call(this, jeu, positionX,  positionY, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.image);//Création du sprite de projectile et positionnement par rapport à l'ennemi qui le crée.
        
        this.scale = new Phaser.Point(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.grosseur.x, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.grosseur.y);//Grosseur du projectile.
        this.anchor.setTo(0.5, 0.5);
        this.rotation = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.rotation;////Rotation du sprite.
        jeu.physics.enable(this);//Création du body.

        this.body.gravity.y = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.gravite;//Gravité du body.
        this.body.velocity.y = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.vitesse;//Vitesse du projectile.
        
        jeu.time.events.add(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.tempsAutodestruction, function() {//Fonction d'autodestruction sur délai.
            this.detruire();
        }, this);
        
        this.jeu = jeu;
	}
    
	Eclair.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype.
	Eclair.prototype.constructor = Eclair;//Définition du constructeur à partir de la fonction plus haut.
    
    Eclair.prototype.update = function() {
        
        this.jeu.physics.arcade.collide(this.jeu.couche, this, this.detruire, null, this);//Collisions entre le projectile et les tuiles du niveau.
        
        if (!this.collision && this.jeu.perso.distanceRestante > 0 && this.x - this.jeu.perso.x < 300) {//S'il n'y a pas déjà eu une collision entre ce projectile et le perso, que le perso n'a pas franchi la ligne d'arrivée et que ce projectile est à moins d'un certain nombre de pixels du perso...
            
            //On vérifie si le personnage et ce projectile sont en contact.
            this.jeu.physics.arcade.overlap([this.jeu.perso, this.jeu.perso.ballonBleu, this.jeu.perso.ballonVert, this.jeu.perso.ballonRouge], this, this.collisionProjectile, null, this);
        }
        //Précaution additionnelle au cas ou la collision avec les tuiles est manquée, pour être certain que l'éclair soit détruit en sortant du cadre.
        if (this.y > this.jeu.camera.y + this.jeu.camera.height) {
            this.detruire();
        }
    };
    
    //Méthode qui détermine ce qui arrive quand le projectile entre en collision avec le perso.
    Eclair.prototype.collisionProjectile = function(partieTouchee) {
        this.collision = true;
        if (partieTouchee.key == "ballonBleu" || partieTouchee.key == "ballonVert" || partieTouchee.key == "ballonRouge") {//Si le projectile touche un ballon...
            this.jeu.perso.ballonTouche = true;//Pour éclater un ballon.
        } 
        else {//Cockpit touché...
            this.jeu.perso.cockpitTouche = true;//Pour que les commandes ne répondent plus.
        }
        this.detruire();
    };
    
    //Méthode de destruction du projectile.
    Eclair.prototype.detruire = function() {
        this.kill();         
    };
    return Eclair;
})();
    