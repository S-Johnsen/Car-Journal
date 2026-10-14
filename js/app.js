const appState = {
  garage: null,
  selectedVehicleId: null,
  selectedJournalPostId: null,
  editingJournalPostId: null,
  journalFilter: "ALL",

  pendingMediaFiles: [],
  removedMediaIds: []
};


document.addEventListener("DOMContentLoaded", initApp);


async function initApp() {
  try {
    appState.garage = await loadGarageData();

    renderVehicleSelector(appState.garage.vehicles);

    setupJournalFilters();

    document
      .getElementById("journalBackButton")
      .addEventListener("click", closeJournalEntry);

    document
      .getElementById("newJournalEntryButton")
      .addEventListener("click", openCreateJournalForm);

    document
      .getElementById("journalFormCancelButton")
      .addEventListener("click", closeJournalForm);

    document
      .getElementById("journalForm")
      .addEventListener("submit", submitJournalForm);

    document
      .getElementById("editJournalEntryButton")
      .addEventListener("click", openEditJournalForm);

    document
      .getElementById("deleteJournalEntryButton")
      .addEventListener("click", deleteSelectedJournalEntry);

    document
      .getElementById("journalFormMediaInput")
      .addEventListener("change", handleJournalMediaSelection);

    document
      .getElementById("openCheatsheetButton")
      .addEventListener("click", openCheatsheet);

    document
      .getElementById("cheatsheetBackButton")
      .addEventListener("click", closeCheatsheet);

    document
      .getElementById("cheatsheetEditButton")
      .addEventListener("click", openCheatsheetEditor);

    document
      .getElementById("cheatsheetEditCancelButton")
      .addEventListener("click", cancelCheatsheetEditor);

    document
      .getElementById("cheatsheetEditForm")
      .addEventListener("submit", submitCheatsheetForm);
      
  } catch (error) {
    console.error(
      "Kunne ikke starte applikasjonen:",
      error
    );
  }
}

function closeJournalEntry() {
  appState.selectedJournalPostId = null;

  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("journalView").hidden = false;
}

function openNewJournalEntry() {
  document.getElementById("journalView").hidden = true;
  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("newJournalEntryView").hidden = false;

  const form =
    document.getElementById("newJournalEntryForm");

  form.reset();
}


function closeNewJournalEntry() {
  document.getElementById("newJournalEntryView").hidden = true;
  document.getElementById("journalView").hidden = false;
}