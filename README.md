# Cabin Manager

A comprehensive management application designed to streamline the maintenance and upkeep of a cabin property. This tool helps owners track projects, appliances, inventory, and maintenance history in one centralized, modern interface.

## Purpose

Owning a cabin comes with unique maintenance challenges. This application provides:

- **Dashboard Overview**: A high-level summary of active projects and recent maintenance activities.
- **Project Management**: Plan and execute cabin improvements with structured task lists.
- **Appliance Registry**: Keep track of model numbers, brands, and detailed maintenance history for all on-site equipment.
- **Inventory Tracking**: Manage tools, supplies, and consumables (like firewood or propane) to ensure you're never caught off guard.
- **Maintenance Logs**: Record repairs and routine maintenance with descriptions and photo attachments for future reference.

## Getting Started

### Environment Configuration

To run this project, you need a [Supabase](https://supabase.com/) project. Create a `.env` file in the root directory and add the following variables:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Developing

Once you've installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> [!NOTE]
> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment. This project is currently configured for Netlify but can be adjusted in `svelte.config.js`.

## Tech Stack

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide Svelte
