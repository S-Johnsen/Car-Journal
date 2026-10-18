# Car-Journal

Car Journal that allows user to keep track off everything fixed, maintained and replaceed on the car.

## Implementasjoner

- JSON [ok]
- HTML [ok]
- JS [ok]
- CSS [ok]

## JSON Struktur

### Journal Føring

- Id
- Dato
- KmStand
- Type (oppgave utført)
- Beskrivelse
- Media[]

### Garasje

#### Kjøretøy:

- Kjøretøy 1:
  - Kjøretøy Data
    - CheatSheet {}
  - Journal Logg Føringer[]

- Kjøretøy 2:
  - Kjøretøy Data
    - CheatSheet{}
  - Journal Logg Føringer[]

## Applikasjonstilstand og videre utvikling

Johnsen Auto Journal er per versjon 1.4.0 en funksjonell applikasjon for dokumentasjon, organisering og oppfølging av kjøretøy. Applikasjonen støtter administrasjon av flere kjøretøy, individuelle journalposter og lagring av informasjon om service, reparasjoner, vedlikehold og modifikasjoner. Hvert kjøretøy har i tillegg et eget Cheatsheet for tekniske opplysninger, notater og relevante lenker. Brukergrensesnittet er tilpasset både mobil og PC, med støtte for lyst og mørkt tema.

Applikasjonen er utviklet med HTML, CSS og JavaScript, og kjøres lokalt i nettleseren eller som en Android-applikasjon gjennom WebView. Løsningen er bygget uten eksterne rammeverk og er ikke avhengig av internettforbindelse, brukerkontoer eller eksterne tjenester for å fungere. Android-applikasjonen benytter en Java-basert integrasjon for blant annet filvalg, håndtering av eksterne lenker og utskrift av PDF-rapporter.

All brukerdata lagres lokalt på enheten. Kjøretøyinformasjon og journalposter administreres gjennom localStorage, mens bilder og CSV-vedlegg oppbevares i IndexedDB. Vedlegg knyttes til individuelle journalposter og kan administreres uten å påvirke øvrige filer eller kjøretøy. Applikasjonen støtter også generering av kjøretøyrapporter i PDF-format, hvor relevant informasjon fra journalen og kjøretøyets Cheatsheet sammenstilles i et utskriftsvennlig dokument.

Fra versjon 1.4.0 støtter applikasjonen import og analyse av CSV-baserte OBD-logger. CSV-filer knyttes til journalposter og behandles først når brukeren åpner analysevisningen. Parametere identifiseres dynamisk fra filinnholdet og presenteres i en statistikktabell med minimumsverdier, maksimumsverdier og gjennomsnitt. En enkel graf gir mulighet til å velge parametere for X- og Y-aksen, samt visning som linje- eller punktdiagram. Store datasett optimaliseres for grafisk fremstilling, mens statistikken beregnes fra alle gyldige målinger. Funksjonaliteten er ment som et supplement til dokumentasjonen, ikke som et selvstendig diagnoseverktøy.

Utviklingsstatus: Versjon 1.4.0 er ferdigstilt og funksjonstestet i både nettleser og Android-applikasjonen. Prosjektet har dermed et stabilt funksjonelt grunnlag som dekker de planlagte hovedfunksjonene for kjøretøyadministrasjon, journalføring og CSV-analyse. Videre utvikling vil i første omgang prioritere vedlikehold, feilrettinger og mindre forbedringer basert på erfaringer fra praktisk bruk. Eventuelle feil eller uforutsette problemer vil bli håndtert i senere vedlikeholdsversjoner, med v1.4.1 som neste aktuelle versjon.

## Versjonslogg

| Versjon |                    Endringer                     |   Status |
| :------ | :----------------------------------------------: | -------: |
| v1.0.0  |             Grunnleggende biljournal             |   Ferdig |
| v1.1.0  |        Journalhåndtering og bildelagring         |   Ferdig |
| v1.1.1  |     Dark Mode og oppdatert brukergrensesnitt     |   Ferdig |
| v1.2.0  |     Modifikasjoner, Cheatsheet og bildezoom      |   Ferdig |
| v1.2.1  | Feilretting av eksterne lenker i Android WebView |   Ferdig |
| v1.3.0  |          Settings & Vehicle Management           |   Ferdig |
| v1.3.1  |    Visuelle forbedringer + footer og contact     |   Ferdig |
| v1.4.0  |    Planlagt CSV-import og analyse av OBD-data    |   Ferdig |
| v1.4.1  |   Visuelle forbedringer og korrigering av feil   | Planlagt |
