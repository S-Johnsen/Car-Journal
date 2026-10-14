// Definerer et standardfelt.
// inputType brukes senere i redigeringsmodus.
function cheatsheetField(
    key,
    label,
    unit = "",
    inputType = "text"
) {
    return { key, label, unit, inputType };
}


const CHEATSHEET_CATEGORIES = [
    {
        title: "Kjøretøy og identifikasjon",
        fields: [
            cheatsheetField("engineCode", "Motorkode"),
            cheatsheetField("bodyType", "Karosseritype"),
            cheatsheetField("chassisCode", "Chassiskode"),
            cheatsheetField("transmissionType", "Girkassetype"),
            cheatsheetField("fuelType", "Drivstofftype"),
            cheatsheetField("vin", "Understellsnummer (VIN)")
        ]
    },
    {
        title: "Hjul og dekk",
        fields: [
            cheatsheetField("tireSizeFront", "Dekkdimensjon foran"),
            cheatsheetField("tireSizeRear", "Dekkdimensjon bak"),
            cheatsheetField("tirePressureFront", "Dekktrykk foran", "bar", "number"),
            cheatsheetField("tirePressureRear", "Dekktrykk bak", "bar", "number"),
            cheatsheetField("boltPattern", "Boltsirkel (PCD)"),
            cheatsheetField("hubBore", "Navdiameter", "mm", "number"),
            cheatsheetField("wheelBoltThread", "Hjulbolt/-muttergjenger"),
            cheatsheetField("wheelTorque", "Hjulmoment", "Nm", "number"),
            cheatsheetField("wheelOffset", "Felginnpress (ET)", "mm", "number")
        ]
    },
    {
        title: "Motor og væsker",
        fields: [
            cheatsheetField("oilViscosity", "Motoroljeviskositet"),
            cheatsheetField("oilSpecification", "Oljespesifikasjon"),
            cheatsheetField("oilCapacity", "Motoroljemengde", "L", "number"),
            cheatsheetField("coolantType", "Kjølevæsketype"),
            cheatsheetField("coolantCapacity", "Kjølevæskemengde", "L", "number"),
            cheatsheetField("transmissionOilType", "Girkasseolje"),
            cheatsheetField("transmissionOilCapacity", "Girkasseoljemengde", "L", "number")
        ]
    },
    {
        title: "Bremser",
        fields: [
            cheatsheetField("brakeTypeFront", "Bremsetype foran"),
            cheatsheetField("brakeTypeRear", "Bremsetype bak"),
            cheatsheetField("brakeDiscFront", "Bremseskive foran", "mm", "number"),
            cheatsheetField("brakeDiscRear", "Bremseskive bak", "mm", "number"),
            cheatsheetField("brakeFluidType", "Bremsevæsketype")
        ]
    },
    {
        title: "Elektrisk og belysning",
        fields: [
            cheatsheetField("batteryVoltage", "Batterispenning", "V", "number"),
            cheatsheetField("batteryType", "Batteritype"),
            cheatsheetField("batteryCapacity", "Batterikapasitet", "Ah", "number"),
            cheatsheetField("batteryCCA", "Startstrøm (CCA)", "A", "number"),
            cheatsheetField("lowBeamType", "Nærlys"),
            cheatsheetField("highBeamType", "Fjernlys")
        ]
    },
    {
        title: "Forbruksdeler",
        fields: [
            cheatsheetField("wiperDriver", "Vindusvisker førerside", "mm", "number"),
            cheatsheetField("wiperPassenger", "Vindusvisker passasjerside", "mm", "number"),
            cheatsheetField("wiperRear", "Vindusvisker bak", "mm", "number"),
            cheatsheetField("oilFilterNumber", "Oljefilter delenummer"),
            cheatsheetField("airFilterNumber", "Luftfilter delenummer"),
            cheatsheetField("cabinFilterNumber", "Kupéfilter delenummer")
        ]
    }
];

function createCheatsheetSection(title) {
    const section = document.createElement("section");
    section.classList.add("cheatsheetSection");

    const heading = document.createElement("h3");
    heading.textContent = title;

    section.appendChild(heading);

    return section;
}


function hasCheatsheetValue(value) {
    return value !== null
        && value !== undefined
        && String(value).trim() !== "";
}

function renderCheatsheet(vehicle) {
    const cheatsheet = getVehicleCheatsheet(vehicle);

    const content =
        document.getElementById("cheatsheetContent");

    content.innerHTML = "";

    for (const category of CHEATSHEET_CATEGORIES) {

        const visibleFields = category.fields.filter(
            field => hasCheatsheetValue(
                cheatsheet.fields[field.key]
            )
        );

        // Ikke vis kategorier uten registrerte verdier.
        if (visibleFields.length === 0) {
            continue;
        }

        const section =
            createCheatsheetSection(category.title);

        const fieldList = document.createElement("dl");
        fieldList.classList.add("cheatsheetFieldList");

        for (const field of visibleFields) {
            const row = document.createElement("div");
            row.classList.add("cheatsheetFieldRow");

            const label = document.createElement("dt");
            label.textContent = field.label;

            const value = document.createElement("dd");

            const storedValue =
                String(cheatsheet.fields[field.key]).trim();

            value.textContent = field.unit
                ? `${storedValue} ${field.unit}`
                : storedValue;

            row.appendChild(label);
            row.appendChild(value);

            fieldList.appendChild(row);
        }

        section.appendChild(fieldList);
        content.appendChild(section);
    }

    renderCheatsheetNotes(content, cheatsheet.notes);
    renderCheatsheetLinks(content, cheatsheet.links);

    if (content.children.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("cheatsheetEmpty");

        emptyMessage.textContent =
            "Ingen teknisk informasjon registrert ennå.";

        content.appendChild(emptyMessage);
    }
}

function renderCheatsheetNotes(content, notes) {
    if (!hasCheatsheetValue(notes)) {
        return;
    }

    const section =
        createCheatsheetSection("Ekstra informasjon");

    const paragraph = document.createElement("p");
    paragraph.classList.add("cheatsheetNotes");

    paragraph.textContent = notes;

    section.appendChild(paragraph);
    content.appendChild(section);
}

function renderCheatsheetLinks(content, links) {
    if (!Array.isArray(links)) {
        return;
    }

    const visibleLinks = links.filter(
        link => link && (
            hasCheatsheetValue(link.name) ||
            hasCheatsheetValue(link.url)
        )
    );

    if (visibleLinks.length === 0) {
        return;
    }

    const section =
        createCheatsheetSection("Lenker og ressurser");

    const list = document.createElement("ul");
    list.classList.add("cheatsheetLinks");

    for (const link of visibleLinks) {
        const item = document.createElement("li");

        const name = String(link.name ?? "").trim();
        const url = String(link.url ?? "").trim();

        let validUrl = null;

        try {
            const parsed = new URL(url);

            if (
                parsed.protocol === "https:" ||
                parsed.protocol === "http:"
            ) {
                validUrl = parsed.href;
            }
        } catch {
            // Ugyldige adresser blir vist som tekst.
        }

        if (validUrl) {
            const anchor = document.createElement("a");

            anchor.textContent = name || url;
            anchor.href = validUrl;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";

            item.appendChild(anchor);
        } else {
            item.textContent = name || url;
        }

        list.appendChild(item);
    }

    section.appendChild(list);
    content.appendChild(section);
}

function getVehicleCheatsheet(vehicle) {
    return {
        fields: vehicle.cheatsheet?.fields ?? {},
        notes: vehicle.cheatsheet?.notes ?? "",
        links: vehicle.cheatsheet?.links ?? []
    };
}


function openCheatsheet() {
    const vehicle =
        getVehicleById(appState.selectedVehicleId);

    if (!vehicle) {
        console.error("Fant ikke valgt kjøretøy");
        return;
    }

    document.getElementById("journalView").hidden = true;
    document.getElementById("journalEntryView").hidden = true;
    document.getElementById("journalFormView").hidden = true;
    document.getElementById("vehicleInfo").hidden = true;

    document.getElementById("cheatsheetView").hidden = false;

    document.getElementById("cheatsheetVehicleName").textContent =
        `${vehicle.manufacturer} ${vehicle.model}`;

    document.getElementById("cheatsheetRegistration").textContent =
        vehicle.registration;

    document.getElementById("cheatsheetYear").textContent =
        vehicle.year;

    renderCheatsheet(vehicle);
    setCheatsheetEditMode(false);
}


function closeCheatsheet() {
    document.getElementById("cheatsheetView").hidden = true;

    document.getElementById("vehicleInfo").hidden = false;
    document.getElementById("journalView").hidden = false;
}

function setCheatsheetEditMode(isEditing) {
    document.getElementById(
        "cheatsheetContent"
    ).hidden = isEditing;

    document.getElementById(
        "cheatsheetEditForm"
    ).hidden = !isEditing;

    document.getElementById(
        "cheatsheetEditButton"
    ).hidden = isEditing;
}


function openCheatsheetEditor() {
    const vehicle =
        getVehicleById(appState.selectedVehicleId);

    if (!vehicle) {
        return;
    }

    renderCheatsheetEditForm(vehicle);

    setCheatsheetEditMode(true);
}


function cancelCheatsheetEditor() {
    setCheatsheetEditMode(false);
}

function renderCheatsheetEditForm(vehicle) {
    const cheatsheet = getVehicleCheatsheet(vehicle);

    const container = document.getElementById(
        "cheatsheetFormFields"
    );

    container.innerHTML = "";

    // De seks tekniske kategoriene
    for (const category of CHEATSHEET_CATEGORIES) {

        const section =
            createCheatsheetSection(category.title);

        for (const field of category.fields) {

            const group = document.createElement("div");
            group.classList.add("cheatsheetFormField");

            const label = document.createElement("label");
            label.textContent = field.label;

            const inputRow = document.createElement("div");
            inputRow.classList.add("cheatsheetInputRow");

            const input = document.createElement("input");

            input.type = field.inputType || "text";
            input.dataset.cheatsheetField = field.key;

            input.value = String(
                cheatsheet.fields[field.key] ?? ""
            );

            // Tillat desimaltall
            if (input.type === "number") {
                input.step = "any";
            }

            label.appendChild(input);

            inputRow.appendChild(label);

            // Vis enhet ved siden av feltet
            if (field.unit) {
                const unit = document.createElement("span");
                unit.classList.add("cheatsheetUnit");

                unit.textContent = field.unit;

                inputRow.appendChild(unit);
            }

            group.appendChild(inputRow);
            section.appendChild(group);
        }

        container.appendChild(section);
    }

    // Ekstra informasjon
    const notesSection =
        createCheatsheetSection("Ekstra informasjon");

    const notesInput = document.createElement("textarea");

    notesInput.id = "cheatsheetNotesInput";
    notesInput.rows = 8;
    notesInput.placeholder =
        "Delenummer, tekniske merknader og annen informasjon...";

    notesInput.value = cheatsheet.notes;

    notesSection.appendChild(notesInput);
    container.appendChild(notesSection);

    // Lenker og ressurser
    const linksSection =
        createCheatsheetSection("Lenker og ressurser");

    const linksContainer = document.createElement("div");
    linksContainer.id = "cheatsheetLinksEditor";

    for (const link of cheatsheet.links) {
        addCheatsheetLinkRow(
            linksContainer,
            link.name,
            link.url
        );
    }

    const addLinkButton = document.createElement("button");

    addLinkButton.type = "button";
    addLinkButton.textContent = "+ Legg til lenke";
    addLinkButton.classList.add("cheatsheetAddLinkButton");

    addLinkButton.addEventListener("click", () => {
        addCheatsheetLinkRow(linksContainer);
    });

    linksSection.appendChild(linksContainer);
    linksSection.appendChild(addLinkButton);

    container.appendChild(linksSection);
}

function addCheatsheetLinkRow(
    container,
    name = "",
    url = ""
) {
    const row = document.createElement("div");
    row.classList.add("cheatsheetLinkRow");

    // Navn
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Navn";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("cheatsheetLinkName");
    nameInput.placeholder = "F.eks. Partsouq";
    nameInput.value = name ?? "";
    nameInput.required = true;

    nameLabel.appendChild(nameInput);

    // URL
    const urlLabel = document.createElement("label");
    urlLabel.textContent = "Adresse";

    const urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.classList.add("cheatsheetLinkUrl");
    urlInput.placeholder = "https://...";
    urlInput.value = url ?? "";
    urlInput.required = true;

    urlLabel.appendChild(urlInput);

    // Fjern lenke
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Fjern";
    removeButton.classList.add("cheatsheetRemoveLinkButton");

    removeButton.addEventListener("click", () => {
        row.remove();
    });

    row.appendChild(nameLabel);
    row.appendChild(urlLabel);
    row.appendChild(removeButton);

    container.appendChild(row);
}

function submitCheatsheetForm(event) {
    event.preventDefault();

    const vehicle =
        getVehicleById(appState.selectedVehicleId);

    if (!vehicle) {
        return;
    }

    const currentCheatsheet =
        getVehicleCheatsheet(vehicle);

    // Behold eventuelle ukjente felt fra tidligere versjoner.
    const fields = {
        ...currentCheatsheet.fields
    };

    const inputs = document.querySelectorAll(
        "#cheatsheetFormFields [data-cheatsheet-field]"
    );

    for (const input of inputs) {
        const key = input.dataset.cheatsheetField;
        const value = input.value.trim();

        if (value === "") {
            delete fields[key];
        } else {
            fields[key] = value;
        }
    }

    // Ekstra informasjon
    const notes = document.getElementById(
        "cheatsheetNotesInput"
    ).value;

    // Lenker
    const linkRows = document.querySelectorAll(
        "#cheatsheetLinksEditor .cheatsheetLinkRow"
    );

    const links = [];

    for (const row of linkRows) {
        const name = row.querySelector(
            ".cheatsheetLinkName"
        ).value.trim();

        const url = row.querySelector(
            ".cheatsheetLinkUrl"
        ).value.trim();

        // Bare HTTP- og HTTPS-lenker
        try {
            const parsed = new URL(url);

            if (
                parsed.protocol !== "http:" &&
                parsed.protocol !== "https:"
            ) {
                throw new Error("Ugyldig protokoll");
            }
        } catch {
            alert(
                `Ugyldig adresse for "${name}". Bruk https://...`
            );
            return;
        }

        links.push({
            name: name,
            url: url
        });
    }

    // Oppdater kun valgt kjøretøy.
    const previousCheatsheet = vehicle.cheatsheet;

    vehicle.cheatsheet = {
        ...(previousCheatsheet ?? {}),
        fields: fields,
        notes: notes,
        links: links
    };

    try {
        saveGarageData(appState.garage);
    } catch (error) {
        vehicle.cheatsheet = previousCheatsheet;

        console.error(
            "Kunne ikke lagre Cheatsheet:",
            error
        );

        alert("Kunne ikke lagre teknisk informasjon.");
        return;
    }

    // Tilbake til oppdatert lesemodus
    renderCheatsheet(vehicle);
    setCheatsheetEditMode(false);
}