import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';
import { ComboboxMulti, Autosuggest, Select } from '@textkernel/oneui';
import { StoreInjector } from '../src/packages/storybook/withStore';
import {
    SUGGESTIONS,
    SUGGESTION_TO_STRING,
    COMPLEX_SUGGESTIONS,
} from '../src/components/AutosuggestDeprecated/__mocks__/suggestions';

type TSuggestion = { name: string };
type TComplexSuggestion = { name: string; type: string };

const searchFor = {
    name: '',
    value: '',
};

storiesOf('Organisms|Select Components', module)
    .addDecorator(withKnobs)
    .addParameters(
        StoreInjector.withStore({
            inputValue: '',
            selectedSuggestions: [],
            selectedItem: SUGGESTIONS[0],
            disabled: false,
            inputRef: React.createRef(),
            singleSelectedText: '',
        })
    )
    .add(
        'Select',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onBlur = () => {
                console.log('onBlur was called');
            };

            const onChange = (item) => {
                console.log(`onChange was called with {name: ${item.name}}`);
                store.set({ selectedItem: item });
            };

            return (
                <>
                    <Select<TSuggestion>
                        style={{ width: '650px' }}
                        items={SUGGESTIONS}
                        itemToString={SUGGESTION_TO_STRING}
                        selectedItem={store.get('selectedItem')}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={onChange}
                    />
                </>
            );
        },
        {
            info: {
                text: `
        ## Usage information
        This component is recommended to use for a simple select component with static known list of values without a need for filtering.
        The list is shown right away by clicking on the control. The selected item is shown in the top field.

        More detailed face-to-face comparison of Select components can be found [here](https://docs.google.com/spreadsheets/d/1VyYR54RpNaPWLBXOoBPkFEkmzLS_LfEEGdm1ZTTOcHU/edit#gid=0)`,
            },
        }
    )
    .add(
        'ComboboxMulti',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const getSuggestions = (): TSuggestion[] => {
                return SUGGESTIONS.filter(
                    (item) =>
                        !store.get('selectedSuggestions').includes(item) &&
                        item.name
                            .toLocaleLowerCase()
                            .includes(store.get('inputValue').toLocaleLowerCase())
                );
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
                store.set({ inputValue: value });
            };

            const onSelectionAdd = (item: TSuggestion) => {
                console.log(`onSelectionAdd was called with {name: ${item?.name}}`);
                store.set({ selectedSuggestions: [...store.get('selectedSuggestions'), item] });
                if (store.get('selectedSuggestions').length === SUGGESTIONS.length) {
                    store.set({ disabled: true });
                }
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onBlur = () => {
                console.log('onBlur was called');
                setTimeout(() => store.set({ inputValue: '' }), 200);
            };

            return (
                <>
                    <ul>
                        {store.get('selectedSuggestions').map((item) => (
                            <li key={item.name}>{item.name}</li>
                        ))}
                    </ul>
                    <ComboboxMulti<TSuggestion>
                        style={{ width: '650px' }}
                        useOptimizeListRender={boolean(
                            'Use optimize list render (ListOptimizer)',
                            false
                        )}
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        noSuggestionsPlaceholder={text('No suggestions', 'No suggestions found...')}
                        suggestions={getSuggestions()}
                        suggestionToString={SUGGESTION_TO_STRING}
                        disabled={boolean('Disabled', false) || store.get('disabled')}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSelectionAdd={onSelectionAdd}
                        onInputValueChange={onInputValueChange}
                    />
                </>
            );
        },
        {
            info: {
                text: `
            ## Usage information
            This component is recommended to use when there's a static known list of values. The user can filter the list through the input field.
            The list is shown right away by clicking on the control. Selected options are not rendered by the component itself. The application using this component should rendered them separately, e.g. above this component using SelectedOption.

            More detailed face-to-face comparison of Select components can be found [here](https://docs.google.com/spreadsheets/d/1VyYR54RpNaPWLBXOoBPkFEkmzLS_LfEEGdm1ZTTOcHU/edit#gid=0)`,
            },
        }
    )
    // eslint-disable-next-line
    .add(
        'Autosuggest as multi-select component',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const getSuggestions = (): TSuggestion[] => {
                const suggestions = SUGGESTIONS.filter(
                    (item: TSuggestion) =>
                        !store
                            .get('selectedSuggestions')
                            .some(
                                (i) => item.name.toLocaleLowerCase() === i.name.toLocaleLowerCase()
                            )
                );
                return suggestions;
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
            };

            const onSelectionAdd = (item: TSuggestion) => {
                console.log(`onSelectionAdd was called with {name: ${item.name}}`);
                const selectedItem = { ...item };
                // Add new item
                if (
                    !store
                        .get('selectedSuggestions')
                        .some((i: TSuggestion) => i.name === selectedItem.name)
                ) {
                    const selectedSuggestions = [...store.get('selectedSuggestions'), selectedItem];
                    store.set({
                        selectedSuggestions,
                    });
                }
            };

            const onSelectionRemove = (item: TSuggestion) => {
                console.log(`onSelectionRemove was called with {name: ${item.name}}`);
                // Delete item
                const selectedSuggestions = store
                    .get('selectedSuggestions')
                    .filter((i: TSuggestion) => i.name !== item.name);
                store.set({
                    selectedSuggestions,
                });
            };

            const onBlur = () => {
                console.log('onBlur was called');
            };

            const onClearAllSelected = () => {
                console.log('onClearAllSelected was called');
                store.set({ selectedSuggestions: [] });
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onSubmit = () => {
                console.log('onSubmit was called');
            };

            const hasSuggestions = boolean('Component has suggestions available', false);

            return (
                <div style={{ width: '500px' }}>
                    <Autosuggest
                        id="test"
                        selectedSuggestions={store.get('selectedSuggestions')}
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        suggestions={hasSuggestions ? getSuggestions() : []}
                        suggestionToString={SUGGESTION_TO_STRING}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSubmit={onSubmit}
                        onSelectionAdd={onSelectionAdd}
                        onSelectionRemove={onSelectionRemove}
                        isLoading={boolean('isLoading', false)}
                        onInputValueChange={onInputValueChange}
                        showClearButton={boolean('Show clear button', true)}
                        clearTitle={text('Clear button label', 'Clear')}
                        onClearAllSelected={onClearAllSelected}
                        noSuggestionsPlaceholder={text(
                            'No suggestions placeholder',
                            'No suggestions'
                        )}
                    />
                </div>
            );
        },
        {
            info: {
                text: `
            ## Usage information
            This component is recommended to use for a dynamic list of values.
            It is geared toward a multi-select usecase, but you can use it in single select more too. See related story for details.
            The list of suggestions is shown once there's a value inside the input.

            More detailed face-to-face comparison of Select components can be found [here](https://docs.google.com/spreadsheets/d/1VyYR54RpNaPWLBXOoBPkFEkmzLS_LfEEGdm1ZTTOcHU/edit#gid=0)`,
            },
        }
    )
    // eslint-disable-next-line
    .add(
        'Autosuggest as single-select component',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const inputValue = store.get('inputValue');
            const inputRef = React.createRef<HTMLInputElement>();

            const getSuggestions = (): TSuggestion[] => {
                // filtering suggestions from some other source
                return SUGGESTIONS.filter((item: TSuggestion) =>
                    // suggestion is relevant to input
                    item.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
                );
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
                store.set({ inputValue: value });
            };

            // most of the magic is happening here
            const onSelectionAdd = (item: TSuggestion) => {
                console.log(`onSelectionAdd was called with {name: ${item.name}}`);
                store.set({ singleSelectedText: item.name });
                // Force UI behavior to single select - blur the field
                inputRef.current?.blur();
            };

            const onBlur = () => {
                console.log('onBlur was called');
                // inputValue is used to filter suggestions,
                // preserve it for free text selection, but not otherwise
                store.set({ inputValue: store.get('singleSelectedText') || '' });
            };

            const onClearAllSelected = () => {
                console.log('onClearAllSelected was called');
                store.set({ singleSelectedText: '' });
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onSubmit = () => {
                console.log('onSubmit was called');
            };

            // Other magical prop -> will overwrite standard blurred render UI
            const customBlur = (
                <div
                    style={{
                        alignSelf: 'center',
                        marginLeft: '6px',
                    }}
                >
                    {store.get('singleSelectedText')}
                </div>
            );

            const hasSuggestions = boolean('Component has suggestions available', false);

            return (
                <div style={{ width: '500px' }}>
                    <Autosuggest
                        id="test"
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        suggestions={hasSuggestions ? getSuggestions() : []}
                        suggestionToString={SUGGESTION_TO_STRING}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSubmit={onSubmit}
                        onSelectionAdd={onSelectionAdd}
                        isLoading={boolean('isLoading', false)}
                        onInputValueChange={onInputValueChange}
                        showClearButton={boolean('Show clear button', true)}
                        clearTitle={text('Clear button label', 'Clear')}
                        onClearAllSelected={onClearAllSelected}
                        inputRef={inputRef}
                        // this will trick to UI to pre-fill the in input field when it gets focused again
                        initInputValue={store.get('singleSelectedText')}
                        // Here we overwrite the UI default look when we have a selection
                        customSelectionIndicator={
                            store.get('singleSelectedText') ? customBlur : undefined
                        }
                    />
                </div>
            );
        },
        {
            info: {
                text: `
                The Autosuggest component is recommended to use for a dynamic list of values.
                It is primarily geared toward a multi-select use case. 
                This story demonstrates how you can add props and function to make it feel like a single select component.
                
                The important parts here are:
                * passing inputRef prop, so we can access the input field from outside
                * calling inputRef.current.blur() in onSelectionAdd
                * when something was selected, passing a custom customSelectionIndicator node to alter the look and feel of the blurred component
                * passing initInputValue so that the input field gets populated when the component receives focus again.`,
            },
        }
    )
    .add(
        'Autosuggest with custom item renderer',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const getSuggestions = (): TComplexSuggestion[] => {
                const suggestions = COMPLEX_SUGGESTIONS.filter(
                    (item: TComplexSuggestion) =>
                        !store
                            .get('selectedSuggestions')
                            .some(
                                (i) => item.name.toLocaleLowerCase() === i.name.toLocaleLowerCase()
                            )
                );
                return suggestions;
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
            };

            const onSelectionAdd = (item: TComplexSuggestion) => {
                console.log(`onSelectionAdd was called with {name: ${item.name}}`);
                const selectedItem = { ...item };
                // Add new item
                if (
                    !store
                        .get('selectedSuggestions')
                        .some((i: TComplexSuggestion) => i.name === selectedItem.name)
                ) {
                    const selectedSuggestions = [...store.get('selectedSuggestions'), selectedItem];
                    store.set({
                        selectedSuggestions,
                    });
                }
            };

            const onSelectionRemove = (item: TComplexSuggestion) => {
                console.log(`onSelectionRemove was called with {name: ${item.name}}`);
                // Delete item
                const selectedSuggestions = store
                    .get('selectedSuggestions')
                    .filter((i: TComplexSuggestion) => i.name !== item.name);
                store.set({
                    selectedSuggestions,
                });
            };

            const onBlur = () => {
                console.log('onBlur was called');
            };

            const onClearAllSelected = () => {
                console.log('onClearAllSelected was called');
                store.set({ selectedSuggestions: [] });
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onSubmit = () => {
                console.log('onSubmit was called');
            };

            const suggestionRenderer = (
                item: TComplexSuggestion | null,
                i: number,
                array: TComplexSuggestion[]
            ) => {
                if (!item) {
                    return null;
                }
                if (i === 0 || item.type !== array[i - 1].type) {
                    return (
                        <div
                            style={{
                                borderTop: '1px solid grey',
                                width: '100%',
                                margin: '-12px',
                                padding: '12px',
                            }}
                        >
                            {item.name}
                            <span
                                style={{ color: 'grey', marginLeft: '6px' }}
                            >{`- ${item.type}`}</span>
                        </div>
                    );
                }

                return <div>{item.name}</div>;
            };

            return (
                <div style={{ width: '500px' }}>
                    <Autosuggest
                        id="test"
                        selectedSuggestions={store.get('selectedSuggestions')}
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        suggestions={getSuggestions()}
                        suggestionToString={SUGGESTION_TO_STRING}
                        suggestionItemRenderer={suggestionRenderer}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSubmit={onSubmit}
                        onSelectionAdd={onSelectionAdd}
                        onSelectionRemove={onSelectionRemove}
                        isLoading={boolean('isLoading', false)}
                        onInputValueChange={onInputValueChange}
                        showClearButton={boolean('Show clear button', true)}
                        clearTitle={text('Clear button label', 'Clear')}
                        onClearAllSelected={onClearAllSelected}
                        noSuggestionsPlaceholder={text(
                            'No suggestions placeholder',
                            'No suggestions'
                        )}
                    />
                </div>
            );
        },
        {
            info: {
                text: `
            The Autosuggest component is recommended to use for a dynamic list of values.
            This story demonstrates how you can apply a custom render function to adjust the look and feel of the suggestions`,
            },
        }
    )
    // eslint-disable-next-line
    .add(
        'Autosuggest with selecting input as free text',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            searchFor.name = `Search for "${store.get('inputValue')}"`;
            searchFor.value = store.get('inputValue');
            const getSuggestions = (): TSuggestion[] => {
                const suggestions = SUGGESTIONS.filter(
                    (item: TSuggestion) =>
                        item.name.toLocaleLowerCase() !==
                            store.get('inputValue').toLocaleLowerCase() &&
                        item.name
                            .toLocaleLowerCase()
                            .includes(store.get('inputValue').toLocaleLowerCase()) &&
                        !store
                            .get('selectedSuggestions')
                            .some(
                                (i) => item.name.toLocaleLowerCase() === i.name.toLocaleLowerCase()
                            )
                );
                if (store.get('inputValue').length) {
                    return [searchFor, ...suggestions];
                }
                return suggestions;
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
                store.set({ inputValue: value });
            };

            const onSelectionAdd = (item: TSuggestion) => {
                console.log(`onSelectionAdd was called with {name: ${item.name}}`);
                let selectedItem = { ...item };
                if (item === searchFor) {
                    selectedItem = { name: (item as typeof searchFor).value };
                }
                // Add new item
                if (
                    !store
                        .get('selectedSuggestions')
                        .some((i: TSuggestion) => i.name === selectedItem.name)
                ) {
                    const selectedSuggestions = [...store.get('selectedSuggestions'), selectedItem];
                    store.set({
                        selectedSuggestions,
                    });
                }
            };

            const onSelectionRemove = (item: TSuggestion) => {
                console.log(`onSelectionRemove was called with {name: ${item.name}}`);
                store.set({ inputValue: '' });
                const selectedItem = { ...item };
                // Delete item
                if (!store.get('inputValue')) {
                    const selectedSuggestions = store
                        .get('selectedSuggestions')
                        .filter((i: TSuggestion) => i.name !== selectedItem.name);
                    store.set({
                        selectedSuggestions,
                    });
                }
            };

            const onBlur = () => {
                console.log('onBlur was called');
                store.set({ inputValue: '' });
            };

            const onClearAllSelected = () => {
                console.log('onClearAllSelected was called');
                store.set({ selectedSuggestions: [] });
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onSubmit = () => {
                console.log('onSubmit was called');
            };

            return (
                <div style={{ width: '500px' }}>
                    <Autosuggest
                        id="test"
                        selectedSuggestions={store.get('selectedSuggestions')}
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        suggestions={getSuggestions()}
                        suggestionToString={SUGGESTION_TO_STRING}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSubmit={onSubmit}
                        allowMixingSuggestionsAndLoading={!!store.get('inputValue').length}
                        onSelectionAdd={onSelectionAdd}
                        onSelectionRemove={onSelectionRemove}
                        isLoading={boolean('isLoading', false)}
                        onInputValueChange={onInputValueChange}
                        showClearButton={boolean('Show clear button', true)}
                        clearTitle={text('Clear button label', 'Clear')}
                        onClearAllSelected={onClearAllSelected}
                        selectFirstOnOutClick
                    />
                </div>
            );
        },
        {
            info: {
                text: `
            The Autosuggest component is recommended to use for a dynamic list of values.

            This story demonstrates how you can mix these dynamic suggestions with static ones (e.g. based on user input), 
            and how those can be shown during the loading state as well.

            It also makes use of "selectFirstOnOutClick" so that the input value gets selected on outer click even if the user
            did not explicitly select it from the suggestions list.
            `,
            },
        }
    )
    // eslint-disable-next-line
    .add(
        'Autosuggest as a dance of single and multi-selection',
        (storyContext) => {
            const store = storyContext?.parameters.getStore();
            const inputValue = store.get('inputValue');
            const inputRef = React.createRef<HTMLInputElement>();

            const getSuggestions = (): TComplexSuggestion[] => {
                // filtering suggestions from some other source
                const autoSuggestions = COMPLEX_SUGGESTIONS.filter(
                    (item: TComplexSuggestion) =>
                        // suggestion is relevant to input
                        item.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) &&
                        // suggestion not yet selected
                        !store
                            .get('selectedSuggestions')
                            .some(
                                (i) => item.name.toLocaleLowerCase() === i.name.toLocaleLowerCase()
                            )
                );

                // add free text option if there is an input by the user and not other suggestions were selected yet
                return inputValue.length && !store.get('selectedSuggestions').length
                    ? [{ name: inputValue, type: 'free-text' }, ...autoSuggestions]
                    : autoSuggestions;
            };

            const onInputValueChange = (value: string) => {
                console.log(`onInputValueChange was called with ${value}`);
                store.set({ inputValue: value });
            };

            // most of the magic is happening here
            const onSelectionAdd = (item: TComplexSuggestion) => {
                console.log(
                    `onSelectionAdd was called with {name: ${item.name}, type: ${item.type}}`
                );
                // Selected option requires single select behavior
                if (item.type === 'free-text') {
                    // save the value to our 'single select' state
                    store.set({ singleSelectedText: item.name });
                    // Force UI behavior to single select - blur the field
                    inputRef.current?.blur();
                    // all done
                    return;
                }

                // a multi selectable option was chosen
                // it is where the user can replace previously selected free text with something else
                // remove previously selected free text
                if (store.get('singleSelectedText')) {
                    store.set({ singleSelectedText: '' });
                }
                // Add new item to multi selection list
                store.set({
                    selectedSuggestions: [...store.get('selectedSuggestions'), item],
                });
            };

            const onSelectionRemove = (item: TSuggestion) => {
                console.log(`onSelectionRemove was called with {name: ${item.name}}`);

                // Delete item
                if (!store.get('inputValue')) {
                    const selectedSuggestions = store
                        .get('selectedSuggestions')
                        .filter((i: TSuggestion) => i.name !== item.name);
                    store.set({
                        selectedSuggestions,
                    });
                }
            };

            const onBlur = () => {
                console.log('onBlur was called');
                // inputValue is used to filter suggestions,
                // preserve it for free text selection, but not otherwise
                store.set({ inputValue: store.get('singleSelectedText') || '' });
            };

            // Make sure to clear both states that hold selections
            const onClearAllSelected = () => {
                console.log('onClearAllSelected was called');
                store.set({ selectedSuggestions: [], singleSelectedText: '' });
            };

            const onFocus = () => {
                console.log('onFocus was called');
            };

            const onSubmit = () => {
                console.log('onSubmit was called');
            };

            // Other magical prop -> will overwrite standard blurred render UI
            const customBlur = (
                <div
                    style={{
                        alignSelf: 'center',
                        marginLeft: '6px',
                    }}
                >
                    {store.get('singleSelectedText')}
                </div>
            );

            return (
                <div style={{ width: '500px' }}>
                    <Autosuggest
                        id="test"
                        selectedSuggestions={store.get('selectedSuggestions')}
                        inputPlaceholder={text('Input placeholder', 'Select something...')}
                        suggestions={getSuggestions()}
                        suggestionToString={SUGGESTION_TO_STRING}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onSubmit={onSubmit}
                        allowMixingSuggestionsAndLoading={!!store.get('inputValue').length}
                        onSelectionAdd={onSelectionAdd}
                        onSelectionRemove={onSelectionRemove}
                        isLoading={boolean('isLoading', false)}
                        onInputValueChange={onInputValueChange}
                        showClearButton={boolean('Show clear button', true)}
                        clearTitle={text('Clear button label', 'Clear')}
                        onClearAllSelected={onClearAllSelected}
                        inputRef={inputRef}
                        // this will trick to UI to pre-fill the in input field when it gets focused again
                        initInputValue={store.get('singleSelectedText')}
                        // here we switch the UI behavior based on our local state
                        customSelectionIndicator={
                            store.get('singleSelectedText') ? customBlur : undefined
                        }
                        // select the first suggestions (user input) on outer click
                        selectFirstOnOutClick={!store.get('selectedSuggestions').length}
                    />
                </div>
            );
        },
        {
            info: {
                text: `
            The Autosuggest component is recommended to use for a dynamic list of values.
            It is primarily geared toward a multi-select use case. 
            This story demonstrates how you can add props and function to allow mix of single select and multi select options together.
            
            The business case we demonstrate here is has the following requirements:
            
            * The user can select free text input
            * When free text input is selected it should behave as a single select component
            * All other suggestions can be selected in a multi-select fashion.
            * Also: if the user clicks outside the component after typing something, select the free texts as on TAB navigation
            
            The **important parts** here are:
            * passing inputRef prop, so we can access the input field from outside
            * calling inputRef.current.blur() in onSelectionAdded callback when needed
            
            when a _single selection happened_:
            * passing a custom customSelectionIndicator node to alter the look and feel of the blurred component
            * passing initInputValue so that the input field gets populated when the component receives focus again.`,
            },
        }
    );
