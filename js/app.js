const appState = {
  garage: null,
  selectedVehicleId: null,
  selectedJournalPostId: null,
  journalFilter: "ALL"
};


document.addEventListener("DOMContentLoaded", initApp);


async function initApp() {
  try {
    appState.garage = await loadGarageData();

    renderVehicleSelector(appState.garage.vehicles);
    
    document.getElementById("journalBackButton").addEventListener("click", closeJournalEntry);

  } catch (error) {
    console.error("Kunne ikke starte applikasjonen:", error);
  }

}

function closeJournalEntry() {
  appState.selectedJournalPostId = null;

  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("journalView").hidden = false;
}