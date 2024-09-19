var jouer = (function() {
    var _jeu;
    var jouer = function(jeu) {
        _jeu = jeu;
    }

    jouer.prototype = {
        
        preload: function() {
            _jeu.stage.backgroundColor = 0x3c2417;
            _jeu.time.advancedTiming = true;
            _jeu.debug.font = '15px arial'
            _jeu.load.json("infoJeu", "assets/infoJeu.json");
        },
        
        create: function() {
            
            /*=== GÉNÉRAL ===*/
            
            _jeu.infoJeu = _jeu.cache.getJSON('infoJeu');//Chargement du fichier Json qui contient l'info des niveaux du jeu.

            if (_jeu.distanceParcourue == null) {//Si la distance parcourue n'a pas encore été initialisée...
                _jeu.distanceParcourue = 0;//Calcule la distance parcourue pendant le jeu par le joueur. Initialisée à 0 lors du 1er chargement seulement.
            }
            _jeu.decalageEnnemi = _jeu.infoJeu.general.decalageEnnemi;//Permet la création d'ennemis devant le personnage, tout juste à l'extérieur du cadre.
            
            _jeu.physics.startSystem(Phaser.Physics.ARCADE);//Active la physique de type ARCADE du jeu.
            
            _jeu.world.setBounds(0, 0, _jeu.infoJeu.general.grandeurMonde.x, _jeu.infoJeu.general.grandeurMonde.y);//Les limites du jeu.
            _jeu.physics.arcade.gravity.y = _jeu.infoJeu.general.gravite;//Gravité du monde.
            
            _jeu.bgFlou = _jeu.add.image(_jeu.infoJeu.general.positionBgFlou.x, _jeu.infoJeu.general.positionBgFlou.y, _jeu.infoJeu.general.imageBgFlou);//Image des montagnes floues.
            _jeu.bgFlou.scale = new Phaser.Point(_jeu.infoJeu.general.grosseurBgFlou.x, _jeu.infoJeu.general.grosseurBgFlou.y);//Grosseur de l'image du background flou.
            
            
            /*=== CRÉATION DU HUD ===*/
            
            _jeu.boutonMusiqueOn = _jeu.add.button(_jeu.camera.width - _jeu.infoJeu.hud.boutonMusiqueOn.decalageX, _jeu.camera.height - _jeu.infoJeu.hud.boutonMusiqueOn.decalageY, _jeu.infoJeu.hud.boutonMusiqueOn.image, this.musiqueToggle, this);//Ajout et positionnement du bouton de musique on.
            _jeu.boutonMusiqueOn.scale = new Phaser.Point(_jeu.infoJeu.hud.boutonMusiqueOn.grosseur.x, _jeu.infoJeu.hud.boutonMusiqueOn.grosseur.y);//Grosseur par défaut du bouton musique on.
            _jeu.boutonMusiqueOn.anchor.setTo(0.5,0.5);
            
            _jeu.boutonMusiqueOff = _jeu.add.button(_jeu.camera.width - _jeu.infoJeu.hud.boutonMusiqueOff.decalageX, _jeu.camera.height - _jeu.infoJeu.hud.boutonMusiqueOff.decalageY, _jeu.infoJeu.hud.boutonMusiqueOff.image, this.musiqueToggle, this);//Ajout et positionnement du bouton de musique off.
            _jeu.boutonMusiqueOff.scale = new Phaser.Point(_jeu.infoJeu.hud.boutonMusiqueOff.grosseur.x, _jeu.infoJeu.hud.boutonMusiqueOff.grosseur.y);//Grosseur par défaut du bouton musique off.
            _jeu.boutonMusiqueOff.anchor.setTo(0.5,0.5);

            _jeu.boutonMusiqueOn.fixedToCamera = true;//Fait partie du HUD, donc bouge avec la caméra.
            _jeu.boutonMusiqueOff.fixedToCamera = true;//Fait partie du HUD, donc bouge avec la caméra.
            
            if (_jeu.choixMusique) {//Si la musique du jeu est activée...
                _jeu.boutonMusiqueOff.visible = false;
                _jeu.boutonMusiqueOn.visible = true;//Bouton qui laisse savoir que la musique est activée.
            }
            else {
                _jeu.boutonMusiqueOff.visible = true;//Bouton qui laisse savoir que la musique est désactivée.
                _jeu.boutonMusiqueOn.visible = false;
            }
            
            //CODE SOURCE (bouton pause Phaser) :http://www.html5gamedevs.com/topic/4684-any-pause-screen-code-examples/
            _jeu.boutonPause = _jeu.add.image(_jeu.camera.width - _jeu.infoJeu.hud.boutonPause.decalageX, _jeu.camera.height - _jeu.infoJeu.hud.boutonPause.decalageY, _jeu.infoJeu.hud.boutonPause.image);
            _jeu.boutonPause.inputEnabled = true;
            _jeu.boutonPause.scale = new Phaser.Point(_jeu.infoJeu.hud.boutonPause.grosseur.x, _jeu.infoJeu.hud.boutonPause.grosseur.y);//Grosseur par défaut du bouton pause.
            _jeu.boutonPause.anchor.setTo(0.5, 0.5);
            _jeu.boutonPause.events.onInputUp.add(function () {
                _jeu.paused = true;//On pause le jeu.
            },this);
            _jeu.input.onDown.add(function () {
                if(_jeu.paused)_jeu.paused = false;//On dépause le jeu.
            },this);
            _jeu.boutonPause.fixedToCamera = true;//Fait partie du HUD, donc bouge avec la caméra.
            
            _jeu.iconeDrapeau = _jeu.add.image(_jeu.infoJeu.hud.iconeDrapeau.decalageX, _jeu.camera.height - _jeu.infoJeu.hud.iconeDrapeau.decalageY, _jeu.infoJeu.hud.iconeDrapeau.image);//Petit icone des drapeaux dans le coin inférieur gauche du HUD.
            _jeu.iconeDrapeau.scale = new Phaser.Point(_jeu.infoJeu.hud.grosseurDrapeau.x, _jeu.infoJeu.hud.grosseurDrapeau.y);//Grosseur par défaut du drapeau.
            _jeu.iconeDrapeau.anchor.setTo(0.5, 0.5);
            _jeu.iconeDrapeau.fixedToCamera = true;//Fait partie du HUD, donc bouge avec la caméra.
            
            
            /*=== CRÉATION DU PERSO ===*/
            
            _jeu.perso = new Perso(_jeu);//Création d'une nouvelle instance de Perso qui sera réinitialisée à chaque niveau.
            _jeu.add.existing(_jeu.perso);//Ajout du perso au jeu. 
            
            
            /*=== CRÉATION DU NIVEAU ===*/
            
            this.chargerNiveau();//Charge toutes les infos du niveau en fonction du niveau actuel (_jeu.niveauActuel).
            
            
            /*=== AUTRE ===*/
            
//            _jeu.couche.debug = true;// Affiche les info de debugage des collisions. 
        },
        
        //Méthode pour mettre la musique à ON / OFF.
        musiqueToggle: function(bouton) {
            
            _jeu.sonBouton.play();//Joue le son du bouton.
            if (bouton.key == "boutonMusiqueOn") {//Si l'utilisateur appui sur le bouton musique ON...
                _jeu.choixMusique = false;//La musique est maintenant à OFF.
                _jeu.musique.stop();
                _jeu.boutonMusiqueOff.visible = true;
                _jeu.boutonMusiqueOn.visible = false;
            }
            else {//Si l'utilisateur appui sur le bouton musique OFF...
                _jeu.choixMusique = true;//La musique est maintenant à ON.
                _jeu.musique.play();
                _jeu.boutonMusiqueOff.visible = false;
                _jeu.boutonMusiqueOn.visible = true;
            }
        },
        
        
        //Méthode pour charger tous les éléments de chaque nouveau niveau.
        chargerNiveau: function() {
            
            console.log("chargement du niveau", _jeu.niveauActuel);

            /*=== CHARGEMENT DU NIVEAU ===*/
            
            _jeu.NouvelEnnemi = true;//Booléan qui contrôle, conjointement avec un timer, la vitesse de création des ennemis.
            _jeu.nbEnnemiCree = 0;//Détermine le nombre d'ennemis générés dans le niveau. Réinitialisé à 0 à chaque nouveau niveau.
            
            
            //Repositionnement des différents éléments du jeu.
            
            _jeu.camera.x = 0;//Réinitialisation de la caméra.
            _jeu.bgFlou.x = _jeu.infoJeu.general.positionBgFlou.x;//Réinitialisation du background flou.          
            _jeu.bg = _jeu.add.image(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].positionBg.x, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].positionBg.y, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].imageBg); // Image des montagnes qui représentent la zone de collision perso / sol.
            _jeu.bg.scale = new Phaser.Point(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].grosseurBg.x, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].grosseurBg.y);//Grosseur de l'image _jeu.bg (montagnes).            
            
            _jeu.ciel = _jeu.add.tileSprite(0, 0, _jeu.world.width, _jeu.world.height, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].imageCiel);//Ajout du motif de ciel.

            _jeu.ciel.fixedToCamera = true;// Pour que le ciel reste  affiché lors du déplacement de la caméra.
            
            _jeu.tileset = _jeu.add.tilemap(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].infoTuiles);// Création des tuiles du niveau à partir du tilemap.
            _jeu.tileset.addTilesetImage(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].imageTuiles);// Ajoute l'image du tileset.
            _jeu.couche = _jeu.tileset.createLayer(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].infoCouche);// Crée la couche des collisions pour le niveau.
            _jeu.drapeau = _jeu.add.image(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].positionDrapeau.x, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].positionDrapeau.y, _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].imageDrapeau);//Finish line.
            _jeu.tileset.setCollisionBetween(_jeu.infoJeu.general.collisionTuiles.debut, _jeu.infoJeu.general.collisionTuiles.fin, true, _jeu.couche);// Active les collisions sur la couche 1 avec les tuiles ayant l'id 1.
            _jeu.vitesseBg = _jeu.infoJeu.general.vitesseBg//Vitesse de défilement du background.
            _jeu.musique.stop();//Au cas où le joueur aurait appuyé sur le bouton musique on après la fin du niveau, on arrête la musqiue avant de charger la prochaine.
            _jeu.musique = _jeu.add.audio(_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].musique);//Musique niveau.
            _jeu.musique.loop = true;//Boucle la musique. Doit être apellé avant le PLAY 
            if (_jeu.choixMusique) {//Si le joueur n'a pas mis la musique à off...
                _jeu.musique.play();//Joue la musique du niveau.
            }
 
            
            /*=== RESET PERSO ===*/
            
            //La méthode reset() est similaire à revive() qui permet de réinitialisé un sprite tué, mais en plus réinitialise le body, ce qui permet d'éviter des bugs de décalage entre le sprite et son body lors du repositionnement.
            if (!_jeu.perso.ballonVert.alive) {//Si il n'y a plus de ballon vert...
                _jeu.perso.ballonVert.reset(_jeu.infoJeu.perso.ballonVert.x, _jeu.infoJeu.perso.ballonVert.y);//Réinitialisation du ballon vert.
            }
            if (!_jeu.perso.ballonBleu.alive) {//Si il n'y a plus de ballon bleu...
                _jeu.perso.ballonBleu.reset(_jeu.infoJeu.perso.ballonBleu.x, _jeu.infoJeu.perso.ballonBleu.y);//Réinitialisation du ballon bleu.
            }
            _jeu.perso.reset(_jeu.infoJeu.perso.x, _jeu.infoJeu.perso.y);//Réinitialisation du perso.
            
            //Réinitialisation des valeurs d'origine du perso pour un nouveau niveau (voir perso.js pour commentaires).
            _jeu.perso.vies = _jeu.infoJeu.perso.vies;//Remet les vies à 3.
            _jeu.perso.fumee.on = true;//Redémarre la fumée.
            _jeu.perso.distanceRestante = Math.round((_jeu.infoJeu.niveaux[0].positionDrapeau.x - _jeu.infoJeu.perso.x) / 10);
            _jeu.perso.increment = Math.round((_jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].positionDrapeau.x - _jeu.infoJeu.perso.x) / 10);
            _jeu.perso.cockpitTouche = false;
            _jeu.perso.moteurOff = false;
            _jeu.perso.ballonTouche = false;
            _jeu.perso.sonMoteur.volume = 1;
            _jeu.perso.body.gravity.y = _jeu.infoJeu.perso.gravite3ballons;
            
            _jeu.perso.sonMoteur.play();//Joue le son du moteur.
            
            //Pour s'assurer d'avoir les différents sprites / images rendus dans le bon ordre.
            _jeu.world.bringToTop(_jeu.ciel);
            _jeu.world.bringToTop(_jeu.bgFlou);
            _jeu.world.bringToTop(_jeu.drapeau);
            _jeu.world.bringToTop(_jeu.bg);
            _jeu.world.bringToTop(_jeu.couche);
            _jeu.world.bringToTop(_jeu.iconeDrapeau);
            _jeu.world.bringToTop(_jeu.perso);
            _jeu.world.bringToTop(_jeu.perso.fumee);
            _jeu.world.bringToTop(_jeu.boutonPause);
            _jeu.world.bringToTop(_jeu.boutonMusiqueOn);
            _jeu.world.bringToTop(_jeu.boutonMusiqueOff);
            
            //Si on est au niveau 2, création de pluie.
            if (_jeu.niveauActuel == 2) {

                //CODE SOURCE : http://phaser.io/examples/v2/particles/rain
                //@author Jens Anders Bakke
                //@author David Lachambre
                var pluie = _jeu.add.emitter(_jeu.camera.x + (_jeu.camera.width), _jeu.camera.y, _jeu.infoJeu.general.pluie.nbParticules);

                pluie.width = _jeu.camera.width * 2;//Doit être 2 fois plus large que la caméra pour compenser le mouvement de celle-ci.

                 pluie.gravity = _jeu.infoJeu.general.pluie.gravite;//Gravité.
                
                pluie.makeParticles(_jeu.infoJeu.general.pluie.image);

                //Grosseur min et max des gouttes.
                pluie.minParticleScale = _jeu.infoJeu.general.pluie.grosseurMin;
                pluie.maxParticleScale = _jeu.infoJeu.general.pluie.grosseurMax;

                //Vitesse des gouttes en X et en Y.
                pluie.setYSpeed(_jeu.infoJeu.general.pluie.vitesseYmin, _jeu.infoJeu.general.pluie.vitesseYmax);
                pluie.setXSpeed(_jeu.infoJeu.general.pluie.vitesseXmin, _jeu.infoJeu.general.pluie.vitesseXmax);

                pluie.setAlpha(1, 0, _jeu.infoJeu.general.pluie.dureeVie)
                
                //Pour empêcher la rotation des particules.
                pluie.minRotation = _jeu.infoJeu.general.pluie.rotation;
                pluie.maxRotation = _jeu.infoJeu.general.pluie.rotation;

                pluie.fixedToCamera = true;
                
                pluie.start(false, _jeu.infoJeu.general.pluie.dureeVie, _jeu.infoJeu.general.pluie.frequenceGouttes);//Début de l'émission des particules.
            }
            
            /*=== CHARGEMENT DU HUD ===*/
            
            //Le texte du HUD doit être recréé à chaque chargement de niveau pour qu'il soit affiché au dessus des autres éléments - on ne peut utiliser world.bringToTop avec cet objet.
                
            _jeu.txtDistance = _jeu.add.text(_jeu.infoJeu.hud.affichageDistance.x, _jeu.infoJeu.hud.affichageDistance.y, '', _jeu.infoJeu.hud.police);// Création de l'affichage de la distance restante.
            _jeu.txtDistance.fixedToCamera = true;// Pour que le texte reste affiché lors du déplacement de la caméra. 
            
            _jeu.niveauCharge = true;//Le chargement est complété.
        },
        
        //fonction pour instancier les classes d'ennemi.
        genererEnnemi: function() {
            if (_jeu.perso.distanceRestante > 150) {//Si il reste moins de 150 mètres (1500 pixels) au personnage à parcourir...
                switch (_jeu.niveauActuel) {//Selon le niveau dans lequel on est...
                    case 1:
                        _jeu.ennemi = new Ennemi1(_jeu);//Création d'une nouvelle instance d'ennemi de 1er niveau.
                        _jeu.add.existing(_jeu.ennemi);//Ajout de l'ennemi au jeu.
                        _jeu.nbEnnemiCree += 1;//historique de création d'ennemi.
                        _jeu.time.events.add((Math.random() + 1) *  _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].ennemi.vitesseCreation, function() {//Timer qui correspond à une valeur comprise entre 1 et 2 fois la vitesse de création de cet ennemi définie dans le Json infoJeu.
                            _jeu.NouvelEnnemi = true;//Remis à true après un délai random.
                        });
                        break;
                    case 2:
                        _jeu.ennemi = new Ennemi2(_jeu);//Création d'une nouvelle instance d'ennemi de 2e niveau.
                        _jeu.add.existing(_jeu.ennemi);//Ajout de l'ennemi au jeu.
                        _jeu.nbEnnemiCree += 1;//historique de création d'ennemi.
                        _jeu.time.events.add((Math.random() + 1) *  _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].ennemi.vitesseCreation, function() {//Timer qui correspond à une valeur comprise entre 1 et 2 fois la vitesse de création de cet ennemi définie dans le Json infoJeu.
                            _jeu.NouvelEnnemi = true;//Remis à true après un délai random.
                            }, this);
                        break;
                    case 3:
                        _jeu.NouvelEnnemi = true;//Doit être remis à true avant d'entrer dans la condition de création pour pouvoir entrer à nouveau dans la fonction au prochain update.
                        var posEnnemiDecale = _jeu.infoJeu.niveaux[_jeu.niveauActuel - 1].ennemi.positionX[_jeu.nbEnnemiCree] - (_jeu.camera.width + _jeu.decalageEnnemi);//Récupère la position de création de l'ennemi en fonction du nombre déjà créé et y ajoute un décalage pour que l'ennemi soit instancier en avant du perso.
                        if ((_jeu.nbEnnemiCree == 0 && _jeu.perso.x > posEnnemiDecale) || (_jeu.nbEnnemiCree == 1 && _jeu.perso.x > posEnnemiDecale) || (_jeu.nbEnnemiCree == 2 && _jeu.perso.x > posEnnemiDecale) || (_jeu.nbEnnemiCree == 3 && _jeu.perso.x > posEnnemiDecale) || (_jeu.nbEnnemiCree == 4 && _jeu.perso.x > posEnnemiDecale) || (_jeu.nbEnnemiCree == 5 && _jeu.perso.x > posEnnemiDecale)) {//Si le nombre d'ennemi créé est d'une certaine quantité et que la position du perso est supérieure à la position où le nouvel ennemi doit être créé...
                            _jeu.ennemi = new Ennemi3(_jeu);//Création d'une nouvelle instance d'ennemi de 3e niveau.
                            _jeu.add.existing(_jeu.ennemi);//Ajout de l'ennemi au jeu.
                            _jeu.nbEnnemiCree += 1;//historique de création d'ennemi.
                            break;
                        }
                }
            }
        },

        //Méthode appelée à la fin d'un niveau.
        finNiveau: function() {
            console.log("fin du niveau");
            _jeu.time.events.add(_jeu.infoJeu.general.tempsTransitionNiveau, function() {//Timer à la fin duquel un nouveau niveau est chargé.
                _jeu.niveauActuel += 1;//Incrémente le niveau.
                _jeu.musique.stop();
                _jeu.perso.sonMoteur.stop();
                _jeu.state.start("Jouer", true);//On charge le prochain niveau. La recharge du state améliore les performances en vidant la cache.
            }, this);
        },
        
        //Méthode appelée à la fin du dernier niveau.
        finJeu: function() {
            console.log("fin du jeu");
            _jeu.time.events.add(_jeu.infoJeu.general.tempsTransitionNiveau, function() {//Timer à la fin duquel l'écran de fin de jeu est chargé.
                _jeu.musique.stop();
                _jeu.perso.sonMoteur.stop();
                _jeu.state.start("Gagnant", true);//Chargement de l'état "gagnant".
            }, this);
        },
             
        //Boucle d'update du jouer.js.
        update: function() {
            
            _jeu.camera.x += _jeu.vitesseBg;//Fait avancer la caméra en additionnant la position du X de la caméra et la vitesse de défilement du background.
            if (!_jeu.camera.atLimit.x) {//Si on n'est pas encore rendu au bout du tableau...
                _jeu.bgFlou.x += (_jeu.vitesseBg / 2);//Défilement du background flou 2 x plus lentement que le background.
            }
        
            if (_jeu.perso.distanceRestante <= 0 && _jeu.niveauCharge) {//Si le joueur à parcouru toute la distance du niveau et que le niveau est chargé...
                _jeu.niveauCharge = false;//Niveau chargé est mis à false. Permet de corriger un bug qui faisait que finNiveau était appellé 2 fois de suite.
                _jeu.musique.stop();//Arrêt de la musique du niveau.

                _jeu.texteFinNiveau = new TexteFinNiveau(_jeu);//Ajout de l'objet TexteFinNiveau.
                _jeu.add.existing(_jeu.texteFinNiveau);
                
                if (_jeu.niveauActuel < _jeu.infoJeu.general.nbNiveaux) {//Si le niveau dans lequel on est est inférieur au nombre de niveaux du jeu...
                    this.finNiveau();//On charge le prochain niveau.
                }
                else {
                    this.finJeu();//Le jeu est fini.
                }
            }
            
            /*=== GESTION DES ENNEMIS ===*/            

            if (_jeu.NouvelEnnemi) {//Si un nouvel ennemi est appelé...
                _jeu.NouvelEnnemi = false;//Booléen qui contrôle la vitesse de création des ennemis avec le timer dans la fonction genererEnnemi.
                this.genererEnnemi();//Appel de fonction de création d'un ennemi.
            }
        },
        
        render: function() {
            //Pour fins de débuggage.
//            _jeu.debug.cameraInfo(_jeu.camera, 32, 48);//Infos relatives à la caméra.
        }
    }
    return jouer;
})();