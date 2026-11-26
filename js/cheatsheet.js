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
        title: "Vehicle Identification",
        fields: [
            cheatsheetField("engineCode", "Engine Code"),
            cheatsheetField("bodyType", "Body Type"),
            cheatsheetField("chassisCode", "Chassis Code"),
            cheatsheetField("transmissionType", "Transmission Type"),
            cheatsheetField("fuelType", "Fuel Type"),
            cheatsheetField("vin", "VIN")
        ]
    },
    {
        title: "Wheels and Tyres",
        fields: [
            cheatsheetField("tireSizeFront", "Front Tyre Size"),
            cheatsheetField("tireSizeRear", "Rear Tyre Size"),
            cheatsheetField("tirePressureFront", "Front Tyre Pressure", "bar", "number"),
            cheatsheetField("tirePressureRear", "Rear Tyre Pressure", "bar", "number"),
            cheatsheetField("boltPattern", "Bolt Pattern (PCD)"),
            cheatsheetField("hubBore", "Hub Bore", "mm", "number"),
            cheatsheetField("wheelBoltThread", "Wheel Bolt/Nut Thread"),
            cheatsheetField("wheelTorque", "Wheel Torque", "Nm", "number"),
            cheatsheetField("wheelOffset", "Wheel Offset (ET)", "mm", "number")
        ]
    },
    {
        title: "Engine and Fluids",
        fields: [
            cheatsheetField("oilViscosity", "Oil Viscosity"),
            cheatsheetField("oilSpecification", "Oil Specification"),
            cheatsheetField("oilCapacity", "Oil Capacity", "L", "number"),
            cheatsheetField("coolantType", "Coolant Type"),
            cheatsheetField("coolantCapacity", "Coolant Capacity", "L", "number"),
            cheatsheetField("transmissionOilType", "Transmission Oil Type"),
            cheatsheetField("transmissionOilCapacity", "Transmission Oil Capacity", "L", "number")
        ]
    },
    {
        title: "Brakes",
        fields: [
            cheatsheetField("brakeTypeFront", "Brake Type Front"),
            cheatsheetField("brakeTypeRear", "Brake Type Rear"),
            cheatsheetField("brakeDiscFront", "Brake Disc Front", "mm", "number"),
            cheatsheetField("brakeDiscRear", "Brake Disc Rear", "mm", "number"),
            cheatsheetField("brakeFluidType", "Brake Fluid Type")
        ]
    },
    {
        title: "Electrical and Lighting",
        fields: [
            cheatsheetField("batteryVoltage", "Battery Voltage", "V", "number"),
            cheatsheetField("batteryType", "Battery Type"),
            cheatsheetField("batteryCapacity", "Battery Capacity", "Ah", "number"),
            cheatsheetField("batteryCCA", "Cold Cranking Amps (CCA)", "A", "number"),
            cheatsheetField("lowBeamType", "Low Beam Type"),
            cheatsheetField("highBeamType", "High Beam Type")
        ]
    },
    {
        title: "Consumables",
        fields: [
            cheatsheetField("wiperDriver", "Wiper Driver Side", "mm", "number"),
            cheatsheetField("wiperPassenger", "Wiper Passenger Side", "mm", "number"),
            cheatsheetField("wiperRear", "Wiper Rear", "mm", "number"),
            cheatsheetField("oilFilterNumber", "Oil Filter Part Number"),
            cheatsheetField("airFilterNumber", "Air Filter Part Number"),
            cheatsheetField("cabinFilterNumber", "Cabin Filter Part Number")
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
            "No technical information recorded yet.";

        content.appendChild(emptyMessage);
    }
}

function renderCheatsheetNotes(content, notes) {
    if (!hasCheatsheetValue(notes)) {
        return;
    }

    const section =
        createCheatsheetSection("Additional Information");

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
        createCheatsheetSection("Links and Resources");

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
            anchor.target =
                window.location.hostname === "appassets.androidplatform.net"
                    ? "_self"
                    : "_blank";
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
        console.error("Could not find the selected vehicle.");
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
        createCheatsheetSection("Additional Information");

    const notesInput = document.createElement("textarea");

    notesInput.id = "cheatsheetNotesInput";
    notesInput.rows = 8;
    notesInput.placeholder =
        "Part numbers, technical specifications or other useful information...";

    notesInput.value = cheatsheet.notes;

    notesSection.appendChild(notesInput);
    container.appendChild(notesSection);

    // Lenker og ressurser
    const linksSection =
        createCheatsheetSection("Links and Resources");

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
    addLinkButton.textContent = "+ Add Link";
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
    nameLabel.textContent = "Name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("cheatsheetLinkName");
    nameInput.placeholder = "e.g. Partsouq";
    nameInput.value = name ?? "";
    nameInput.required = true;

    nameLabel.appendChild(nameInput);

    // URL
    const urlLabel = document.createElement("label");
    urlLabel.textContent = "URL";

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
    removeButton.textContent = "Remove";
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
                throw new Error("Invalid URL protocol");
            }
        } catch {
            alert(
                `Invalid URL for "${name}". Use https://...`
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
            "Could not save technical information:",
            error
        );

        alert("Could not save information.");
        return;
    }

    // Tilbake til oppdatert lesemodus
    renderCheatsheet(vehicle);
    setCheatsheetEditMode(false);
}