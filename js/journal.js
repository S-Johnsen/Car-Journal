function renderJournalList(journal) {
  const journalList =
    document.getElementById("journalList");

  journalList.innerHTML = "";

  const visibleEntries =
    getVisibleJournalEntries(journal);

  if (visibleEntries.length === 0) {
    renderEmptyJournalMessage(journalList);
    return;
  }

  visibleEntries.forEach((entry) => {
    const journalCard =
      document.createElement("button");

    journalCard.type = "button";
    journalCard.classList.add("journalCard");

    journalCard.dataset.journalId = entry.id;

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const type = document.createElement("p");
    type.textContent =
      getJournalTypeLabel(entry.type);

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

    case "MODIFICATION":
      return "Modifikasjon";

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

async function renderMediaGallery(media) {
    const gallery =
        document.getElementById("journalEntryMediaGallery");

    gallery.innerHTML = "";

    if (!media || media.length === 0) {
        return;
    }

    for (const item of media) {
        if (item.type !== "IMAGE") {
            continue;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("journalMediaButton");
        button.setAttribute("aria-label", "Forstørr bilde");

        const image = document.createElement("img");
        image.alt = item.name || "Bilde fra journalpost";

        await setMediaImageSource(image, item);

        button.appendChild(image);

        button.addEventListener("click", () => {
            openImageLightbox(item);
        });

        gallery.appendChild(button);
    }
}

async function submitJournalForm(event) {
  event.preventDefault();

  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    return;
  }

  const formData = {
    date:
      document.getElementById(
        "journalFormDate"
      ).value,

    odometer:
      Number(
        document.getElementById(
          "journalFormOdometer"
        ).value
      ),

    type:
      document.getElementById(
        "journalFormType"
      ).value,

    title:
      document.getElementById(
        "journalFormTitle"
      ).value.trim(),

    description:
      document.getElementById(
        "journalFormDescription"
      ).value.trim()
  };


  if (appState.editingJournalPostId === null) {
    await createJournalEntry(
      vehicle,
      formData
    );
  } else {
    await updateJournalEntry(
      vehicle,
      formData
    );
  }
}
function setupJournalFilters() {
  const filterButtons =
    document.querySelectorAll(".journalFilter button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      appState.journalFilter = button.dataset.filter;

      updateActiveJournalFilterButton();
      renderCurrentVehicleJournal();
    });
  });

  updateActiveJournalFilterButton();
}

function updateActiveJournalFilterButton() {
  const filterButtons =
    document.querySelectorAll(".journalFilter button");

  filterButtons.forEach((button) => {
    const isSelected =
      button.dataset.filter === appState.journalFilter;

    button.classList.toggle("selected", isSelected);

    button.setAttribute(
      "aria-pressed",
      isSelected.toString()
    );
  });
}

function renderCurrentVehicleJournal() {
  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    return;
  }

  renderJournalList(vehicle.journal);
}

function getVisibleJournalEntries(journal) {
  let entries = [...journal];

  if (appState.journalFilter !== "ALL") {
    entries = entries.filter(
      (entry) =>
        entry.type === appState.journalFilter
    );
  }

  entries.sort((a, b) => {
    const dateComparison =
      b.date.localeCompare(a.date);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return b.odometer - a.odometer;
  });

  return entries;
}

function renderEmptyJournalMessage(journalList) {
  const message = document.createElement("p");

  message.classList.add("journalEmptyMessage");

  switch (appState.journalFilter) {
    case "SERVICE":
      message.textContent =
        "Ingen service registrert.";
      break;

    case "REPAIR":
      message.textContent =
        "Ingen reparasjoner registrert.";
      break;

    case "WORKSHOP":
      message.textContent =
        "Ingen verkstedbesøk registrert.";
      break;
    
    case "MODIFICATION":
      message.textContent =
        "Ingen modifikasjoner registrert.";
      break;

    default:
      message.textContent =
        "Ingen journalposter registrert.";
  }

  journalList.appendChild(message);
}

function createJournalEntry(event) {
  event.preventDefault();

  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    console.error("Fant ikke valgt kjøretøy");
    return;
  }

  const date =
    document.getElementById("newJournalDate").value;

  const odometer =
    Number(
      document.getElementById("newJournalOdometer").value
    );

  const type =
    document.getElementById("newJournalType").value;

  const title =
    document.getElementById("newJournalTitle").value.trim();

  const description =
    document.getElementById("newJournalDescription").value.trim();


  const newEntry = {
    id: generateJournalEntryId(),
    date: date,
    odometer: odometer,
    type: type,
    title: title,
    description: description,
    media: []
  };


  vehicle.journal.push(newEntry);

  saveGarageData(appState.garage);

  appState.journalFilter = "ALL";

  updateActiveJournalFilterButton();

  renderJournalList(vehicle.journal);

  closeNewJournalEntry();
}

function generateJournalEntryId() {
  return `logg-${Date.now()}`;
}

function openCreateJournalForm() {
  appState.editingJournalPostId = null;

  appState.pendingMediaFiles = [];
  appState.removedMediaIds = [];

  const form =
    document.getElementById("journalForm");

  form.reset();

  document.getElementById("journalFormHeading").textContent =
    "Ny loggføring";

  document.getElementById("journalFormSaveButton").textContent =
    "Lagre loggføring";

  document.getElementById("journalView").hidden = true;
  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("journalFormView").hidden = false;

  renderJournalFormMediaGallery();
}

function openEditJournalForm() {
  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    return;
  }

  const entry = vehicle.journal.find(
    (entry) =>
      entry.id === appState.selectedJournalPostId
  );

  if (!entry) {
    console.error("Fant ikke journalpost");
    return;
  }

  appState.editingJournalPostId = entry.id;
  appState.pendingMediaFiles = [];
  appState.removedMediaIds = [];

  document.getElementById("journalFormHeading").textContent =
    "Rediger loggføring";

  document.getElementById("journalFormSaveButton").textContent =
    "Lagre endringer";

  document.getElementById("journalFormDate").value =
    entry.date;

  document.getElementById("journalFormOdometer").value =
    entry.odometer;

  document.getElementById("journalFormType").value =
    entry.type;

  document.getElementById("journalFormTitle").value =
    entry.title;

  document.getElementById("journalFormDescription").value =
    entry.description;

  document.getElementById("journalEntryView").hidden = true;
  document.getElementById("journalFormView").hidden = false;


  renderJournalFormMediaGallery();
}

async function submitJournalForm(event) {
  event.preventDefault();

  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    return;
  }

  const formData = {
    date:
      document.getElementById(
        "journalFormDate"
      ).value,

    odometer:
      Number(
        document.getElementById(
          "journalFormOdometer"
        ).value
      ),

    type:
      document.getElementById(
        "journalFormType"
      ).value,

    title:
      document.getElementById(
        "journalFormTitle"
      ).value.trim(),

    description:
      document.getElementById(
        "journalFormDescription"
      ).value.trim()
  };


  if (appState.editingJournalPostId === null) {
    await createJournalEntry(
      vehicle,
      formData
    );
  } else {
    await updateJournalEntry(
      vehicle,
      formData
    );
  }
}

async function createJournalEntry(vehicle, formData) {
  const newMedia =
    await savePendingMediaFiles();

  const newEntry = {
    id: generateJournalEntryId(),
    date: formData.date,
    odometer: formData.odometer,
    type: formData.type,
    title: formData.title,
    description: formData.description,
    media: newMedia
  };

  vehicle.journal.push(newEntry);

  saveGarageData(appState.garage);

  appState.pendingMediaFiles = [];
  appState.removedMediaIds = [];

  appState.journalFilter = "ALL";
  appState.editingJournalPostId = null;

  updateActiveJournalFilterButton();
  renderJournalList(vehicle.journal);

  closeJournalForm();
}

async function updateJournalEntry(vehicle, formData) {
  const entry = vehicle.journal.find(
    (entry) =>
      entry.id === appState.editingJournalPostId
  );

  if (!entry) {
    return;
  }


  // Slett faktiske IndexedDB-filer som er fjernet
  const removedMedia =
    entry.media.filter(
      (media) =>
        appState.removedMediaIds.includes(
          media.id
        )
    );

  for (const media of removedMedia) {
    if (media.storageKey) {
      await deleteMediaFile(
        media.storageKey
      );
    }
  }


  // Fjern metadata
  entry.media =
    entry.media.filter(
      (media) =>
        !appState.removedMediaIds.includes(
          media.id
        )
    );


  // Lagre nye bilder
  const newMedia =
    await savePendingMediaFiles();

  entry.media.push(...newMedia);


  // Oppdater vanlige felt
  entry.date = formData.date;
  entry.odometer = formData.odometer;
  entry.type = formData.type;
  entry.title = formData.title;
  entry.description = formData.description;


  saveGarageData(appState.garage);


  appState.pendingMediaFiles = [];
  appState.removedMediaIds = [];
  appState.editingJournalPostId = null;


  renderJournalList(vehicle.journal);

  document.getElementById(
    "journalFormView"
  ).hidden = true;

  showJournalEntry(entry);
}

function closeJournalForm() {
  document.getElementById("journalFormView").hidden = true;

  if (appState.editingJournalPostId !== null) {
    document.getElementById("journalEntryView").hidden = false;
  } else {
    document.getElementById("journalView").hidden = false;
  }

  appState.editingJournalPostId = null;

  appState.pendingMediaFiles = [];
  appState.removedMediaIds = [];
}

async function deleteSelectedJournalEntry() {

    const vehicleId = appState.selectedVehicleId;
    const entryId = appState.selectedJournalPostId;

    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
        return;
    }

    const entry = vehicle.journal.find(
        item => item.id === entryId
    );

    if (!entry) {
        return;
    }

    const confirmed = confirm(
        `Er du sikker på at du vil slette "${entry.title}"?\n\n` +
        "Journalposten og tilhørende bilder som ikke brukes " +
        "andre steder, vil bli slettet permanent."
    );

    if (!confirmed) {
        return;
    }

    // Opprett ny garasje uten journalposten.
    // Originaldataene endres ikke før lagring er vellykket.
    const updatedGarage = {
        ...appState.garage,

        vehicles: appState.garage.vehicles.map(item => {

            if (item.id !== vehicleId) {
                return item;
            }

            return {
                ...item,
                journal: item.journal.filter(
                    journalEntry => journalEntry.id !== entryId
                )
            };
        })
    };

    // Finn lagrede bilder som tilhørte journalposten.
    const mediaKeys = new Set();

    for (const media of entry.media || []) {
        if (media.storageKey) {
            mediaKeys.add(media.storageKey);
        }
    }

    // Behold bilder som fortsatt er referert
    // av andre journalposter eller kjøretøy.
    for (const otherVehicle of updatedGarage.vehicles) {

        for (const otherEntry of otherVehicle.journal || []) {

            for (const media of otherEntry.media || []) {

                if (media.storageKey) {
                    mediaKeys.delete(media.storageKey);
                }
            }
        }
    }

    // Lagre journalendringen først.
    try {
        saveGarageData(updatedGarage);

    } catch (error) {
        console.error(
            "Kunne ikke lagre sletting av journalpost:",
            error
        );

        alert(
            "Kunne ikke slette journalposten. " +
            "Ingen bilder er fjernet."
        );

        return;
    }

    // Oppdater applikasjonens tilstand.
    appState.garage = updatedGarage;

    appState.selectedJournalPostId = null;
    appState.editingJournalPostId = null;

    appState.pendingMediaFiles = [];
    appState.removedMediaIds = [];

    // Gå tilbake til journaloversikten.
    document.getElementById(
        "journalEntryView"
    ).hidden = true;

    document.getElementById(
        "journalView"
    ).hidden = false;

    renderJournalList(
        getVehicleById(vehicleId).journal
    );

    // Fjern bildefilene som ikke lenger brukes.
    let failedMediaDeletes = 0;

    for (const key of mediaKeys) {

        try {
            await deleteMediaFile(key);

        } catch (error) {
            console.error(
                "Kunne ikke slette bildefil:",
                key,
                error
            );

            failedMediaDeletes++;
        }
    }

    if (failedMediaDeletes > 0) {
        alert(
            "Journalposten er slettet, men enkelte " +
            "bildefiler kunne ikke fjernes fra lokal lagring."
        );
    }
}

function handleJournalMediaSelection(event) {
  const files =
    Array.from(event.target.files);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    appState.pendingMediaFiles.push({
      id: generateMediaId(),
      file: file
    });
  });

  renderJournalFormMediaGallery();

  // Gjør det mulig å velge samme fil igjen senere
  event.target.value = "";
}

function generateMediaId() {
  if (crypto.randomUUID) {
    return `media-${crypto.randomUUID()}`;
  }

  return `media-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function getEditingJournalEntry() {
  if (appState.editingJournalPostId === null) {
    return null;
  }

  const vehicle =
    getVehicleById(appState.selectedVehicleId);

  if (!vehicle) {
    return null;
  }

  return vehicle.journal.find(
    (entry) =>
      entry.id === appState.editingJournalPostId
  );
}

async function renderJournalFormMediaGallery() {
  const gallery =
    document.getElementById(
      "journalFormMediaGallery"
    );

  gallery.innerHTML = "";

  const entry =
    getEditingJournalEntry();


  // Eksisterende media ved UPDATE
  if (entry && entry.media) {
    for (const item of entry.media) {

      if (appState.removedMediaIds.includes(item.id)) {
        continue;
      }

      if (item.type !== "IMAGE") {
        continue;
      }

      const mediaItem =
        document.createElement("div");

      mediaItem.classList.add("mediaFormItem");

      const image =
        document.createElement("img");

      await setMediaImageSource(
        image,
        item
      );

      const removeButton =
        document.createElement("button");

      removeButton.type = "button";
      removeButton.textContent = "×";
      removeButton.classList.add(
        "mediaRemoveButton"
      );

      removeButton.addEventListener(
        "click",
        () => {
          appState.removedMediaIds.push(
            item.id
          );

          renderJournalFormMediaGallery();
        }
      );

      mediaItem.appendChild(image);
      mediaItem.appendChild(removeButton);

      gallery.appendChild(mediaItem);
    }
  }


  // Nye, ikke lagrede bilder
  appState.pendingMediaFiles.forEach(
    (pendingMedia) => {

      const mediaItem =
        document.createElement("div");

      mediaItem.classList.add("mediaFormItem");

      const image =
        document.createElement("img");

      const objectUrl =
        URL.createObjectURL(
          pendingMedia.file
        );

      image.src = objectUrl;

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
      };

      const removeButton =
        document.createElement("button");

      removeButton.type = "button";
      removeButton.textContent = "×";
      removeButton.classList.add(
        "mediaRemoveButton"
      );

      removeButton.addEventListener(
        "click",
        () => {
          appState.pendingMediaFiles =
            appState.pendingMediaFiles.filter(
              (media) =>
                media.id !== pendingMedia.id
            );

          renderJournalFormMediaGallery();
        }
      );

      mediaItem.appendChild(image);
      mediaItem.appendChild(removeButton);

      gallery.appendChild(mediaItem);
    }
  );
}

async function setMediaImageSource(image, media) {

  if (media.storageKey) {
    const storedMedia =
      await loadMediaFile(
        media.storageKey
      );

    if (!storedMedia) {
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        storedMedia.blob
      );

    image.src = objectUrl;

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
    };

    return;
  }


  if (media.path) {
    image.src = media.path;
  }
}

async function savePendingMediaFiles() {
  const metadata = [];

  for (const pendingMedia of appState.pendingMediaFiles) {

    await saveMediaFile(
      pendingMedia.id,
      pendingMedia.file
    );

    metadata.push({
      id: pendingMedia.id,
      type: "IMAGE",
      name: pendingMedia.file.name,
      storageKey: pendingMedia.id
    });
  }

  return metadata;
}

async function openImageLightbox(media) {
    const lightbox =
        document.getElementById("imageLightbox");

    const image =
        document.getElementById("imageLightboxImage");

    image.removeAttribute("src");
    image.alt = media.name || "Forstørret bilde";

    lightbox.hidden = false;
    document.body.classList.add("lightboxOpen");

    resetImageLightboxZoom();
    try {
        await setMediaImageSource(image, media);
    } catch (error) {
        console.error("Kunne ikke åpne bildet:", error);
        closeImageLightbox();
    }
}


function closeImageLightbox() {
    const lightbox =
        document.getElementById("imageLightbox");

    resetImageLightboxZoom();
      
    lightbox.hidden = true;

    document.body.classList.remove("lightboxOpen");
}


function setupImageLightbox() {
    const lightbox =
        document.getElementById("imageLightbox");

    const stage =
        document.getElementById("imageLightboxStage");

    const closeButton =
        document.getElementById("imageLightboxClose");

    closeButton.addEventListener(
        "click",
        closeImageLightbox
    );

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeImageLightbox();
        }
    });

    stage.addEventListener("click", (event) => {
        if (event.target === stage) {
            closeImageLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            !lightbox.hidden
        ) {
            closeImageLightbox();
        }
    });
    setupImageLightboxZoom();
}


document.addEventListener(
    "DOMContentLoaded",
    setupImageLightbox
);

const imageZoom = {
    scale: 1,
    x: 0,
    y: 0,
    pointers: new Map(),
    pinchStart: null
};

const IMAGE_MIN_ZOOM = 1;
const IMAGE_MAX_ZOOM = 5;


// Oppdater kun transformasjonen til bildet
function updateImageZoom() {
    const image =
        document.getElementById("imageLightboxImage");

    image.style.transform =
        `translate3d(${imageZoom.x}px, ${imageZoom.y}px, 0) scale(${imageZoom.scale})`;
}


// Begrens hvor langt bildet kan dras
function constrainImagePan() {
    const image =
        document.getElementById("imageLightboxImage");

    const stage =
        document.getElementById("imageLightboxStage");

    const maxX = Math.max(
        0,
        (image.offsetWidth * imageZoom.scale - stage.clientWidth) / 2
    );

    const maxY = Math.max(
        0,
        (image.offsetHeight * imageZoom.scale - stage.clientHeight) / 2
    );

    imageZoom.x = Math.max(
        -maxX,
        Math.min(maxX, imageZoom.x)
    );

    imageZoom.y = Math.max(
        -maxY,
        Math.min(maxY, imageZoom.y)
    );
}


// Tilbakestill zoom
function resetImageLightboxZoom() {
    imageZoom.scale = 1;
    imageZoom.x = 0;
    imageZoom.y = 0;

    imageZoom.pointers.clear();
    imageZoom.pinchStart = null;

    updateImageZoom();
}


// Beregn avstand og midtpunkt mellom to fingre
function getPinchInfo() {
    const points = [...imageZoom.pointers.values()];

    const a = points[0];
    const b = points[1];

    return {
        distance: Math.hypot(
            b.x - a.x,
            b.y - a.y
        ),
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    };
}


// Registrer touch- og pekerhendelser
function setupImageLightboxZoom() {
    const image =
        document.getElementById("imageLightboxImage");

    const stage =
        document.getElementById("imageLightboxStage");

    image.draggable = false;

    image.addEventListener("dragstart", event => {
        event.preventDefault();
    });

    // Finger plasseres på bildet
    image.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        event.preventDefault();

        image.setPointerCapture(event.pointerId);

        imageZoom.pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });

        if (imageZoom.pointers.size === 2) {
            const pinch = getPinchInfo();

            imageZoom.pinchStart = {
                ...pinch,
                scale: imageZoom.scale,
                panX: imageZoom.x,
                panY: imageZoom.y
            };
        }
    });

    // Finger beveges
    image.addEventListener("pointermove", event => {
        if (!imageZoom.pointers.has(event.pointerId)) {
            return;
        }

        const previous =
            imageZoom.pointers.get(event.pointerId);

        imageZoom.pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });

        if (
            imageZoom.pointers.size === 2 &&
            imageZoom.pinchStart
        ) {
            // To fingre: zoom
            const current = getPinchInfo();
            const start = imageZoom.pinchStart;

            const ratio =
                current.distance / Math.max(1, start.distance);

            imageZoom.scale = Math.max(
                IMAGE_MIN_ZOOM,
                Math.min(
                    IMAGE_MAX_ZOOM,
                    start.scale * ratio
                )
            );

            // Behold området mellom fingrene under zoom
            const rect = stage.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const scaleRatio =
                imageZoom.scale / start.scale;

            imageZoom.x =
                current.x - centerX -
                (start.x - centerX - start.panX) * scaleRatio;

            imageZoom.y =
                current.y - centerY -
                (start.y - centerY - start.panY) * scaleRatio;

        } else if (
            imageZoom.pointers.size === 1 &&
            imageZoom.scale > 1
        ) {
            // Én finger: flytt forstørret bilde
            imageZoom.x += event.clientX - previous.x;
            imageZoom.y += event.clientY - previous.y;
        }

        constrainImagePan();
        updateImageZoom();
    });

    // Finger løftes fra bildet
    function releasePointer(event) {
        imageZoom.pointers.delete(event.pointerId);

        imageZoom.pinchStart = null;

        if (image.hasPointerCapture(event.pointerId)) {
            image.releasePointerCapture(event.pointerId);
        }
    }

    image.addEventListener("pointerup", releasePointer);
    image.addEventListener("pointercancel", releasePointer);
}