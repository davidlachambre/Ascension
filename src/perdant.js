var perdant = (function () {
	var _jeu;
	var perdant = function (jeu) {
		_jeu = jeu;
	}
	perdant.prototype = {
		create: function () {
            _jeu.stage.backgroundColor = 0x000000;
            _jeu.musique.stop();
            _jeu.arrierePlan = _jeu.add.image(_jeu.camera.width / 2, _jeu.camera.height / 2, "bgPerdant");//Image en background.
            _jeu.arrierePlan.anchor.setTo(0.5, 0.5);
            _jeu.musique = _jeu.add.audio('musiqueMort');//Création de la musique de l'état.
            if (_jeu.choixMusique) {
                _jeu.musique.play();
            }
            
            _jeu.txtDistanceFinale = _jeu.add.text(_jeu.camera.game.width / 2, _jeu.camera.game.height - _jeu.infoJeu.hud.decalageTxtDistanceFinale, '', _jeu.infoJeu.hud.police);//Initialisation du texte à afficher.
            
            _jeu.txtDistanceFinale.anchor.setTo(0.5, 0.5);
            
            _jeu.txtDistanceFinale.setText("Distance totale parcourue : " + _jeu.distanceParcourue + " mètres");//Affichage de la distance totale parcourue par le joueur.
            
            _jeu.boutonRetour = _jeu.add.button(_jeu.camera.game.width / 2, _jeu.camera.height / 2, "boutonRetour", rejouerNiveau, this);//Ajout et positionnement du bouton retour.
            _jeu.boutonRetour.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonRetour.anchor.setTo(0.5,0.5);
            
            function rejouerNiveau () {
                _jeu.sonBouton.play();//Joue le son du bouton.
                _jeu.musique.stop();
                _jeu.dernierNiveau = _jeu.niveauActuel;
                switch (_jeu.niveauActuel) {//On reinitialise la distance parcourue en fonction du niveau où le joueur est mort. 
                    case 1:
                        _jeu.distanceParcourue = 0;
                        break;
                    case 2:
                        _jeu.distanceParcourue = _jeu.infoJeu.general.distanceNiveaux;
                        break;
                    case 3:
                        _jeu.distanceParcourue = _jeu.infoJeu.general.distanceNiveaux * 2;
                        break;
                }
                _jeu.state.start("Jouer", true);//Rejoue le dernier niveau.
            }
        }
	};
    console.log('perdant');
	return perdant;
})();