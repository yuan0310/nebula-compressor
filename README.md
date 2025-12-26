# Nebula Image Compressor

A premium, privacy-focused web image compressor designed for HackMD and high-performance web usage. Built with a modern "$300k" aesthetic design system using advanced Glassmorphism and CSS animations.

![Nebula Compressor Preview](https://via.placeholder.com/800x450?text=Nebula+Compressor+UI)

## 🚀 Features

*   **Smart Compression Engine**:
    *   **Intelligent PNG Mode**: Preserves transparency and uses binary search to optimize dimensions while keeping format.
    *   **Binary Search JPEG**: Finds the absolute highest quality (0-100) that fits under 1MB.
    *   **Pass-through**: Instantly returns files that are already small enough.
*   **Privacy First**: All processing happens **100% in the browser**. No images are ever uploaded to a server.
*   **Premium UI/UX**:
    *   Smooth drag-and-drop workflow.
    *   Responsive "Nebula" dark theme.
    *   Instant visual feedback and micro-interactions.
*   **HackMD Optimized**: Specifically tuned to ensure images stay under the 1MB limit for free-tier HackMD usage.

## 🛠️ Tech Stack

*   **HTML5**
*   **CSS3** (Variables, Flexbox/Grid, Backdrop Filter)
*   **Vanilla JavaScript** (No heavy frameworks, <15KB)

## 🌍 Deployment

This project is optimized for **Cloudflare Pages**, **Vercel**, or **GitHub Pages**.

### Deploy to Cloudflare Pages (Recommended)
1.  Fork or push this repository to your GitHub.
2.  Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
3.  Go to **Workers & Pages** > **Create Application** > **Connect to Git**.
4.  Select this repository.
5.  Click **Save and Deploy**. (No build command needed).

## 📄 License

MIT License. Feel free to use and modify.
