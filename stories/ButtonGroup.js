import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { Button, ButtonGroup } from '@textkernel/oneui';
import { CONTEXTS, SIZES } from '../src/constants';

storiesOf('Molecules|ButtonGroup', module)
    .addDecorator(withKnobs)
    .add('ButtonGroup', () => (
        <ButtonGroup
            context={select('Context', [...CONTEXTS, 'link'], CONTEXTS[0])}
            isBlock={boolean('isBlock', false)}
            size={select('Size', SIZES, SIZES[1])}
        >
            <Button
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                }}
            >
                Some
            </Button>
            <Button>Button</Button>
            <Button>Group</Button>
        </ButtonGroup>
    ));
