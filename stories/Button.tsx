/* eslint-disable react/no-children-prop */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { Button, SearchButton } from '@textkernel/oneui';
import { CONTEXTS, SIZES } from '../src/constants';

storiesOf('Atoms|Button', module)
    .addDecorator(withKnobs)
    .add('Button', () => (
        <Button
            context={select('Context', ['link', ...CONTEXTS], CONTEXTS[0])}
            size={select('Size', SIZES, SIZES[1])}
            isBlock={boolean('isBlock', false)}
            isInline={boolean('isInline', false)}
            isLoading={boolean('isLoading', false)}
            type={select('Type', ['submit', 'button'], 'submit')}
            disabled={boolean('Disabled', false)}
            onClick={(e) => {
                console.log('Clicked button', e);
            }}
        >
            {text('Button label', 'Click me!')}
        </Button>
    ))
    .add('Button as a link', () => (
        <Button
            target="_blank"
            context={select('Context', ['link', ...CONTEXTS], CONTEXTS[0])}
            href={text('Href URL', 'https://github.com/textkernel/oneui')}
            size={select('Size', SIZES, SIZES[1])}
            isBlock={boolean('isBlock', false)}
            isInline={boolean('isInline', false)}
            disabled={boolean('Disabled', false)}
            onClick={(e) => {
                console.log('Clicked button', e);
            }}
        >
            {text('Button label', 'Click me!')}
        </Button>
    ))
    .add('SearchButton', () => (
        <SearchButton
            type={select('Type', ['submit', 'button'], 'submit')}
            disabled={boolean('Disabled', false)}
            children={text('Label', '')}
            onClick={(e) => {
                console.log('Clicked button', e);
            }}
        />
    ));
