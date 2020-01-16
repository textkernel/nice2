import * as React from 'react';
import { GetItemPropsOptions } from 'downshift';
import { Text, MarkedText } from '../Text';
import { ListItem } from '../List';

export interface Props<S> {
    /** An array of objects that will be used to render the suggestions list. */
    suggestions: S[];
    /** suggestionToString(suggestion) should return a string to be displayed in the UI. e.g.: suggestion => suggestion.name */
    suggestionToString: (suggestions: S) => string;
    /** to be shown when no suggestions are available */
    noSuggestionsPlaceholder: string;
    getItemProps: (options: GetItemPropsOptions<S>) => object;
    highlightedIndex: number | null;
    inputValue: string;
}

function SuggestionsList<S>(props: Props<S>) {
    const {
        suggestionToString,
        suggestions,
        noSuggestionsPlaceholder,
        getItemProps,
        highlightedIndex,
        inputValue,
    } = props;

    if (!suggestions || !suggestions.length) {
        return inputValue ? (
            <ListItem disabled>
                <Text context="muted">{noSuggestionsPlaceholder}</Text>
            </ListItem>
        ) : null;
    }

    // <> is needed because of https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356
    return (
        <>
            {suggestions.map((item, index) => (
                <ListItem
                    key={suggestionToString(item)}
                    {...getItemProps({
                        item,
                        index,
                    })}
                    isHighlighted={highlightedIndex === index}
                    highlightContext="brand"
                >
                    <MarkedText marker={inputValue} inline>
                        {suggestionToString(item)}
                    </MarkedText>
                </ListItem>
            ))}
        </>
    );
}

SuggestionsList.displayName = 'SuggestionsList';

export default SuggestionsList;
