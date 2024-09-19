var gagnant = (function () {
	var _jeu;
	var gagnant = function (jeu) {
		_jeu = jeu;
	}
	gagnant.prototype = {
        
        preload: function () {
            _jeu.load.image('bgGagnant', 'assets/backgroundGagnant.jpg');// Chargement de l'image du background - state gagnant.
        },
        
		create: function () {
            _jeu.stage.backgroundColor = 0x000000;
            _jeu.musique.stop();
            _jeu.arrierePlan = _jeu.add.image(_jeu.camera.width / 2,_jeu.camera.height / 2, "bgGagnant");//Image en background.
            _jeu.arrierePlan.anchor.setTo(0.5, 0.5);
            _jeu.musique = _jeu.add.audio('musiqueFinJeu');//Création de la musique de l'état.
            if (_jeu.choixMusique) {
                _jeu.musique.play();
            }
            
            _jeu.txtDistanceFinale = _jeu.add.text(_jeu.camera.game.width / 2, _jeu.camera.game.height - _jeu.infoJeu.hud.decalageTxtDistanceFinale, '', _jeu.infoJeu.hud.police);//Initialisation du texte à afficher.
            
            _jeu.txtDistanceFinale.anchor.setTo(0.5, 0.5);
            
            _jeu.txtDistanceFinale.setText("Distance totale parcourue : " + _jeu.distanceParcourue + " mètres");//Affichage de la distance totale parcourue par le joueur.
            
            _jeu.boutonRetour = _jeu.add.button(_jeu.camera.game.width / 2, _jeu.camera.height / 2, "boutonRetour", retourMenu, this);//Ajout et positionnement du bouton retour.
            _jeu.boutonRetour.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonRetour.anchor.setTo(0.5,0.5);
            
            function retourMenu () {
                _jeu.sonBouton.play();//Joue le son du bouton.
                _jeu.dernierNiveau = 1;
                _jeu.distanceParcourue = 0;
                _jeu.musique.stop();
                _jeu.state.start("Menu", true);//Retour au menu.
            }
        }
	};
    console.log('gagnant');
	return gagnant;
})();