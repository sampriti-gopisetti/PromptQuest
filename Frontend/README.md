# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/62ef0233-10a5-48cb-918c-9fd7ccee79fb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/62ef0233-10a5-48cb-918c-9fd7ccee79fb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Responsive Design Guidelines

Recent improvements added mobile-first responsiveness:

- Added an `xs (480px)` breakpoint in `tailwind.config.ts` for very small devices.
- Removed forced `overflow: hidden` on `html, body` to allow natural vertical scrolling and avoid mobile 100vh issues.
- Converted the main game container in `Index.tsx` to `w-full min-h-screen` instead of `w-screen h-screen` to prevent horizontal jitter and better handle mobile browser chrome.
- Introduced a utility class `.responsive-modal-width` (see `src/index.css`) that scales modal max-widths across breakpoints.
- Updated `QuestionModal` and `FeedbackModal` to use adaptive text sizes (`text-sm sm:text-base`) and the new responsive width utility.
- Adjusted `PlayerStatus` to shrink and reposition on small screens using percentage width and `xs` breakpoint.

### Adding Responsive Components

Use Tailwind’s mobile-first classes. Example pattern:

```tsx
<div className="p-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{/* items */}
</div>
```

### Modal Pattern

Wrap dialog content with `responsive-modal-width` and avoid fixed pixel widths:

```tsx
<DialogContent className="responsive-modal-width border-4 border-black" />
```

### Common Pitfalls Avoided

- Avoid hard `100vh` on mobile: use `min-h-screen`.
- Avoid `w-screen` unless you need to force canvas width; prefer `w-full` in layouts.
- Keep text readable: scale font sizes with `text-sm sm:text-base md:text-lg` as needed.
- Constrain large grids or 3D/canvas elements; conditionally hide heavy visuals for very small screens if performance becomes an issue.

### Next Steps (Optional)

- Introduce conditional rendering or simplified map for devices narrower than 480px.
- Add integration tests for layout (e.g., using Playwright) to ensure modals fit within viewport.
- Consider a `Layout` component encapsulating top-left status and map for future multi-page expansion.

## Deployment Notes

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/62ef0233-10a5-48cb-918c-9fd7ccee79fb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
