var Ennemi3 = (function() {
    //Constructeur
    var Ennemi3 = function(jeu) {//Constructeur...

        this.positionEnnemi = jeu.nbEnnemiCree;//La position dans le tableau sera déterminée par le nombre d'ennemis créés dans le niveau (cette façon de faire fonctionne sur le principe qu'il y a une relation directe entre le nombre d'ennemis créés et la position du personnage dans le niveau).
        Phaser.Sprite.call(this, jeu, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.positionX[this.positionEnnemi],  jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.positionY[this.positionEnnemi], jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.image);//Création du sprite de l'ennemi.
        
        this.scale = new Phaser.Point(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.x, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.grosseur.y);//Grosseur de l'ennemi.
        
        this.nouveauProjectile = true;
        
        this.collision = false;//Initialise le booléen de détection d'une collision avec le personnage à false (n'est pas en collision).
        
        this.son = jeu.add.audio(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.son);//Son du canon.
        
        jeu.groupeBoulets = jeu.add.physicsGroup();
        
        //Création d'un pool de projectiles.
        for(var i=0; i<3; i++) {
            
            var bouletCanon = new BouletCanon (jeu, 0, 0);//Nouveau boulet de canon.
            jeu.groupeBoulets.add(bouletCanon);//Ajout du boulet de canon au groupe.
            bouletCanon.kill();
        }
        
        //Création des particules de fumée
        this.fumee = jeu.add.emitter(this.x + ((this.width / 2) -12), this.y, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.nbParticules);

        this.fumee.gravity = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.gravite;//Gravité.
        this.fumee.makeParticles(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.image);//Image des nuages de fumée.
        this.fumee.setAlpha(1, 0, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.dureeVie);//Les particules de fumée disparaissent progressivement en fondu.

        //Grosseur min et max des petits nuages de fumée.
        this.fumee.minParticleScale = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.grosseurMin;
        this.fumee.maxParticleScale = jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.grosseurMax;

        //Vitesse des nuages de fumée en X et en Y.
        this.fumee.setYSpeed(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.vitesseYmin, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.vitesseYmax);
        this.fumee.setXSpeed(jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.vitesseXmin, jeu.infoJeu.niveaux[jeu.niveauActuel - 1].ennemi.projectile.fumee.vitesseXmax);
        
        this.jeu = jeu;
	}
    
	Ennemi3.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype de l'ennemi.
	Ennemi3.prototype.constructor = Ennemi3;//Définition du constructeur à partir de la fonction plus haut.
    
    Ennemi3.prototype.update = function() {
        
        if (this.jeu.niveauActuel != 3 || (this.x + this.width < this.jeu.camera.x && this.jeu.perso.distanceRestante > 0)) {//Si niveau n'est pas 2 OU (ennemi plus loin qu'un décalage derrière le perso ET perso n'a pas franchi la ligne d'arrivée)...
            this.detruire();
        }
        else if (this.nouveauProjectile) {//Si un nouveau projectile est demandé et que le personnage est devant l'ennemi (déterminé par un décalage)...
            this.genererProjectile();//Appel de fonction pour générer un nouveau projectile.
        }
    };
    
    //Méthode pour générer un nouveau projectile.
    Ennemi3.prototype.genererProjectile = function() {

        this.nouveauProjectile = false;//Booléen qui contrôle la vitesse de création des ennemis avec le timer.
        
        this.projectile = this.jeu.groupeBoulets.getFirstDead();//Récupère un projectile "tué".

        if (this.projectile) {//S'il y a un projectile de disponible...
            this.projectile.reset(this.x + ((this.width / 2) -12), this.y);//Reset au lieu de revive pour régler un bug de désinchronisation entre les coordonnées du sprite et son body.
            this.jeu.world.bringToTop(this.fumee);//Pour que la fumée apparaîsse par dessus le boulet de canon.
            
            this.projectile.body.velocity.y = this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.vitesse;//Vitesse en Y du projectile.
            this.projectile.body.velocity.x = this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.vitesse / 4;//Vitesse en X du projectile.
            
            this.fumee.start(true, this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.fumee.dureeVie, null, this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.fumee.nbParticules, true);//Début de l'émission des particules.
            this.son.play();//Joue le son.
        }
        
        this.jeu.time.events.add(this.jeu.infoJeu.niveaux[this.jeu.niveauActuel - 1].ennemi.projectile.interval, function() {//Timer à la fin duquel...
            this.nouveauProjectile = true;//Peut à nouveau générer des projectiles après un délai.
        }, this);

    };

    Ennemi3.prototype.detruire = function() {//Destruction de l'instance.
        this.destroy();         
    };
    return Ennemi3;
})();