// import { useLayoutEffect, useState } from "react"

// interface PositionProp {
//     fixedRef: React.RefObject<HTMLDivElement | null>
//     modalRef: React.RefObject<HTMLDivElement | null>
//     dropdownOffset?: number
//     isOpen: boolean
// }

// export const useDropdownPosition = ({ fixedRef, modalRef, dropdownOffset = 0, isOpen }: PositionProp) => {
//     const [position, setPosition] = useState<{ top?: number; left?: number; width?: number; } | undefined>(undefined);
//     useLayoutEffect(() => {
//         if (isOpen) {
//             calculatePosition()
//         }
//     }, [isOpen])
//     const calculatePosition = () => {
//         const inputRect = fixedRef.current?.getBoundingClientRect();
//         const modalRect = modalRef.current?.getBoundingClientRect();
//         const innerHeight = window.innerHeight

//         if (!inputRect || !modalRect) return;


//         const spaceBelow = innerHeight - inputRect.bottom;
//         // const spaceAbove = inputRect.top


//         const direction =
//             spaceBelow > modalRect.height
//                 ? "down"
//                 : "up"


//         // const scrollOffset = window.scrollY
//         const top = direction === "down"
//             ? inputRect.bottom + (dropdownOffset)
//             : inputRect.top - modalRect.height - (dropdownOffset)

//         setPosition({
//             left: inputRect.left,
//             width: inputRect.width,
//             top
//         });
//     }

//     return { position, calculatePosition }
// }

import { useLayoutEffect, useCallback, useRef } from "react";

interface PositionProp {
    fixedRef: React.RefObject<HTMLDivElement | null>;
    modalRef: React.RefObject<HTMLDivElement | null>;
    dropdownOffset?: number;
    isOpen: boolean;
}

export const useDropdownPosition = ({ fixedRef, modalRef, dropdownOffset = 0, isOpen }: PositionProp) => {
    const rafRef = useRef<number | null>(null);

    const calculatePosition = useCallback(() => {
        const trigger = fixedRef.current;
        const modal = modalRef.current;

        if (!trigger || !modal || !isOpen) return;

        // 1. Get measurements (This causes a 'reflow', we do it once per frame)
        const inputRect = trigger.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        const innerHeight = window.innerHeight;

        // 2. Determine direction
        const spaceBelow = innerHeight - inputRect.bottom;
        const direction = spaceBelow > modalRect.height ? "down" : "up";

        // 3. Calculate target Y
        const top = direction === "down"
            ? inputRect.bottom + dropdownOffset
            : inputRect.top - modalRect.height - dropdownOffset;

        // 4. DIRECT DOM UPDATE
        // We bypass React state entirely to avoid re-rendering the whole dropdown tree
        modal.style.width = `${inputRect.width}px`;
        modal.style.transform = `translate3d(${inputRect.left}px, ${top}px, 0)`;

        // Ensure it's visible only after the first calculation to prevent "flashing" at 0,0
        if (modal.style.visibility !== 'visible') {
            modal.style.visibility = 'visible';
        }
    }, [isOpen, dropdownOffset, fixedRef, modalRef]);

    // useLayoutEffect(() => {
    //     if (!isOpen) return;

    //     const handleThrottledCalc = () => {
    //         if (rafRef.current !== null) return;

    //         // requestAnimationFrame ensures we sync with the browser's refresh rate
    //         rafRef.current = window.requestAnimationFrame(() => {
    //             calculatePosition();
    //             rafRef.current = null;
    //         });
    //     };

    //     // Initial position
    //     handleThrottledCalc();

    //     window.addEventListener("resize", handleThrottledCalc);
    //     // 'true' uses capture phase, which is more reliable for scroll events
    //     window.addEventListener("scroll", handleThrottledCalc, true);

    //     return () => {
    //         window.removeEventListener("resize", handleThrottledCalc);
    //         window.removeEventListener("scroll", handleThrottledCalc, true);
    //         if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    //     };
    // }, [isOpen, calculatePosition]);
    useLayoutEffect(() => {
        if (!isOpen || !fixedRef.current) return;

        const handleThrottledCalc = () => {
            if (rafRef.current !== null) return;
            rafRef.current = window.requestAnimationFrame(() => {
                calculatePosition();
                rafRef.current = null;
            });
        };

        // 1. Setup ResizeObserver for the input element itself
        const resizeObserver = new ResizeObserver(handleThrottledCalc);
        resizeObserver.observe(fixedRef.current);

        // 2. Setup Global Listeners
        window.addEventListener("resize", handleThrottledCalc);
        window.addEventListener("scroll", handleThrottledCalc, true);

        handleThrottledCalc();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", handleThrottledCalc);
            window.removeEventListener("scroll", handleThrottledCalc, true);
            if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
        };
    }, [isOpen, calculatePosition, fixedRef]);

    return { calculatePosition };
};