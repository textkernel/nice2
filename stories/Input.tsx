import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { Input } from '@textkernel/oneui';
import { INPUT_TYPES, SIZES } from '../src/constants';

const validationContextOptions = {
    None: undefined,
    Good: 'good',
    Bad: 'bad',
    Warning: 'warning',
} as const;

storiesOf('Atoms|Input', module)
    .addDecorator(withKnobs)
    .add('Default behavior', () => (
        <Input
            context={select('Context', validationContextOptions, undefined)}
            disabled={boolean('Disabled', false)}
            isBlock={boolean('isBlock', false)}
            onChange={(e) => {
                const { value } = e.target;
                console.log(value);
            }}
            placeholder={text('Placeholder', 'Some text goes here...')}
            size={select('Size', SIZES, SIZES[1])}
            type={select('Type', INPUT_TYPES, INPUT_TYPES[0])}
        />
    ))
    .add('Controlled component', () => (
        <Input
            context={select('Context', validationContextOptions, undefined)}
            disabled={boolean('Disabled', false)}
            isBlock={boolean('isBlock', false)}
            onChange={(e) => {
                const { value } = e.target;
                console.log(value);
            }}
            placeholder={text('Placeholder', 'While typing, check your console log...')}
            size={select('Size', SIZES, SIZES[1])}
            type={select('Type', INPUT_TYPES, INPUT_TYPES[0])}
            value={text('Input value', '')}
        />
    ));
