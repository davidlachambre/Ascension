var BouletCanon = (function() {
    //Constructeur
    var BouletCanon = function(jeu) {//Constructeur...

        Phaser.Sprite.call(this, jeu, 0,  0, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.image);//Création du sprite de projectile et positionnement par rapport à l'ennemi qui le crée.
        
        this.scale = new Phaser.Point(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.grosseur.x, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.grosseur.y);//Grosseur du projectile.
        this.anchor.setTo(0.5, 0.5);
        
        jeu.physics.enable(this);//Création du body.

        this.body.gravity.y = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.gravite;//Gravité du body.
        
        this.detecteCollisionMontagne = false;//Sert à corriger un bug où une collision entre cet objet et les tuiles du jeu est détectée dans la toute première boucle d'update même s'ils ne sont pas en contact.
        
        this.jeu = jeu;
	}
    
	BouletCanon.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype.
	BouletCanon.prototype.constructor = BouletCanon;//Définition du constructeur à partir de la fonction plus haut.
    
    BouletCanon.prototype.update = function() {
        
        if (this.y > this.jeu.camera.y + this.jeu.camera.height) {//Précaution additionnelle au cas ou la collision avec les tuiles est manquée, pour être certain que le boulet de canon soit détruit en sortant du cadre.
            this.detruire();
        }
        else if (this.detecteCollisionMontagne) {
            this.jeu.physics.arcade.collide(this.jeu.couche, this, this.detruire, null, this);//Collisions entre le projectile et les tuiles du niveau.
        }
        
        if (!this.collision && this.jeu.perso.distanceRestante > 0 && this.x - this.jeu.perso.x < this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.distanceCreation) {//S'il n'y a pas déjà eu une collision entre ce projectile et le perso, que le perso n'a pas franchi la ligne d'arrivée et que ce projectile est à moins d'un certain nombre de pixels du perso...

            //On vérifie si le personnage et ce projectile sont en contact.
            this.jeu.physics.arcade.overlap([this.jeu.perso, this.jeu.perso.ballonBleu, this.jeu.perso.ballonVert, this.jeu.perso.ballonRouge], this, this.collisionProjectile, null, this);
        }
        this.detecteCollisionMontagne = true;//Peut maintenant vérifier les collisions avec la montagne.
    };
    
    //Méthode qui détermine ce qui arrive quand le projectile entre en collision avec le perso.
    BouletCanon.prototype.collisionProjectile = function(partieTouchee) {
        this.collision = true;//Le projectile ne peut entrer à nouveau en collision.
        if (partieTouchee.key == "ballonBleu" || partieTouchee.key == "ballonVert" || partieTouchee.key == "ballonRouge") {//Si le projectile touche un ballon...
            this.jeu.perso.ballonTouche = true;//Pour éclater un ballon.
        } 
        else {//Cockpit touché...
            this.jeu.perso.cockpitTouche = true;//Pour que les commandes ne répondent plus.
        }
        this.detruire();//Destruction de l'instance.
    };
    
    //Méthode de destruction de l'instance.
    BouletCanon.prototype.detruire = function() {
        this.kill();         
    };
    return BouletCanon;
})();