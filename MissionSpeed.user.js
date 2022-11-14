// ==UserScript==
// @name         MissionSpeed
// @namespace https://github.com/mibzzer15
// @version      2.1.3
// @description  Allows changes to the mission speed above the mission list.
// @author      Allure149; translated by tylernelson224, updated by Mibzzer15
// @downloadURL https://github.com/mibzzer15/scripts/raw/main/MissionSpeed
// @updateURL https://github.com/mibzzer15/scripts/raw/main/MissionSpeed
// @match        https://www.missionchief.com/
// @updateURL    https://github.com/types140/LSS-Scripte/raw/master/missionspeed.user.js
// @icon https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==
/* global $ */


(function() {
    'use strict';

    if($('#mission_select_sicherheitswache').length != 0){
        $('#mission_select_sicherheitswache').after(`<div id="missionSpeed" class="btn-group">
                                                      <a id="mspa" class="btn btn-xs btn-success" title="Pause"><div class="glyphicon glyphicon-pause"></div></a>
                                                      <a id="msfb" class="btn btn-xs btn-success" title="10 Minutes"><div class="glyphicon glyphicon-fast-backward"></div></a>
                                                      <a id="mssb" class="btn btn-xs btn-success" title="7 Minutes"><div class="glyphicon glyphicon-step-backward"></div></a>
                                                      <a id="msb" class="btn btn-xs btn-success" title="5 Minutes"><div class="glyphicon glyphicon-backward"></div></a>
                                                      <a id="mspl" class="btn btn-xs btn-success" title="3 Minutes"><div class="glyphicon glyphicon-play"></div></a>
                                                      <a id="msf" class="btn btn-xs btn-success" title="2 Minutes"><div class="glyphicon glyphicon-forward"></div></a>
                                                      <a id="mssf" class="btn btn-xs btn-success" title="1 Minute"><div class="glyphicon glyphicon-step-forward"></div></a>
                                                      <a id="msff" class="btn btn-xs btn-success" title="30 Seconds"><div class="glyphicon glyphicon-fast-forward"></div></a>
                                                      <a id="msvf" class="btn btn-xs btn-success" title="20 Seconds"><div class="glyphicon glyphicon-plane"></div></a>
                                                  </div>`);
        switch(mission_speed){
            case 0: $('#mspl').toggleClass("btn-success btn-warning");
                break;
            case 1: $('#msf').toggleClass("btn-success btn-warning");
                break;
            case 2: $('#msff').toggleClass("btn-success btn-warning");
                break;
            case 3: $('#msvf').toggleClass("btn-success btn-warning");
                break;
            case 4: $('#msb').toggleClass("btn-success btn-warning");
                break;
            case 5: $('#msfb').toggleClass("btn-success btn-warning");
                break;
            case 6: $('#mspa').toggleClass("btn-success btn-warning");
                break;
        }
    }

    if($('#mission_speed_pause').length != 0) $('#mission_speed_pause').remove();

    $('#mspa, #msfb, #msb, #mspl, #msf, #msff, #msvf').on('click', function(){
        var clickedId = $(this).attr('id');

        switch(clickedId){
            case "mspa": $.get('/missionSpeed?speed=6');
                         mission_speed = 6;
                break;
            case "msfb": $.get('/missionSpeed?speed=5');
                         mission_speed = 5;
                break;
            case "msb": $.get('/missionSpeed?speed=4');
                         mission_speed = 4;
                break;
            case "mspl": $.get('/missionSpeed?speed=0');
                         mission_speed = 0;
                break;
            case "msf": $.get('/missionSpeed?speed=1');
                         mission_speed = 1;
                break;
            case "msff": $.get('/missionSpeed?speed=2');
                         mission_speed = 2;
                break;
            case "msvf": if(user_premium){
                             $.get('/missionSpeed?speed=3');
                             mission_speed = 3;
                         } else {
                             return false;
                         }
                break;
        }

        $('#mspa, #msfb, #msb, #mspl, #msf, #msff, #msvf').removeClass().addClass('btn btn-xs btn-success');

        $('#' + clickedId).toggleClass('btn-success btn-warning');
    });
})();
