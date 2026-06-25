# CardFlow

CardFlow is an intuitive, browser-based web application designed for generating bulk ID cards, badges, and passes.

## Overview

CardFlow streamlines the process of designing and generating ID cards for organizations, events, schools, and hospitals. It provides a visual drag-and-drop editor where you can build your template by adding text fields, images, dynamic photos, and a variety of vector shapes. Once the design is complete, you can import bulk data via CSV or Excel to automatically generate hundreds of unique cards at once.

## Features

- **Visual Editor:** Drag, drop, scale, and rotate text, images, and over 50 built-in vector shapes.
- **Bulk Data Mapping:** Upload CSV or Excel files to map spreadsheet columns directly to text fields on your template.
- **Dynamic Image Mapping:** Link image fields to local folders containing employee or attendee photos, automatically mapping them via unique ID numbers.
- **Prebuilt Themes:** Start from scratch or use one of the several prebuilt themes (Corporate, Event Pass, Student ID, etc.).
- **Export Options:** Export the final generated cards as a zipped archive of individual high-resolution images or as a multi-page PDF document.
- **Single Manual Entry:** Toggle to manual mode to quickly generate a single ID card without uploading a spreadsheet.

## Technology Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Exporting Engine:** html2canvas, jsPDF, JSZip
- **Data Parsing:** SheetJS (xlsx)

## Local Development

To run the application locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is automatically built and deployed to the `release` branch via GitHub Actions when code is pushed to `master`. The live site is hosted at `cardflow.abino.in`.
