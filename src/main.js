(function () {
    var jeu = new Phaser.Game(1366, 768, Phaser.AUTO, '');//Création du jeu et des limites de la caméra.
    
    jeu.state.add("Demarrage", demarrage);  // Boot
    jeu.state.add("Chargement", chargement);  // Loading
    jeu.state.add("Menu", menu);  // Menu de démarrage
    jeu.state.add("Jouer", jouer);  // Le jeu
    jeu.state.add("Gagnant", gagnant);  // La fin gagnante
    jeu.state.add("Perdant", perdant);  // La fin perdante
    jeu.state.start("Demarrage");
    console.log('main');
})();