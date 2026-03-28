import type { FieldVisualState } from "./Config/FieldVisualState"

export type NormalizedStyle = {
    className?: string
    style?: React.CSSProperties
}

type FieldElements = {
    input: HTMLInputElement
    label?: HTMLLabelElement | null
}

export class InputStyles {
    private elements = new Map<string, FieldElements>()
    private fieldStates = new Map<string, Set<FieldVisualState>>()
    private styles = new Map<FieldVisualState, NormalizedStyle>()
    // colorScheme = new Set<FieldVisualState>()

    /* ---------------- register ---------------- */

    register(key: string, el: HTMLInputElement) {
        const label = el.parentElement?.querySelector('label') as HTMLLabelElement | null
        this.elements.set(key, {
            input: el,
            label
        })
    }

    unregister(key: string) {
        this.elements.delete(key)
        this.fieldStates.delete(key)
    }

    /* ---------------- config ---------------- */

    setStyle(state: FieldVisualState, style: NormalizedStyle) {
        this.styles.set(state, style)
    }

    /* ---------------- state toggle ---------------- */

    enable(key: string, state: FieldVisualState) {
        if (!this.styles.has(state)) return
        const states = this.getStates(key)
        if (states.has(state)) return

        states.add(state)
        console.log('enabling state', key, state, states)
        this.apply(key, state)
    }

    disable(key: string, state: FieldVisualState) {
        if (!this.styles.has(state)) return
        const states = this.getStates(key)
        if (!states.has(state)) return

        states.delete(state)
        this.remove(key, state)
    }

    /* ---------------- internals ---------------- */

    private getStates(key: string) {
        if (!this.fieldStates.has(key)) {
            this.fieldStates.set(key, new Set())
        }
        return this.fieldStates.get(key)!
    }

    private apply(key: string, state: FieldVisualState) {
        const els = this.elements.get(key)
        if (!els) return
        const {input, label} = els
        const style = this.styles.get(state)
        if (!style) return

        if (style.className) {
            const classes = style.className.split(' ')
            input.classList.add(...classes)
            label?.classList.add(...classes)
        }

        if (style.style) {
            Object.assign(input.style, style.style)
            Object.assign(label?.style || {}, style.style)
        }
    }

    private remove(key: string, state: FieldVisualState) {
        const els = this.elements.get(key)
        if (!els) return
        const {input, label} = els
        const style = this.styles.get(state)
        if (!style) return

        if (style.className) {
            const classes = style.className.split(' ')
            input.classList.remove(...classes)
            label?.classList.remove(...classes)
        }

        if (style.style) {
            for (const k of Object.keys(style.style)) {
                ; (input.style as any)[k] = ''
                if (label) (label.style as any)[k] = ''
            }
        }
    }
}

export const inputStylesStore = new InputStyles()
// import { initFormify } from './Config/configStore'
// import type { FieldVisualState } from "./Config/FieldVisualState"

// export type NormalizedStyle = {
//     className?: string
//     style?: React.CSSProperties
// }

// export class InputStyles {
//     private elements = new Map<string, HTMLInputElement>()
//     private fieldStates = new Map<string, Set<FieldVisualState>>()
//     private styles = new Map<FieldVisualState, NormalizedStyle>()
//     // colorScheme = new Set<FieldVisualState>()

//     /* ---------------- register ---------------- */

//     register(key: string, el: HTMLInputElement) {
//         this.elements.set(key, el)
//     }

//     unregister(key: string) {
//         this.elements.delete(key)
//         this.fieldStates.delete(key)
//     }

//     /* ---------------- config ---------------- */

//     setStyle(state: FieldVisualState, style: NormalizedStyle) {
//         this.styles.set(state, style)
//     }

//     /* ---------------- state toggle ---------------- */

//     enable(key: string, state: FieldVisualState) {
//         if (!this.styles.has(state)) return
//         const states = this.getStates(key)
//         if (states.has(state)) return

//         states.add(state)
//         console.log('enabling state', key, state, states)
//         this.apply(key, state)
//     }

//     disable(key: string, state: FieldVisualState) {
//         if (!this.styles.has(state)) return
//         const states = this.getStates(key)
//         if (!states.has(state)) return

//         states.delete(state)
//         this.remove(key, state)
//     }

//     /* ---------------- internals ---------------- */

//     private getStates(key: string) {
//         if (!this.fieldStates.has(key)) {
//             this.fieldStates.set(key, new Set())
//         }
//         return this.fieldStates.get(key)!
//     }

//     private apply(key: string, state: FieldVisualState) {
//         const el = this.elements.get(key)
//         const style = this.styles.get(state)
//         if (!el || !style) return

//         if (style.className) {
//             el.classList.add(...style.className.split(' '))
//             const label = el.parentElement?.querySelector('label')
//             label?.classList.add(...style.className.split(' '))
//         }

//         if (style.style) {
//             Object.assign(el.style, style.style)
//             const label = el.parentElement?.querySelector('label')
//             Object.assign(label?.style || {}, style.style)
//         }
//     }

//     private remove(key: string, state: FieldVisualState) {
//         const el = this.elements.get(key)
//         const style = this.styles.get(state)
//         if (!el || !style) return

//         if (style.className) {
//             el.classList.remove(...style.className.split(' '))
//             const label = el.parentElement?.querySelector('label')
//             label?.classList.remove(...style.className.split(' '))
//         }

//         if (style.style) {
//             for (const k of Object.keys(style.style)) {
//                 ; (el.style as any)[k] = ''
//                 const label = el.parentElement?.querySelector('label')
//                     ; (label?.style as any)[k] = ''
//             }
//         }
//     }
// }