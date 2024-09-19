var TexteFinNiveau = (function() {
    //Constructeur
    var TexteFinNiveau = function(jeu) {//Constructeur...

        Phaser.Sprite.call(this, jeu, jeu.world.width - (jeu.camera.width * 1.5),  jeu.camera.height / 3, jeu.infoJeu.general.finNiveau.image);//Création du sprite de texte.
        
        this.scale = new Phaser.Point(jeu.infoJeu.general.finNiveau.grosseur.x, jeu.infoJeu.general.finNiveau.grosseur.y);//Grosseur du texte.
        this.anchor.setTo(0.5, 0.5);
        this.musique = jeu.add.audio(jeu.infoJeu.general.finNiveau.musique);//Musique niveau.
        this.musique.loop = false;//Boucle la musique. Doit être apellé avant le PLAY
        if (jeu.choixMusique) {
            this.musique.play();//Joue la musique du niveau.
        }
        
        var animDebut = jeu.add.tween(this);//Ajout d'un tween pour animer l'arrivée du texte.
        var positionFinTweenX = jeu.world.width - (jeu.camera.game.width / 2);//Position du texte en fonction de la largeur du jeu (et non du monde).
        animDebut.to({x:positionFinTweenX}, jeu.infoJeu.general.finNiveau.dureeTween.debut, Phaser.Easing.Bounce.Out);
        animDebut.onComplete.add(this.animFin, this);//Lancement du 2e tween à la fin du 1er.
        animDebut.start();//Lancement du tween.
        
        this.jeu = jeu;
	}
    
	TexteFinNiveau.prototype = Object.create(Phaser.Sprite.prototype);//Copie du prototype des sprites dans le prototype.
	TexteFinNiveau.prototype.constructor = TexteFinNiveau;//Définition du constructeur à partir de la fonction plus haut.
    
    TexteFinNiveau.prototype.animFin = function () {
        this.jeu.time.events.add(this.jeu.infoJeu.general.finNiveau.dureeTween.fixe, function() {
            var tweenFin = this.jeu.add.tween(this);//Ajout d'un tween pour animer le départ du texte dans l'écran.
            var positionFinTweenX = this.jeu.world.width + (this.jeu.camera.game.width / 2);//Position du texte en fonction de la largeur du jeu (et non du monde).
            tweenFin.to({x:positionFinTweenX}, this.jeu.infoJeu.general.finNiveau.dureeTween.fin, Phaser.Easing.Back.In);
            tweenFin.onComplete.add(this.detruire, this);//Destruction de l'instance quand le tween est terminé.
            tweenFin.start();//Lancement du tween.
        }, this);
    }

    TexteFinNiveau.prototype.detruire = function() {//Destruction de l'instance.
        this.destroy();         
    };
    return TexteFinNiveau;
})();