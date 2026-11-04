
  (() => {
    const container = document.querySelector("[data-cal-inline='aether-studio/selfie-shoot']");
    if (!container || container.dataset.calInitialized === "true") return;

    const confirmationPath = container.dataset.selfieConfirmationPath || "/selfie-post-booking";
    const fallback = container.dataset.selfieBookingFallback || "The booking calendar could not be loaded. Please try again or email us.";
    let redirected = false;

    const redirectAfterBooking = () => {
      if (redirected) return;
      redirected = true;
      // Only an actual Cal.com success callback counts as a received request.
      // Do not forward its payload: it can contain personal booking details.
      document.dispatchEvent(new CustomEvent("selfie:booking-received"));
      if (document.body.dataset.experiment === "korean-selfie-v1") {
        window.setTimeout(() => window.location.assign(confirmationPath), 600);
      } else {
        window.location.assign(confirmationPath);
      }
    };

    const handleEmbedFailure = () => {
      if (container.querySelector("iframe") || container.dataset.calFailed === "true") return;
      container.dataset.calFailed = "true";
      container.textContent = fallback;
      container.classList.add("selfie-booking-embed__calendar--failed");
    };

    // A blocked or stalled embed may never emit linkFailed. Keep the external
    // Cal.com and email options visible below the calendar, and announce failure.
    window.setTimeout(() => {
      if (!container.querySelector("iframe")) handleEmbedFailure();
    }, 15_000);

    // Cal.com queues these calls until its embed script is ready. Register both
    // action names because the hosted embed has used both during the transition
    // from bookingSuccessful to bookingSuccessfulV2.
    const installEmbed = () => {
      window.Cal("init", { origin: "https://cal.com" });
      window.Cal("on", { action: "bookingSuccessfulV2", callback: redirectAfterBooking });
      window.Cal("on", { action: "bookingSuccessful", callback: redirectAfterBooking });
      window.Cal("on", { action: "linkFailed", callback: handleEmbedFailure });
      window.Cal("inline", {
        elementOrSelector: container,
        calLink: "aether-studio/selfie-shoot",
        config: { theme: "light", layout: "month_view" }
      });
      container.dataset.calInitialized = "true";
    };

    // This is Cal.com's documented queue loader. It lets the page register
    // actions immediately while the hosted embed script loads asynchronously.
    if (!window.Cal) {
      ((C, A, L) => {
        const push = (api, args) => api.q.push(args);
        const document = C.document;
        C.Cal = C.Cal || function (...args) {
          const cal = C.Cal;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = document.createElement("script");
            script.src = A;
            script.async = true;
            script.addEventListener("error", handleEmbedFailure, { once: true });
            document.head.appendChild(script);
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api = (...apiArgs) => push(api, apiArgs);
            const namespace = args[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = api;
              push(api, args);
            } else {
              push(cal, args);
            }
            return api;
          }
          push(cal, args);
        };
      })(window, "https://cal.com/embed/embed.js", "init");
    }

    installEmbed();
  })();
