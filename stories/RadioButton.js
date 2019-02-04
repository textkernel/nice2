import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { boolean, text, withKnobs } from '@storybook/addon-knobs'; // eslint-disable-line import/no-extraneous-dependencies
import { RadioButton } from '@textkernel/oneui';

storiesOf('RadioButton', module)
    .addDecorator(withKnobs)
    .add('RadioButton', () => (
        <div>
            <RadioButton disabled={boolean('Disabled 1', false)} id="radio-1" name="my-group">
                {text('RadioButton 1 label', 'Option 1')}
            </RadioButton>
            <RadioButton disabled={boolean('Disabled 2', false)} id="radio-2" name="my-group">
                {text('RadioButton 2 label', 'Option 2')}
            </RadioButton>
        </div>
    ));
