# Gallery Security Selectors

A simple admin panel for storing and managing CSS selectors for various sites, built with React and Cloudflare Pages + Workers KV.

## Features

- ✨ Simple and intuitive UI
- 🗂️ Persistent storage in Cloudflare Workers KV
- 📋 Quick copy selectors with one click
- ➕ Fast site addition via textarea form
- 🗑️ Easy site deletion
- 📱 Responsive design

## Project Structure

```
.
├── src/
│   ├── App.jsx          # Main component
│   ├── App.css          # UI styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── functions/
│   └── api/
│       └── sites.js     # API endpoints for KV
├── index.html
├── vite.config.js
└── package.json
```

## Local Installation and Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Cloudflare account

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/ali934h/Gallery-Security-Selectors.git
cd Gallery-Security-Selectors
```

2. Install dependencies:

```bash
npm install
```

3. Run the project in development mode:

```bash
npm run dev
```

## Deploying to Cloudflare Pages

### Step 1: Create KV Namespace

1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages**
3. Click on the **KV** tab
4. Create a new namespace named `Gallery-Security-Selectors`

### Step 2: Connect Repository to Cloudflare Pages

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click **Create application**
3. Select the **Pages** tab
4. Click **Connect to Git**
5. Select the `Gallery-Security-Selectors` repository
6. Configure build settings as follows:

   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

7. Click **Save and Deploy**

### Step 3: Bind KV Namespace

1. After the first deployment, go to project **Settings**
2. Navigate to **Functions** section
3. In **KV namespace bindings**, click **Add binding**
4. Enter the following settings:
   - **Variable name**: `GALLERY_SECURITY_SELECTORS`
   - **KV namespace**: Select the namespace you created in Step 1
5. Click **Save**
6. Perform a **Redeploy** to apply the changes

## How to Use

### Adding a New Site

1. Enter 4 lines in the textarea in the following order:
   ```
   example.com
   div.card-selector
   a.link-selector
   div.container-selector
   ```

2. Click the **Add Site** button

3. The site will be added to the table

### Copying Selectors

- Click on any cell in the table to copy its value to clipboard
- A toast notification will appear

### Deleting a Site

- Click the **Delete** button at the top of each column
- A confirmation dialog will appear
- After confirmation, the site will be removed from KV

## Data Structure in KV

Each site is stored as a key-value pair in KV:

**Key**: Site domain name (e.g., `example.com`)

**Value**: JSON in the following format

```json
{
  "site": "example.com",
  "cardSelector": "div.card-selector",
  "linkSelector": "a.link-selector",
  "containerSelector": "div.container-selector"
}
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Cloudflare Pages** - Hosting and deployment
- **Cloudflare Workers KV** - Key-value database
- **Pages Functions** - Serverless API

## Further Development

To add new features:

1. UI changes in `src/App.jsx` and `src/App.css`
2. API changes in `functions/api/sites.js`
3. To add new fields, modify the JSON structure in KV

## License

MIT

## Author

[@ali934h](https://github.com/ali934h)