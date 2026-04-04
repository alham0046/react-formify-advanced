import React, { memo, useMemo, type ReactNode } from 'react'
import { NameScopeContext } from '../context/NameScopeContext'
import { ArrayHelpers } from './ArrayContainer'

interface ArrayItemProps {
    scope: string
    index: number
    children: (args: { index: number, helpers: ArrayHelpers }) => ReactNode
    helpers: any
}

const ArrayItem : React.FC<ArrayItemProps> = ({ scope, index, children, helpers }) => {

    const contextValue = useMemo(() => ({
        parent: scope,
        parentType: 'array',
        parentIndex: index,
        parentKey: scope.split('.').slice(0, -1).join('.')
    }), [scope, index])

    return (
        <NameScopeContext.Provider value={contextValue}>
            {children({ index, helpers })}
        </NameScopeContext.Provider>
    )
}

export default memo(ArrayItem)
