/* =========================
   VEHICLE REPORT
   ========================= */

let reportReturnScrollY = 0;


// Oppretter HTML-elementer uten å tolke
// brukerregistrert tekst som HTML.
function createReportElement(tag, className, value) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (value !== undefined) {
        element.textContent = String(value);
    }

    return element;
}


function createReportSection(root, heading) {
    const section = createReportElement(
        "section",
        "reportSection"
    );

    section.appendChild(
        createReportElement("h2", "", heading)
    );

    root.appendChild(section);

    return section;
}


function appendReportField(section, label, value) {
    const row = createReportElement(
        "div",
        "reportField"
    );

    row.appendChild(
        createReportElement("span", "reportLabel", label)
    );

    row.appendChild(
        createReportElement("span", "reportValue", value)
    );

    section.appendChild(row);
}


function formatReportDate(date) {
    const text = String(date ?? "");
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

    if (!match) {
        return text || "Ukjent dato";
    }

    return `${match[3]}.${match[2]}.${match[1]}`;
}


function renderVehicleReport(vehicle) {
    const root = document.getElementById("reportContent");
    root.replaceChildren();

    // Rapportheader
    const header = createReportElement(
        "header",
        "reportDocumentHeader"
    );

    header.appendChild(
        createReportElement(
            "p",
            "reportBrand",
            "JOHNSEN AUTO JOURNAL"
        )
    );

    header.appendChild(
        createReportElement("h1", "", "Kjøretøyrapport")
    );

    header.appendChild(
        createReportElement(
            "p",
            "reportSubtitle",
            `${vehicle.manufacturer} ${vehicle.model}`
        )
    );

    header.appendChild(
        createReportElement(
            "p",
            "reportMeta",
            "Generert: " +
                new Intl.DateTimeFormat("nb-NO").format(new Date())
        )
    );

    root.appendChild(header);

    // 01 - Kjøretøyinformasjon
    const vehicleSection = createReportSection(
        root,
        "01 – Kjøretøyinformasjon"
    );

    appendReportField(
        vehicleSection, "Merke", vehicle.manufacturer
    );

    appendReportField(
        vehicleSection, "Modell", vehicle.model
    );

    appendReportField(
        vehicleSection, "Årsmodell", vehicle.year
    );

    appendReportField(
        vehicleSection,
        "Registreringsnummer",
        vehicle.registration
    );

    // 02 - Teknisk informasjon
    const technicalSection = createReportSection(
        root,
        "02 – Teknisk informasjon"
    );

    const cheatsheet = getVehicleCheatsheet(vehicle);
    let hasTechnicalData = false;

    for (const category of CHEATSHEET_CATEGORIES) {
        const fields = category.fields.filter(
            field => hasCheatsheetValue(
                cheatsheet.fields[field.key]
            )
        );

        if (fields.length === 0) {
            continue;
        }

        hasTechnicalData = true;

        const categoryBlock = createReportElement(
            "div",
            "reportTechnicalCategory"
        );

        categoryBlock.appendChild(
            createReportElement(
                "h3",
                "",
                category.title
            )
        );

        for (const field of fields) {
            const value = String(
                cheatsheet.fields[field.key]
            ).trim();

            appendReportField(
                categoryBlock,
                field.label,
                field.unit
                    ? `${value} ${field.unit}`
                    : value
            );
        }

        technicalSection.appendChild(categoryBlock);
    }

    // Ekstra informasjon
    if (hasCheatsheetValue(cheatsheet.notes)) {
        hasTechnicalData = true;

        technicalSection.appendChild(
            createReportElement(
                "h3",
                "",
                "Ekstra informasjon"
            )
        );

        technicalSection.appendChild(
            createReportElement(
                "p",
                "reportDescription",
                cheatsheet.notes
            )
        );
    }

    // Lenker og ressurser
    const links = (cheatsheet.links || []).filter(
        link => link &&
            (hasCheatsheetValue(link.name) ||
             hasCheatsheetValue(link.url))
    );

    if (links.length > 0) {
        hasTechnicalData = true;

        technicalSection.appendChild(
            createReportElement(
                "h3",
                "",
                "Lenker og ressurser"
            )
        );

        for (const link of links) {
            const name = String(link.name ?? "").trim();
            const url = String(link.url ?? "").trim();

            technicalSection.appendChild(
                createReportElement(
                    "p",
                    "reportResource",
                    name && url
                        ? `${name}: ${url}`
                        : name || url
                )
            );
        }
    }

    if (!hasTechnicalData) {
        technicalSection.appendChild(
            createReportElement(
                "p",
                "reportEmpty",
                "Ingen teknisk informasjon registrert."
            )
        );
    }

    // 03 - Journalhistorikk
    const journalSection = createReportSection(
        root,
        "03 – Journalhistorikk"
    );

    // Kopierer listen før sortering.
    // Eksporterer alltid alle journaltyper.
    const entries = [...(vehicle.journal || [])];

    entries.sort((a, b) => {
        const dateComparison = String(
            b.date ?? ""
        ).localeCompare(String(a.date ?? ""));

        if (dateComparison !== 0) {
            return dateComparison;
        }

        return Number(b.odometer ?? 0) -
            Number(a.odometer ?? 0);
    });

    journalSection.appendChild(
        createReportElement(
            "p",
            "reportMeta",
            `${entries.length} registrerte journalposter`
        )
    );

    if (entries.length === 0) {
        journalSection.appendChild(
            createReportElement(
                "p",
                "reportEmpty",
                "Ingen journalposter registrert."
            )
        );
    }

    for (const entry of entries) {
        const article = createReportElement(
            "article",
            "reportJournalEntry"
        );

        const heading = createReportElement(
            "h3",
            "",
            entry.title || "Uten tittel"
        );

        const odometer = Number.isFinite(
            Number(entry.odometer)
        )
            ? Number(entry.odometer).toLocaleString("nb-NO") + " km"
            : "Ukjent kilometerstand";

        const metadata = createReportElement(
            "p",
            "reportEntryMeta",
            [
                formatReportDate(entry.date),
                getJournalTypeLabel(entry.type),
                odometer
            ].join(" · ")
        );

        const description = createReportElement(
            "p",
            "reportDescription",
            entry.description || "Ingen beskrivelse."
        );

        article.appendChild(heading);
        article.appendChild(metadata);
        article.appendChild(description);

        journalSection.appendChild(article);
    }

    // Merknad
    const footer = createReportElement(
        "footer",
        "reportDocumentFooter"
    );

    footer.textContent =
        "Rapporten er generert fra brukerregistrerte " +
        "opplysninger i Johnsen Auto Journal. " +
        "Opplysningene er ikke uavhengig verifisert.";

    root.appendChild(footer);
}


// Velg kjøretøy og åpne rapportvisningen.
function openVehicleReport() {
    const vehicleId = document.getElementById(
        "settingsExportVehicle"
    ).value;

    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
        alert("Velg et kjøretøy først.");
        return;
    }

    renderVehicleReport(vehicle);

    reportReturnScrollY = window.scrollY;

    document.getElementById("settingsView").hidden = true;
    document.getElementById("reportView").hidden = false;

    window.scrollTo(0, 0);
}


function closeVehicleReport() {
    document.getElementById("reportView").hidden = true;
    document.getElementById("settingsView").hidden = false;

    window.scrollTo(0, reportReturnScrollY);
}


function printVehicleReport() {

    const isAndroidApp =
        window.location.hostname ===
        "appassets.androidplatform.net";

    if (isAndroidApp) {

        // Bruk Androids innebygde utskriftssystem.
        if (
            window.AndroidPrint &&
            typeof window.AndroidPrint.printReport === "function"
        ) {
            window.AndroidPrint.printReport();

        } else {
            alert(
                "PDF-eksport er ikke tilgjengelig " +
                "i denne APK-versjonen."
            );
        }

        return;
    }

    // Vanlig nettleser: Chrome, Edge osv.
    window.print();
}