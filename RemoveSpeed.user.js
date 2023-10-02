// ==UserScript==
// @name         Remove Mission Speed Button
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Removes the mission speed button from the top of the mission list.
// @author       MissSobol; translated to US by tylernelson224
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.police.missionchief.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Element mit der ID "mission_speed_play" auswählen
    var elementToHide = document.getElementById("mission_speed_play");

    // Überprüfen, ob das Element existiert
    if (elementToHide) {
        // Element ausblenden, indem der CSS-Stil geändert wird (display: none)
        elementToHide.style.display = "none";
    }
})();
