let previousSettingsView = null;
let previousSettingsScrollY = 0;


function openSettings() {
    const settingsView =
        document.getElementById("settingsView");

    if (!settingsView.hidden) {
        return;
    }

    const vehicleSelector =
        document.getElementById("vehicleSelector");

    const vehicleView =
        document.getElementById("vehicleView");

    // Husk hvilken hovedvisning brukeren var i.
    previousSettingsView = {
        selectorHidden: vehicleSelector.hidden,
        vehicleHidden: vehicleView.hidden
    };

    previousSettingsScrollY = window.scrollY;

    renderSettingsVehicleList();
    renderSettingsExportVehicles();

    vehicleSelector.hidden = true;
    vehicleView.hidden = true;

    settingsView.hidden = false;

    document.getElementById(
        "openSettingsButton"
    ).hidden = true;

    window.scrollTo(0, 0);
}


function closeSettings() {
    const settingsView =
        document.getElementById("settingsView");

    if (settingsView.hidden || !previousSettingsView) {
        return;
    }

    settingsView.hidden = true;

    document.getElementById(
        "vehicleSelector"
    ).hidden = previousSettingsView.selectorHidden;

    document.getElementById(
        "vehicleView"
    ).hidden = previousSettingsView.vehicleHidden;

    document.getElementById(
        "openSettingsButton"
    ).hidden = false;

    window.scrollTo(0, previousSettingsScrollY);

    previousSettingsView = null;
}


function renderSettingsVehicleList() {
    const container =
        document.getElementById("settingsVehicleList");

    container.replaceChildren();

    const vehicles = appState.garage.vehicles;

    if (vehicles.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Ingen kjøretøy registrert.";
        container.appendChild(message);
        return;
    }

    vehicles.forEach((vehicle) => {
        const item = document.createElement("div");
        item.className = "settingsVehicleItem";

        const info = document.createElement("div");
        info.className = "settingsVehicleInfo";

        const name = document.createElement("strong");
        name.textContent =
            `${vehicle.manufacturer} ${vehicle.model}`;

        const details = document.createElement("p");
        details.textContent =
            `${vehicle.year} · ${vehicle.registration}`;

        info.appendChild(name);
        info.appendChild(details);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "settingsVehicleEditButton";
        editButton.textContent = "Rediger";

        editButton.addEventListener("click", () => {
            openSettingsVehicleForm(vehicle.id);
        });

        const actions = document.createElement("div");
        actions.className = "settingsVehicleActions";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "settingsVehicleDeleteButton";
        deleteButton.textContent = "Slett";

        deleteButton.addEventListener("click", () => {
            deleteSettingsVehicle(vehicle.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(actions);

        container.appendChild(item);
    });
}

/* =========================
   THEME MANAGEMENT
   ========================= */

const THEME_STORAGE_KEY = "carJournalTheme";


function initializeTheme() {
    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);

    // Dark Mode er standard dersom brukeren
    // ikke har valgt et tema tidligere.
    const theme =
        savedTheme === "light" ? "light" : "dark";

    applyTheme(theme);
}


function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const themeButton =
        document.getElementById("settingsThemeButton");

    const themeDescription =
        document.getElementById("settingsThemeDescription");

    if (theme === "dark") {
        themeButton.textContent = "☀ Lyst tema";
        themeDescription.textContent =
            "Mørkt tema aktivert";

    } else {
        themeButton.textContent = "☾ Mørkt tema";
        themeDescription.textContent =
            "Lyst tema aktivert";
    }
}


function toggleTheme() {
    const currentTheme =
        document.documentElement.dataset.theme;

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    // Oppdater grensesnittet.
    applyTheme(newTheme);

    // Husk brukerens valg.
    localStorage.setItem(
        THEME_STORAGE_KEY,
        newTheme
    );
}

/* =========================
   VEHICLE CRUD
   ========================= */

let editingSettingsVehicleId = null;


function openSettingsVehicleForm(vehicleId = null) {
    const form =
        document.getElementById("settingsVehicleForm");

    form.reset();

    document.getElementById("settingsVehicleRegistration").setCustomValidity("");

    editingSettingsVehicleId = vehicleId;

    const vehicle = vehicleId === null
        ? null
        : getVehicleById(vehicleId);

    if (vehicleId !== null && !vehicle) {
        console.error("Fant ikke kjøretøy:", vehicleId);
        return;
    }

    document.getElementById(
        "settingsVehicleFormTitle"
    ).textContent = vehicle
        ? "Rediger kjøretøy"
        : "Nytt kjøretøy";

    document.getElementById(
        "settingsVehicleSaveButton"
    ).textContent = vehicle
        ? "Lagre endringer"
        : "Legg til kjøretøy";

    if (vehicle) {
        document.getElementById(
            "settingsVehicleRegistration"
        ).value = vehicle.registration;

        document.getElementById(
            "settingsVehicleManufacturer"
        ).value = vehicle.manufacturer;

        document.getElementById(
            "settingsVehicleModel"
        ).value = vehicle.model;

        document.getElementById(
            "settingsVehicleYear"
        ).value = vehicle.year;
    }

    form.hidden = false;
}


function closeSettingsVehicleForm() {
    const form =
        document.getElementById("settingsVehicleForm");

    form.hidden = true;
    form.reset();

    editingSettingsVehicleId = null;
}


function submitSettingsVehicleForm(event) {
    event.preventDefault();

    const registrationInput =
        document.getElementById("settingsVehicleRegistration");

    const registration =
        registrationInput.value.trim().toUpperCase();

    const manufacturer =
        document.getElementById(
            "settingsVehicleManufacturer"
        ).value.trim();

    const model =
        document.getElementById(
            "settingsVehicleModel"
        ).value.trim();

    const year = Number(
        document.getElementById(
            "settingsVehicleYear"
        ).value
    );

    if (!registration || !manufacturer || !model ||
        !Number.isInteger(year) || year < 1886 || year > 2100) {
        return;
    }

    // Unngå flere biler med samme registreringsnummer.
    const duplicate = appState.garage.vehicles.some(
        vehicle =>
            vehicle.id !== editingSettingsVehicleId &&
            String(vehicle.registration).trim().toUpperCase()
                === registration
    );

    if (duplicate) {
        registrationInput.setCustomValidity(
            "Registreringsnummeret finnes allerede."
        );
        registrationInput.reportValidity();
        return;
    }

    if (editingSettingsVehicleId !== null) {
        // UPDATE: Endre bare kjøretøyets grunninformasjon.
        const vehicle =
            getVehicleById(editingSettingsVehicleId);

        if (!vehicle) {
            return;
        }

        vehicle.registration = registration;
        vehicle.manufacturer = manufacturer;
        vehicle.model = model;
        vehicle.year = year;

    } else {
        // CREATE: Opprett nytt kjøretøy.
        const vehicle = {
            id: crypto.randomUUID(),
            registration: registration,
            manufacturer: manufacturer,
            model: model,
            year: year,
            journal: [],
            cheatsheet: {
                fields: {},
                notes: "",
                links: []
            }
        };

        appState.garage.vehicles.push(vehicle);
    }

    saveGarageData(appState.garage);

    refreshVehicleDisplays();

    closeSettingsVehicleForm();
}


function refreshVehicleDisplays() {
    const vehicles = appState.garage.vehicles;

    renderVehicleSelector(vehicles);
    renderVehicleNavigation(vehicles);
    renderSettingsVehicleList();
    renderSettingsExportVehicles();

    // Oppdater synlige kjøretøyopplysninger
    // uten å lukke journalen eller Cheatsheet.
    const selectedVehicle =
        getVehicleById(appState.selectedVehicleId);

    if (selectedVehicle) {
        document.getElementById("vehicleName").textContent =
            `${selectedVehicle.manufacturer} ${selectedVehicle.model}`;

        document.getElementById("vehicleRegistration").textContent =
            selectedVehicle.registration;

        document.getElementById("vehicleYear").textContent =
            selectedVehicle.year;

        document.getElementById(
            "cheatsheetVehicleName"
        ).textContent =
            `${selectedVehicle.manufacturer} ${selectedVehicle.model}`;

        document.getElementById(
            "cheatsheetRegistration"
        ).textContent = selectedVehicle.registration;

        document.getElementById(
            "cheatsheetYear"
        ).textContent = selectedVehicle.year;
    }
}

/* =========================
   DELETE VEHICLE
   ========================= */

async function deleteSettingsVehicle(vehicleId) {
    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
        console.error("Fant ikke kjøretøy:", vehicleId);
        return;
    }

    const confirmed = confirm(
        `Vil du slette ${vehicle.manufacturer} ${vehicle.model}?\n\n` +
        "Dette vil permanent fjerne kjøretøyet, journalen, " +
        "Cheatsheet og tilhørende bilder.\n\n" +
        "Handlingen kan ikke angres."
    );

    if (!confirmed) {
        return;
    }

    // Finn bildefilene som tilhører kjøretøyet.
    const mediaKeys = new Set();

    for (const entry of vehicle.journal || []) {
        for (const media of entry.media || []) {
            if (media.storageKey) {
                mediaKeys.add(media.storageKey);
            }
        }
    }

    // Lag ny garasje uten det slettede kjøretøyet.
    const updatedGarage = {
        ...appState.garage,
        vehicles: appState.garage.vehicles.filter(
            item => item.id !== vehicleId
        )
    };

    // Behold bilder som fortsatt brukes av andre kjøretøy.
    for (const otherVehicle of updatedGarage.vehicles) {
        for (const entry of otherVehicle.journal || []) {
            for (const media of entry.media || []) {
                if (media.storageKey) {
                    mediaKeys.delete(media.storageKey);
                }
            }
        }
    }

    // Lagre endringen før bildefilene fjernes.
    try {
        saveGarageData(updatedGarage);
    } catch (error) {
        console.error("Kunne ikke slette kjøretøy:", error);
        alert("Kunne ikke lagre endringen. Ingen bilder er slettet.");
        return;
    }

    appState.garage = updatedGarage;

    // Dersom det slettede kjøretøyet var valgt,
    // nullstill tilstanden.
    if (appState.selectedVehicleId === vehicleId) {
        appState.selectedVehicleId = null;
        appState.selectedJournalPostId = null;
        appState.editingJournalPostId = null;
        appState.journalFilter = "ALL";

        appState.pendingMediaFiles = [];
        appState.removedMediaIds = [];

        // Tilbake fra innstillinger skal nå vise bilvelgeren.
        if (previousSettingsView) {
            previousSettingsView.selectorHidden = false;
            previousSettingsView.vehicleHidden = true;
        }
    }

    // Lukk redigeringsskjemaet dersom det gjelder samme bil.
    if (editingSettingsVehicleId === vehicleId) {
        closeSettingsVehicleForm();
    }

    // Oppdater grensesnittet.
    refreshVehicleDisplays();

    // Slett bildefiler som ikke lenger er i bruk.
    let failedMediaDeletes = 0;

    for (const key of mediaKeys) {
        try {
            await deleteMediaFile(key);
        } catch (error) {
            console.error("Kunne ikke slette bildefil:", key, error);
            failedMediaDeletes++;
        }
    }

    if (failedMediaDeletes > 0) {
        alert(
            "Kjøretøyet er slettet, men enkelte bildefiler " +
            "kunne ikke fjernes fra lokal lagring."
        );
    }
}

function renderSettingsExportVehicles() {
    const select = document.getElementById(
        "settingsExportVehicle"
    );

    const exportButton = document.getElementById(
        "settingsExportButton"
    );

    const vehicles = appState.garage.vehicles;

    const previousSelection =
        select.value || appState.selectedVehicleId;

    select.replaceChildren();

    for (const vehicle of vehicles) {
        const option = document.createElement("option");

        option.value = vehicle.id;
        option.textContent =
            `${vehicle.manufacturer} ${vehicle.model} ` +
            `(${vehicle.registration})`;

        select.appendChild(option);
    }

    if (vehicles.some(
        vehicle => vehicle.id === previousSelection
    )) {
        select.value = previousSelection;
    }

    select.disabled = vehicles.length === 0;
    exportButton.disabled = vehicles.length === 0;
}