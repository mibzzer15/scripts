// ==UserScript==
// @name         Set station staff us
// @description  Mass processing of the maximum staff of the guards
// @version      1.0.1
// @author       everyone
// @match     https://*.missionchief.com/buildings/*
// ==/UserScript==
/* global $ */

(function() {
    'use strict';


    if($("#tab_buildings")[0]){
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                if(mutation.addedNodes.length > 1) {
                    if($("#selectBuilding").length === 0) buildInterface();
                }
            })
        }).observe($("#tab_buildings")[0],{childList: true});
    }

    function buildInterface(){
        $("#building_table").before(`<div class="input-group col-xs-3">
                                         <span class="input-group-addon">All</span>
                                         <select class="select optional form-control" id="selectBuilding">
                                         	  <option value="">choose ...</option>
	                                       	  <option value="0"">Fire Station</option>
	                                       	  <option value="13">Fire Station (small)</option>
                                              <option value="3">Ambulance Station</option>
                                              <option value="16">Ambulance station (Small station)</option>
                                              <option value="6">Medical Helicopter station</option>
                                              <option value="8">Police Aviation</option>
                                              <option value="5">Police Station</option>
                                              <option value="15">Police Station (Small station)</option>
                                              <option value="14">Clinic</option>
                                              <option value="11">Fire boat dock</option>
                                              <option value="12">Rescue boat dock</option>
                                              <option value="17">Firefighting plane station</option>
                                              <option value="18">Federal Police Station</option>
                                              <option value="22">Fire Marshal's Office</option>
                                              <option value="23">Coastal Rescue Station</option>
                                              <option value="25">Coastal Air Station</option>
                                              <option value="26">Lifeguard Post</option>
                                         </select>
                                         <span class="input-group-addon">at</span>
                                         <input class="numeric integer optional form-control" id="setMaxPersonal" step="1" type="number" value="0">
                                         <span class="input-group-addon">Set personnel</span>
                                     </div>
                                     <input class="btn btn btn-success" id="savePersonalSettings" name="commit" type="button" value="Save">
                                     <span id="persOut" style="margin-left: 5px"></span>`);

        $("#savePersonalSettings").on("click",function(){
            var selectedTypeId = $("#selectBuilding option:selected")[0].value;
            var selectedTypeName = $("#selectBuilding option:selected")[0].innerText;
            var countSelectedTypes = $("#building_table tbody tr td:nth-child(2) a[building_type='"+selectedTypeId+"']").length;
            var countDoneTypes = 0,
                countLoopings = 0;

            var timerStart = Date.now();
            $("#building_table tbody tr").each(function(i){
                let t = $(this);
                let buildingId = $("td:nth-child(2) a", t).attr("href").match(/\d+/);
                let buildingTypeId = $("td:nth-child(2) a", t).attr("building_type");
                let maxPers = $("#setMaxPersonal")[0].value;

                if(buildingTypeId === selectedTypeId) {
                    countLoopings++;
                    setTimeout(async function(i){
                        await $.post("/buildings/"+buildingId+"?personal_count_target_only=1", {"building":{"personal_count_target":maxPers}, "_method":"put"}).done(function(){
                            countDoneTypes++;
                            $("#building_personal_count_target_"+buildingId).text(maxPers);
                            $("#persOut").text(`${countDoneTypes} of ${countSelectedTypes} ${selectedTypeName} on ${maxPers} Personnel set.`);
                        });
                    },countLoopings*250);
                }
            });
        });
    }
})();
