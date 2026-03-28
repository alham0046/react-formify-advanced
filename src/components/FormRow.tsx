import { memo } from "react"
import { FormLayoutContext } from "../context/LabelLayoutContext"

interface FormRowProps {
  label: React.ReactNode
  separator?: React.ReactNode
  children: React.ReactNode
  className?: string
  labelWidth?: string | number
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  separator,
  children,
  className = "",
  labelWidth = "12rem", // default alignment width
}) => {
  return (
    <FormLayoutContext.Provider value={{ labelMode : true }}>
      <div
        className={`
          grid items-center gap-x-3
          ${className}
        `}
        style={{
          gridTemplateColumns: `${labelWidth} auto 1fr`,
        }}
      >
        <div className="whitespace-nowrap">{label}</div>
        <div className="whitespace-nowrap text-center">{separator ?? null}</div>
        <div>{children}</div>
      </div>
    </FormLayoutContext.Provider>
  )
}

export default memo(FormRow)
