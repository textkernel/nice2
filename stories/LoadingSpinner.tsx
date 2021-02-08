import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { LoadingSpinner } from '@textkernel/oneui';
import { CONTEXTS } from '../src/constants';

storiesOf('Molecules|LoadingSpinner', module)
    .addDecorator(withKnobs)
    .add('LoadingSpinner', () => {
        const label = text('Label', 'Loading...');
        return (
            <LoadingSpinner
                context={select('Context', CONTEXTS, CONTEXTS[1])}
                hidden={boolean('Hidden', false)}
                size={number('Size', 0) || undefined}
                centerIn={select(
                    'Center in...',
                    {
                        Nothing: undefined,
                        'Parent element': 'parent',
                        Viewport: 'viewport',
                    },
                    undefined
                )}
            >
                {label}
            </LoadingSpinner>
        );
    });
