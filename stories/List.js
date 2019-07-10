import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { List, ListItem, ListActions, JobResult, Text, Button, Checkbox } from '@textkernel/oneui';
import { CONTEXTS } from '../src/constants';

storiesOf('List', module)
    .addDecorator(withKnobs)
    .add('List', () => (
        <List isDivided={boolean('Add dividers between items', true)}>
            <ListItem highlightContext={select('Highlight context', ['default', ...CONTEXTS])}>
                First item passed as string{' '}
                <ListActions>
                    <Button context="link" isInline>
                        Action
                    </Button>
                </ListActions>
            </ListItem>
            <ListItem highlightContext={select('Highlight context', ['default', ...CONTEXTS])}>
                <Checkbox id="item2" />
                <div>
                    <Text>Item passed as Text component</Text>
                    <Text>It has multiple lines</Text>
                </div>
            </ListItem>
            <ListItem
                isSelected={boolean('Select item', true)}
                highlightContext={select('Highlight context', ['default', ...CONTEXTS])}
            >
                <Text inline>Item selectable via props</Text>
            </ListItem>
            <ListItem
                disabled={boolean('Disable item', true)}
                highlightContext={select('Highlight context', ['default', ...CONTEXTS])}
            >
                <Text inline>Disabled item</Text>
            </ListItem>
            <ListItem
                onClick={e => {
                    e.preventDefault();
                    alert('Item was selected'); // eslint-disable-line no-alert, no-undef
                }}
                highlightContext={select('Highlight context', ['default', ...CONTEXTS])}
            >
                <Checkbox id="item4" />
                Clickable item
            </ListItem>
        </List>
    ))
    .add('List showing job results', () => {
        const onClickJob = e => {
            e.preventDefault();
            alert('Item was selected'); // eslint-disable-line no-alert, no-undef
        };
        const onClickAction = e => {
            e.preventDefault();
            e.stopPropagation();
            alert('Action button was clicked'); // eslint-disable-line no-alert, no-undef
        };

        return (
            <div style={{ width: '500px' }}>
                <List isDivided>
                    <ListItem onClick={onClickJob}>
                        <JobResult
                            title="My first job"
                            location="Melbourne"
                            organization="Awsome inc."
                            details="It was posted here, yesterday"
                        />
                        <ListActions>
                            <Button context="link" onClick={onClickAction} isInline>
                                Action
                            </Button>
                        </ListActions>
                    </ListItem>
                    <ListItem onClick={onClickJob}>
                        <JobResult
                            title="Job with a very, very, very long title to be truncated by css"
                            location="Melbourne"
                            organization="Awsome inc."
                            details="It was posted there, yesterday"
                        />
                        <ListActions>
                            <Button context="link" onClick={onClickAction} isInline>
                                Action
                            </Button>
                        </ListActions>
                    </ListItem>
                    <ListItem onClick={onClickJob}>
                        <JobResult title="An other job with a very, very, very long title to be truncated by css if it doesn't fit" />
                        <ListActions>
                            <Button context="link" onClick={onClickAction} isInline>
                                Action
                            </Button>
                        </ListActions>
                    </ListItem>
                </List>
            </div>
        );
    });
