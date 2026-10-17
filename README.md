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

## Videre utviklng

Applikasjonen fungere med CRUD for loggføringer, det er Read and Update for teknisk-kjøretøyinnformasjon, det er mediagalleri med mulighet for fullskjermvisning og zoom på bilder. Videre vil det være greit å se på CSV filer og mulige tabeller knyttet til CSV loggføringer fra OBD porter. Etterhvert kanskje også funksjoner/grafer for å illustrere dataloggene.

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
| v1.4.0  |    Planlagt CSV-import og analyse av OBD-data    | Planlagt |
