# CSS Selector Panel

A modern, secure admin panel for storing and managing CSS selectors for various sites. Built with React, Tailwind CSS, and Cloudflare Pages + Workers KV.

## Features

- ✨ Modern and beautiful UI with Tailwind CSS
- 🔒 Secure authentication with custom admin path
- 🗂️ Persistent storage in Cloudflare Workers KV
- 📋 One-click copy to clipboard
- ➕ Fast site addition via textarea form
- 🗑️ Easy site deletion with confirmation
- 📱 Fully responsive design
- 🎉 Smooth animations and transitions
- 🔑 API Key management for external access

## Project Structure

```
.
├── src/
│   ├── App.jsx              # Main dashboard component
│   ├── Login.jsx            # Login page component
│   ├── main.jsx             # Entry point with auth check
│   └── index.css            # Tailwind CSS imports
├── functions/
│   ├── _middleware.js       # Main middleware for path protection
│   ├── public-api/
│   │   └── sites.js         # Public API endpoint (API Key protected)
│   └── api/
│       ├── _middleware.js   # API auth middleware
│       ├── apikey.js        # API Key management endpoints
│       ├── sites.js         # Sites CRUD endpoints
│       └── auth/
│           ├── login.js     # Login endpoint
│           ├── logout.js    # Logout endpoint
│           └── check.js     # Auth check endpoint
├── _headers
├── _routes.json
├── tailwind.config.js
├── postcss.config.js
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
git clone https://github.com/ali934h/css-selector-panel.git
cd css-selector-panel
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
4. Create a new namespace named `CSS-Selector-Panel`

### Step 2: Connect Repository to Cloudflare Pages

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click **Create application**
3. Select the **Pages** tab
4. Click **Connect to Git**
5. Select the `css-selector-panel` repository
6. Configure build settings as follows:

   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

7. Click **Save and Deploy**

### Step 3: Configure Environment Variables

**IMPORTANT:** You need to set these environment variables in Cloudflare Pages:

1. Go to your Pages project → **Settings** → **Environment variables**
2. Add the following variables for **Production** (and Preview if needed):

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `ADMIN_PASSWORD` | `MyStr0ng!P@ssw0rd#2024` | Strong password for admin access |
| `ADMIN_PATH` | `secret-admin-xyz` | Custom admin path (without leading slash) |

**Example Configuration:**
```
ADMIN_PASSWORD = MyStr0ng!P@ssw0rd#2024
ADMIN_PATH = my-secret-panel-2024
```

With these settings, your panel will be accessible at:
```
https://your-site.pages.dev/my-secret-panel-2024
```

**Security Tips:**
- Use a strong password with uppercase, lowercase, numbers, and special characters
- Choose an unpredictable admin path (not "admin", "panel", etc.)
- Don't share these values publicly

### Step 4: Bind KV Namespace

1. In project **Settings**, go to **Functions** section
2. In **KV namespace bindings**, click **Add binding**
3. Enter the following settings:
   - **Variable name**: `GALLERY_SECURITY_SELECTORS`
   - **KV namespace**: Select the namespace you created in Step 1
4. Click **Save**

### Step 5: Deploy

1. Go to **Deployments** tab
2. Click **Retry deployment** to apply all changes
3. Your panel will be live at `https://your-site.pages.dev/YOUR_ADMIN_PATH`

## How to Use

### Accessing the Panel

1. Navigate to `https://your-site.pages.dev/YOUR_ADMIN_PATH`
2. Enter your configured password
3. Click **Sign In**

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
- A success notification will appear

### Deleting a Site

- Click the **Delete** button at the top of each column
- Confirm the deletion in the dialog
- The site will be removed from KV

### Logging Out

- Click the **Logout** button in the top-right corner
- You'll be redirected to the login page

## Public API

The panel provides a public API endpoint that can be accessed from any external website using an API Key.

### Generate an API Key

1. Log in to the admin panel
2. In the **API Key Management** section, click **Generate API Key**
3. Copy the generated key

### API Endpoint

**GET** `/public-api/sites`

Returns all stored sites and their CSS selectors.

**Request Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | ✅ Yes | Your generated API Key |

**Example Usage:**

```javascript
fetch('https://your-site.pages.dev/public-api/sites', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

**Response Format:**

```json
{
  "success": true,
  "count": 2,
  "sites": [
    {
      "site": "example.com",
      "cardSelector": "div.card",
      "linkSelector": "a.link",
      "containerSelector": "div.container"
    }
  ]
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401` | API Key is missing |
| `403` | Invalid API Key |
| `500` | Server error |

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
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vite** - Build tool
- **Cloudflare Pages** - Hosting and deployment
- **Cloudflare Workers KV** - Key-value database
- **Pages Functions** - Serverless API

## Security Features

- **Custom Admin Path**: Hide your admin panel with a secret URL
- **Password Protection**: Strong password authentication
- **HttpOnly Cookies**: Secure session management
- **Path Middleware**: Automatic 404 for unauthorized paths
- **API Protection**: All API endpoints require authentication
- **API Key Authentication**: Public API protected by rotating API Keys

## Customization

### Changing Colors

Edit `tailwind.config.js` to change the primary color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Fields

1. Update the JSON structure in `functions/api/sites.js`
2. Add new table rows in `src/App.jsx`
3. Update the form instructions

## Troubleshooting

### Cannot access the panel
- Make sure you're using the correct admin path from your ENV variables
- Check if environment variables are set correctly in Cloudflare Pages settings
- Verify KV namespace binding is configured

### Login not working
- Verify `ADMIN_PASSWORD` is set in environment variables
- Check browser console for errors
- Try clearing cookies and cache

### Sites not saving
- Confirm KV namespace binding variable name is `GALLERY_SECURITY_SELECTORS`
- Check the binding is added to the correct environment (Production/Preview)
- Redeploy after adding the binding

### Public API not working
- Make sure you have generated an API Key from the admin panel
- Verify the `X-API-Key` header is included in your request
- Check that the API Key has not been regenerated

## License

MIT

## Author

[@ali934h](https://github.com/ali934h)