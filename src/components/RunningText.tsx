import React, { memo, useLayoutEffect, useRef } from "react";

interface RunningTextProps {
    children: React.ReactNode;
    width?: string;
    className?: string;
    speed?: number;          // optional fixed duration
    maxAutoSpeed?: number;   // cap auto duration
}

const RunningText: React.FC<RunningTextProps> = ({
    children,
    width,
    className = "",
    speed,
    maxAutoSpeed = 20,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const id = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(id);

        function measure() {
            const container = containerRef.current;
            const content = contentRef.current;
            if (!container || !content) return;

            const scrollW = Math.ceil(content.scrollWidth);
            const visibleW = Math.ceil(container.clientWidth);

            const overflow = scrollW > visibleW;
            
            // container.dataset.ready = "true";
            // container.dataset.overflow = overflow ? "true" : "false";
            // container.classList.add("rt-overflow")
            container.classList.toggle("rt-overflow", overflow);
            
            if (!overflow) return;

            const gap = 48;
            const distance = scrollW + gap;

            container.style.setProperty("--rt-distance", `-${distance}px`);

            if (speed) {
                container.style.setProperty("--rt-speed", `${speed}s`);
            } else {
                const pxPerSecond = 60;
                const duration = scrollW / pxPerSecond;
                container.style.setProperty(
                    "--rt-speed",
                    `${Math.min(duration, maxAutoSpeed)}s`
                );
            }
        }
    }, [children, speed, maxAutoSpeed]);

    return (
        <div
            ref={containerRef}
            style={{ width }}
            className={`rt-container ${className}`}
        >
            <div className="rt-track">
                <div ref={contentRef} className="rt-content">
                    {children}
                </div>
                <div className="rt-content rt-duplicate" aria-hidden>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default memo(RunningText);