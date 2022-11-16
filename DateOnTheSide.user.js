// ==UserScript==
// @name         DateOnTheSide
// @version      1.0.2
// @description  Displays creation date/time of a mission in the missionlist. 
// @author       HerrWaldgott; translated by tylernelson224
// @match        *://www.missionchief.com/
// @downloadURL  https://github.com/mibzzer15/scripts/raw/main/DateOnTheSide.user.js
// @updateURL    https://github.com/mibzzer15/scripts/raw/main/DateOnTheSide.user.js
// @grant        none
// @namespace    https://github.com/mibzzer15
// ==/UserScript==

(async function() {
    'use strict';
    
    $('#mission_list_sicherheitswache > .missionSideBarEntry, #mission_list_krankentransporte > .missionSideBarEntry, #mission_list > .missionSideBarEntry, #mission_list_alliance > .missionSideBarEntry, #mission_list_alliance_event > .missionSideBarEntry').each(async function(){
        var $this = $(this);
        var $attributes = $this[0].attributes;
        var missionId = +($attributes).mission_id.value;
        await new Promise(resolve => {
          $.get("https://www.missionchief.com/missions/" + missionId, function (data, status) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(data, 'text/html');
                var div = htmlDoc.getElementById('mission_general_info');
                var date = div.getAttribute('data-generation-time');
                const generateDate = new Date(date);
                var dd = String(generateDate.getDate()).padStart(2, '0');
                var mm = String(generateDate.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = generateDate.getFullYear();
                var hour = String(generateDate.getHours()).padStart(2, "0");
                var minute = String(generateDate.getMinutes()).padStart(2, "0");
                var second = String(generateDate.getSeconds()).padStart(2, "0");

                var d = mm + '.' + dd + '.' + yyyy + " - " + hour + ":" + minute + ":" + second;

                var id = "mission_panel_heading_" + missionId;
                $('#' + id).append("<small> (" + d + ")</span>");
                window.setTimeout(resolve, 100);
            });
        });
    });
})();
