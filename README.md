# Exif Pro (照片信息查看器)

**Live Demo**: [exifpro.fandx.vip](https://exifpro.fandx.vip)

Exif Pro is a professional, privacy-first photo metadata viewer built with modern web technologies. It allows photographers and enthusiasts to inspect detailed EXIF information without uploading their photos to any server.

## ✨ Features

-   **🔒 Privacy First**: All processing happens locally in your browser. Your photos never leave your device.
-   **📊 Comprehensive Data**: View standard EXIF, IFD0, GPS, and specific tag groups.
-   **🔍 Professional Inspection**:
    -   **Hex Codes**: View raw tag IDs (e.g., `0x0112`) alongside names.
    -   **Decoded Values**: See human-readable meanings for standard enum values (e.g., Flash modes, Metering modes).
    -   **Search**: Instantly filter through hundreds of metadata tags.
-   **🌍 Internationalization**: Fully localized interface.
-   **🎨 Modern UI**: Clean, responsive design using Material UI.

## 🛠️ Tech Stack

-   **Core**: React 18, TypeScript, Vite
-   **UI**: Material UI (MUI)
-   **EXIF Parsing**: [exifr](https://github.com/mikeKovarik/exifr)
-   **State Management**: React Hooks

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/fangyishu/exifpro.git
    cd exifpro
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📄 License

MIT
