import { useState, useEffect } from "react";

export function useViewedNotifications() {
    const [viewed, setViewed] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("viewed_notifications");
        if (stored) {
            try {
                setViewed(new Set(JSON.parse(stored)));
            } catch (e) {
                console.error(e);
            }
        }
        setIsLoaded(true);
    }, []);

    const markViewed = (id: string) => {
        setViewed((prev) => {
            const next = new Set([...prev, id]);
            localStorage.setItem("viewed_notifications", JSON.stringify(Array.from(next)));
            return next;
        });
    };

    const markAllViewed = (ids: string[]) => {
        setViewed((prev) => {
            const next = new Set([...prev, ...ids]);
            localStorage.setItem("viewed_notifications", JSON.stringify(Array.from(next)));
            return next;
        });
    };

    return { viewed, markViewed, markAllViewed, isLoaded };
}
