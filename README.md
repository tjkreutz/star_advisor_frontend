## Star Advisor – Front-End Chat UI

This project is a front-end-only chat interface for **Star Advisor**, an AI assistant that helps people understand and choose insurance in plain language.

### Tech stack

- React + TypeScript
- Vite

### Running the app

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Then open the printed local URL in your browser.

### Where to plug in a real AI backend

All chat behaviour currently runs on the client side with simulated assistant responses. To connect a real backend or AI provider:

- Open `src/App.tsx`.
- Replace the body of `createAssistantReply` with a call to your API, or
- Move the chat state and logic into a dedicated hook (for example `useChat`) and have that hook call your backend.

The UI will render whatever messages you push into the `messages` state.

### Theming

The subtle red theme and layout are defined with CSS variables and utility classes in:

- `src/index.css`

You can adjust the look and feel by tweaking the `--sa-*` variables near the top of that file.
