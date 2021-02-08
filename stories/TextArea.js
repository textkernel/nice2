import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { TextArea } from '@textkernel/oneui';
import { CONTEXTS, SIZES } from '../src/constants';

storiesOf('Atoms|TextArea', module)
    .addDecorator(withKnobs)
    .add('Default behavior', () => (
        <TextArea
            context={select('Context', CONTEXTS, CONTEXTS[1])}
            defaultValue="This is a default value"
            disabled={boolean('Disabled', false)}
            isBlock={boolean('isBlock', false)}
            onChange={(e) => {
                const { value } = e.target;
                console.log(value);
            }}
            placeholder={text('Placeholder', 'Some text goes here...')}
            size={select('Size', SIZES, SIZES[1])}
        />
    ))
    .add('Controlled component', () => (
        <TextArea
            context={select('Context', CONTEXTS, CONTEXTS[1])}
            disabled={boolean('Disabled', false)}
            isBlock={boolean('isBlock', false)}
            onChange={(e) => {
                const { value } = e.target;
                console.log(value);
            }}
            placeholder={text('Placeholder', 'While typing, check your console log...')}
            size={select('Size', SIZES, SIZES[1])}
            value={text('Textarea value', '')}
        />
    ));
