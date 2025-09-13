import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";
import { isDay } from "../../store/weatherStore";

const DynamicCursor = () => {
    const $isDay = useStore(isDay);
    const isClient = typeof window !== "undefined";

    useEffect(() => {
        if (!isClient) return;

        const updateCursor = () => {
            const cursorUrl = $isDay ? "/Sun.svg" : "/Moon.svg";
            const largeCursorUrl = $isDay ? "/Sun_large.svg" : "/Moon_large.svg";

            console.log("Updating cursor:", { isDay: $isDay, cursorUrl, largeCursorUrl });

            // Update CSS custom properties
            document.documentElement.style.setProperty(
                "--cursor-url",
                `url('${cursorUrl}') 16 16, auto`
            );
            document.documentElement.style.setProperty(
                "--cursor-hover-url",
                `url('${largeCursorUrl}') 24 24, pointer`
            );
        };

        updateCursor();
    }, [$isDay, isClient]);

    return null; // This component doesn't render anything
};

export default DynamicCursor;
