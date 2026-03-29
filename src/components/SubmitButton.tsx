import React, { forwardRef, memo, type MouseEvent, type MouseEventHandler, type ReactElement, type ReactNode, useCallback, useImperativeHandle, useState } from 'react'
import { getEditedData } from '../Utils/getEditedData';
import { useContainerContext } from '../context/ContainerContext';
import type { OnSubmit } from '../typeDeclaration/inputProps';

export interface ConfirmationRenderProps {
  success: (data?: any) => void
  cancel: () => void
  data: Record<string, any> | null
  isDisabled?: boolean
  resetForm: (key?: string[] | string) => void
  clearForm: () => void
}

export interface SubmitButtonRef {
  submit: (e: MouseEvent<HTMLDivElement>) => void
}


interface SubmitProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  closeModal?: () => void
  onClick?: OnSubmit
  /**
   * Configuration for enabling and customizing a confirmation modal.
   * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
   * * @example
   * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
   * modal: {
   * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
   * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
   * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
   * onConfirm: handleSubmitFunction,    
   * }
   */
  modal?: {
    modalStyle?: { height?: string | number, width?: string | number }
    renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>
    isDisabled?: boolean
    onConfirm?: (data: any) => void
  }
}

const SubmitButton = forwardRef<SubmitButtonRef, SubmitProps>((
  {
    children,
    className,
    closeModal,
    disabled = false,
    onClick,
    modal,
  },
  ref
) => {
  const { isDisabled = false, modalStyle, onConfirm, renderConfirmationModel } = modal || {}
  const { inputStore } = useContainerContext()
  const resetForm = (key?: string[] | string) => inputStore.reset(key)
  const clearForm = () => inputStore.clear()
  // const { height, width } = modal.modelStyle
  const [openModal, setOpenModal] = useState<boolean>(false)
  const getSnapshot = () => inputStore.getSnapshot().inputData
  const success = (data?: any) => {
    onConfirm?.(data)
    setOpenModal(false)
    resetForm()
    closeModal?.()
  }
  const cancel = () => {
    setOpenModal(false)
  }
  // const resetForm = useResetForm
  // const resetForm = inputStore.reset()
  const handleSubmit = useCallback(async (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || openModal) return
    if (!inputStore.validatorStore.isValid()) {
      return
    }
    // if (renderConfirmationModel) setOpenModal(true)
    // const { inputData: data } = useInputStore.getState()
    const { data, edited } = getEditedData(inputStore)

    // 🔹 CASE 1: No onClick → open modal directly
    if (!onClick && renderConfirmationModel) {
      setOpenModal(true)
      return
    }
    // 🔹 CASE 2 & 3: onClick exists
    if (onClick) {
      // const shouldOpenModal = await onClick({ data, edited, resetForm, stopPropagation : () => e.stopPropagation(), preventDefault : () => e.preventDefault() })
      const shouldOpenModal = await Promise.resolve(
        onClick({ data, edited, resetForm, clearForm, stopPropagation : () => e.stopPropagation(), preventDefault : () => e.preventDefault() })
      )

      if (shouldOpenModal && renderConfirmationModel) {
        setOpenModal(true)
      }
    }
  }, [onClick, disabled, openModal, renderConfirmationModel])

  // 🔑 Expose submit() safely
  useImperativeHandle(ref, () => ({
    submit: handleSubmit
  }), [handleSubmit])

  return (
    <div className={`${className}`} onClick={handleSubmit}>
      {children}
      {
        openModal ? (
          <div
            className={`fixed flex cursor-default justify-center items-center z-50 left-0 top-0 w-full h-full bg-gray-500/50 backdrop-blur-lg `}
          >
            <div
              className={`relative grid rounded-lg shadow-lg bg-gray-400 overflow-y-auto max-h-4/5`}
              style={{ height: modalStyle?.height, width: modalStyle?.width || '80%' }}
            >
              <div className=''>
                {typeof renderConfirmationModel === 'function'
                  ? renderConfirmationModel({ cancel, success, resetForm, clearForm, data: getSnapshot(), isDisabled })
                  : React.isValidElement(renderConfirmationModel)
                    ? React.cloneElement(renderConfirmationModel, { cancel, success,clearForm, resetForm, data: getSnapshot(), isDisabled })
                    : null}
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
})

// 1. Export the memoized component
const MemoizedSubmitButton = memo(SubmitButton)

// 2. Set the displayName on the exported component
MemoizedSubmitButton.displayName = 'SubmitButton';

export default MemoizedSubmitButton;