# Auto-Journal

<<<<<<< HEAD
**En lokal og offline-basert biljournal for dokumentasjon, vedlikehold og oppfølging av kjøretøy.**
=======
** En lokal og offline-basert biljournal for dokumentasjon, vedlikehold og oppfølging av kjøretøy.**
>>>>>>> 87dddf7f368a20df7015d9e6fc2546ec8ebea1d6

Auto Journal er en Android- og nettleserbasert applikasjon utviklet for å organisere kjøretøyinformasjon, dokumentere utført arbeid og bevare servicehistorikk. Applikasjonen kombinerer tradisjonell journalføring med bildevedlegg, tekniske opplysninger, CSV-basert OBD-analyse og PDF-rapportering.

Prosjektet er utviklet med fokus på enkelhet, lokal datalagring og et brukergrensesnitt som fungerer på både mobil og PC.

Teknologier: HTML · CSS · JavaScript · Java · Android WebView · IndexedDB

Gjeldende versjon: v1.4.1 – Ferdigstillt

## Funksjoner

Auto Journal tilbyr flere funksjoner for å organisere og dokumentere et kjøretøys historikk.

### Kjøretøyadministrasjon

- Registrere, redigere og fjerne kjøretøy.
- Administrere flere kjøretøy i samme garasje.
- Lagre registreringsnummer, produsent, modell og årstall.
- Oppbevare kjøretøyspesifikke journalposter og tekniske opplysninger.

### Journalføring

- Opprette, redigere og slette journalposter.
  Registrere dato, kilometerstand, tittel og beskrivelse.
  Kategorisere journalposter som Service, Reparasjon, Verksted, Modifikasjon eller Diagnostikk.
  Filtrere journalhistorikken etter kategori.
  Legge ved flere bilder og CSV-filer til hver journalpost.

### Tekniske opplysninger

Hvert kjøretøy har et eget Cheatsheet for tekniske opplysninger og praktiske notater.

- Registrere og oppdatere kjøretøyspesifikk informasjon.
- Lagre notater og relevante lenker.
- Samle opplysninger som er nyttige ved service, vedlikehold og reparasjoner.

### CSV & OBD Analyse

Auto Journal støtter import av CSV-baserte OBD-logger som vedlegg til journalposter.

- Dynamisk identifikasjon av parametere fra CSV-filen.
- Automatisk håndtering av innledende initialiseringsrader.
- Statistikktabell med minimum, maksimum og gjennomsnitt.
- Valgfrie parametere på X- og Y-aksen.
- Grafisk fremstilling med linje- eller punktdiagram.
- Optimalisert graftegning for store datasett.

Statistikken beregnes fra alle gyldige måleverdier, mens grafen kan vise et redusert utvalg punkter for å bevare ytelsen.

Analysefunksjonen er laget for å gi brukeren oversikt over loggførte målinger, ikke for å utføre automatisk kjøretøydiagnostikk.

### PDF Rapport

- Generere kjøretøyspesifikke rapporter.
- Inkludere kjøretøyinformasjon, Cheatsheet og journalhistorikk.
- Eksportere rapporter gjennom nettleserens eller Androids utskriftssystem.
- Benytte et utskriftsvennlig A4-format.

CSV-rådata og vedlagte bildefiler inkluderes ikke i PDF-rapportene.

### Brukergrensesnitt

- Responsivt grensesnitt for mobil og PC.
- Light Mode og Dark Mode.
- Lokal lagring av brukerens temavalg.
- Bildegalleri med mulighet for forstørret visning.
- Separat håndtering av bilder og CSV-vedlegg.

## Implementasjoner

| Teknologi |             Bruksområde              | Status |
| :-------- | :----------------------------------: | -----: |
| JSON      |     DataStruktur og eksempeldata     |   [ok] |
| HTML      |    Struktur og brukergrensesnitt     |   [ok] |
| JS        | Applikasjonslogikk og databehandling |   [ok] |
| CSS       |   Design og responsivt grensesnitt   |   [ok] |
| Java      |         Android-integrasjon          |   [ok] |

## Utviklingsmiljø

| Verktøy            |                  Bruksområde |
| :----------------- | ---------------------------: |
| Visual Studio Code |      Primært utviklingsmiljø |
| Git                |             Versjonskontroll |
| Gradle             |               Android-bygger |
| Android-Studio     | Android-prosjekt og APK-bygg |

## Datastruktur

Applikasjonen organiserer data i en garasje med ett eller flere kjøretøy. Hvert kjøretøy har egne tekniske opplysninger, et Cheatsheet og en samling journalposter.

### Journalposter:

En journalpost inneholder følgende informasjon:

- Id
- Dato
- Kilometerstand
- Type (Service, Reparasjon, Verksted, Modifikasjon eller Diagnostikk)
- Tittel
- Beskrivelse
- Media []
  - Bilder (IMAGE)
  - CSV-vedlegg (CSV)

Medieobjektene inneholder referanser til filer som lagres separat i IndexedDB. Flere bilder og CSV-filer kan knyttes til samme journalpost.

### Garasje

#### Kjøretøy:

- Kjøretøy 1:
  - Kjøretøy Data
  - CheatSheet {}
  - Journal []
    - Journalpost 1
      - Media []
    - Journalpost 2
      - Media []

- Kjøretøy 2:
  - Kjøretøy Data
  - CheatSheet{}
  - Journal[]

- ...

## Applikasjonstilstand og videre utvikling

Johnsen Auto Journal er per versjon 1.4.1 en funksjonell applikasjon for dokumentasjon, organisering og oppfølging av kjøretøy. Applikasjonen støtter administrasjon av flere kjøretøy, individuelle journalposter og lagring av informasjon om service, reparasjoner, vedlikehold og modifikasjoner. Hvert kjøretøy har i tillegg et eget Cheatsheet for tekniske opplysninger, notater og relevante lenker. Brukergrensesnittet er tilpasset både mobil og PC, med støtte for lyst og mørkt tema.

Applikasjonen er utviklet med HTML, CSS og JavaScript, og kjøres lokalt i nettleseren eller som en Android-applikasjon gjennom WebView. Løsningen er bygget uten eksterne rammeverk og er ikke avhengig av internettforbindelse, brukerkontoer eller eksterne tjenester for å fungere. Android-applikasjonen benytter en Java-basert integrasjon for blant annet filvalg, håndtering av eksterne lenker og utskrift av PDF-rapporter.

All brukerdata lagres lokalt på enheten. Kjøretøyinformasjon og journalposter administreres gjennom localStorage, mens bilder og CSV-vedlegg oppbevares i IndexedDB. Vedlegg knyttes til individuelle journalposter og kan administreres uten å påvirke øvrige filer eller kjøretøy. Applikasjonen støtter også generering av kjøretøyrapporter i PDF-format, hvor relevant informasjon fra journalen og kjøretøyets Cheatsheet sammenstilles i et utskriftsvennlig dokument.

Fra versjon 1.4.0 støtter applikasjonen import og analyse av CSV-baserte OBD-logger. CSV-filer knyttes til journalposter og behandles først når brukeren åpner analysevisningen. Parametere identifiseres dynamisk fra filinnholdet og presenteres i en statistikktabell med minimumsverdier, maksimumsverdier og gjennomsnitt. En enkel graf gir mulighet til å velge parametere for X- og Y-aksen, samt visning som linje- eller punktdiagram. Store datasett optimaliseres for grafisk fremstilling, mens statistikken beregnes fra alle gyldige målinger. Funksjonaliteten er ment som et supplement til dokumentasjonen, ikke som et selvstendig diagnoseverktøy.

Utviklingsstatus: Versjon 1.4.1 er ferdigstilt og funksjonstestet i både nettleser og Android-applikasjonen. Prosjektet har dermed et stabilt funksjonelt grunnlag som dekker de planlagte hovedfunksjonene for kjøretøyadministrasjon, journalføring og CSV-analyse. Videre utvikling vil i første omgang prioritere vedlikehold, feilrettinger og mindre forbedringer basert på erfaringer fra praktisk bruk. Eventuelle feil eller uforutsette problemer vil bli håndtert i senere vedlikeholdsversjoner, med v1.4.2 som neste aktuelle versjon.Auto Journal er per versjon 1.4.1 en funksjonell applikasjon for dokumentasjon, organisering og oppfølging av kjøretøy. Applikasjonen støtter administrasjon av flere kjøretøy, individuelle journalposter og registrering av service, reparasjoner, verkstedarbeid, modifikasjoner og diagnostikk. Hvert kjøretøy har et eget Cheatsheet for tekniske opplysninger, notater og relevante lenker. Brukergrensesnittet er tilpasset både mobil og PC, med støtte for lyst og mørkt tema.

## Versjonslogg

| Versjon |                       Endringer                        |   Status |
| :------ | :----------------------------------------------------: | -------: |
| v1.0.0  |                Grunnleggende biljournal                |   Ferdig |
| v1.1.0  |           Journalhåndtering og bildelagring            |   Ferdig |
| v1.1.1  |        Dark Mode og oppdatert brukergrensesnitt        |   Ferdig |
| v1.2.0  |        Modifikasjoner, Cheatsheet og bildezoom         |   Ferdig |
| v1.2.1  |    Feilretting av eksterne lenker i Android WebView    |   Ferdig |
| v1.3.0  |  Innstillinger, kjøretøyadministrasjon og PDF-eksport  |   Ferdig |
| v1.3.1  |  Visuelle forbedringer, kontaktinformasjon og footer   |   Ferdig |
| v1.4.0  |     CSV-import, OBD-statistikk og grafisk analyse      |   Ferdig |
| v1.4.1  | Visuelle forbedringer, navneoppdatering og Diagnostikk |   Ferdig |
| v1.4.2  |     Vedlikehold, feilrettinger og tilbakemeldinger     | Planlagt |

## Utvikler

**Auto Journal** er utviklet og vedlikeholdt av **Sondre Johnsen** som et selvstendig programvareprosjekt.

Prosjektet kombinerer interesse for bilteknologi og programvareutvikling, med fokus på praktisk dokumentasjon, lokal datalagring og analyse av kjøretøydata. Applikasjonen er utviklet med HTML, CSS, JavaScript og Java, med Android WebView som plattform for mobilversjonen.

### Kontakt og tilbakemelding

Spørsmål, tilbakemeldinger, feilrapporter og forslag til forbedringer kan sendes direkte til utvikleren.

- **Utvikler:** Sondre Johnsen
- **Email:** [sondre.johns1@gmail.com](mailto:sondre.johns1@gmail.com)
- **Prosjekt:** Auto Journal
- **Platform:** Web / Android

### Copyright

© 2026 Johnsen Auto Journal. Developed by Sondre Johnsen.

Prosjektet utvikles og vedlikeholdes uavhengig. Informasjon om videre utvikling, feilrettinger og nye versjoner finnes i prosjektets versjonshistorikk.
