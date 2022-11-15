// ==UserScript==
// @name            [LSS] Vehicle and Building Statistics
// @name:de         [LSS] Fahrzeug- und Gebäudestatistik
// @namespace       https://github.com/mibzzer15
// @version         1.0.1
// @description     Select
// @author          BOS-Ernie; translated by tylernelson224
// @description     Lists the number of buildings and vehicles of each type.
// @description:de  Listet die Anzahl der Gebäude und Fahrzeuge jeder Art auf.
// @match           https://www.leitstellenspiel.de/
// @match           https://www.missionchief.com/
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL: https://github.com/mibzzer15/scripts/raw/main/Stats.user.js
// @updateURL: https://github.com/mibzzer15/scripts/raw/main/Stats.user.js
// @run-at          document-idle
// @grant           none
// ==/UserScript==

//////////////////////////////////////////////
//
// Vehicle Types and Buildings Statistics
//
// https://snipboard.io/JRXqQ8.jpg
// https://snipboard.io/k7xCMv.jpg
//
////////////////////////////////////////////////////

(function () {
  "use strict";

  // Generate Modal
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "statistics-modal";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "statistics-modal-label");
  modal.setAttribute("aria-hidden", "true");
  modal.style.zIndex = "5000";
  modal.innerHTML = `
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="statistics-modal-label"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span> Vehicle & Building Statistics</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">    
                <span aria-hidden="true">&times;</span>
            </button>   
        </div>  
        <div class="modal-body" style="max-height: calc(100vh - 212px);overflow-y: auto;">
            <div>
                <!-- Nav tabs -->
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" class="active"><a href="#vehicle-types-panel" aria-controls="vehicle-types-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-knight" aria-hidden="true"></span> Vehicles</a></li>
                    <li role="presentation"><a href="#buildings-panel" aria-controls="buildings-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Buildings</a></li>
                    <li role="presentation"><a href="#export-panel" aria-controls="export-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-export" aria-hidden="true"></span> Export</a></li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="vehicle-types-panel">
                        <div id="vehicle-types-statistics" class="resizable">
                            <div class="row">
                                <div class="col-md-12 bg">
                                    <div class="loader">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="buildings-panel">
                        <div id="buildings-statistics" class="resizable">
                            <div class="row">
                                <div class="col-md-12 bg">
                                    <div class="loader">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="export-panel">
                        <div id="export" class="resizable">
                            <textarea id="export-textarea" class="form-control" rows="20"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
  document.body.appendChild(modal);

  // Add statistics button
  const divider = document.createElement("li");
  divider.setAttribute("class", "divider");
  divider.setAttribute("role", "presentation");
  document
    .getElementById("logout_button")
    .parentElement.parentElement.append(divider);
  const li = document.createElement("li");
  li.innerHTML =
    '<a href="javascript: void(0)" id="statistics-button"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span> Vehicle & Building Statistics</a>';
  document
    .getElementById("logout_button")
    .parentElement.parentElement.append(li);

  // Generate Statistics
  async function generateStatistic() {
    $("#statistics-modal").modal("show");

    const vehicles = fetch("https://www.missionchief.com/api/vehicles").then(
      (response) => response.json()
    );
    await vehicles;
    vehicles.then((result) => {
      const vehicleTypes = {};
      result.forEach((vehicle) => {
        if (vehicleTypes[vehicle.vehicle_type]) {
          vehicleTypes[vehicle.vehicle_type]["count"]++;
        } else {
          vehicleTypes[vehicle.vehicle_type] = {
            count: 1,
            name: vehicle.caption,
          };
        }
      });

      const orderedVehicleTypes = Object.values(vehicleTypes).sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      // Render vehicle types as HTML table
      const tableHead = document.createElement("thead");
      tableHead.innerHTML = "<tr><th>Unit:</th><th>Quantity:</th></tr>";

      const table = document.createElement("table");
      table.setAttribute(
        "class",
        "table table-responsive table-hover table-striped"
      );
      table.appendChild(tableHead);

      const tableBody = document.createElement("tbody");

      orderedVehicleTypes.forEach((vehicleType) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${vehicleType.name}</td><td>${vehicleType.count}</td>`;

        tableBody.appendChild(row);
      });

      table.appendChild(tableBody);

      document.getElementById("vehicle-types-statistics").innerHTML =
        table.outerHTML;

      // Place ordered vehicles as string in export textarea
      let exportString = "";
      for (const vehicleType in orderedVehicleTypes) {
        exportString += `${orderedVehicleTypes[vehicleType].name}: ${orderedVehicleTypes[vehicleType].count}\n`;
      }
      document.getElementById("export-textarea").value = "Vehicles\n";
      document.getElementById("export-textarea").value +=
        "=====================\n";
      document.getElementById("export-textarea").value += exportString;
    });

    const buildingTypeNames = {
      1: "Dispatch Center",
      0: "Fire Station",
      18: "Federal Police Station",
      7: "Police Academy",
      2: "Hospital",
      20: "Large Complex",
      3: "Ambulance Station",
      4: "Fire Academy",
      5: "Police Station",
      12: "Rescue Boat Dock",
      6: "HEMS Station",
      19: "Rescue (EMS) Academy",
      11: "Fire Boat Dock",
      17: "Firefighting Plane Station",
      13: "Fire Station (Small)",
      8: "Police Aviation",
      9: "Staging Area",
      10: "Prison",
      14: "Clinic",
      15: "Police Station (Small)",
      21: "Small Complex",
      16: "Ambulance Station (Small)",
      22: "Fire Marshal's Office",
      23: "Coastal Rescue Station",
      24: "Coastal Rescue School",
      25: "Coastal Air Station",
      26: "Lifeguard Post",
    };

    const buildings = fetch(
      "https://www.missionchief.com/api/buildings"
    ).then((response) => response.json());
    await buildings;
    buildings.then((result) => {
      const buildings = {};
      result.forEach((building) => {
        if (buildings[building.building_type]) {
          buildings[building.building_type]["count"]++;
        } else {
          buildings[building.building_type] = {
            count: 1,
            name: buildingTypeNames[building.building_type],
          };
        }
      });

      // Sort buildings by name case-insensitive
      const orderedBuildings = Object.values(buildings).sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      // Render buildings as HTML table
      const tableHead = document.createElement("thead");
      tableHead.innerHTML = "<tr><th>Type:</th><th>Quantity:</th></tr>";

      const table = document.createElement("table");
      table.setAttribute(
        "class",
        "table table-responsive table-hover table-striped"
      );
      table.appendChild(tableHead);

      const tableBody = document.createElement("tbody");

      orderedBuildings.forEach((buildingType) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${buildingType.name}</td><td>${buildingType.count}</td>`;

        tableBody.appendChild(row);
      });

      table.appendChild(tableBody);

      document.getElementById("buildings-statistics").innerHTML =
        table.outerHTML;

      // Place ordered buildings as string in export textarea
      let exportString = "";
      for (const buildingType in orderedBuildings) {
        exportString += `${orderedBuildings[buildingType].name}: ${orderedBuildings[buildingType].count}\n`;
      }
      document.getElementById("export-textarea").value += "\n\nBuilding\n";
      document.getElementById("export-textarea").value +=
        "=====================\n";
      document.getElementById("export-textarea").value += exportString;

      document.getElementById("export-textarea").value +=
        "\n\nStand: " + new Date().toLocaleString();

      // Copy exportString to clipboard
      navigator.clipboard.writeText(
        document.getElementById("export-textarea").value
      );
    });
  }

  document
    .getElementById("statistics-button")
    .addEventListener("click", generateStatistic);

  const style =
    ".loader{width:100px;height:100px;border-radius:100%;position:relative;margin:0 auto;top:40px;left:-2.5px}.loader span{display:inline-block;width:5px;height:20px;background-color:#c9302c}.loader span:first-child{animation:1s ease-in-out infinite grow}.loader span:nth-child(2){animation:1s ease-in-out .15s infinite grow}.loader span:nth-child(3){animation:1s ease-in-out .3s infinite grow}.loader span:nth-child(4){animation:1s ease-in-out .45s infinite grow}@keyframes grow{0%,100%{-webkit-transform:scaleY(1);-ms-transform:scaleY(1);-o-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(1.8);-ms-transform:scaleY(1.8);-o-transform:scaleY(1.8);transform:scaleY(1.8)}}";

  // Add style to head
  const styleElement = document.createElement("style");
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
})();
