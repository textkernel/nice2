import React from 'react';
import PropTypes from 'prop-types';
import bem from 'bem';
import Downshift from 'downshift';
import memoize from 'fast-memoize';
import { List, ListItem, ContentPlaceholder, Text, MarkedText, FieldWrapper } from '../../index';
import ItemTag from './ItemTag';
import styles from './Autosuggest.scss';
import {
    NUMBER_OF_SUGGESTION_LOADING_PLACEHOLDERS,
    BACKSPACE_KEY,
    ESCAPE_KEY,
    TAB_KEY,
    ENTER_KEY,
} from '../../constants';

const { block, elem } = bem({
    name: 'Autosuggest',
    classnames: styles,
    propsToMods: ['focused', 'isProminent'],
});

class Autosuggest extends React.Component {
    constructor() {
        super();
        this.inputRef = React.createRef();
        this.rootRef = React.createRef();
        this.listRef = React.createRef();
        this.state = {
            inputValue: '',
            inputValueRecall: '',
            focused: false,
        };

        this.handleTagDeleteClick = memoize(this.handleTagDeleteClick);
        this.handleWrapperClick = memoize(this.handleWrapperClick);
        this.handleWrapperKeyDown = memoize(this.handleWrapperKeyDown);
    }

    handleChange = selectedItem => {
        const { onSelectionChange, isMultiselect } = this.props;

        this.setState({ inputValue: '' });

        if (selectedItem) {
            onSelectionChange(selectedItem);
        }

        if (!isMultiselect) {
            this.handleBlur();
        }
    };

    handleInputKeyDown = event => {
        const { onSelectionChange, selectedSuggestions } = this.props;
        if (
            event.key === BACKSPACE_KEY &&
            !event.target.value &&
            selectedSuggestions &&
            !!selectedSuggestions.length
        ) {
            // remove the last input
            onSelectionChange(selectedSuggestions[selectedSuggestions.length - 1]);
        } else if ([ESCAPE_KEY, TAB_KEY].includes(event.key)) {
            this.inputRef.current.blur();
            this.handleBlur();
        }
    };

    handleInputValueChange = (inputValue, changes) => {
        const { onInputValueChange } = this.props;
        if (changes.type === Downshift.stateChangeTypes.changeInput) {
            this.setState({ inputValue, inputValueRecall: inputValue });
            if (this.listRef.current) {
                this.listRef.current.scrollTop = 0;
            }
            if (onInputValueChange) {
                onInputValueChange(inputValue);
            }
        }
    };

    handleClearSelectedSuggestions = e => {
        const { onClearAllSelected } = this.props;

        e.stopPropagation();
        if (onClearAllSelected) {
            onClearAllSelected();
        }
    };

    handleBlur = () => {
        const { onBlur } = this.props;

        this.setState({ inputValue: '', inputValueRecall: '' });
        if (onBlur) {
            onBlur();
        }
    };

    handleTagDeleteClick = item => {
        const { onSelectionChange } = this.props;

        return e => {
            e.stopPropagation();
            onSelectionChange(item);
            this.inputRef.current.focus();
        };
    };

    handleWrapperClick = openMenu => () => {
        const { focused } = this.state;
        if (!focused) {
            this.focus(openMenu);
        }
    };

    handleWrapperKeyDown = openMenu => e => {
        const { focused } = this.state;
        if (!focused && e.key === ENTER_KEY) {
            this.focus(openMenu);
        }
    };

    stateReducer = (state, changes) => {
        const { isMultiselect } = this.props;

        switch (changes.type) {
            case Downshift.stateChangeTypes.keyDownEnter:
                return {
                    ...changes,
                    highlightedIndex: state.highlightedIndex,
                    isOpen: isMultiselect,
                };
            case Downshift.stateChangeTypes.clickItem:
                return {
                    ...changes,
                    highlightedIndex: state.highlightedIndex,
                    isOpen: isMultiselect,
                };
            default:
                return changes;
        }
    };

    stateUpdater = (change, state) => {
        const { focused } = this.state;
        if (state.isOpen !== focused) {
            this.setState({ focused: state.isOpen });
        }
    };

    focus(openMenu) {
        openMenu();
        this.inputRef.current.focus();
    }

    renderTags() {
        const { selectedPlaceholder, suggestionToString, selectedSuggestions } = this.props;
        const { focused } = this.state;

        if (!focused) {
            return selectedPlaceholder ? (
                <div {...elem('spacedElem', { ...this.props, ...this.state })}>
                    {selectedPlaceholder}
                </div>
            ) : null;
        }

        if (selectedSuggestions && !!selectedSuggestions.length) {
            return selectedSuggestions.map(item => (
                <ItemTag key={suggestionToString(item)} onClick={this.handleTagDeleteClick(item)}>
                    {suggestionToString(item)}
                </ItemTag>
            ));
        }

        return null;
    }

    renderSuggestions({ getItemProps, highlightedIndex }) {
        const {
            isLoading,
            suggestionToString,
            getSuggestions,
            noSuggestionsPlaceholder,
            listRenderer,
        } = this.props;
        const { inputValue, inputValueRecall } = this.state;

        if (isLoading) {
            return new Array(NUMBER_OF_SUGGESTION_LOADING_PLACEHOLDERS).fill('').map((el, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <ListItem key={i}>
                    <div {...elem('loaderContainer', { ...this.props, ...this.state })}>
                        <ContentPlaceholder />
                    </div>
                </ListItem>
            ));
        }

        const suggestions =
            typeof getSuggestions === 'function' ? getSuggestions(inputValue) : getSuggestions;

        if (!suggestions || !suggestions.length) {
            return inputValue ? (
                <ListItem disabled>
                    <Text context="muted">{noSuggestionsPlaceholder}</Text>
                </ListItem>
            ) : null;
        }

        const defaultListRenderer = () =>
            suggestions.map((item, index) => (
                <ListItem
                    key={suggestionToString(item)}
                    {...getItemProps({
                        item,
                        index,
                        isHighlighted: highlightedIndex === index,
                        highlightContext: 'brand',
                    })}
                >
                    <MarkedText marker={inputValueRecall} inline>
                        {suggestionToString(item)}
                    </MarkedText>
                </ListItem>
            ));

        return listRenderer
            ? listRenderer({
                  suggestions,
                  getItemProps,
                  highlightedIndex,
                  listInputValue: inputValueRecall,
              })
            : defaultListRenderer();
    }

    renderIcon() {
        const { iconNode } = this.props;

        const classes = [elem('spacedElem', {}).className];
        if (iconNode.props.className) {
            classes.push(iconNode.props.className);
        }

        return React.cloneElement(iconNode, { className: classes.join(' ') });
    }

    render() {
        const {
            selectedPlaceholder,
            suggestionToString,
            inputPlaceholder,
            clearTitle,
            showClearButton,
            iconNode,
            selectedSuggestions,
            getSuggestions,
            isLoading,
            noSuggestionsPlaceholder,
            onBlur,
            onSelectionChange,
            onInputValueChange,
            onClearAllSelected,
            isMultiselect,
            isProminent,
            listRenderer,
            ...rest
        } = this.props;
        const { inputValue, focused } = this.state;

        const stateAndProps = { ...this.props, ...this.state };
        const hideInputPlaceholder = !focused && !!selectedPlaceholder;
        const doShowClearButton =
            showClearButton && !!selectedSuggestions && !!selectedSuggestions.length && !focused;

        return (
            <div {...rest} ref={this.rootRef} {...block(stateAndProps)}>
                <Downshift
                    onChange={this.handleChange}
                    itemToString={suggestionToString}
                    onOuterClick={this.handleBlur}
                    stateReducer={this.stateReducer}
                    onStateChange={this.stateUpdater}
                    onInputValueChange={this.handleInputValueChange}
                    inputValue={inputValue}
                    defaultHighlightedIndex={0}
                >
                    {({
                        getInputProps,
                        getMenuProps,
                        getItemProps,
                        highlightedIndex,
                        openMenu,
                    }) => (
                        <div {...elem('main', stateAndProps)}>
                            <FieldWrapper
                                clearLabel={clearTitle}
                                onClear={this.handleClearSelectedSuggestions}
                                showClearButton={doShowClearButton}
                                isFocused={focused}
                                onClick={this.handleWrapperClick(openMenu)}
                                onKeyDown={this.handleWrapperKeyDown(openMenu)}
                                {...elem('field', stateAndProps)}
                            >
                                <div
                                    tabIndex="0"
                                    role="searchbox"
                                    {...elem('wrapper', stateAndProps)}
                                >
                                    {iconNode && this.renderIcon()}
                                    {this.renderTags()}
                                    <input
                                        {...getInputProps({
                                            ref: this.inputRef,
                                            onKeyDown: this.handleInputKeyDown,
                                            placeholder: hideInputPlaceholder
                                                ? ''
                                                : inputPlaceholder,
                                            ...elem('input', stateAndProps),
                                        })}
                                    />
                                </div>
                                <List
                                    {...getMenuProps({
                                        ...elem('list', stateAndProps),
                                        ref: e => {
                                            this.listRef.current = e;
                                        },
                                        isControlledNavigation: true,
                                    })}
                                >
                                    {focused
                                        ? this.renderSuggestions({
                                              getItemProps,
                                              highlightedIndex,
                                          })
                                        : null}
                                </List>
                            </FieldWrapper>
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }
}

Autosuggest.propTypes = {
    /** array of already selected suggestions */
    selectedSuggestions: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    /** getSuggestions(inputValue) => an array of objects that will be used to render the suggestions list. */
    getSuggestions: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    /** suggestionToString(suggestion) should return a string to be displayed in the UI. e.g.: suggestion => suggestion.name */
    suggestionToString: PropTypes.func.isRequired,
    /** if suggestions are still loading, i.e. display placeholders */
    isLoading: PropTypes.bool,
    /** a string or function (to be called with selectedValues) that represents the selected values when the component is blurred */
    selectedPlaceholder: PropTypes.string,
    /** to be shown in the input field when no value is typed */
    inputPlaceholder: PropTypes.string.isRequired,
    /** to be shown when no suggestions are available */
    noSuggestionsPlaceholder: PropTypes.string.isRequired,
    /** to be shown as clear button title */
    clearTitle: PropTypes.string,
    /** onBlur() is called when the component is blurred */
    onBlur: PropTypes.func,
    /** onSelectionChange() called when a suggestion is selected or removed. Can be used to implement the component as controlled component */
    onSelectionChange: PropTypes.func.isRequired,
    /** onInputValueChange(inputValue) called when the input values is changed. Can be used to implement the component as controlled component */
    onInputValueChange: PropTypes.func,
    /** reset the selected suggestions array to it's default value */
    onClearAllSelected: PropTypes.func,
    /** show Clear button on hover even if there are no selectedSuggestions passed */
    showClearButton: PropTypes.bool,
    /** an icon or other node to always be rendered as a first element inside the input box */
    iconNode: PropTypes.node,
    /** should this component behave as a multiselect (e.g. no collapse after selection made) */
    isMultiselect: PropTypes.bool,
    /** style the component to be prominent */
    isProminent: PropTypes.bool,
    /** custom render function for listing suggestions */
    listRenderer: PropTypes.func,
};

Autosuggest.defaultProps = {
    getSuggestions: null,
    selectedSuggestions: null,
    isLoading: false,
    onBlur: null,
    onInputValueChange: null,
    onClearAllSelected: null,
    showClearButton: false,
    selectedPlaceholder: '',
    iconNode: null,
    isMultiselect: false,
    isProminent: false,
    listRenderer: null,
    clearTitle: '',
};

Autosuggest.displayName = 'Autosuggest';

export default Autosuggest;
