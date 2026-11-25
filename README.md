# Auto-Journal

**A local, offline-based vehicle journal for documentation, maintenance, and vehicle management.**

Auto Journal is an Android and browser-based application designed to organize vehicle information, document completed work, and maintain service history. The application combines traditional record-keeping with image attachments, technical specifications, CSV-based OBD analysis, and PDF reporting.

The project was developed with an emphasis on simplicity, local data storage, and a user interface that works across both mobile devices and desktop computers.

Technologies: HTML · CSS · JavaScript · Java · Android WebView · IndexedDB

Current Version: v1.4.1 – Completed

## Features

Auto Journal provides several features for organizing and documenting a vehicle's history.

### Vehicle Management

- Register, edit, and remove vehicles.
- Manage multiple vehicles within the same garage.
- Store registration numbers, manufacturers, models, and model years.
- Maintain vehicle-specific journal entries and technical information.

### Journal Management

- Create, edit, and delete journal entries.
- Record dates, mileage, titles, and descriptions.
- Categorize journal entries as Service, Repair, Workshop, Modification, or Diagnostics.
- Filter journal history by category.
- Attach multiple images and CSV files to individual journal entries.

### Technical Information

Each vehicle has its own Cheatsheet for technical specifications and practical notes.

- Register and update vehicle-specific information.
- Store notes and relevant links.
- Organize information useful for servicing, maintenance, and repairs.

### CSV & OBD Analysis

Auto Journal supports importing CSV-based OBD logs as attachments to journal entries.

- Dynamic identification of parameters from CSV files.
- Automatic handling of initial initialization rows.
- Statistical tables displaying minimum, maximum, and average values.
- Customizable parameters for the X and Y axes.
- Graphical visualization using line charts or scatter plots.
- Optimized chart rendering for large datasets.

Statistics are calculated using all valid measurement values, while charts may display a reduced number of data points to maintain performance.

The analysis feature is designed to provide an overview of recorded measurements rather than perform automated vehicle diagnostics.

### PDF Reports

- Generate vehicle-specific reports.
- Include vehicle information, Cheatsheets, and journal history.
- Export reports through the browser's or Android's printing system.
- Use a print-friendly A4 layout.

Raw CSV data and attached image files are not included in PDF reports.

### User Interface

- Responsive interface for mobile devices and desktop computers.
- Light Mode and Dark Mode.
- Local storage of user theme preferences.
- Image gallery with enlarged viewing capabilities.
- Separate management of image and CSV attachments.

## Implementation

| Technology |                Purpose                | Status |
| :--------- | :-----------------------------------: | -----: |
| JSON       |    Data structures and sample data    |   [ok] |
| HTML       |     Structure and user interface      |   [ok] |
| JS         | Application logic and data processing |   [ok] |
| CSS        |   Styling and responsive interface    |   [ok] |
| Java       |          Android integration          |   [ok] |

## Development Environment

| Tool               |                         Purpose |
| :----------------- | ------------------------------: |
| Visual Studio Code | Primary development environment |
| Git                |                 Version control |
| Gradle             |            Android build system |
| Android Studio     |  Android project and APK builds |

## Data Structure

The application organizes data within a garage containing one or more vehicles. Each vehicle maintains its own technical information, Cheatsheet, and collection of journal entries.

### Journal Entries:

A journal entry contains the following information:

- ID
- Date
- Mileage
- Type (Service, Repair, Workshop, Modification, or Diagnostics)
- Title
- Description
- Media []
  - Images (IMAGE)
  - CSV attachments (CSV)

Media objects contain references to files stored separately in IndexedDB. Multiple images and CSV files can be associated with the same journal entry.

### Garage

#### Vehicles:

- Vehicle 1:
  - Vehicle Data
  - Cheatsheet {}
  - Journal []
    - Journal Entry 1
      - Media []
    - Journal Entry 2
      - Media []

- Vehicle 2:
  - Vehicle Data
  - Cheatsheet {}
  - Journal []

- ...

## Application Status and Future Development

As of version 1.4.1, Johnsen Auto Journal is a functional application for vehicle documentation, organization, and maintenance tracking. The application supports managing multiple vehicles, maintaining individual journal entries, and recording information related to servicing, repairs, maintenance, and modifications. Each vehicle also includes a dedicated Cheatsheet for technical specifications, notes, and relevant links. The user interface is optimized for both mobile devices and desktop computers, with support for light and dark themes.

The application is developed using HTML, CSS, and JavaScript and runs locally in a web browser or as an Android application through WebView. The solution is built without external frameworks and does not require an internet connection, user accounts, or external services to function. The Android application uses Java-based integration for features such as file selection, external link handling, and PDF printing.

All user data is stored locally on the device. Vehicle information and journal entries are managed through localStorage, while images and CSV attachments are stored in IndexedDB. Attachments are associated with individual journal entries and can be managed independently without affecting other files or vehicles. The application also supports generating vehicle reports in PDF format, combining relevant journal information and vehicle-specific Cheatsheets into a print-friendly document.

Starting with version 1.4.0, the application supports importing and analyzing CSV-based OBD logs. CSV files are attached to journal entries and processed only when the user opens the analysis view. Parameters are dynamically identified from the file contents and presented in a statistical table displaying minimum, maximum, and average values. A graphical interface allows users to select parameters for the X and Y axes and choose between line charts and scatter plots. Large datasets are optimized for graphical rendering, while statistics are calculated using all valid measurements. This functionality is intended to supplement vehicle documentation rather than serve as a standalone diagnostic tool.

Development Status: Version 1.4.1 has been completed and functionally tested in both the web browser and Android application. The project now provides a stable functional foundation covering the planned core features for vehicle management, journal documentation, and CSV analysis. Future development will initially prioritize maintenance, bug fixes, and minor improvements based on practical usage and user feedback. Any identified bugs or unexpected issues will be addressed in subsequent maintenance releases, with v1.4.2 planned as the next update.

As of version 1.4.1, Auto Journal is a functional application for documenting, organizing, and managing vehicle information. The application supports multiple vehicles, individual journal entries, and the documentation of servicing, repairs, workshop activities, modifications, and diagnostics. Each vehicle includes a dedicated Cheatsheet for technical information, notes, and relevant links. The user interface is designed for both mobile and desktop use, with support for light and dark themes.

## Version History

| Version |                       Changes                        |   Status |
| :------ | :--------------------------------------------------: | -------: |
| v1.0.0  |         Basic vehicle journal functionality          | Complete |
| v1.1.0  |         Journal management and image storage         | Complete |
| v1.1.1  |         Dark Mode and updated user interface         | Complete |
| v1.2.0  |      Modifications, Cheatsheet, and image zoom       | Complete |
| v1.2.1  |   Fixed external link handling in Android WebView    | Complete |
| v1.3.0  |     Settings, vehicle management, and PDF export     | Complete |
| v1.3.1  | Visual improvements, contact information, and footer | Complete |
| v1.4.0  |  CSV import, OBD statistics, and graphical analysis  | Complete |
| v1.4.1  | Visual improvements, naming updates, and Diagnostics | Complete |
| v1.4.2  |      Maintenance, bug fixes, and user feedback       |  Planned |

## Developer

**Auto Journal** is developed and maintained by **Sondre Johnsen** as an independent software project.

The project combines an interest in automotive technology and software development, focusing on practical documentation, local data storage, and vehicle data analysis. The application is developed using HTML, CSS, JavaScript, and Java, with Android WebView serving as the platform for the mobile version.

### Contact and Feedback

Questions, feedback, bug reports, and suggestions for improvements can be sent directly to the developer.

- **Developer:** Sondre Johnsen
- **Email:** [sondre.johns1@gmail.com](mailto:sondre.johns1@gmail.com)
- **Project:** Auto Journal
- **Platform:** Web / Android

### Copyright

© 2026 Johnsen Auto Journal. Developed by Sondre Johnsen.

The project is independently developed and maintained. Information regarding future development, bug fixes, and new releases can be found in the project's version history.
