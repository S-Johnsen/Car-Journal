// ==========================================
// CSV GRAPH - Johnsen Auto Journal v1.4.0
// ==========================================

let csvGraphData = null;

const CSV_GRAPH_MAX_POINTS = 1800;


// Klargjør grafen for et nytt CSV-datasett.
function initializeCsvGraph(parsed) {

    csvGraphData = parsed;

    const xSelect = document.getElementById("csvGraphXAxis");
    const ySelect = document.getElementById("csvGraphYAxis");
    const typeSelect = document.getElementById("csvGraphType");

    xSelect.replaceChildren();
    ySelect.replaceChildren();

    // Tell forekomster av like parameternavn.
    const nameCounts = new Map();

    parsed.parameters.forEach(name => {
        nameCounts.set(
            name,
            (nameCounts.get(name) || 0) + 1
        );
    });

    // Kolonneindeksen er parameterens identifikator.
    parsed.parameters.forEach((name, index) => {

        const label = nameCounts.get(name) > 1
            ? `${name} (kolonne ${index + 1})`
            : name;

        xSelect.add(new Option(label, String(index)));
        ySelect.add(new Option(label, String(index)));
    });

    // Standard: Time på X og første sensor på Y.
    xSelect.value = "0";
    ySelect.value = "1";

    typeSelect.value = "line";

    xSelect.onchange = drawCsvGraph;
    ySelect.onchange = drawCsvGraph;
    typeSelect.onchange = drawCsvGraph;

    document.getElementById("csvGraphSection").hidden = false;
}


// Frigjør referansen til datasettet.
function clearCsvGraph() {
    csvGraphData = null;
}

// Velg representativ informasjon til grafen.
// Statistikken påvirkes ikke.
function prepareCsvGraphPoints(rows, xIndex, yIndex) {

    const valid = [];

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    let segment = 0;
    let previousValid = false;

    for (const row of rows) {

        const x = row[xIndex];
        const y = row[yIndex];

        if (!Number.isFinite(x) || !Number.isFinite(y)) {

            if (previousValid) {
                segment++;
            }

            previousValid = false;
            continue;
        }

        previousValid = true;

        valid.push({ x, y, segment });

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);

        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }

    // Små datasett trenger ingen reduksjon.
    if (valid.length <= CSV_GRAPH_MAX_POINTS) {
        return {
            points: valid,
            validCount: valid.length,
            minX, maxX, minY, maxY
        };
    }

    // Del datasettet i intervaller.
    const bucketCount = Math.floor(
        CSV_GRAPH_MAX_POINTS / 6
    );

    const bucketSize = Math.ceil(
        valid.length / bucketCount
    );

    const selected = [];

    for (
        let start = 0;
        start < valid.length;
        start += bucketSize
    ) {

        const end = Math.min(
            start + bucketSize,
            valid.length
        );

        let minXIndex = start;
        let maxXIndex = start;
        let minYIndex = start;
        let maxYIndex = start;

        for (let i = start + 1; i < end; i++) {

            if (valid[i].x < valid[minXIndex].x) {
                minXIndex = i;
            }

            if (valid[i].x > valid[maxXIndex].x) {
                maxXIndex = i;
            }

            if (valid[i].y < valid[minYIndex].y) {
                minYIndex = i;
            }

            if (valid[i].y > valid[maxYIndex].y) {
                maxYIndex = i;
            }
        }

        // Behold første/siste punkt og lokale
        // minimums- og maksimumsverdier.
        const indices = [
            start,
            minXIndex,
            maxXIndex,
            minYIndex,
            maxYIndex,
            end - 1
        ];

        const uniqueIndices = [...new Set(indices)]
            .sort((a, b) => a - b);

        uniqueIndices.forEach(i => {
            selected.push(valid[i]);
        });
    }

    return {
        points: selected,
        validCount: valid.length,
        minX, maxX, minY, maxY
    };
}

// Forkort lange aksenavn uten å endre originalnavnet.
function fitCsvGraphLabel(ctx, text, maxWidth) {

    if (ctx.measureText(text).width <= maxWidth) {
        return text;
    }

    let shortened = text;

    while (
        shortened.length > 0 &&
        ctx.measureText(shortened + "…").width > maxWidth
    ) {
        shortened = shortened.slice(0, -1);
    }

    return shortened + "…";
}


// Tegn grafen med Canvas 2D.
function drawCsvGraph() {

    const view = document.getElementById("csvAnalysisView");
    const section = document.getElementById("csvGraphSection");

    if (!csvGraphData || view.hidden || section.hidden) {
        return;
    }

    const canvas = document.getElementById("csvGraphCanvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const xSelect = document.getElementById("csvGraphXAxis");
    const ySelect = document.getElementById("csvGraphYAxis");
    const typeSelect = document.getElementById("csvGraphType");

    const xIndex = Number(xSelect.value);
    const yIndex = Number(ySelect.value);
    const graphType = typeSelect.value;

    // Bruk eksisterende temafarger.
    const styles = getComputedStyle(document.documentElement);

    const graphColor =
        styles.getPropertyValue("--textColor").trim() || "#10ff00";

    const textColor =
        styles.getPropertyValue("--mutedTextColor").trim() || "#dddddd";

    const gridColor =
        styles.getPropertyValue("--secondaryColor1").trim() || "#888888";

    // Tilpass Canvas til skjermens oppløsning.
    const rect = canvas.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    if (width < 100 || height < 100) {
        return;
    }

    const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Les de valgte parameterne.
    const data = prepareCsvGraphPoints(
        csvGraphData.rows,
        xIndex,
        yIndex
    );

    if (data.validCount === 0) {

        ctx.fillStyle = textColor;
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";

        ctx.fillText(
            "Ingen gyldige målepar for disse parameterne.",
            width / 2,
            height / 2,
            width - 16
        );

        updateCsvGraphSummary(data);
        return;
    }

    // Området hvor punktene skal tegnes.
    const left = 66;
    const right = 14;
    const top = 18;
    const bottom = 60;

    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    if (plotWidth <= 0 || plotHeight <= 0) {
        return;
    }

    // Unngå divisjon med null når en parameter
    // har samme verdi i hele loggøkten.
    const minX = data.minX === data.maxX
        ? data.minX - 0.5
        : data.minX;

    const maxX = data.minX === data.maxX
        ? data.maxX + 0.5
        : data.maxX;

    const minY = data.minY === data.maxY
        ? data.minY - 0.5
        : data.minY;

    const maxY = data.minY === data.maxY
        ? data.maxY + 0.5
        : data.maxY;

    const scaleX = x =>
        left + (x - minX) / (maxX - minX) * plotWidth;

    const scaleY = y =>
        top + plotHeight -
        (y - minY) / (maxY - minY) * plotHeight;

    const formatNumber = new Intl.NumberFormat("nb-NO", {
        maximumSignificantDigits: 3
    });

    // Rutenett og akseverdier.
    ctx.font = "11px system-ui";
    ctx.lineWidth = 1;

    const tickCount = width < 380 ? 3 : 5;

    for (let i = 0; i < tickCount; i++) {

        const fraction = i / (tickCount - 1);

        const x = left + fraction * plotWidth;
        const y = top + fraction * plotHeight;

        ctx.strokeStyle = gridColor;
        ctx.globalAlpha = 0.25;

        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + plotHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + plotWidth, y);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = textColor;

        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.fillText(
            formatNumber.format(
                minX + fraction * (maxX - minX)
            ),
            x,
            top + plotHeight + 7
        );

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.fillText(
            formatNumber.format(
                maxY - fraction * (maxY - minY)
            ),
            left - 8,
            y
        );
    }

    // Aksetitler.
    ctx.fillStyle = textColor;
    ctx.font = "12px system-ui";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        fitCsvGraphLabel(
            ctx,
            csvGraphData.parameters[xIndex],
            plotWidth
        ),
        left + plotWidth / 2,
        height - 12
    );

    ctx.save();

    ctx.translate(13, top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);

    ctx.fillText(
        fitCsvGraphLabel(
            ctx,
            csvGraphData.parameters[yIndex],
            plotHeight
        ),
        0,
        0
    );

    ctx.restore();

    // Tegn måleverdiene.
    ctx.strokeStyle = graphColor;
    ctx.fillStyle = graphColor;
    ctx.lineWidth = 1.8;

    if (graphType === "line") {

        ctx.beginPath();

        let previousSegment = null;

        for (const point of data.points) {

            const x = scaleX(point.x);
            const y = scaleY(point.y);

            if (point.segment !== previousSegment) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            previousSegment = point.segment;
        }

        ctx.stroke();

    } else {

        // Punktdiagram.
        for (const point of data.points) {

            ctx.beginPath();

            ctx.arc(
                scaleX(point.x),
                scaleY(point.y),
                2.2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    updateCsvGraphSummary(data);
}


// Vis om grafen er optimalisert.
function updateCsvGraphSummary(data) {

    const element = document.getElementById(
        "csvGraphSummary"
    );

    if (!element) {
        return;
    }

    const shown = data.points.length.toLocaleString("nb-NO");
    const total = data.validCount.toLocaleString("nb-NO");

    element.textContent =
        `Viser ${shown} av ${total} gyldige målepar. ` +
        "Statistikken bruker alle gyldige målinger.";
}


// Tegn grafen på nytt ved endret skjermstørrelse.
window.addEventListener("resize", () => {
    requestAnimationFrame(drawCsvGraph);
});