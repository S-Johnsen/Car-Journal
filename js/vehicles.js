function renderVehicleSelector(vehicles) {
  const vehicleList = document.getElementById("vehicleList");

  vehicleList.innerHTML = "";

  if (vehicles.length === 0) {
    const message = document.createElement("p");
    message.className = "journalEmptyMessage";
    message.textContent =
        "Ingen kjøretøy registrert.";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "vehicleCard";
    addButton.textContent = "+ Legg til kjøretøy";

    addButton.addEventListener("click", () => {
        openSettings();

        document.querySelector(
            ".settingsVehicleSection"
        ).open = true;

        openSettingsVehicleForm();
    });

    vehicleList.appendChild(message);
    vehicleList.appendChild(addButton);

    return;
  }

  vehicles.forEach((vehicle) => {
    const vehicleButton = document.createElement("button");

    vehicleButton.type = "button";
    vehicleButton.classList.add("vehicleCard");

    vehicleButton.dataset.vehicleId = vehicle.id;

    const vehicleName = document.createElement("h3");
    vehicleName.textContent =
      `${vehicle.manufacturer} ${vehicle.model}`;

    const registration = document.createElement("p");
    registration.textContent = vehicle.registration;

    vehicleButton.appendChild(vehicleName);
    vehicleButton.appendChild(registration);

    vehicleButton.addEventListener("click", () => {
      selectVehicle(vehicle.id);
    });

    vehicleList.appendChild(vehicleButton);
  });
}

function selectVehicle(vehicleId) {
  appState.selectedVehicleId = vehicleId;
  appState.selectedJournalPostId = null;
  appState.journalFilter = "ALL";
  appState.selectedJournalPostId = null;
  appState.editingJournalPostId = null;

  const vehicle =
    getVehicleById(vehicleId);

  if (!vehicle) {
    console.error(
      "Fant ikke kjøretøy:",
      vehicleId
    );
    return;
  }

  showVehicleView(vehicle);
}

function getVehicleById(vehicleId) {
  return appState.garage.vehicles.find(
    (vehicle) => vehicle.id === vehicleId
  );
}

function showVehicleView(vehicle) {
  document.getElementById("vehicleSelector").hidden = true;
  document.getElementById("vehicleView").hidden = false;

  document.getElementById("journalView").hidden = false;
  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("journalFormView").hidden = true;
  document.getElementById("cheatsheetView").hidden = true;
  document.getElementById("vehicleInfo").hidden = false;

  document.getElementById("vehicleName").textContent =
    `${vehicle.manufacturer} ${vehicle.model}`;

  document.getElementById("vehicleRegistration").textContent =
    vehicle.registration;

  document.getElementById("vehicleYear").textContent =
    vehicle.year;

  renderVehicleNavigation(
    appState.garage.vehicles
  );

  updateActiveJournalFilterButton();

  renderJournalList(vehicle.journal);
}

function renderVehicleNavigation(vehicles) {
  const navigation =
    document.getElementById("vehicleNavigation");

  navigation.innerHTML = "";

  vehicles.forEach((vehicle) => {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("vehicleNavigationButton");

    if (vehicle.id === appState.selectedVehicleId) {
      button.classList.add("selected");
    }

    button.textContent =
      `${vehicle.manufacturer} ${vehicle.model}`;

    button.addEventListener("click", () => {
      selectVehicle(vehicle.id);
    });

    navigation.appendChild(button);
  });
}