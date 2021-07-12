import * as React from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { storiesOf } from '@storybook/react';
import { boolean, select, number, withKnobs } from '@storybook/addon-knobs';
import { Dot } from '@textkernel/oneui';
import { CONTEXTS } from '../src/constants';

storiesOf('Atoms|Dot', module)
    .addDecorator(withKnobs)
    .add('Dot', () => (
        <div
            style={{
                backgroundColor: 'var(--color-neutral-10)',
                padding: 100,
            }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'inline-block',
                }}
            >
                <IoMdNotifications style={{ fontSize: 28 }} />
                <Dot
                    context={select('Context', CONTEXTS, CONTEXTS[0])}
                    isClickable={boolean('isClickable', false)}
                    isPulsating={boolean('isPulsating', false)}
                    isHoverable={boolean('isHoverable', false)}
                    size={number('Size', 8)}
                    style={{
                        position: 'absolute',
                        top: 3,
                        right: 3,
                    }}
                />
            </div>
        </div>
    ));
