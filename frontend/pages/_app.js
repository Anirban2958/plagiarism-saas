// =====================
// Custom App component for Next.js
// =====================
// This file is used to initialize pages. You can use it to keep state when navigating between pages,
// inject global CSS, or wrap your app with providers (e.g., for state management).

import '../styles/globals.css' // Import global styles for the entire app

export default function MyApp({ Component, pageProps }) {
  // Render the active page. 'Component' is the current page, 'pageProps' are its props.
  return <Component {...pageProps} />
}
