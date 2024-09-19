var chargement = (function () {
	var _jeu;
	var chargement = function (jeu) {
		_jeu = jeu;
	}

	chargement.prototype = {
		preload: function () {
            
            _jeu.barreChargement = _jeu.add.sprite((_jeu.camera.game.width / 2) - 400, _jeu.camera.game.height / 2, "barre_chargement");//Sprite de la barre de chargement.
            _jeu.barreChargement.scale = new Phaser.Point(2, 2);
			_jeu.load.setPreloadSprite(_jeu.barreChargement);//Affectation du sprite de la barre de chargement à l'anim de chargement.
            
            _jeu.load.image('boutonPlay', 'assets/bouton_play.png');//Sprite du bouton play.
            _jeu.load.image('boutonConfig', 'assets/bouton_config.png');//Sprite du bouton configuration.
            _jeu.load.image('boutonInfo', 'assets/bouton_info.png');//Sprite du bouton instruction.
            _jeu.load.image('boutonPause', 'assets/bouton_pause.png');//Sprite du bouton pause.
            _jeu.load.image('boutonRetour', 'assets/bouton_retour.png');//Sprite du bouton retour en arrière.
            _jeu.load.image('boutonMusiqueOn', 'assets/bouton_son_on.png');//Sprite du bouton musique on.
            _jeu.load.image('boutonMusiqueOff', 'assets/bouton_son_off.png');//Sprite du bouton musique off.
            _jeu.load.image('boutonSon+', 'assets/bouton_son_plus.png');//Sprite du bouton augmenter volume.
            _jeu.load.image('boutonSon-', 'assets/bouton_son_moins.png');//Sprite du bouton diminuer volume.
            _jeu.load.image('boutonFermer', 'assets/bouton_fermer.png');//Sprite du bouton fermer fenêtre.
            
            //Chargement des éléments audio du jeu.
            
            _jeu.load.audio('sonBouton', 'assets/sonBouton.mp3');//Chargement du son des boutons.
            _jeu.load.audio('sonPreCrash', 'assets/preCrash.mp3');//Chargement du son pré-explosion.
            _jeu.load.audio('sonExplosion', 'assets/explosion.mp3');//Chargement du son de l'explosion.
            _jeu.load.audio('sonMoteur', 'assets/moteur.mp3');//Chargement du son de moteur.
            _jeu.load.audio('sonEclair', 'assets/eclair.mp3');//Chargement du son de l'éclair.
            _jeu.load.audio('sonCanon', 'assets/canon.mp3');//Chargement du son de canon.
            _jeu.load.audio('sonMoteurEtouffe', 'assets/moteurEtouffe.mp3');//Chargement du son de moteur qui étouffe.
            _jeu.load.audio('sonBallonPop', 'assets/ballonPop.mp3');//Chargement du son de ballon qui éclate.
            _jeu.load.audio('musiqueNiveau1', 'assets/musiqueNiveau1.mp3');//Chargement de la musique du niveau 1.
            _jeu.load.audio('musiqueNiveau2', 'assets/musiqueNiveau2.mp3');//Chargement de la musique du niveau 2.
            _jeu.load.audio('musiqueNiveau3', 'assets/musiqueNiveau3.mp3');//Chargement de la musique du niveau 3.
            
            _jeu.load.audio('musiqueFinNiveau', 'assets/musiqueFinNiveau.mp3');//Chargement de la musique du niveau 3.
            _jeu.load.audio('musiqueFinJeu', 'assets/musiqueFinJeu.mp3');//Chargement de la musique du niveau 3.
            _jeu.load.audio('musiqueMort', 'assets/musiqueMort.mp3');//Chargement de la musique du niveau 3.

            _jeu.load.tilemap('tilemapNiveau01', 'assets/tilemapNiveau01.json', '', Phaser.Tilemap.TILED_JSON);// Chargement du fichier json qui contient l'info de tuile du niveau 1.
            _jeu.load.tilemap('tilemapNiveau02', 'assets/tilemapNiveau02.json', '', Phaser.Tilemap.TILED_JSON);// Chargement du fichier json qui contient l'info de tuile du niveau 1.
            _jeu.load.tilemap('tilemapNiveau03', 'assets/tilemapNiveau03.json', '', Phaser.Tilemap.TILED_JSON);// Chargement du fichier json qui contient l'info de tuile du niveau 1.
            _jeu.load.image('tuiles', 'assets/tuiles.png');// Chargement de l'image des tuiles (tileset).
            _jeu.load.image('drapeau', 'assets/drapeau.png');// Chargement de l'image du drapeau finish.
            _jeu.load.image('miniDrapeau', 'assets/miniDrapeau.png');// Chargement de l'image du drapeau finish.
            _jeu.load.atlasJSONHash('ennemi1', 'assets/animOiseau.png', 'assets/animOiseau.json');//Chargement de l'animation de l'ennemi 1.
            _jeu.load.atlasJSONHash('perso', 'assets/animPerso.png', 'assets/animPerso.json');//Chargement de l'animation du personnage.
            _jeu.load.image('ennemi2', 'assets/nuage.png');// Chargement de l'image de l'ennemi #2 (nuage).
            _jeu.load.image('ennemi3', 'assets/canon.png');// Chargement de l'image de l'ennemi #3.
            _jeu.load.image('eclair', 'assets/eclair.png');// Chargement du projectile du niveau 2.
            _jeu.load.image('bouletCanon', 'assets/bouletCanon.png');// Chargement du projectile du niveau 3.
            _jeu.load.image('goutte', 'assets/goutte.png');// Chargement de l'image de goutte de pluie.
            _jeu.load.image('ballonRouge', 'assets/ballonRouge.png');// Chargement de l'image du ballon rouge.
            _jeu.load.image('ballonBleu', 'assets/ballonBleu.png');// Chargement de l'image du ballon bleu.
            _jeu.load.image('ballonVert', 'assets/ballonVert.png');// Chargement de l'image du ballon vert.
            _jeu.load.image('fumee', 'assets/fumee.png');// Chargement de l'image de fumée blanche.
            _jeu.load.image('fumeeGrise', 'assets/fumeeGrise.png');// Chargement de l'image de fumée grise.
            _jeu.load.image('fumeeNoire', 'assets/fumeeNoire.png');// Chargement de l'image de fumée noire.
            _jeu.load.image('bgNiveau1', 'assets/background1.png');// Chargement de l'image du background - niveau 1.
            _jeu.load.image('bgNiveau2', 'assets/background2.png');// Chargement de l'image du background - niveau 2.
            _jeu.load.image('bgNiveau3', 'assets/background3.png');// Chargement de l'image du background - niveau 3.
            _jeu.load.image('cielNiveau1', 'assets/cielNiveau1.png');// Chargement de l'image du ciel - niveau 1.
            _jeu.load.image('cielNiveau2', 'assets/cielNiveau2.png');// Chargement de l'image du ciel - niveau 2.
            _jeu.load.image('cielNiveau3', 'assets/cielNiveau3.png');// Chargement de l'image du ciel - niveau 3.
            _jeu.load.image('bgIntro', 'assets/backgroundIntro.jpg');// Chargement de l'image du background - menu d'intro.
            _jeu.load.image('bgInstruction', 'assets/backgroundInstruction.png');// Chargement de l'image du background - menu d'instruction.
            _jeu.load.image('bgConfig', 'assets/backgroundConfig.png');// Chargement de l'image du background config.
            _jeu.load.image('bgPerdant', 'assets/backgroundPerdant.jpg');// Chargement de l'image du background - state perdant.
            _jeu.load.image('bgFlou', 'assets/backgroundFlou.png');// Chargement de l'image du background flou - tous les niveaux.
            _jeu.load.image('texteFinNiveau', 'assets/texteFinNiveau.png');// Chargement de l'image du texte apparaissant à la fin d'un niveau.
		},
		create: function () {
			_jeu.state.start("Menu", false);
            _jeu.barreChargement.destroy();//détruit la barre de chargement au changement de state.
		}
	}
    console.log('chargement');
	return chargement;
})();