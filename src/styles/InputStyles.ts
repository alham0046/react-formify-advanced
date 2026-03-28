import { InputStyle, TWInputStyleProp } from "src/typeDeclaration/stylesProps";

export const DEFAULT_INPUT_STYLE: InputStyle = {
  borderWidth: '2px',
  boxHeight: '8px',
  boxWidth: '100%',
  placeHolderOffset: '16px',
  placeholderInlineStyle: {},
  inputInlineStyle: {},
  containerStyles: {},
}

export const TW_DEFAULT_INPUT_STYLE: TWInputStyleProp = {
  twInputStyles: 'outline-none w-full rounded-lg bg-transparent',
  twPlaceholderStyles: '',
  twContainerStyles: '',
}