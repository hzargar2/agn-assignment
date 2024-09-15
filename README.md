## Project Setup

Begin by installing the requirements.
```sh
npm install
```

### Compile and Hot-Reload for Development

Then you can start the server by running:

```sh
npm run dev
```

This will start both an express server and the Vite server. The express server provides an endpoint that is used to read the data file and return it as a JSON response to the frontend client on its initial page load.

The Vue app will run on: `http://localhost:5173`

Notes: Chart can be moved around by clicking and dragging and can be zoomed by scrolling.

### Compile and Minify for Production

```sh
npm run build
```
