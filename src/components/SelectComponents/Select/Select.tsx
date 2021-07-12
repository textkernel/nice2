import * as React from 'react';
import { useSelect } from 'downshift';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import { bem } from '../../../utils/bem/bem';
import { List } from '../../List';
import { SuggestionsList } from '../SuggestionsList';
import styles from './Select.scss';

const { block, elem } = bem('Select', styles);

interface Props<S> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** an array of objects that will be used to render the options list. */
    items: S[];
    /** The item that is currently selected */
    selectedItem: S;
    /** itemToString(item) should return a string to be displayed in the UI. e.g.: item => item.name */
    itemToString: (item?: S | null) => string;
    /** render function for option list item. If undefined, itemToString will be used. */
    optionItemRenderer?: (item?: S | null) => ReactNode;
    /** onChange(item) called when an item is selected */
    onChange: (item: S) => void;
    /** onFocus() is called when the component is focused */
    onFocus?: () => void;
    /** onBlur() is called when the component is blurred */
    onBlur?: () => void;
    /** root wrapper ref */
    rootRef?: React.RefObject<HTMLDivElement>;
    /** items list ref */
    listRef?: React.RefObject<HTMLUListElement>;
}

export function Select<S>(props: Props<S>) {
    const {
        items,
        selectedItem,
        itemToString,
        optionItemRenderer,
        onChange,
        onBlur,
        onFocus,
        rootRef,
        listRef,
        ...rest
    } = props;

    const handleSelection = (state) => {
        onChange(state.selectedItem);
        onBlur?.();
    };

    const { isOpen, getToggleButtonProps, getMenuProps, highlightedIndex, getItemProps } =
        useSelect({
            items,
            selectedItem,
            onSelectedItemChange: handleSelection,
        });

    const handleToggle = (e) => {
        e?.stopPropagation();
        if (isOpen) {
            onBlur?.();
        } else {
            onFocus?.();
        }
    };

    return (
        <div ref={rootRef} {...rest} {...block()}>
            <div {...elem('main', { isOpen })}>
                <div
                    tabIndex={0}
                    role="searchbox"
                    {...elem('wrapper', { isOpen })}
                    {...getToggleButtonProps({ onClick: handleToggle })}
                >
                    <span {...elem('selected')}>{itemToString(selectedItem)}</span>
                    {isOpen ? (
                        <IoMdArrowDropup {...elem('dropdownIcon')} />
                    ) : (
                        <IoMdArrowDropdown {...elem('dropdownIcon')} />
                    )}
                </div>
                <List
                    {...getMenuProps({ ref: listRef })}
                    {...elem('list', { isOpen })}
                    isControlledNavigation
                >
                    {isOpen && (
                        <SuggestionsList
                            suggestionToString={itemToString}
                            suggestionItemRenderer={optionItemRenderer}
                            suggestions={items}
                            getItemProps={getItemProps}
                            highlightedIndex={highlightedIndex}
                        />
                    )}
                </List>
            </div>
        </div>
    );
}

Select.displayName = 'Select';

Select.defaultProps = {
    optionItemRenderer: undefined,
    onFocus: undefined,
    onBlur: undefined,
    rootRef: undefined,
    listRef: undefined,
};
