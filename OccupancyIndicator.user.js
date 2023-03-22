// ==UserScript==
// @name        Occupancy Indicator
// @namespace   bos-ernie.leitstellenspiel.de
// @version     1.0.0
// @license     BSD-3-Clause
// @author      BOS-Ernie; translated by tylernelson224
// @description Shows the occupancy of beds, cells and schools of own and alliance buildings.
// @match       https://www.leitstellenspiel.de/
// @match       https://www.missionchief.com/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// ==/UserScript==

(function () {
  "use strict";

  let buildings;
  let allianceBuildings;

  function addButton() {
    const divider = document.createElement("li");
    divider.setAttribute("class", "divider");
    divider.setAttribute("role", "presentation");

    document
      .getElementById("logout_button")
      .parentElement.parentElement.append(divider);

    const bedIcon = document.createElement("span");
    bedIcon.setAttribute("class", "glyphicon glyphicon-blackboard");

    const button = document.createElement("a");
    button.setAttribute("href", "javascript: void(0)");
    button.setAttribute("id", "occupancy-button");
    button.append(bedIcon);
    button.append(" Occupancy Indicator");
    button.addEventListener("click", buttonClick);

    const li = document.createElement("li");
    li.appendChild(button);

    document
      .getElementById("logout_button")
      .parentElement.parentElement.append(li);
  }

  function addModal() {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "occupancy-modal";
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "occupancy-modal-label");
    modal.setAttribute("aria-hidden", "true");
    modal.style.zIndex = "5000";
    modal.innerHTML = `
<div class="modal-dialog modal-lg" role="document" style="width: 1280px;">
    <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title" id="occupancy-modal-label"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span> Occupancy Indicator</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 212px);overflow-y: auto;">
            <div>
                <!-- Summary -->
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Building Type</th>
                            <th>Own Buildings</th>
                            <th>Alliance Buildings</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Hospitals</td>
                            <td id="summary-hospitals-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td id="summary-alliance-hospitals-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Cells</td>
                            <td id="summary-cells-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td id="summary-alliance-cells-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>Academies</td>
                            <td id="summary-schools-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td id="summary-alliance-schools-occupancy">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr class="divider">
                <!-- Nav tabs -->
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" class="active">
                        <a href="#hospitals-panel" aria-controls="hospitals-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-bed" aria-hidden="true"></span> Hospitals</a>
                    </li>
                    <li role="presentation">
                        <a href="#alliance-hospitals-panel" aria-controls="alliance-hospitals-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-bed" aria-hidden="true"></span> Alliance Hospitals</a>
                    </li>
                    <li role="presentation">
                        <a href="#cells-panel" aria-controls="cells-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Cells</a>
                    </li>
                    <li role="presentation">
                        <a href="#alliance-cells-panel" aria-controls="alliance-cells-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Alliance Cells</a>
                    </li>
                    <li role="presentation">
                        <a href="#schools-panel" aria-controls="schools-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span> Academies</a>
                    </li>
                    <li role="presentation">
                        <a href="#alliance-schools-panel" aria-controls="alliance-schools-panel" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span> Alliance Academies</a>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="hospitals-panel">
                        <div id="hospitals-occupancy" class="resizable">
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
                    <div role="tabpanel" class="tab-pane" id="alliance-hospitals-panel">
                        <div id="alliance-hospitals-occupancy" class="resizable">
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
                    <div role="tabpanel" class="tab-pane" id="cells-panel">
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
                    <div role="tabpanel" class="tab-pane" id="alliance-cells-panel">
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
                    <div role="tabpanel" class="tab-pane" id="schools-panel">
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
                    <div role="tabpanel" class="tab-pane" id="alliance-schools-panel">
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
            </div>
        </div>
    </div>
</div>
`;
    document.body.appendChild(modal);
  }

  function addStyle() {
    const style =
      ".loader{width:100px;height:100px;border-radius:100%;position:relative;margin:0 auto;top:40px;left:-2.5px}.loader span{display:inline-block;width:5px;height:20px;background-color:#c9302c}.loader span:first-child{animation:1s ease-in-out infinite grow}.loader span:nth-child(2){animation:1s ease-in-out .15s infinite grow}.loader span:nth-child(3){animation:1s ease-in-out .3s infinite grow}.loader span:nth-child(4){animation:1s ease-in-out .45s infinite grow}@keyframes grow{0%,100%{-webkit-transform:scaleY(1);-ms-transform:scaleY(1);-o-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(1.8);-ms-transform:scaleY(1.8);-o-transform:scaleY(1.8);transform:scaleY(1.8)}}";

    const styleElement = document.createElement("style");
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  }

  async function fetchBuildings() {
    if (buildings) {
      return buildings;
    }

    buildings = await fetch("/api/buildings")
      .then((response) => response.json())
      .then((buildings) => {
        return buildings.sort((a, b) => {
          if (a.caption < b.caption) return -1;
          if (a.caption > b.caption) return 1;
          return 0;
        });
      });

    return buildings;
  }

  async function fetchAllianceBuildings() {
    if (allianceBuildings) {
      return allianceBuildings;
    }

    allianceBuildings = await fetch("/api/alliance_buildings")
      .then((response) => response.json())
      .then((buildings) => {
        return buildings.sort((a, b) => {
          if (a.caption < b.caption) return -1;
          if (a.caption > b.caption) return 1;
          return 0;
        });
      });

    return allianceBuildings;
  }

  function renderProgressbarAbsolute(capacity, used) {
    return renderProgressbar(capacity, used, used + "/" + capacity);
  }

  function renderProgressbarRelative(capacity, used) {
    return renderProgressbar(
      capacity,
      used,
      Math.round((used / capacity) * 100) + "%"
    );
  }

  function renderProgressbar(capacity, used, innerText) {
    const occupancy = (used / capacity) * 100;

    let progressBarColor = "progress-bar-success";
    if (occupancy >= 80) {
      progressBarColor = "progress-bar-danger";
    } else if (occupancy >= 40) {
      progressBarColor = "progress-bar-warning";
    }

    const progressBarInner = document.createElement("div");
    progressBarInner.classList.add("progress-bar");
    progressBarInner.classList.add(progressBarColor);
    progressBarInner.setAttribute("role", "progressbar");
    progressBarInner.setAttribute("aria-valuenow", used);
    progressBarInner.setAttribute("aria-valuemin", "0");
    progressBarInner.setAttribute("aria-valuemax", capacity);
    progressBarInner.setAttribute("style", "width: " + occupancy + "%;");
    progressBarInner.innerText = innerText;

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress");

    progressBar.appendChild(progressBarInner);

    return progressBar;
  }

  function renderHospitalsTable(hospitals) {
    const hospitalTable = document.createElement("table");
    hospitalTable.classList.add(
      "table",
      "table-striped",
      "table-hover",
      "table-condensed"
    );

    const hospitalTableHeader = document.createElement("thead");
    const hospitalTableHeaderRow = document.createElement("tr");
    const hospitalTableHeaderCaption = document.createElement("th");
    hospitalTableHeaderCaption.innerText = "Hospital";
    const hospitalTableHeaderLevel = document.createElement("th");
    hospitalTableHeaderLevel.innerText = "Capacity";
    const hospitalTableHeaderAllianceShare = document.createElement("th");
    hospitalTableHeaderAllianceShare.innerText = "Tax";
    const hospitalTableHeaderOccupancy = document.createElement("th");
    hospitalTableHeaderOccupancy.innerText = "Work Load";

    hospitalTableHeaderRow.appendChild(hospitalTableHeaderCaption);
    hospitalTableHeaderRow.appendChild(hospitalTableHeaderLevel);
    hospitalTableHeaderRow.appendChild(hospitalTableHeaderAllianceShare);
    hospitalTableHeaderRow.appendChild(hospitalTableHeaderOccupancy);
    hospitalTableHeader.appendChild(hospitalTableHeaderRow);

    const hospitalTableBody = document.createElement("tbody");
    hospitals.forEach((hospital) => {
      const capacity = hospital.level + 10;

      let levelColor = "warning";
      if (capacity === 30) {
        levelColor = "success";
      }

      const capacitySpan = document.createElement("span");
      capacitySpan.classList.add("label", "label-" + levelColor);
      capacitySpan.innerText = capacity;

      let creditsClass = "warning";
      if (hospital.alliance_share_credits_percentage === 10) {
        creditsClass = "success";
      }

      const creditsSpan = document.createElement("span");
      creditsSpan.classList.add("label", "label-" + creditsClass);
      creditsSpan.innerText = hospital.alliance_share_credits_percentage + "%";

      const hospitalTableRow = document.createElement("tr");
      const hospitalTableRowCaption = document.createElement("td");
      hospitalTableRowCaption.innerText = hospital.caption;
      const hospitalTableRowLevel = document.createElement("td");
      hospitalTableRowLevel.appendChild(capacitySpan);
      const hospitalTableRowAllianceShare = document.createElement("td");
      hospitalTableRowAllianceShare.appendChild(creditsSpan);
      const hospitalTableRowOccupancy = document.createElement("td");
      hospitalTableRowOccupancy.appendChild(
        renderProgressbarAbsolute(hospital.level + 10, hospital.patient_count)
      );

      hospitalTableRow.appendChild(hospitalTableRowCaption);
      hospitalTableRow.appendChild(hospitalTableRowLevel);
      hospitalTableRow.appendChild(hospitalTableRowAllianceShare);
      hospitalTableRow.appendChild(hospitalTableRowOccupancy);
      hospitalTableBody.appendChild(hospitalTableRow);
    });

    hospitalTable.appendChild(hospitalTableHeader);
    hospitalTable.appendChild(hospitalTableBody);

    return hospitalTable;
  }

  function calculateNumberOfHospitalsAndTotalCapacity(hospitals) {
    let totalCapacity = 0;

    hospitals.forEach((hospital) => {
      totalCapacity += hospital.level + 10;
    });

    return totalCapacity;
  }

  async function renderHospitals() {
    await fetchBuildings()
      .then((buildings) =>
        buildings.filter((building) => building.building_type === 2)
      )
      .then((hospitals) => {
        const hospitalTable = renderHospitalsTable(hospitals);

        const totalCapacity =
          calculateNumberOfHospitalsAndTotalCapacity(hospitals);

        const totalPatients = hospitals.reduce((total, hospital) => {
          return total + hospital.patient_count;
        }, 0);

        const infoParagraph = document.createElement("p");
        infoParagraph.innerText =
          hospitals.length + " Building (" + totalCapacity + " Beds)";

        const summaryHospitalsOccupancyDiv = document.getElementById(
          "summary-hospitals-occupancy"
        );
        summaryHospitalsOccupancyDiv.innerHTML = "";
        summaryHospitalsOccupancyDiv.appendChild(
          renderProgressbarRelative(totalCapacity, totalPatients)
        );
        summaryHospitalsOccupancyDiv.appendChild(infoParagraph);

        const hospitalsOccupancyDiv = document.getElementById(
          "hospitals-occupancy"
        );
        hospitalsOccupancyDiv.innerHTML = "";
        hospitalsOccupancyDiv.appendChild(hospitalTable);
      });
  }

  async function renderAllianceHospitals() {
    await fetchAllianceBuildings()
      .then((buildings) =>
        buildings.filter((building) => building.building_type === 2)
      )
      .then((hospitals) => {
        const hospitalTable = renderHospitalsTable(hospitals);

        const totalCapacity =
          calculateNumberOfHospitalsAndTotalCapacity(hospitals);

        const totalPatients = hospitals.reduce((total, hospital) => {
          return total + hospital.patient_count;
        }, 0);

        const infoParagraph = document.createElement("p");
        infoParagraph.innerText =
          hospitals.length + " Building (" + totalCapacity + " Beds)";

        const summaryHospitalsOccupancyDiv = document.getElementById(
          "summary-alliance-hospitals-occupancy"
        );
        summaryHospitalsOccupancyDiv.innerHTML = "";
        summaryHospitalsOccupancyDiv.appendChild(
          renderProgressbarRelative(totalCapacity, totalPatients)
        );
        summaryHospitalsOccupancyDiv.appendChild(infoParagraph);

        const hospitalsOccupancyDiv = document.getElementById(
          "alliance-hospitals-occupancy"
        );
        hospitalsOccupancyDiv.innerHTML = "";
        hospitalsOccupancyDiv.appendChild(hospitalTable);
      });
  }

  function renderCellsTable(buildings) {
    const cellsTable = document.createElement("table");
    cellsTable.classList.add("table", "table-striped");

    const cellsTableHeaderRow = document.createElement("tr");
    const cellsTableHeaderCaption = document.createElement("th");
    cellsTableHeaderCaption.innerText = "Name";
    const cellsTableHeaderCapacity = document.createElement("th");
    cellsTableHeaderCapacity.innerText = "Capacity";
    const cellsTableHeaderProvision = document.createElement("th");
    cellsTableHeaderProvision.innerText = "Tax";
    const cellsTableHeaderOccupancy = document.createElement("th");
    cellsTableHeaderOccupancy.innerText = "Work Load";

    const cellsTableHeader = document.createElement("thead");
    cellsTableHeaderRow.appendChild(cellsTableHeaderCaption);
    cellsTableHeaderRow.appendChild(cellsTableHeaderCapacity);
    cellsTableHeaderRow.appendChild(cellsTableHeaderProvision);
    cellsTableHeaderRow.appendChild(cellsTableHeaderOccupancy);
    cellsTableHeader.appendChild(cellsTableHeaderRow);

    const cellsTableBody = document.createElement("tbody");
    buildings.forEach((building) => {
      let capacityClass = "warning";

      if (building.buildingType !== 10) {
        console.log(building);
        debugger;
      }

      if (building.smallBuilding === false && building.numberOfCells === 10) {
        capacityClass = "success";
      }
      if (building.smallBuilding === true && building.numberOfCells === 2) {
        capacityClass = "success";
      }

      const capacitySpan = document.createElement("span");
      capacitySpan.classList.add("label", "label-" + capacityClass);
      capacitySpan.innerText = building.numberOfCells;

      const buildingLink = document.createElement("a");
      buildingLink.href = "/buildings/" + building.id;
      buildingLink.innerText = building.caption;
      buildingLink.setAttribute("target", "_blank");

      let provisionClass = "warning";
      if (building.provision === 10) {
        provisionClass = "success";
      }

      const provisionSpan = document.createElement("span");
      provisionSpan.classList.add("label", "label-" + provisionClass);
      provisionSpan.innerText = building.provision;
      if (!isNaN(building.provision)) {
        provisionSpan.innerText += "%";
      }

      const cellsTableRowCaption = document.createElement("td");
      cellsTableRowCaption.appendChild(buildingLink);
      const cellsTableRowCapacity = document.createElement("td");
      cellsTableRowCapacity.appendChild(capacitySpan);
      const cellsTableRowProvision = document.createElement("td");
      cellsTableRowProvision.appendChild(provisionSpan);
      const cellsTableRowOccupancy = document.createElement("td");
      cellsTableRowOccupancy.append(
        renderProgressbarAbsolute(
          building.numberOfCells,
          building.numberOfPrisoners
        )
      );

      const cellsTableRow = document.createElement("tr");
      cellsTableRow.appendChild(cellsTableRowCaption);
      cellsTableRow.appendChild(cellsTableRowCapacity);
      cellsTableRow.appendChild(cellsTableRowProvision);
      cellsTableRow.appendChild(cellsTableRowOccupancy);
      cellsTableBody.appendChild(cellsTableRow);
    });

    cellsTable.appendChild(cellsTableHeader);
    cellsTable.appendChild(cellsTableBody);

    return cellsTable;
  }

  async function renderCells() {
    // policeStations constitutes an array of objects which have the following structure:
    // {
    //   id: 123456,
    //   caption: "Polizeistation",
    //   buildingType: 6, // Either 6 or 19
    //   numberOfCells: 10, // sum of all extensions of type id 0 through 9
    //   numberOfPrisoners: 5, // taken from prisoner_count of the building
    // }

    let policeStations = await fetchBuildings()
      .then((buildings) =>
        buildings.filter(
          (building) =>
            building.building_type === 5 || building.building_type === 15
        )
      )
      .then((policeStations) => {
        return policeStations.map((policeStation) => {
          let numberOfCells = policeStation.extensions.filter(
            (extension) => extension.type_id >= 0 && extension.type_id <= 9
          ).length;

          return {
            id: policeStation.id,
            caption: policeStation.caption,
            buildingType: policeStation.building_type,
            smallBuilding: policeStation.small_building,
            numberOfCells: numberOfCells,
            numberOfPrisoners: policeStation.prisoner_count,
            provision: policeStation.alliance_share_credits_percentage,
          };
        });
      });

    const totalCapacity = policeStations.reduce(
      (accumulator, currentValue) => accumulator + currentValue.numberOfCells,
      0
    );
    const totalOccupancy = policeStations.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.numberOfPrisoners,
      0
    );

    const infoParagraph = document.createElement("p");
    infoParagraph.innerText =
      policeStations.length + " Building (" + totalCapacity + " Cells)";

    const summaryCellsOccupancyDiv = document.getElementById(
      "summary-cells-occupancy"
    );
    summaryCellsOccupancyDiv.innerHTML = "";
    summaryCellsOccupancyDiv.appendChild(
      renderProgressbarRelative(totalCapacity, totalOccupancy)
    );
    summaryCellsOccupancyDiv.appendChild(infoParagraph);

    const cellsPanel = document.getElementById("cells-panel");
    cellsPanel.innerHTML = "";
    cellsPanel.appendChild(renderCellsTable(policeStations));
  }

  function renderAllianceCellsTable(policeStations) {
    const cellsTable = document.createElement("table");
    cellsTable.classList.add("table", "table-bordered", "table-striped");

    const cellsTableHeaderRow = document.createElement("tr");
    const cellsTableHeaderCaption = document.createElement("th");
    cellsTableHeaderCaption.innerText = "Building";
    const cellsTableHeaderCapacity = document.createElement("th");
    cellsTableHeaderCapacity.innerText = "Capacity";
    const cellsTableHeaderProvision = document.createElement("th");
    cellsTableHeaderProvision.innerText = "Tax";
    const cellsTableHeaderOccupancy = document.createElement("th");
    cellsTableHeaderOccupancy.innerText = "Work Load";

    const cellsTableHeader = document.createElement("thead");
    cellsTableHeaderRow.appendChild(cellsTableHeaderCaption);
    cellsTableHeaderRow.appendChild(cellsTableHeaderCapacity);
    cellsTableHeaderRow.appendChild(cellsTableHeaderProvision);
    cellsTableHeaderRow.appendChild(cellsTableHeaderOccupancy);
    cellsTableHeader.appendChild(cellsTableHeaderRow);

    const cellsTableBody = document.createElement("tbody");
    policeStations.forEach((building) => {
      let capacityClass = "warning";

      if (building.buildingType !== 10) {
        console.log(building);
        debugger;
      }

      if (building.smallBuilding === false && building.numberOfCells === 10) {
        capacityClass = "success";
      }
      if (building.smallBuilding === true && building.numberOfCells === 2) {
        capacityClass = "success";
      }

      const capacitySpan = document.createElement("span");
      capacitySpan.classList.add("label", "label-" + capacityClass);
      capacitySpan.innerText = building.numberOfCells;

      const buildingLink = document.createElement("a");
      buildingLink.href = "/buildings/" + building.id;
      buildingLink.innerText = building.caption;
      buildingLink.setAttribute("target", "_blank");

      let provisionClass = "warning";
      if (building.provision === 0) {
        provisionClass = "success";
      }

      const provisionSpan = document.createElement("span");
      provisionSpan.classList.add("label", "label-" + provisionClass);
      provisionSpan.innerText = building.provision;
      if (!isNaN(building.provision)) {
        provisionSpan.innerText += "%";
      }

      const cellsTableRowCaption = document.createElement("td");
      cellsTableRowCaption.appendChild(buildingLink);
      const cellsTableRowCapacity = document.createElement("td");
      cellsTableRowCapacity.appendChild(capacitySpan);
      const cellsTableRowProvision = document.createElement("td");
      cellsTableRowProvision.appendChild(provisionSpan);
      const cellsTableRowOccupancy = document.createElement("td");
      cellsTableRowOccupancy.appendChild(
        renderProgressbarAbsolute(
          building.numberOfCells,
          building.numberOfPrisoners
        )
      );

      const cellsTableRow = document.createElement("tr");
      cellsTableRow.appendChild(cellsTableRowCaption);
      cellsTableRow.appendChild(cellsTableRowCapacity);
      cellsTableRow.appendChild(cellsTableRowProvision);
      cellsTableRow.appendChild(cellsTableRowOccupancy);

      cellsTableBody.appendChild(cellsTableRow);
    });

    cellsTable.appendChild(cellsTableHeader);
    cellsTable.appendChild(cellsTableBody);

    return cellsTable;
  }

  async function renderAllianceCells() {
    let alliancePoliceStations = await fetchAllianceBuildings()
      .then((buildings) =>
        buildings.filter((building) => building.building_type === 10)
      )
      .then((policeStations) => {
        return policeStations.map((policeStation) => {
          let numberOfCells = policeStation.extensions.filter(
            (extension) => extension.type_id >= 0 && extension.type_id <= 9
          ).length;

          return {
            id: policeStation.id,
            caption: policeStation.caption,
            buildingType: policeStation.building_type,
            smallBuilding: policeStation.small_building,
            numberOfCells: numberOfCells,
            numberOfPrisoners: policeStation.prisoner_count,
            provision: policeStation.alliance_share_credits_percentage,
          };
        });
      });

    const totalCapacity = alliancePoliceStations.reduce(
      (accumulator, currentValue) => accumulator + currentValue.numberOfCells,
      0
    );
    const totalOccupancy = alliancePoliceStations.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.numberOfPrisoners,
      0
    );

    const infoParagraph = document.createElement("p");
    infoParagraph.innerText =
      alliancePoliceStations.length + " Building (" + totalCapacity + " Cells)";

    const summaryCellsOccupancyDiv = document.getElementById(
      "summary-alliance-cells-occupancy"
    );
    summaryCellsOccupancyDiv.innerHTML = "";
    summaryCellsOccupancyDiv.appendChild(
      renderProgressbarRelative(totalCapacity, totalOccupancy)
    );
    summaryCellsOccupancyDiv.appendChild(infoParagraph);

    const cellsPanel = document.getElementById("alliance-cells-panel");
    cellsPanel.innerHTML = "";
    cellsPanel.appendChild(renderAllianceCellsTable(alliancePoliceStations));
  }

  function renderSchoolsTable(schools) {
    const schoolsTable = document.createElement("table");
    schoolsTable.classList.add("table", "table-bordered", "table-striped");

    const schoolsTableHeaderRow = document.createElement("tr");
    const schoolsTableHeaderCaption = document.createElement("th");
    schoolsTableHeaderCaption.innerText = "Building";
    const schoolsTableHeaderCapacity = document.createElement("th");
    schoolsTableHeaderCapacity.innerText = "Capacity";
    const schoolsTableHeaderOccupancy = document.createElement("th");
    schoolsTableHeaderOccupancy.innerText = "Work Load";

    const schoolsTableHeader = document.createElement("thead");
    schoolsTableHeaderRow.appendChild(schoolsTableHeaderCaption);
    schoolsTableHeaderRow.appendChild(schoolsTableHeaderCapacity);
    schoolsTableHeaderRow.appendChild(schoolsTableHeaderOccupancy);
    schoolsTableHeader.appendChild(schoolsTableHeaderRow);

    const schoolsTableBody = document.createElement("tbody");
    schools.forEach((building) => {
      const buildingLink = document.createElement("a");
      buildingLink.href = "/buildings/" + building.id;
      buildingLink.innerText = building.caption;
      buildingLink.setAttribute("target", "_blank");

      let capacityClass = "warning";
      if (building.capacity === 4) {
        capacityClass = "success";
      }

      let capacitySpan = document.createElement("span");
      capacitySpan.classList.add("label", "label-" + capacityClass);
      capacitySpan.innerText = building.capacity;

      const schoolsTableRowCaption = document.createElement("td");
      schoolsTableRowCaption.appendChild(buildingLink);
      const schoolsTableRowCapacity = document.createElement("td");
      schoolsTableRowCapacity.appendChild(capacitySpan);
      const schoolsTableRowOccupancy = document.createElement("td");
      schoolsTableRowOccupancy.appendChild(
        renderProgressbarAbsolute(building.capacity, building.occupancy)
      );

      const schoolsTableRow = document.createElement("tr");
      schoolsTableRow.appendChild(schoolsTableRowCaption);
      schoolsTableRow.appendChild(schoolsTableRowCapacity);
      schoolsTableRow.appendChild(schoolsTableRowOccupancy);

      schoolsTableBody.appendChild(schoolsTableRow);
    });

    schoolsTable.appendChild(schoolsTableHeader);
    schoolsTable.appendChild(schoolsTableBody);

    return schoolsTable;
  }

  async function renderSchools() {
    let schools = await fetchBuildings()
      .then((buildings) =>
        buildings.filter(
          (building) =>
            building.building_type === 4 ||
            building.building_type === 7 ||
            building.building_type === 19 ||
            building.building_type === 24
        )
      )
      .then((schools) => {
        return schools.map((school) => {
          let numberOfRooms = school.extensions.filter(
            (extension) => extension.type_id >= 0 && extension.type_id <= 2
          ).length;

          return {
            id: school.id,
            caption: school.caption,
            buildingType: school.building_type,
            capacity: 1 + numberOfRooms,
            occupancy: school.schoolings.length,
          };
        });
      });

    const totalCapacity = schools.reduce(
      (accumulator, currentValue) => accumulator + currentValue.capacity,
      0
    );
    const totalOccupancy = schools.reduce(
      (accumulator, currentValue) => accumulator + currentValue.occupancy,
      0
    );

    const infoParagraph = document.createElement("p");
    infoParagraph.innerText =
      schools.length + " Building (" + totalCapacity + " Classrooms)";

    const summaryCellsOccupancyDiv = document.getElementById(
      "summary-schools-occupancy"
    );
    summaryCellsOccupancyDiv.innerHTML = "";
    summaryCellsOccupancyDiv.appendChild(
      renderProgressbarRelative(totalCapacity, totalOccupancy)
    );
    summaryCellsOccupancyDiv.appendChild(infoParagraph);

    const schoolsPanel = document.getElementById("schools-panel");
    schoolsPanel.innerHTML = "";
    schoolsPanel.appendChild(renderSchoolsTable(schools));
  }

  async function renderAllianceSchools() {
    let allianceSchools = await fetchAllianceBuildings()
      .then((buildings) =>
        buildings.filter(
          (building) =>
            building.building_type === 4 ||
            building.building_type === 7 ||
            building.building_type === 19 ||
            building.building_type === 24
        )
      )
      .then((schools) => {
        return schools.map((school) => {
          let numberOfRooms = school.extensions.filter(
            (extension) => extension.type_id >= 0 && extension.type_id <= 2
          ).length;

          return {
            id: school.id,
            caption: school.caption,
            buildingType: school.building_type,
            capacity: 1 + numberOfRooms,
            occupancy: school.schoolings.length,
            provision: school.alliance_share_credits_percentage,
          };
        });
      });

    const totalCapacity = allianceSchools.reduce(
      (accumulator, currentValue) => accumulator + currentValue.capacity,
      0
    );
    const totalOccupancy = allianceSchools.reduce(
      (accumulator, currentValue) => accumulator + currentValue.occupancy,
      0
    );

    const infoParagraph = document.createElement("p");
    infoParagraph.innerText =
      allianceSchools.length + " Building (" + totalCapacity + " Classrooms)";

    const summarySchoolsOccupancyDiv = document.getElementById(
      "summary-alliance-schools-occupancy"
    );
    summarySchoolsOccupancyDiv.innerHTML = "";
    summarySchoolsOccupancyDiv.appendChild(
      renderProgressbarRelative(totalCapacity, totalOccupancy)
    );
    summarySchoolsOccupancyDiv.appendChild(infoParagraph);

    const schoolsPanel = document.getElementById("alliance-schools-panel");
    schoolsPanel.innerHTML = "";
    schoolsPanel.appendChild(renderSchoolsTable(allianceSchools));
  }

  function buttonClick(event) {
    event.preventDefault();

    $("#occupancy-modal").modal("show");

    renderHospitals();
    renderAllianceHospitals();
    renderCells();
    renderAllianceCells();
    renderSchools();
    renderAllianceSchools();
  }

  function main() {
    addStyle();
    addModal();
    addButton();
  }

  main();
})();
