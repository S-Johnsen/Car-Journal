function renderJournalList(journal) {
  const journalList =
    document.getElementById("journalList");

  journalList.innerHTML = "";

  journal.forEach((entry) => {
    const journalCard = document.createElement("button");

    journalCard.type = "button";
    journalCard.classList.add("journalCard");

    journalCard.dataset.journalId = entry.id;

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const type = document.createElement("p");
    type.textContent = getJournalTypeLabel(entry.type);

    const info = document.createElement("p");
    info.textContent =
      `${formatDate(entry.date)} · ${entry.odometer.toLocaleString("nb-NO")} km`;

    journalCard.appendChild(title);
    journalCard.appendChild(type);
    journalCard.appendChild(info);

    journalCard.addEventListener("click", () => {
        selectJournalEntry(entry.id);
    });

    journalList.appendChild(journalCard);
  });
}

function getJournalTypeLabel(type) {
  switch (type) {
    case "SERVICE":
      return "Service";

    case "REPAIR":
      return "Reparasjon";

    case "WORKSHOP":
      return "Verksted";

    default:
      return type;
  }
}

function formatDate(dateString) {
  const parts = dateString.split("-");

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}.${month}.${year}`;
}

function selectJournalEntry(entryId) {
  const vehicle = getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    console.error("Fant ikke valgt kjøretøy");
    return;
  }

  const entry = vehicle.journal.find(
    (entry) => entry.id === entryId
  );

  if (!entry) {
    console.error("Fant ikke journalpost:", entryId);
    return;
  }

  appState.selectedJournalPostId = entryId;

  showJournalEntry(entry);
}

function showJournalEntry(entry) {
  const journalView =
  document.getElementById("journalView");

const journalEntryView =
  document.getElementById("journalEntryView");

journalView.hidden = true;
journalEntryView.hidden = false;

  document.getElementById("journalEntryType").textContent =
    getJournalTypeLabel(entry.type);

  document.getElementById("journalEntryTitle").textContent =
    entry.title;

  document.getElementById("journalEntryDate").textContent =
    formatDate(entry.date);

  document.getElementById("journalEntryOdometer").textContent =
    `${entry.odometer.toLocaleString("nb-NO")} km`;

  document.getElementById("journalEntryDescription").textContent =
    entry.description;

  renderMediaGallery(entry.media);
}

function renderMediaGallery(media) {
  const gallery =
    document.getElementById("journalEntryMediaGallery");

  gallery.innerHTML = "";

  if (!media || media.length === 0) {
    return;
  }

  media.forEach((item) => {
    if (item.type === "IMAGE") {
      const image = document.createElement("img");

      image.src = item.path;
      image.alt = "Bilde fra journalpost";

      gallery.appendChild(image);
    }
  });
}