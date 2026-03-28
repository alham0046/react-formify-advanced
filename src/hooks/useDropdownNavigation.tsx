import { useCallback, useEffect, useMemo, useRef } from "react"
import type { DropdownOption } from "../components/BaseDropdown"
import { useDropdownContext } from "../context/DropdownContext"
import { createStyleStrategy } from "../Utils/styleStrategy"

export function useDropdownNavigation(options: (DropdownOption | string)[], close: () => void) {
  const optionLength = options.length
  const highlightIndexRef = useRef(-1)
  const optionRefs = useRef<HTMLDivElement[]>([])

  const resetRef = () => {
    highlightIndexRef.current = -1
  }

  const { twHighlightedStyles, highlightedStyle } = useDropdownContext()

  // const twHighlightedStyles = twStyle?.twHighlightedStyles
  // const highlightedStyles = style?.highlightedStyles


  // const {twHighlightedStyles, highlightedStyles} = {...twStyle, ...style}

  const strategy = useMemo(
    () => createStyleStrategy(twHighlightedStyles, highlightedStyle),
    [twHighlightedStyles, highlightedStyle]
  );

  useEffect(() => {
    console.log('options changed', optionRefs.current, optionLength)
  }, [optionLength])


  const reset = () => {
    // highlightIndexRef.current = 0
    strategy.remove()
    optionRefs.current = []
    console.log('resetting highlight index')
    // strategy.remove()
  }
  // const reset = () => {
  //   // highlightIndexRef.current = 0
  //   console.log('resetting highlight index')
  //   // strategy.remove()
  //   updateHighlight(0)
  // }






  console.log('rendering useDropdown', optionLength)
  const updateHighlight = useCallback((next: number) => {
    if (!optionLength) return

    const prev = highlightIndexRef.current
    if (prev === next) return

    const nextEl = optionRefs.current[next]

    console.log('updating highlight', prev, next)
    // strategy.remove(optionRefs.current[prev])
    strategy.swap(nextEl)
    // strategy.remove()
    // strategy.apply(optionRefs.current[next])

    // optionRefs.current[prev]?.classList.remove("bg-blue-200")
    // optionRefs.current[next]?.classList.add("bg-blue-200")
    // optionRefs.current[next]?.scrollIntoView({ block: "nearest" })
    nextEl?.scrollIntoView({ block: "nearest" })

    highlightIndexRef.current = next
  }, [optionLength])

  const handleKeyDown = (
    e: KeyboardEvent | React.KeyboardEvent,
    onSelect: (item: string | DropdownOption) => void
  ) => {
    if (!options.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      updateHighlight(
        Math.min(highlightIndexRef.current + 1, options.length - 1)
      )
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      updateHighlight(
        Math.max(highlightIndexRef.current - 1, 0)
      )
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const item = options[highlightIndexRef.current]
      // strategy.remove()
      item && onSelect(item)
    }

    if (e.key === "Escape") {
      // strategy.remove()
      close()
    }
  }

  const registerOption = (index: number) => (el: HTMLDivElement | null) => {
    // if (el) optionRefs.current[index] = el
    if (!el) return

    // optionRefs.current = []

    optionRefs.current[index] = el

    console.log('highlighting first option', index, highlightIndexRef.current)
    // If this is first option, auto-highlight it
    // if (index === 0 && highlightIndexRef.current === 0) {
    if (index === 0) {
      resetRef()
      updateHighlight(0)
    }
  }

  return {
    highlightIndexRef,
    handleKeyDown,
    registerOption,
    updateHighlight,
    reset,
  }
}



// import { useRef } from "react"
// import type { DropdownOption } from "../components/BaseDropdown"

// export function useDropdownNavigation(options: (DropdownOption | string)[], close: () => void) {
//   const highlightIndexRef = useRef(0)
//   const optionRefs = useRef<HTMLDivElement[]>([])

//   const reset = () => {
//     highlightIndexRef.current = 0
//   }

//   const updateHighlight = (next: number) => {
//     if (!options.length) return

//     const prev = highlightIndexRef.current
//     if (prev === next) return

//     optionRefs.current[prev]?.classList.remove("bg-blue-200")
//     optionRefs.current[next]?.classList.add("bg-blue-200")
//     optionRefs.current[next]?.scrollIntoView({ block: "nearest" })

//     highlightIndexRef.current = next
//   }

//   const handleKeyDown = (
//     e: KeyboardEvent | React.KeyboardEvent,
//     onSelect: (item: string | DropdownOption) => void
//   ) => {
//     if (!options.length) return

//     if (e.key === "ArrowDown") {
//       e.preventDefault()
//       updateHighlight(
//         Math.min(highlightIndexRef.current + 1, options.length - 1)
//       )
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault()
//       updateHighlight(
//         Math.max(highlightIndexRef.current - 1, 0)
//       )
//     }

//     if (e.key === "Enter") {
//       e.preventDefault()
//       const item = options[highlightIndexRef.current]
//       item && onSelect(item)
//     }

//     if (e.key === "Escape") {
//       reset()
//       close()
//     }
//   }

//   const registerOption = (index: number) => (el: HTMLDivElement | null) => {
//     if (el) optionRefs.current[index] = el
//   }

//   return {
//     highlightIndexRef,
//     handleKeyDown,
//     registerOption,
//     reset,
//   }
// }
