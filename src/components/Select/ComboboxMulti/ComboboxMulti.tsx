import * as React from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import bem from '../../../utils/bem/bem';
import { Props as SelectBaseProps, SelectBase } from '../SelectBase';
import { SuggestionsList } from '../SuggestionsList';
import styles from './ComboboxMulti.scss';
import { ESCAPE_KEY, TAB_KEY } from '../../../constants';

interface Props<S>
    extends Omit<
        Omit<Omit<SelectBaseProps<S>, 'listRenderer'>, 'focusedRenderer'>,
        'blurredRenderer'
    > {
    inputPlaceholder: string;
}

const { elem } = bem('ComboboxMulti', styles);

function ComboboxMulti<S>(props: Props<S>) {
    const {
        onSelectionChange,
        inputRef: inputRefFromProps,
        suggestions,
        suggestionToString,
        showClearButton,
        noSuggestionsPlaceholder,
        onBlur,
        onInputValueChange,
        onClearAllSelected,
        inputPlaceholder,
        ...rest
    } = props;
    const inputRef = inputRefFromProps || React.createRef<HTMLInputElement>();

    const renderFocused = ({ getInputProps, getToggleButtonProps, onBlur: blur }) => {
        const handleInputKeyDown = event => {
            if (event.key === TAB_KEY) {
                inputRef.current?.blur();
                blur();
            } else if (event.key === ESCAPE_KEY) {
                // prevents key propagation and sets the focus on parent component
                inputRef.current?.blur();
                blur();
                inputRef.current?.parentElement?.focus();
                event.stopPropagation();
            }
        };

        return (
            <div tabIndex={0} role="searchbox" {...elem('wrapper', { ...props })}>
                <input
                    {...getInputProps({
                        ref: inputRef,
                        placeholder: inputPlaceholder,
                        onKeyDown: handleInputKeyDown,
                        ...elem('input', { ...props }),
                    })}
                />
                <div {...elem('buttons', { ...props })}>
                    <IoIosArrowUp {...getToggleButtonProps()} />
                </div>
            </div>
        );
    };

    const renderBlurred = ({ getInputProps, getToggleButtonProps }) => (
        <div tabIndex={0} role="searchbox" {...elem('wrapper', { ...props })}>
            <input
                {...getInputProps({
                    ref: inputRef,
                    placeholder: inputPlaceholder,
                    ...elem('input', { ...props }),
                })}
            />
            <div {...elem('buttons', { ...props })}>
                <IoIosArrowDown
                    {...getToggleButtonProps({
                        onClick: e => {
                            e?.stopPropagation();
                        },
                    })}
                />
            </div>
        </div>
    );

    renderBlurred.displayName = 'ComboboxMulti';

    return (
        <SelectBase
            {...rest}
            suggestions={suggestions}
            suggestionToString={suggestionToString}
            noSuggestionsPlaceholder={noSuggestionsPlaceholder}
            inputRef={inputRef}
            onBlur={onBlur}
            onSelectionChange={onSelectionChange}
            onInputValueChange={onInputValueChange}
            onClearAllSelected={onClearAllSelected}
            listRenderer={listProps => <SuggestionsList {...listProps} />}
            focusedRenderer={renderFocused}
            blurredRenderer={renderBlurred}
            keepExpandedAfterSelection
        />
    );
}

ComboboxMulti.defaultProps = {
    showClearButton: false,
};

ComboboxMulti.displayName = 'ComboboxMulti';

export default ComboboxMulti;
