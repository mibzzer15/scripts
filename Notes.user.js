// ==UserScript==
// @name         Notes
// @version      1.0.2
// @description  ermöglicht Notizen unterhalb der Einsatzliste
// @author       DrTraxx
// @match        https://www.missionchief.com/
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    if(!localStorage.notizen) localStorage.notizen = "";

    $("#btn-group-building-select")
        .parent()
        .parent()
        .after(<div class="form-group btn-group">
                  <label for="geileNotizenTextarea">Notes</label>
                  <textarea class="form-control" id="geileNotizenTextarea" rows="4" style="width:40em">${localStorage.notizen}</textarea>
                  <a class="btn btn-success btn-xs" id="geileNotizenSave">Save</a>
                  <a class="btn btn-danger btn-xs" id="geileNotizenClear">Clear</a>
                </div>);

    $("body").on("click", "#geileNotizenSave", function() {
        localStorage.notizen = $("#geileNotizenTextarea").val();
        alert("Notes have been saved!");
    });

    $("body").on("click", "#geileNotizenClear", function() {
        $("#geileNotizenTextarea").val("");
        localStorage.notizen = "";
        alert("Notes have been cleared!");
    });

})();
