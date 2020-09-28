import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { Alert } from '@textkernel/oneui';
import { CONTEXTS } from '../src/constants';

storiesOf('Molecules|Alert', module)
    .addDecorator(withKnobs)
    .add('Alert', () => {
        const hasAction = boolean('Has an action', true);

        return (
            <Alert
                action={
                    hasAction
                        ? {
                              label: 'Dismiss',
                              onClick: (e) => {
                                  console.log('Clicked alert action', e);
                              },
                          }
                        : null
                }
                context={select('Context', CONTEXTS, CONTEXTS[1])}
                title={text('Title', 'Hi there!')}
            >
                {text('Content', 'This is some information for you')}
            </Alert>
        );
    });
