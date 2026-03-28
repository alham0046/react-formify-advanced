import { useEffect } from "react";
import { inputStore } from "../store/InputStore";

export const useSetEditData = (data: Record<string, any>, resetOnClose: boolean = true) => {
    useEffect(() => {
        console.log("useSetEditData", data)
        inputStore.setEditData(data)
        return () => {
            if (!resetOnClose) return
            inputStore.reset()
        }
    }, [])
}
// import { useEffect } from "react";
// // import { useInputStore } from "./useInputStore";

// export const useSetEditData = (data?: Record<string, any>, resetOnClose: boolean = true) => {
//     useEffect(() => {
//         if (data) {
//             useInputStore.setState((state) => ({
//                 inputData: data,
//             }))
//             setTimeout(() => {
//                 useInputStore.setState((state) => ({
//                     initialData: data
//                 }))
//             }, 200);
//         }
//         return () => {
//             if (!resetOnClose) return
//             useInputStore.getState().resetInput()
//         }
//     }, [])
// }