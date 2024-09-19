var Perso = (function() {
    //Constructeur
    var Perso = function(jeu) {//Constructeur...
        
        this.distanceRestante = Math.round((jeu.infoJeu.niveaux[0].positionDrapeau.x - jeu.infoJeu.perso.x) / 10);//Nombre de pixels du niveau 1 séparant le drapeau et le perso / 10 = mètres fictifs.
        this.increment = Math.round((jeu.infoJeu.niveaux[jeu.niveauActuel - 1].positionDrapeau.x - jeu.infoJeu.perso.x) / 10);//compteur pour calculer la distance totale parcourue par le joueur.
        
        Phaser.Sprite.call(this, jeu, jeu.infoJeu.perso.x, jeu.infoJeu.perso.y, jeu.infoJeu.perso.imagePerso);//Création du sprite du perso.
        this.animations.add(jeu.infoJeu.perso.animPerso.cle, Phaser.Animation.generateFrameNames(jeu.infoJeu.perso.animPerso.cle, 0, 9, '', 4), 60, true);//Anim perso... param: (key, (prefix, start, stop, suffix, zeroPad), framerate, loop)
        this.animations.add(jeu.infoJeu.perso.animPersoChoke.cle, Phaser.Animation.generateFrameNames(jeu.infoJeu.perso.animPersoChoke.cle, 0, 45, '', 4), 60, true);//Anim perso en arrêt moteur... param: (key, (prefix, start, stop, suffix, zeroPad), framerate, loop)
        this.animations.play(jeu.infoJeu.perso.animPerso.cle, jeu.infoJeu.perso.animPerso.frameRate, jeu.infoJeu.perso.animPerso.loop);
        
        this.ballonRouge = jeu.add.sprite(jeu.infoJeu.perso.ballonRouge.x, jeu.infoJeu.perso.ballonRouge.y, jeu.infoJeu.perso.ballonRouge.image);//Création du ballon rouge.
        this.ballonBleu = jeu.add.sprite(jeu.infoJeu.perso.ballonBleu.x, jeu.infoJeu.perso.ballonBleu.y, jeu.infoJeu.perso.ballonBleu.image);//Création du ballon bleu.
        this.ballonVert = jeu.add.sprite(jeu.infoJeu.perso.ballonVert.x, jeu.infoJeu.perso.ballonVert.y, jeu.infoJeu.perso.ballonVert.image);//Création du ballon vert.
        
        //Ajustement du point de pivot des ballons et du perso. Les valeurs choisies servent à garder la position de la fumée synchronisée lors de la chute en rotation du perso, en plaçant le point de pivot exactement au point d'origiine du tuyau d'échappement de l'engin volant. Valeurs calculées dans Photoshop et converties en données unitaires.
        this.anchor.setTo(jeu.infoJeu.perso.anchor.x, jeu.infoJeu.perso.anchor.y);
        this.ballonRouge.anchor.setTo(jeu.infoJeu.perso.anchor.x, jeu.infoJeu.perso.anchor.y);
        this.ballonBleu.anchor.setTo(jeu.infoJeu.perso.anchor.x, jeu.infoJeu.perso.anchor.y);
        this.ballonVert.anchor.setTo(jeu.infoJeu.perso.anchor.x, jeu.infoJeu.perso.anchor.y);

        //Les ballons sont mis enfant du perso pour qu'ils se déplacent en même temps.
        this.addChild(this.ballonRouge);
        this.addChild(this.ballonVert);
        this.addChild(this.ballonBleu);

        this.scale = new Phaser.Point(jeu.infoJeu.perso.grosseur.x, jeu.infoJeu.perso.grosseur.y);//Grosseur par défaut du personnage.
        this.vitesse = jeu.infoJeu.perso.vitesse;//Initialise la vitesse du héros.
        this.vies = jeu.infoJeu.perso.vies;//Nombre de vies du héros au départ.
        this.cockpitTouche = false;//Détermine si l'engin (et non les ballons) a été touche par un ennemi.
        this.moteurOff = false;//Le moteur tourne au départ.
        this.ballonTouche = false;//Aucun ballon crevé au départ.
        
        //Création du body des sprites qui composent le perso.
        jeu.physics.enable(this);
        jeu.physics.enable(this.ballonRouge);
        jeu.physics.enable(this.ballonBleu);
        jeu.physics.enable(this.ballonVert);

        //Initialisation de la gravité sur le personnage.
        this.ballonRouge.body.gravity.y = jeu.infoJeu.perso.gravite3ballons;
        this.ballonVert.body.gravity.y = jeu.infoJeu.perso.gravite3ballons;          
        this.ballonBleu.body.gravity.y = jeu.infoJeu.perso.gravite3ballons;
        this.body.gravity.y = jeu.infoJeu.perso.gravite3ballons;
        
        //Sons liés au perso.
        this.sonPreCrash = jeu.add.audio(jeu.infoJeu.audio.preCrash);//Création du son généré quand 3 ballons sont crevés.
        this.sonExplosion = jeu.add.audio(jeu.infoJeu.audio.explosion);//Création du son de l'explosion.
        this.sonMoteur = jeu.add.audio(jeu.infoJeu.audio.moteur);//Création du son du moteur.
        this.sonMoteurEtouffe = jeu.add.audio(jeu.infoJeu.audio.moteurEtouffe);//Création du son de moteur étouffé (quand le cockpit est touché par un ennemi).
        this.sonBallonPop = jeu.add.audio(jeu.infoJeu.audio.ballonPop);//Création du son de ballon qui éclate.
        this.sonMoteur.loop = true;//Boucle le son du moteur.
        
        
        //Création des particules de fumée
        this.fumee = jeu.add.emitter(jeu.infoJeu.perso.fumee.positionX, jeu.infoJeu.perso.fumee.positionY, jeu.infoJeu.perso.fumee.nbParticules);

        this.fumee.gravity = jeu.infoJeu.perso.fumee.gravite;//Gravité.
        this.fumee.makeParticles(jeu.infoJeu.perso.fumee.image);//Image des nuages de fumée.
        this.fumee.setAlpha(1, 0, jeu.infoJeu.perso.fumee.dureeVie);//Les particules de fumée disparaissent progressivement en fondu.

        //Grosseur min et max des petits nuages de fumée.
        this.fumee.minParticleScale = jeu.infoJeu.perso.fumee.grosseurMin;
        this.fumee.maxParticleScale = jeu.infoJeu.perso.fumee.grosseurMax;

        //Vitesse des nuages de fumée en X et en Y.
        this.fumee.setYSpeed(jeu.infoJeu.perso.fumee.vitesseYmin, jeu.infoJeu.perso.fumee.vitesseYmax);
        this.fumee.setXSpeed(jeu.infoJeu.perso.fumee.vitesseXmin, jeu.infoJeu.perso.fumee.vitesseXmax);
        
        this.fumee.start(false, jeu.infoJeu.perso.fumee.dureeVie, jeu.infoJeu.perso.fumee.frequence, jeu.infoJeu.perso.fumee.quantite, false);//Début de l'émission des particules.
        
        this.jeu = jeu;//Pour pouvoir accéder aux autres éléments du jeu.
        
        //Fonctionalité permettant de remettre la gravité à la bonne valeur dès que la souris ou le doigt est relâché, car la valeur de gravité est modifiée chaque mois que le pointeur est enfoncé pour les déplacements.
        this.jeu.input.onUp.add(function () {
            if (!this.moteurOff) {//Si le moteur tourne...
                switch (this.vies) {//Selon le nombre de vies / ballons restants...
                    case 3:
                        this.body.gravity.y = this.jeu.infoJeu.perso.gravite3ballons;
                        break;
                    case 2:
                        this.body.gravity.y = this.jeu.infoJeu.perso.gravite2ballons;
                        break;
                    case 1:
                        this.body.gravity.y = this.jeu.infoJeu.perso.gravite1ballons;
                        break;
                }
            }
        }, this);
	}
    
	Perso.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype du perso.
	Perso.prototype.constructor = Perso;//Définition du constructeur à partir de la fonction plus haut.

    Perso.prototype.update = function() {
        
        //Mise à jour de la position de l'émetteur de fumée en fonction de la position du perso.
        this.fumee.x = this.body.x + this.jeu.infoJeu.perso.fumee.decalageX;
        this.fumee.y = this.body.y + this.jeu.infoJeu.perso.fumee.decalageY;
        
        if (this.distanceRestante >= 0) {//Si le perso n'est pas rendu à la ligne d'arrivée...
            if (this.increment > this.distanceRestante) {//Si la variable d'incrémentation est plus grande que la distance restante à parcourir...
                this.jeu.distanceParcourue += (this.increment - this.distanceRestante);//On incrémente le nombre de mètres parcourus.
                this.increment -= (this.increment - this.distanceRestante);//Mise à jour de la variable de contrôle.
            }
            this.jeu.txtDistance.setText(this.distanceRestante + " mètres");//Mets à jour à l'écran la distance restante à parcourir.
        }
        else if (this.vies > 0) {//Si il reste des vies... -> Correction d'un bug qui permettait de finir le niveau à 0 vies / ballons.
            this.finNiveau(); //Appel de la fonction finNiveau quand la distance restante est à 0.
            if (this.sonMoteur.volume > 0) {//Tant que le volume du son de moteur est plus grand que  0...
                this.sonMoteur.volume -= this.jeu.infoJeu.audio.fadeSon;//Fade du son du moteur.
            }
        }
     
        this.distanceRestante = Math.round((this.jeu.drapeau.x - this.x) / 10);//Calcul de la distance en pixels, converti en mètres fictifs, entre le perso et le drapeau indiquand la fin du niveau.
        
        this.jeu.physics.arcade.collide(this, this.jeu.couche, this.collisionPersoMontagne, null, this);//Collisions entre le perso et les tuiles du niveau 1.

        
        //CONTRÔLES
        
        this.direction = {x:this.jeu.infoJeu.general.velociteCamera, y:0};//défini la direction.

        
        //DÉPLACEMENT DE BASE - FONCTIONNE SANS INTERVENTION DU JOUEUR
        
        if (this.vies <= 0 || this.moteurOff || !this.jeu.input.activePointer.isDown || this.distanceRestante <= 0) {
            this.body.velocity.x = this.direction.x * this.vitesse;
            this.body.velocity.y = this.direction.y * (this.vitesse / 2);//Vitesse 2 fois plus lente sur l'axe des Y.
        }
        
        //CONTRÔLES CURSEUR / TOUCH
        
        else if (this.jeu.input.activePointer.isDown && this.jeu.physics.arcade.distanceToPointer(this, this.jeu.input.activePointer) > 20) {

            this.jeu.physics.arcade.accelerateToXY(this, this.jeu.input.activePointer.worldX, this.jeu.input.activePointer.worldY, this.jeu.infoJeu.perso.vitesse, this.jeu.infoJeu.perso.vitesseMin,this.jeu.infoJeu.perso.vitesseMax);
            this.body.gravity.y = this.jeu.infoJeu.perso.gravite3ballons;//Nécessaire pendant le déplacement avec curseur / touch sinon le perso tombe à pic.

        }
        if (this.x != this.jeu.infoJeu.perso.x && this.y != this.jeu.infoJeu.perso.y) {
            if (this.body.y <= this.jeu.infoJeu.perso.limiteTop) {
                this.body.y = this.jeu.infoJeu.perso.limiteTop + 0.5;
            }
            if (this.body.x <= this.jeu.camera.x) {
                this.body.x = this.jeu.camera.x + 0.5;
            }
            else if (this.body.x >= this.jeu.camera.x + (this.jeu.camera.game.width - this.width) && this.distanceRestante >= 0) {
                this.body.x = (this.jeu.camera.x + (this.jeu.camera.game.width - this.width)) - 0.5;
            }
        }
        
        /*=== COLLISION DU PERSO ===*/

        if (this.cockpitTouche) {//Si le cockpit est touché par un ennemi...
            this.cockpitTouche = false;//Le cockpit ne peut à nouveau être touché.
            this.animations.play(this.jeu.infoJeu.perso.animPersoChoke.cle, this.jeu.infoJeu.perso.animPersoChoke.frameRate, this.jeu.infoJeu.perso.animPersoChoke.loop);
            this.moteurOff = true;//Le moteur est arrêté.
            this.fumee.on = false;//emetteur de fumée est arrêté.
            this.sonMoteur.stop();//Arrêt du son de moteur.
            this.sonMoteurEtouffe.play();//Joue le son du moteur qui étouffe.
            this.body.gravity.y = 0;//Le perso tombe rapidement.
            var timer = this.jeu.time.events.add(this.jeu.infoJeu.perso.tempsArretMoteur, function() {//Timer à la fin duquel...
                if (this.vies > 0) {//Si le perso n'est pas mort...
                    switch (this.vies) {//Selon le nombre de vies / ballons qui reste...
                        case 1:
                            this.body.gravity.y = this.jeu.infoJeu.perso.gravite1ballons;//La gravité est rétablie à sa valeur avant impact.
                            break;
                        case 2:
                            this.body.gravity.y = this.jeu.infoJeu.perso.gravite2ballons;//La gravité est rétablie à sa valeur avant impact.
                            break;
                        case 3:
                            this.body.gravity.y = this.jeu.infoJeu.perso.gravite3ballons;//La gravité est rétablie à sa valeur avant impact.
                            break;
                    }
                    this.sonMoteurEtouffe.stop();//Arrêt du son de moteur qui étouffe.
                    this.moteurOff = false;//Le moteur est à nouveau fonctionnel.
                    this.sonMoteur.play();//Son du moteur rétabli.
                    this.fumee.on = true;//L'émetteur de fumée émets à nouveau.
                    this.animations.play(this.jeu.infoJeu.perso.animPerso.cle, this.jeu.infoJeu.perso.animPerso.frameRate, this.jeu.infoJeu.perso.animPerso.loop);
                }
            }, this);
        }
        else if (this.ballonTouche) {//Si l'ennemi touche un ballon...
            this.sonBallonPop.play();//Son de ballon qui éclate.
            
            switch (this.vies) {//Dépendant du nombre de vies/ballons restant(e)s...
                case 3:
                    this.ballonVert.kill();//Destruction du ballon.
                    this.vies = 2;//Mise à jour des vies.
                    this.body.gravity.y = this.jeu.infoJeu.perso.gravite2ballons;//Diminution de la valeur de gravité pour qu'il soit attiré vers le sol.
                    //Annule l'effet de physique sur les ballons.
                    this.ballonBleu.body.velocity.x = 0;
                    this.ballonRouge.body.velocity.x = 0;
                    break;
                case 2:
                    this.ballonBleu.kill();
                    this.vies = 1;
                    this.body.gravity.y = this.jeu.infoJeu.perso.gravite1ballons; 
                    this.ballonRouge.body.velocity.x = 0;//Annule l'effet de physique sur le ballon.
                    break;
                case 1:
                    this.ballonRouge.kill();
                    this.vies = 0;
                    this.body.gravity.y = 0;
                    this.body.angularVelocity = this.jeu.infoJeu.perso.vitesseRotationChute;//Pour que le cockpit pique du nez en tombant. 
                    this.sonPreCrash.play();//Joue le son avant l'explosion.
                    break;
            }
            this.ballonTouche = false;//Les ballons peuvent à nouveau être touchés.
        }
        //Ajustement pour améliorer l'aspect visuel de la fumée de moteur lors de la chute du perso vers la montagne.
        if (this.vies == 0) {
            this.fumee.gravity -= this.jeu.infoJeu.perso.fumee.graviteChute;
        }
    };
    
    //Méthode qui détermine ce qui se produit quand le perso percute les tuiles de la montagne.
    Perso.prototype.collisionPersoMontagne = function () {
            
        //La vérif des collisions du perso est désactivée pour éviter la détection de nouvelles collisions.
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        this.body.checkCollision.up = false;
        this.body.checkCollision.down = false;

        if (this.ballonVert.body) {
            this.ballonVert.kill();
        }
        if (this.ballonRouge.body) {
             this.ballonRouge.kill();
        }
        if (this.ballonBleu.body) {
             this.ballonBleu.kill();
        }
        //Création des particules de l'explosion
        this.explosion = this.jeu.add.emitter(this.x + (this.width * this.jeu.infoJeu.perso.explosion.decalage.x), this.y + (this.height * this.jeu.infoJeu.perso.explosion.decalage.y), this.jeu.infoJeu.perso.explosion.nbParticules);
        this.explosion.gravity = this.jeu.infoJeu.perso.explosion.gravite;//Gravité.
        this.explosion.makeParticles(this.jeu.infoJeu.perso.explosion.image);//Image des nuages de fumée.
        this.explosion.setAlpha(1, 0, this.jeu.infoJeu.perso.explosion.dureeVie);//Les particules de fumée disparaissent progressivement en fondu.

        //Grosseur min et max des petits nuages de fumée.
        this.explosion.minParticleScale = this.jeu.infoJeu.perso.explosion.grosseurMin;
        this.explosion.maxParticleScale = this.jeu.infoJeu.perso.explosion.grosseurMax;

        //Vitesse des nuages de fumée en X et en Y.
        this.explosion.setYSpeed(this.jeu.infoJeu.perso.explosion.vitesseYmin, this.jeu.infoJeu.perso.explosion.vitesseYmax);
        this.explosion.setXSpeed(this.jeu.infoJeu.perso.explosion.vitesseXmin, this.jeu.infoJeu.perso.explosion.vitesseXmax);
//        this.explosion.x = this.x + (this.width / 2);//Positionnement en X de l'explosion au centre du perso.
//        this.explosion.y = this.y + (this.height / 2);//Positionnement en Y de l'explosion au centre du perso.
        this.explosion.start(true, this.jeu.infoJeu.perso.explosion.dureeVie, null, this.jeu.infoJeu.perso.explosion.nbParticules, true);//Début de l'émission des particules de l'explosion.
//        this.explosion.forEach(function(particle) {
//          // tint every particle red
//          particle.tint = 0xff0000;
//        });
        this.vies = 0;
        this.detruire(); 
        
        //Arrêt des sons du jeu :
        this.sonPreCrash.stop();
        this.sonMoteur.stop();
        if (this.sonMoteurEtouffe.isPlaying) {
            this.sonMoteurEtouffe.stop();
        }
        if (!this.sonExplosion.isPlaying) {//Condition pour que la musique soit lancée et jouée une seule fois.
            this.sonExplosion.play();//Joue le son d'explosion.
        }
        this.jeu.musique.stop();
        this.jeu.time.events.add(this.jeu.infoJeu.perso.tempsTransitionMort, function() {//Timer à la fin duquel un nouveau niveau est chargé.
            this.jeu.state.start("Perdant", true);
        }, this);
    };
    
    //Méthode qui rétabli la gravité originale quand le personnage franchi la ligne d'arrivée.
    Perso.prototype.finNiveau = function() {
        this.body.gravity.y = this.jeu.infoJeu.perso.gravite3ballons;
    };
    
    //Méthode de destruction de l'instance du perso.
    Perso.prototype.detruire = function() {
        this.fumee.kill();
        this.kill();
    };
    return Perso;
})();