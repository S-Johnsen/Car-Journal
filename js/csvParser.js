// ======================================
// CSV PARSER - Johnsen Auto Journal
// ======================================

// Deler én CSV-linje i kolonner.
// Håndterer også komma inne i anførselstegn.
function splitObdCsvLine(line) {
    const fields = [];

    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {

            if (insideQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }

        } else if (char === "," && !insideQuotes) {

            fields.push(current.trim());
            current = "";

        } else {
            current += char;
        }
    }

    if (insideQuotes) {
        throw new Error(
            "CSV row contains an unmatched quotation mark."
        );
    }

    fields.push(current.trim());

    return fields;
}


// Leser og behandler CSV-innholdet.
function parseObdCsvText(csvText) {

    // Fjern eventuell UTF-8 BOM.
    const lines = csvText
        .replace(/^\uFEFF/, "")
        .split(/\r\n|\n|\r/);

    if (lines.length < 3) {
        throw new Error(
            "CSV file is missing a header or parameter row."
        );
    }

    // Linje 1: StartTime.
    const startMatch = lines[0].match(
        /^#\s*StartTime\s*=\s*(.+)$/i
    );

    if (!startMatch) {
        throw new Error(
            "First line should contain # StartTime = ..."
        );
    }

    // Linje 2: Dynamiske parametere.
    const parameters = splitObdCsvLine(lines[1]);

    if (
        parameters.length < 2 ||
        !/^time\b/i.test(parameters[0]) ||
        parameters.some(name => !name)
    ) {
        throw new Error(
            "Second line should start with time " +
            "and contain at least one sensor."
        );
    }

    // ======================================
    // LES OG VALIDER MÅLERADER
    // ======================================

    const rawRows = [];

    for (let i = 2; i < lines.length; i++) {

        if (!lines[i].trim()) {
            continue;
        }

        const fields = splitObdCsvLine(lines[i]);

        if (fields.length !== parameters.length) {
            throw new Error(
                `Line ${i + 1}: expected ` +
                `${parameters.length} columns, ` +
                `found ${fields.length}.`
            );
        }

        const values = fields.map(field => {

            if (field === "") {
                return null;
            }

            const value = Number(field);

            return Number.isFinite(value)
                ? value
                : null;
        });

        if (values[0] === null) {
            throw new Error(
                `Line ${i + 1}: Illegal time value.`
            );
        }

        rawRows.push(values);
    }

    if (rawRows.length === 0) {
        throw new Error(
            "CSV file contains no measurements."
        );
    }

    const totalRows = rawRows.length;


    // ======================================
    // IDENTIFISER INITIALISERINGSFASEN
    // ======================================

    // Undersøk bare starten av loggen.
    const startupSeconds = 3;
    const startupMaxRows = 100;

    const firstTime = rawRows[0][0];

    let startIndex = 0;
    let highestActiveCount = 0;

    for (
        let i = 0;
        i < Math.min(rawRows.length, startupMaxRows);
        i++
    ) {

        const row = rawRows[i];

        // Ikke undersøk lenger enn tre sekunder.
        if (row[0] - firstTime > startupSeconds) {
            break;
        }

        // Tell parametere som rapporterer en verdi
        // ulik null. Tidskolonnen telles ikke.
        const activeCount = row
            .slice(1)
            .filter(value =>
                value !== null && value !== 0
            )
            .length;

        // Behold første rad med høyest
        // antall aktive parametere.
        if (activeCount > highestActiveCount) {
            highestActiveCount = activeCount;
            startIndex = i;
        }
    }


    // ======================================
    // BEHOLD GYLDIGE MÅLERADER
    // ======================================

    const initialRowsSkipped = startIndex;

    // Lag en analysevisning av datasettet.
    // Den originale CSV-filen endres ikke.
    const rows = rawRows.slice(startIndex);

    if (rows.length === 0) {
        throw new Error(
            "File contains no measurements " +
            "after initialisation."
        );
    }

    // Beregn Min, Max og Avg for hver sensor.
    // Kolonne 0 er tidsaksen og tas ikke
    // med i statistikktabellen.
    const statistics = parameters
        .slice(1)
        .map((name, sensorIndex) => {

            const column = sensorIndex + 1;

            let min = Infinity;
            let max = -Infinity;
            let sum = 0;
            let count = 0;

            for (const row of rows) {

                const value = row[column];

                // Ugyldige eller manglende verdier
                // skal ikke regnes som null.
                if (value === null) {
                    continue;
                }

                min = Math.min(min, value);
                max = Math.max(max, value);

                sum += value;
                count++;
            }

            return {
                index: column,
                name: name,

                min: count ? min : null,
                max: count ? max : null,
                avg: count ? sum / count : null,

                count: count
            };
        });

    return {
        startTime: startMatch[1].trim(),

        parameters: parameters,
        rows: rows,
        statistics: statistics,

        totalRows: totalRows,
        initialRowsSkipped: initialRowsSkipped
    };
}


// Leser en File eller Blob fra IndexedDB,
// og sender innholdet til CSV-parseren.
async function parseObdCsv(blob) {

    if (
        !blob ||
        typeof blob.text !== "function"
    ) {
        throw new Error(
            "CSV file could not be read."
        );
    }

    const text = await blob.text();

    return parseObdCsvText(text);
}