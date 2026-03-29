import type React from "react";

interface PositionProp {
    fixedRef: React.RefObject<HTMLDivElement>;
    modalRef: React.RefObject<HTMLDivElement>;
    dropdownOffset?: number
}
export const calculatePosition = ({ fixedRef, modalRef, dropdownOffset = 0 }: PositionProp) => {
    const inputRect = fixedRef.current?.getBoundingClientRect();
    const modalRect = modalRef.current?.getBoundingClientRect();
    const innerHeight = window.innerHeight

    if (!inputRect) return;


    const spaceBelow = innerHeight - inputRect.bottom;
    const spaceAbove = inputRect.top


    const direction =
        spaceBelow > modalRect.height
            ? "down"
            : "up"


    // const scrollOffset = window.scrollY
    const top = direction === "down"
        ? inputRect.bottom + (dropdownOffset)
        : inputRect.top - modalRect.height - (dropdownOffset)

    return {
        left: inputRect.left,
        width: inputRect.width,
        top
    };

};