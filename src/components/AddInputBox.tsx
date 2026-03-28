import { memo, type FC } from 'react'
import { useArrayContext } from '../context/ArrayContext'
import { useContainerContext } from '../context/ContainerContext'

const AddInputBox: FC<{ defaultValue: any }> = ({ defaultValue }) => {
  const { inputStore } = useContainerContext()
  const { path } = useArrayContext()
  return (
    <button
      type="button"
      onClick={() => inputStore.addArrayItem(path, defaultValue)}
    >
      + Add
    </button>
  )
}

export default memo(AddInputBox)
