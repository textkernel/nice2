import React, { Children } from 'react';
import PropTypes from 'prop-types';
import bem from 'bem';
import { DropdownConsumer } from '../DropdownContext';
import { isStringMatch } from '../../../utils';
import styles from './DropdownGroup.scss';

const { block, elem } = bem({
    name: 'DropdownGroup',
    classnames: styles,
    propsToMods: []
});

const DropdownGroup = props => {
    const { children, label } = props;

    return (
        <DropdownConsumer>
            {({ filterValue }) => {
                const items = Children.map(children, child => {
                    if (isStringMatch(filterValue, child.props.children)) {
                        return child;
                    }

                    return null;
                });

                if (!items.length) {
                    return null;
                }

                return (
                    <div {...block(props)}>
                        <div {...elem('label', props)}>{label}</div>
                        <div {...elem('nodes', props)}>{items}</div>
                    </div>
                );
            }}
        </DropdownConsumer>
    );
};

DropdownGroup.displayName = 'DropdownGroup';

DropdownGroup.propTypes = {
    label: PropTypes.node.isRequired
};

DropdownGroup.defaultProps = {};

export default DropdownGroup;
