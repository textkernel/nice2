import { GetItemPropsOptions, GetToggleButtonPropsOptions } from 'downshift';

export interface BasicSelectProps<S> extends React.HTMLAttributes<HTMLDivElement> {
    /** an array of objects that will be used to render the suggestions list. */
    suggestions: S[];
    /** suggestionToString(suggestion) should return a string to be displayed in the UI. e.g.: suggestion => suggestion.name */
    suggestionToString: (suggestions?: S | null) => string;
    /** render function for suggestion list item. If undefined, suggestionToString will be used. */
    suggestionItemRenderer?: (suggestions: S | null, index: number, array: S[]) => ReactNode;
    /** root wrapper ref */
    rootRef?: React.RefObject<HTMLDivElement>;
    /** suggestions list ref */
    listRef?: React.RefObject<HTMLUListElement>;
    /** defines if the component is disabled */
    disabled?: boolean;
    /** onFocus() is called when the component is focused */
    onFocus?: () => void;
    /** onBlur() is called when the component is blurred */
    onBlur?: () => void;
    /** onSelectionAdd() called when a suggestion is selected */
    onSelectionAdd: (item: S) => void;
}

export interface SelectInputFieldProps {
    /** input field ref */
    inputRef?: React.RefObject<HTMLInputElement>;
    /** onInputValueChange(inputValue) called when the input values is changed. Can be used to implement the component as controlled component */
    onInputValueChange?: (value: string) => void;
    /** clean up input value after selected item */
    clearInputAfterSelection?: boolean;
    /** Initial input value should be shown if input gets focused */
    initInputValue?: string;
}

export interface SelectClearButtonProps {
    /** to be shown as clear button title */
    clearTitle?: string;
    /** function to be called if FieldWrapper clear button is clicked */
    onClearAllSelected?: () => void;
    /** show Clear button on hover even if there are no selectedSuggestions passed */
    showClearButton?: boolean;
}

export type FocusedRendererHelpers<S> = (helpers: {
    getInputProps: (options: GetItemPropsOptions<S>) => object;
    getToggleButtonProps: (options: GetToggleButtonPropsOptions) => object;
    onBlur: () => void;
    onFocus: (callback: () => void) => void;
    inputValue: string;
    highlightedIndex: number | null;
}) => ReactNode;

export type BlurredRendererHelpers<S> = (helpers: {
    getInputProps: (options: GetItemPropsOptions<S>) => object;
    getToggleButtonProps: (options: GetToggleButtonPropsOptions) => object;
    onFocus: (callback: () => void) => void;
}) => ReactNode;

export type ListRendererHelper<S> = (props: {
    /** An array of objects that will be used to render the suggestions list. */
    suggestions: S[];
    /** suggestionToString(suggestion) should return a string to be displayed in the UI. e.g.: suggestion => suggestion.name */
    suggestionToString: (suggestions: S) => string;
    /** a function which gets props for the item in the list */
    getItemProps: (options: GetItemPropsOptions<S>) => object;
    /** index of the item from the list to be highlighted */
    highlightedIndex: number | null;
    /** input field value to be highlighted in the item from the list */
    inputValue: string;
}) => ReactNode;

export interface Props<S>
    extends BasicSelectProps<S>,
        SelectClearButtonProps,
        SelectInputFieldProps {
    /** defines if the suggestion list should be collapsed once an item is selected */
    keepExpandedAfterSelection?: boolean;
    /** will be called when list of suggestions should be rendered */
    listRenderer: ListRendererHelper<S>;
    /** a function that renders the top part of the component when it is focused  */
    focusedRenderer: FocusedRendererHelpers<S>;
    /** a function that renders the top part of the component when it is blurred  */
    blurredRenderer: BlurredRendererHelpers<S>;
    /** highlighting for first item will be added if input is empty */
    highlightOnEmptyInput?: boolean;
    /** select highlighted item when blurring out of the component */
    selectOnTab?: boolean;
    /** If highlighted, item at this index will be selected when user clicks outside of the component */
    indexToSelectOnOutClick?: number;
}
