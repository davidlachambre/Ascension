var menu = (function () {
	var _jeu;
	var menu = function (jeu) {
		_jeu = jeu;
	}
	menu.prototype = {
        
        preload: function() {
            _jeu.stage.backgroundColor = 0xffffff;
        },
        
		create: function () {
            
            _jeu.niveauActuel = 1;//Le niveau est initialisé ici pour pouvoir recharger le state "jouer" à chaque nouveau niveau, ce qui améliore grandement les performances en vidant la cache à chaque fois.
            
            _jeu.sonBouton = _jeu.add.audio('sonBouton');//Création du son des boutons.
            _jeu.musique = _jeu.add.audio('musiqueIntro');//Création de la musique d'intro.
            _jeu.musique.loop = true;
            _jeu.musique.play();//La musique d'intro est chargée.
            _jeu.world.setBounds(0, 0, 1024, 768);//Les limites du jeu.
            _jeu.arrierePlan = _jeu.add.image(_jeu.camera.width / 2,_jeu.camera.height / 2, 'bgIntro'); // Image de background du menu.
            _jeu.arrierePlan.anchor.setTo(0.5, 0.5);
            
            _jeu.boutonPlay = _jeu.add.button((_jeu.camera.width / 2) - 150, _jeu.camera.height - (_jeu.camera.height / 3), "boutonPlay", this.demarrerJeu, this);//Ajout et positionnement du bouton play.
            _jeu.boutonPlay.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonPlay.anchor.setTo(0.5,0.5);
            
            _jeu.boutonConfig = _jeu.add.button(_jeu.camera.width / 2, _jeu.camera.height - (_jeu.camera.height / 3), "boutonConfig", this.fenetreConfigJeu, this);//Ajout et positionnement du bouton de configuration.
            _jeu.boutonConfig.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonConfig.anchor.setTo(0.5,0.5);
            
            _jeu.boutonPlus = _jeu.add.button(335, -120, "boutonSon+", this.configVolume, this);//Ajout et positionnement du bouton Plus.
            _jeu.boutonPlus.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonPlus.anchor.setTo(0.5,0.5);
            
            _jeu.boutonMoins = _jeu.add.button(175, -120, "boutonSon-", this.configVolume, this);//Ajout et positionnement du bouton Moins.
            _jeu.boutonMoins.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonMoins.anchor.setTo(0.5,0.5);
            
            _jeu.boutonMusiqueOn = _jeu.add.button(175, 110, "boutonMusiqueOn", this.configVolume, this);//Ajout et positionnement du bouton musique on.
            _jeu.boutonMusiqueOn.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonMusiqueOn.anchor.setTo(0.5,0.5);
            
            _jeu.boutonMusiqueOff = _jeu.add.button(175, 110, "boutonMusiqueOff", this.configVolume, this);//Ajout et positionnement du bouton musique off.
            _jeu.boutonMusiqueOff.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonMusiqueOff.anchor.setTo(0.5,0.5);
            
            _jeu.boutonInfo = _jeu.add.button((_jeu.camera.width / 2) + 150, _jeu.camera.height - (_jeu.camera.height / 3), "boutonInfo", this.fenetreInstructionJeu, this);//Ajout et positionnement du bouton info.
            _jeu.boutonInfo.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonInfo.anchor.setTo(0.5,0.5);
            
            _jeu.boutonFermerInst = _jeu.add.button(418, -295, "boutonFermer", this.fermerFenetreInst, this);//Ajout et positionnement du bouton fermer fenetre d'instruction.
            _jeu.boutonFermerInst.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonFermerInst.anchor.setTo(0.5,0.5);
            
            _jeu.boutonFermerConfig = _jeu.add.button(418, -295, "boutonFermer", this.fermerFenetreConfig, this);//Ajout et positionnement du bouton fermer fenetre configuration.
            _jeu.boutonFermerConfig.scale = new Phaser.Point(1, 1);//Grosseur par défaut du bouton.
            _jeu.boutonFermerConfig.anchor.setTo(0.5,0.5);

            //Menu des instructions de jeu.
            _jeu.fenetreInstructions = _jeu.add.image(_jeu.camera.width / 2,_jeu.camera.height / 2, 'bgInstruction');
            _jeu.fenetreInstructions.anchor.setTo(0.5,0.5);
            _jeu.fenetreInstructions.visible = false;//initialise le menu en mode invisible.
            _jeu.fenetreInstructions.addChild(_jeu.boutonFermerInst);
            
            _jeu.txtVolume = _jeu.add.text(253, -120, '', {"font": "Arial narrow", "fill": "#ffffff", "fontSize": "48px"});
            _jeu.txtVolume.anchor.setTo(0.5,0.5);
            _jeu.txtVolume.setText(parseFloat(_jeu.sound.volume.toFixed(2)) * 10);
            
            //Menu pour configurer le son.
            _jeu.fenetreConfig = _jeu.add.image(_jeu.camera.width / 2,_jeu.camera.height / 2, 'bgConfig');
            _jeu.fenetreConfig.anchor.setTo(0.5,0.5);
            _jeu.fenetreConfig.visible = false;//initialise le menu en mode invisible.
            _jeu.fenetreConfig.fixedToCamera = true;
            
            //Différents boutons du menu config.
            _jeu.fenetreConfig.addChild(_jeu.boutonFermerConfig);
            _jeu.fenetreConfig.addChild(_jeu.boutonPlus);
            _jeu.fenetreConfig.addChild(_jeu.boutonMoins);
            _jeu.fenetreConfig.addChild(_jeu.boutonMusiqueOn);
            _jeu.fenetreConfig.addChild(_jeu.boutonMusiqueOff);
            _jeu.fenetreConfig.addChild(_jeu.txtVolume);
            
            _jeu.choixMusique = true;//La musique joue par défaut.
        },
        
        //Méthode pour contrôler le son en fonction du bouton appuyé.
        configVolume: function(bouton) {
            
            switch (bouton.key) {//En fonctions du bouton...
                case "boutonSon-"://Baisse le son de 10%.
                    if (parseFloat(_jeu.sound.volume.toFixed(2)) > 0.1) {
                        _jeu.sonBouton.play();//Joue le son du bouton.
                        _jeu.sound.volume = parseFloat(_jeu.sound.volume.toFixed(2)) - 0.1;
                        _jeu.txtVolume.setText(parseFloat(_jeu.sound.volume.toFixed(2)) * 10);
                    }
                    break;
                case "boutonSon+"://Monte le son de 10%.
                    if (parseFloat(_jeu.sound.volume.toFixed(2)) < 1) {
                        _jeu.sonBouton.play();//Joue le son du bouton.
                        _jeu.sound.volume = parseFloat(_jeu.sound.volume.toFixed(2)) + 0.1;
                        _jeu.txtVolume.setText(parseFloat(_jeu.sound.volume.toFixed(2)) * 10);
                    }
                    break;
                case "boutonMusiqueOn"://Arrête la musique.
                    _jeu.sonBouton.play();//Joue le son du bouton.
                    _jeu.boutonMusiqueOn.visible = false;
                    _jeu.boutonMusiqueOff.visible = true;
                    _jeu.musique.stop();
                    _jeu.choixMusique = false;
                    console.log("musique off");
                    break;
                case "boutonMusiqueOff":
                    _jeu.sonBouton.play();//Joue la musique.
                    _jeu.boutonMusiqueOn.visible = true;
                    _jeu.boutonMusiqueOff.visible = false;
                    _jeu.musique.play();
                    _jeu.choixMusique = true;
                    console.log("musique on");
                    break;
            }
        },
        
        //Méthode qui affiche le menu de configuration du son.
        fenetreConfigJeu: function() {
            _jeu.sonBouton.play();//Joue le son du bouton.
            _jeu.fenetreConfig.visible = true;
            _jeu.boutonInfo.inputEnabled = false;
            _jeu.boutonConfig.inputEnabled = false;
            _jeu.boutonPlay.inputEnabled = false;
            if (_jeu.choixMusique) {
                _jeu.boutonMusiqueOn.visible = true;
                _jeu.boutonMusiqueOff.visible = false;
            }
            else {
                _jeu.boutonMusiqueOn.visible = false;
                _jeu.boutonMusiqueOff.visible = true;
            }
            console.log("Panneau configurer...");

        },

        //Pour fermer la fenêtre de configuration.
        fermerFenetreConfig: function() {
            _jeu.sonBouton.play();//Joue le son du bouton.
            _jeu.fenetreConfig.visible = false;
            _jeu.boutonInfo.inputEnabled = true;
            _jeu.boutonConfig.inputEnabled = true;
            _jeu.boutonPlay.inputEnabled = true;

        },
        
        //Méthode pour démarrer le jeu.
        demarrerJeu: function() {
            _jeu.scale.startFullScreen(true);
            _jeu.sonBouton.play();//Joue le son du bouton.
            console.log("Jouer...");
            _jeu.musique.stop();//Arrête la musique d'intro.
            _jeu.state.start("Jouer");
        },
        
        //Méthode qui affiche le menu des instructions du jeu.
        fenetreInstructionJeu: function() {
            _jeu.sonBouton.play();//Joue le son du bouton.
            _jeu.fenetreInstructions.visible = true;
            _jeu.boutonInfo.inputEnabled = false;
            _jeu.boutonConfig.inputEnabled = false;
            _jeu.boutonPlay.inputEnabled = false;
            console.log("Fenetre instruction...");
            
        },
        
        //Pour fermer la fenêtre d'instruction.
        fermerFenetreInst: function() {
            _jeu.sonBouton.play();//Joue le son du bouton.
            _jeu.fenetreInstructions.visible = false;
            _jeu.boutonInfo.inputEnabled = true;
            _jeu.boutonConfig.inputEnabled = true;
            _jeu.boutonPlay.inputEnabled = true;
            
        }
	}
    console.log('menu');
	return menu;
})();