import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { Modal, Button } from '@textkernel/oneui';
import withStore from '../src/packages/storybook/withStore';

storiesOf('Atoms|Modal', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .addParameters(
        withStore({
            isOpen: false,
        })
    )
    .add(
        'Modal',
        ({ parameters }) => {
            const store = parameters.getStore();
            const onClose = () => {
                store.set({ isOpen: false });
                console.log('Modal was requested to be closed.');
            };
            return (
                <div>
                    <Button onClick={() => store.set({ isOpen: true })}>Open Modal</Button>
                    <Modal
                        isOpen={store.get('isOpen')}
                        contentLabel={text(
                            'Label for content visible to screenreaders',
                            'My superb modal'
                        )}
                        onRequestClose={onClose}
                    >
                        Some content
                    </Modal>
                </div>
            );
        },
        {
            info: {
                text: `
                ## Usage information

                This component is a wrapper around [react-modal](http://reactcommunity.org/react-modal/#usage).

                * You can pass other props according to their definition, apart from classes.
                * For accessibility reasons you need to __initialise__ modal use in your app.
                For more info see [app element](http://reactcommunity.org/react-modal/accessibility/#app-element) in thier documentation.
                To do this call the following function once:

                > __Modal.setAppElement__(appElementSelector);

                To see the modal in action here, change the Open prop to 'true' in the Knobs section.
                `,
            },
        }
    );
