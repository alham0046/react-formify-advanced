import { type FC, memo, type ReactNode } from 'react'
import { NameScopeContext, useNameScope } from '../context/NameScopeContext';

interface ObjContainerProps {
    name: string
    // inputContainerStyles?: string
    children: ReactNode
}


const ObjectContainer: FC<ObjContainerProps> = ({
    name,
    // inputContainerStyles = '',
    children
}) => {
    const parent = useNameScope();
    const scope = parent ? `${parent}.${name}` : name;

    return (
        <NameScopeContext.Provider value={scope}>
                {
                    children
                }
        </NameScopeContext.Provider>
    )
}


// 1. Export the memoized component
const MemoizedObjectContainer = memo(ObjectContainer)

// 2. Set the displayName on the exported component
MemoizedObjectContainer.displayName = 'ObjectContainer';

export default MemoizedObjectContainer;

















// export default memo(ObjectContainer)

{/* <div className={inputContainerStyles ? inputContainerStyles : 'contents'}> */}
    {/* </div> */}
// import React, { type FC, memo, type ReactNode, type RefObject, useMemo } from 'react'
// import { camelCase } from '../functions/camelCase';
// import { useInputStore } from '../hooks/useInputStore';
// import { flattenChildren } from '../Utils/flattenChildren';
// import { handleInitialValue } from '../Utils/setInitialValue';


// interface FullProps {
    //     onInputChange: (name: string, value: any) => void;
    //     sharedStyles : string
    //     bgColor : string
//     modalContainerRef: RefObject<HTMLDivElement>
// }

// interface ObjContainerProps {
    //     objName: string
    //     inputContainerStyles?: string
    //     children: ReactNode
// }

// interface InputChildProps {
    //   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// const ObjectContainer: FC<ObjContainerProps> = ({
//     objName,
//     inputContainerStyles = '',
//     children,
//     ...props
// }) => {
//     const fullProps = props as FullProps
//     const setInputValue = useInputStore((state) => state.setInputValue)
//     const childrenArray = useMemo(() => flattenChildren(children), [children]);
    
//     const handleInputChange = (modifiedName : string, value : any) => {
//         fullProps.onInputChange(modifiedName, value)
//     }

//     return (
//         <div className={inputContainerStyles ? inputContainerStyles : 'contents'}>
//             {
//                 childrenArray.map((child, index) => {
//                     if (!React.isValidElement<InputChildProps>(child)) return child;
//                     const childType = child.type
//                     const isDOMElement = typeof childType === 'string';
//                     if (isDOMElement) return child;
//                     const childProps = child.props
//                     const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
//                     const changedName = `${objName}.${modifiedName}`
//                     if (childProps.placeholder) {
//                         handleInitialValue(changedName, childProps.initialValue,setInputValue, (childType as any).type.name)
//                     }
//                     if (React.isValidElement(child)) {
//                         return React.cloneElement(child, {
//                             key: child.key ?? index,
//                             onInputChange: handleInputChange,
//                             name: changedName,
//                             sharedStyles : fullProps.sharedStyles,
//                             bgColor : fullProps.bgColor,
//                             modalContainerRef: fullProps.modalContainerRef,
//                             // ...props
//                             // isArray : isChildArray
//                         })
//                     }
//                     return child
//                 })
//             }
//         </div>
//     )
// }


// // 1. Export the memoized component
// const MemoizedObjectContainer = memo(ObjectContainer)

// // 2. Set the displayName on the exported component
// MemoizedObjectContainer.displayName = 'ObjectContainer';

// export default MemoizedObjectContainer;


// // export default memo(ObjectContainer)