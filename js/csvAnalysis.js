// ==========================================
// CSV ANALYSIS - Johnsen Auto Journal v1.4.0
// ==========================================

let csvAnalysisReturnScrollY = 0;
let csvAnalysisRequestId = 0;


// Åpne analysevisningen for én bestemt CSV-fil.
async function openCsvAnalysis(media) {

    if (!media || media.type !== "CSV" || !media.storageKey) {
        return;
    }

    const view = document.getElementById("csvAnalysisView");
    const vehicleView = document.getElementById("vehicleView");

    const status = document.getElementById("csvAnalysisStatus");
    const results = document.getElementById("csvAnalysisResults");

    // Husk journalpostens rulleposisjon.
    csvAnalysisReturnScrollY = window.scrollY;

    // Bruk et eget ID-nummer per analyseforespørsel.
    // Dette hindrer at en gammel lasting oppdaterer
    // skjermen etter at brukeren har gått tilbake.
    const requestId = ++csvAnalysisRequestId;

    document.getElementById("csvAnalysisTitle").textContent =
        media.name || "CSV-analyse";

    document.getElementById("csvAnalysisMeta").textContent = "";

    document.getElementById("csvStatisticsBody").replaceChildren();

    // Grafen implementeres i steg 6D.
    document.getElementById("csvGraphSection").hidden = true;
    
    clearCsvGraph();

    results.hidden = true;

    status.hidden = false;
    status.textContent = "Leser og analyserer CSV-filen ...";

    // Vis analysevisningen i stedet for kjøretøyvisningen.
    vehicleView.hidden = true;
    view.hidden = false;

    // Unngå at innstillinger åpnes oppå analysevisningen.
    document.getElementById("openSettingsButton").hidden = true;

    window.scrollTo(0, 0);

    try {

        // Hent originalfilen fra IndexedDB.
        const storedFile = await loadMediaFile(media.storageKey);

        if (!storedFile || !storedFile.blob) {
            throw new Error("CSV-filen finnes ikke i lokal lagring.");
        }

        // Parseren leser filen, filtrerer tomme innledende
        // rader og beregner Min, Max og Avg.
        const parsed = await parseObdCsv(storedFile.blob);

        // Avbryt visningsoppdateringen dersom brukeren
        // allerede har forlatt analysevisningen.
        if (requestId !== csvAnalysisRequestId) {
            return;
        }

        renderCsvStatistics(parsed);

        const parameters = parsed.statistics.length;
        const measurements = parsed.rows.length;
        const skipped = parsed.initialRowsSkipped;

        const meta = [
            `${parameters} parametere`,
            `${measurements} målinger`,
            `${skipped} tomme startrader utelatt`
        ];

        document.getElementById("csvAnalysisMeta").textContent =
            meta.join(" · ");

        status.hidden = true;
        results.hidden = false;

        // Klargjør grafen med samme datasett som statistikken.
        initializeCsvGraph(parsed);

        // Vent til analysevisningen har fått sin faktiske
        // størrelse før Canvas tegnes.
        requestAnimationFrame(() => {

            if (
                requestId === csvAnalysisRequestId &&
                !view.hidden
            ) {
                drawCsvGraph();
            }
        });

    } catch (error) {

        if (requestId !== csvAnalysisRequestId) {
            return;
        }

        console.error("Kunne ikke analysere CSV:", error);

        status.textContent =
            "Kunne ikke analysere filen: " + error.message;

        status.hidden = false;
        results.hidden = true;
    }
}


// Opprett statistikktabellen dynamisk.
function renderCsvStatistics(parsed) {

    const body = document.getElementById("csvStatisticsBody");

    body.replaceChildren();

    // Minimum og maksimum vises med inntil seks desimaler.
    const valueFormatter = new Intl.NumberFormat("nb-NO", {
        maximumFractionDigits: 6
    });

    // Gjennomsnitt avrundes til to desimaler i visningen.
    const avgFormatter = new Intl.NumberFormat("nb-NO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    parsed.statistics.forEach((statistic) => {

        const row = document.createElement("tr");

        const values = [
            statistic.name,
            statistic.min === null
                ? "—"
                : valueFormatter.format(statistic.min),

            statistic.max === null
                ? "—"
                : valueFormatter.format(statistic.max),

            statistic.avg === null
                ? "—"
                : avgFormatter.format(statistic.avg)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;

            row.appendChild(cell);
        });

        body.appendChild(row);
    });
}


// Returner til journalposten brukeren åpnet filen fra.
function closeCsvAnalysis() {

    const view = document.getElementById("csvAnalysisView");

    if (view.hidden) {
        return;
    }

    // Ugyldiggjør eventuell pågående filanalyse.
    csvAnalysisRequestId++;

    clearCsvGraph();

    view.hidden = true;

    document.getElementById("vehicleView").hidden = false;
    document.getElementById("openSettingsButton").hidden = false;

    // Journalposten ligger fortsatt åpen inne i vehicleView.
    // Vi trenger derfor ikke laste journalen på nytt.
    requestAnimationFrame(() => {
        window.scrollTo(0, csvAnalysisReturnScrollY);
    });
}