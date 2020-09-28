import * as React from 'react';
import { bem } from '../../../utils';
import { Text } from '../../Text';
import { Context } from '../../../constants';
import styles from './ListItem.scss';

interface Props extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
    /** List Items */
    children?: ReactNode;
    /** A function to be called if the item is clicked */
    onClick?: (e: React.SyntheticEvent<HTMLDivElement>) => void;
    /** Formats this item as selected  */
    isSelected?: boolean;
    /** Formats this item as selected  */
    isHighlighted?: boolean;
    /** Format this item as disabled */
    disabled?: boolean;
    /** formatting context when hovered or selected */
    highlightContext?: Context | 'default';
    /** Ref to access the li element */
    ref?: React.RefObject<HTMLLIElement>;
}

const { block, elem } = bem('ListItem', styles);

export const ListItem = React.forwardRef<HTMLLIElement, Props>((props, ref) => {
    const {
        children,
        isSelected,
        isHighlighted,
        onClick,
        disabled,
        highlightContext,
        ...rest
    } = props;
    const customBlockMod = { clickable: typeof onClick === 'function' };

    return (
        <li {...rest} ref={ref} {...block({ ...props, ...customBlockMod })}>
            <div onClick={onClick} role="presentation" {...elem('container', props)}>
                {React.Children.map(children, (child) =>
                    typeof child === 'string' ? <Text inline>{child}</Text> : child
                )}
            </div>
        </li>
    );
});

ListItem.displayName = 'ListItem';

ListItem.defaultProps = {
    isSelected: false,
    isHighlighted: false,
    disabled: false,
    highlightContext: 'default',
};
