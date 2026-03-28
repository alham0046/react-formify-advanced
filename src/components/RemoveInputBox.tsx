import { memo, type FC } from 'react'
import { useArrayContext } from '../context/ArrayContext'
import { useContainerContext } from '../context/ContainerContext'

const RemoveInputBox : FC<{index: number}> = ({index}) => {
    const { inputStore } = useContainerContext()
    const {path} = useArrayContext()
    return (
        <button
            type="button"
            onClick={() => inputStore.removeArrayItem(path, index)}
        >
            Remove
        </button>
    )
}

export default memo(RemoveInputBox)
