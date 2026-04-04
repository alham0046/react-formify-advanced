import StrInput from "./StrInput"
import NumInput from "./NumInput"
import { fromCamelCase } from "../functions/camelCase"
import ArrayContainer from "./ArrayContainer"
import AutoInput from "./AutoInput"
import ObjectContainer from "./ObjContainer"
import { isPlainObject } from "../functions/dataTypesValidation"

export const RenderField = (
  key: string,
  value: any
): React.ReactNode => {
  const commonProps = {
    name: key,
    placeholder: fromCamelCase(key),
  }

  // primitive
  if (typeof value === 'string') {
    return <StrInput key={key} {...commonProps} />
  }

  if (typeof value === 'number') {
    return <NumInput key={key} {...commonProps} />
  }

  // array
  if (Array.isArray(value)) {
    return (
      <ArrayContainer
        key={key}
        name={key}
        // items={value}
        repeat={value.length}
        getKey={(i) => i.toString()}
      >
        {({index}) => (
          <AutoInput initialData={value[index]} />
        )}
      </ArrayContainer>
    )
  }

  // object
  if (isPlainObject(value)) {
    return (
      <ObjectContainer key={key} name={key}>
        <AutoInput initialData={value} />
      </ObjectContainer>
    )
  }

  return null
}
