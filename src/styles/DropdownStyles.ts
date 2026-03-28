import { DropdownStyleProp, InputStyle, TWDropdownStyleProp } from "src/typeDeclaration/stylesProps";

// export const DEFAULT_DROPDOWN_STYLE: InputStyle & Pick<DropdownStyleProp, 'dropdownOffset'> = {
//   borderWidth: '2px',
//   boxHeight: '8px',
//   boxWidth: '100%',
//   placeHolderOffset: '16px',
//   dropdownOffset: 5,
// }
export const DEFAULT_DROPDOWN_STYLE: DropdownStyleProp = {
  dropdownOffset: 5,
  selectedStyles: {},
  highlightedStyles: {},
  modalBoxStyles: {},
  optionBoxStyles: {},
  optionStyles: {}
}

export const TW_DEFAULT_DROPDOWN_STYLE: TWDropdownStyleProp = {
  twSelectedStyles: 'text-blue-600 bg-gray-100',
  twHighlightedStyles: '',
  twModalBoxStyles: '',
  twOptionBoxStyles: 'bg-white border rounded-lg shadow-xl',
  twOptionItemStyles: 'px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200'
}