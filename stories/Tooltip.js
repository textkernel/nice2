/* eslint-disable react/no-children-prop */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { Tooltip } from '@textkernel/oneui';
import { POPUP_PLACEMENTS } from '@textkernel/oneui/constants';

storiesOf('Molecules|Tooltip', module)
    .addDecorator(withKnobs)
    .add('Tooltip', () => (
        <div>
            <div style={{ display: 'table', margin: '0 auto' }}>
                <Tooltip
                    placement={select('Placement', POPUP_PLACEMENTS, 'bottom')}
                    content="this is my tooltip text"
                >
                    hover here to see the tooltip
                </Tooltip>
            </div>
        </div>
    ));
