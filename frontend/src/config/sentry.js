import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // no-op in dev if DSN not set

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || "production",
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    beforeSend(event) {
      // Redact sensitive query params from URLs
      if (event.request?.url) {
        event.request.url = event.request.url.replace(
          /appid=[^&]+/,
          "appid=REDACTED"
        );
      }
      return event;
    },
  });
}

export { Sentry };
