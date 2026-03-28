// // A reusable utility
// const createKeyFilter = (keys: string[], callback: (e: KeyboardEvent) => void) => {
//     const keySet = new Set(keys); // Sets are very fast for lookups
//     return (e: KeyboardEvent) => {
//         if (keySet.has(e.key)) {
//             callback(e);
//         }
//     };
// };


// export const keyboardAction = (type: 'keydown' | 'keyup' | 'keypress', keys: string[], listener: (e: KeyboardEvent) => void, targetElementId?: string) => {
//     const element = targetElementId ? document.getElementById(targetElementId) : document.body;
//     const navHandler = createKeyFilter(
//         keys,
//         (e) => listener(e)
//     );
//     element?.addEventListener(type, navHandler)
//     return () => {console.log('removing'); element?.removeEventListener(type, navHandler)}
// }
import { isRefObject } from "../functions/dataTypesValidation";

const refineTarget = (target?: any): EventTarget | null => {
    if (!target) return window
    if (typeof target === 'string') {
        return document.getElementById(target) || window;
    }
    if (isRefObject(target)) {
        console.log('the target is', target)
        return target.current
    }
    if (target instanceof HTMLElement) {
        return target;
    }

    return window
}

type KeyListener = (e: KeyboardEvent) => void;

export const keyboardAction = (
    type: 'keydown' | 'keyup' | 'keypress',
    keys: string[],
    listener: KeyListener,
    // Accept an element directly, default to window for global shortcuts
    target?: string | HTMLElement | React.RefObject<HTMLElement | null>
) => {
    const keySet = new Set(keys);

    // console.log('the type of target is', typeof target)
    const refinedTarget = refineTarget(target)
    if (!refinedTarget) return () => {};

    const navHandler = (e: Event) => {
        // Cast to KeyboardEvent since we know the type
        const event = e as KeyboardEvent;
        if (keySet.has(event.key)) {
            listener(event);
        }
    };

    refinedTarget?.addEventListener(type, navHandler);

    return () => {
        console.log('removing')
        refinedTarget?.removeEventListener(type, navHandler);
    };
};
// keyboardAction('key')