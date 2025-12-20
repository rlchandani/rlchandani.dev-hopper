# Hopper

Hopper is a context-aware URL redirection engine designed to improve productivity by eliminating the need to type full URLs. It acts as a custom "search name hopper", allowing you to define shortcuts for different profiles (e.g., Work vs. Personal) and execute them via your browser's address bar.

## Features

- **Profile Management**: Switch between "Work", "Personal", or custom profiles.
- **Context-Aware Redirects**: The same command (e.g., `mail`) can go to Gmail in Personal profile and Outlook in Work profile.
- **Smart Search**: Commands can accept arguments (e.g., `gh hopper` -> Search GitHub for "hopper").
- **Global Shortcuts**: Define shortcuts that work across all profiles.
- **Management Dashboard**: A beautiful, glassmorphic UI to manage your shortcuts.

## Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Firebase**:
   - Create a Firebase project.
   - Enable **Firestore** and **Authentication**.
   - Create a `.env.local` file based on `.env.example`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Firebase config keys.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Browser Configuration

To use Hopper as your search engine:

1. Open the Dashboard.
2. Select your desired profile (e.g., Personal).
3. Click the **Share** icon (top right).
4. Copy the URL provided.
5. In your browser settings (Chrome/Edge), add a new "Site Search".
   - **Shortcut**: `h` (or whatever you prefer)
   - **URL**: Paste the copied URL.

Now you can type `h gh hopper` in your address bar to jump straight to GitHub!
