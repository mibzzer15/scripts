// ==UserScript==
// @name         WhoShared
// @version      1.0.3
// @description  Shows who shared the mission. Search function then also searches for names.
// @author       HerrWaldgott; translated by tylernelson224
// @match      *://www.missionchief.com/
// @downloadURL  https://github.com/mibzzer15/scripts/raw/main/WhoShared.user.js
// @updateURL    https://github.com/mibzzer15/scripts/raw/main/WhoShared.user.js
// @grant        none
// @namespace    https://github.com/mibzzer15

// ==/UserScript==

(function() {
    'use strict';

    $('#mission_list_sicherheitswache > .missionSideBarEntry, #mission_list_krankentransporte > .missionSideBarEntry, #mission_list > .missionSideBarEntry, #mission_list_alliance > .missionSideBarEntry, #mission_list_alliance_event > .missionSideBarEntry').each(async function(){
        var $this = $(this);
        var $attributes = $this[0].attributes;
        var missionId = +($attributes).mission_id.value;
        await new Promise(resolve => {
            $.get("https://www.missionchief.com/missions/" + missionId, function (data, status) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(data, 'text/html');
                var div = htmlDoc.getElementById('col_left');
                var nameDiv = div.getElementsByClassName('alert-info');
                var name = nameDiv[0].childNodes[1].innerHTML;

                var id = "mission_address_" + missionId;
                $('#' + id).text($('#' + id).text() + " - " + name);
                $('#mission_' + missionId).attr('search_attribute', $('#mission_' + missionId).attr('search_attribute') + ", " + name);
                window.setTimeout(resolve, 100);
            });
        });
    });
})();
