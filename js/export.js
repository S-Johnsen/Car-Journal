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
        return text || "Unknown Date";
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
            "AUTO JOURNAL"
        )
    );

    header.appendChild(
        createReportElement("h1", "", "Vehicle Report")
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
            "Generated: " +
                new Intl.DateTimeFormat("en-GB").format(new Date())
        )
    );

    root.appendChild(header);

    // 01 - Kjøretøyinformasjon
    const vehicleSection = createReportSection(
        root,
        "01 – Vehicle Information"
    );

    appendReportField(
        vehicleSection, "Manufacturer", vehicle.manufacturer
    );

    appendReportField(
        vehicleSection, "Model", vehicle.model
    );

    appendReportField(
        vehicleSection, "Year", vehicle.year
    );

    appendReportField(
        vehicleSection,
        "Registration",
        vehicle.registration
    );

    // 02 - Teknisk informasjon
    const technicalSection = createReportSection(
        root,
        "02 – Technical Information"
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
                "Additional Information"
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
                "Links and Resources"
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
                "No technical information recorded."
            )
        );
    }

    // 03 - Journalhistorikk
    const journalSection = createReportSection(
        root,
        "03 – Journal History"
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
            `${entries.length} journal entries recorded`
        )
    );

    if (entries.length === 0) {
        journalSection.appendChild(
            createReportElement(
                "p",
                "reportEmpty",
                "No journal entries recorded."
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
            entry.title || "Untitled"
        );

        const odometer = Number.isFinite(
            Number(entry.odometer)
        )
            ? Number(entry.odometer).toLocaleString("en-GB") + " km"
            : "Odometer unavailable";

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
            entry.description || "No description provided."
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
        "This report is based on user-provided information " +
        "recorded in Auto Journal. The information has not been independently verified.";

    root.appendChild(footer);
}


// Velg kjøretøy og åpne rapportvisningen.
function openVehicleReport() {
    const vehicleId = document.getElementById(
        "settingsExportVehicle"
    ).value;

    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) {
        alert("Select a vehicle first.");
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
                "PDF export is not available " +
                "in this version of the Android app."
            );
        }

        return;
    }

    // Vanlig nettleser: Chrome, Edge osv.
    window.print();
}