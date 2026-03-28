import { forwardRef, memo, useImperativeHandle, useRef } from "react";

export interface RotatingDropdownRef {
    open: () => void,
    close: () => void
}

const RotatingDropdown = forwardRef<RotatingDropdownRef, {}>((_, ref) => {
    const iconRef = useRef<SVGSVGElement>(null);
    useImperativeHandle(ref, () => ({
        open: () => {
            iconRef.current?.classList.add('rotate-180')
        },
        close: () => {
            iconRef.current?.classList.remove('rotate-180')
        }
    }))
    return (
        <svg
            ref={iconRef}
            className={`w-4 h-4 transition-transform duration-200`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    )
})

export default memo(RotatingDropdown)
