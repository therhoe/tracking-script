// tracking-script.js

(function() {
    // Config
    const TRACKING_LIMIT = 100;
    const TRACKING_STORAGE_KEY = 'customTrackingVisitorCount';
    const ENDPOINT = 'https://xpsq-sdbm-bcmj.n7e.xano.io/api:C4HxN1_-/track-events';

    // Utility: Get or Init Visitor Count
    function getVisitorCount() {
        return parseInt(localStorage.getItem(TRACKING_STORAGE_KEY) || '0', 10);
    }

    function incrementVisitorCount() {
        const count = getVisitorCount() + 1;
        localStorage.setItem(TRACKING_STORAGE_KEY, count);
        return count;
    }

    // Stop tracking if limit reached
    if (getVisitorCount() >= TRACKING_LIMIT) return;

    // Record this visitor
    incrementVisitorCount();

    // Capture UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utms = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        if (urlParams.has(param)) {
            utms[param] = urlParams.get(param);
        }
    });

    // Send data function
    function sendTrackingEvent(eventType, extraData = {}) {
        const payload = {
            event: eventType,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            utms: utms,
            ...extraData
        };

        // Replace with your backend or logging service
        console.log('Tracking event:', payload);
        // Example POST request
        // fetch(ENDPOINT, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });
    }

    // Track clicks
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (target) {
            sendTrackingEvent('click', { element: target.tagName, text: target.innerText });
        }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        if (scrollDepth > maxScroll) {
            maxScroll = scrollDepth;
            sendTrackingEvent('scroll', { scrollDepth: maxScroll });
        }
    });

    // Track exit intent
    window.addEventListener('beforeunload', () => {
        sendTrackingEvent('exit', { finalScrollDepth: maxScroll });
    });

    // Initial pageview
    sendTrackingEvent('pageview');
})();
