import React, { memo, useLayoutEffect, useRef } from 'react'

const InputSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        let current: HTMLElement | null = el

        while (current && !current.hasAttribute("data-input-container")) {
            const bg = getComputedStyle(current).backgroundColor

            if (
                bg &&
                bg !== "rgba(0, 0, 0, 0)" &&
                bg !== "transparent"
            ) {
                el.style.setProperty("--line-bg", bg)
                break
            }

            current = current.parentElement
        }
    }, [])
    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

export default memo(InputSection)
