var demarrage = (function(){
	var _jeu;
var demarrage = function(jeu){
	_jeu = jeu;
};
  
demarrage.prototype = {
	preload: function(){
        _jeu.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;//Scale Manager pour ajuster la taille de l'écran au navigateur / device. Maintien le ratio.
        
		_jeu.load.image("barre_chargement", "assets/chargement.png");//Chargement du sprite de la barre de chargement.
        _jeu.stage.backgroundColor = 0xffffff;
        _jeu.load.audio('musiqueIntro', 'assets/musiqueIntro.mp3');//Chargement de la musique d'intro.
	},
  	create: function(){
        
        _jeu.state.start("Chargement", false);
	}
}	
console.log('démarrage');
return demarrage;	
	
})();

