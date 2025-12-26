---
description: How to deploy Nebula Compressor to Cloudflare Pages
---

# Deploying to Cloudflare Pages

Yes/Yes! Simple static sites like this are **perfect** for Cloudflare Pages. It is free, fast (served from the edge), and supports HTTPS automatically.

## Method 1: Direct Upload (Easiest)
This is best if you just want to put the current folder online immediately without using Git.

1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create Application**.
3.  Select the **Pages** tab.
4.  Choose **"Upload Assets"**.
5.  Name your project (e.g., `smart-compressor`).
6.  **Drag and Drop** the folder `d:\antigravity\image_compressor` into the upload box.
    *   *Note: You don't need to upload `start_tool.bat`, but it won't hurt if you do.*
7.  Click **Deploy Site**.

Done! You will get a URL like `https://smart-compressor.pages.dev`.

## Method 2: Connect to Git (Recommended)
If you want the site to update automatically when you save code changes.

1.  Push this folder `d:\antigravity\image_compressor` to a GitHub repository.
2.  In Cloudflare Dashboard, go to **Workers & Pages** > **Create Application** > **Connect to Git**.
3.  Select your repository.
4.  **Build Settings**:
    *   **Framework Preset**: None (it's plain HTML).
    *   **Build Command**: (Leave empty).
    *   **Output Directory**: (Leave empty or `/` if asked).
5.  Click **Save and Deploy**.

## Method 3: GitHub Desktop (Visual Interface)
If you prefer using a GUI instead of the command line.

1.  Open **GitHub Desktop**.
2.  Go to **File** > **Add Local Repository**.
3.  Click **Choose...** and select the folder: `D:\antigravity\image_compressor`.
4.  Click **Add Repository**.
5.  You will see a list of "Changes" on the left (index.html, style.css, etc.).
6.  In the bottom left "Summary" box, type "Initial Commit" and click the blue **Commit to master** button.
7.  Click the **Publish repository** button in the top toolbar.
    *   Name: `nebula-compressor`
    *   Uncheck "Keep this code private" (optional, for easier Pages setup).
    *   Click **Publish Repository**.
8.  Now follow the "Cloudflare Pages" steps in Method 2 (Connect to Git) to put it online!

## Important Note for v3.0
The "Copy Image" issue from before (file:// restrictions) **will totally disappear** once deployed on Cloudflare. 
Because Cloudflare provides a secure `https://` connection, browsers automatically unlock all clipboard features. You (and anyone you share the link with) will get the best experience automatically.
