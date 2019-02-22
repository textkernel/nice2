import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs'; // eslint-disable-line import/no-extraneous-dependencies
import { LoadingSpinner } from '@textkernel/oneui';
import { CONTEXTS } from '@textkernel/oneui/constants';

storiesOf('LoadingSpinner', module)
    .addDecorator(withKnobs)
    .add('LoadingSpinner', () => (
        <LoadingSpinner
            centerIn={select(
                'Center in...',
                {
                    '': null,
                    'Parent element': 'parent',
                    Viewport: 'viewport'
                },
                null
            )}
            context={select('Context', CONTEXTS, CONTEXTS[1])}
            hidden={boolean('Hidden', false)}
            size={number('Size', null)}
        >
            {text('Label', 'Loading...')}
        </LoadingSpinner>
    ));
