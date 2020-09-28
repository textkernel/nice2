import * as React from 'react';
import { bem } from '../../../utils';
import styles from './BlockWidthRestrictor.scss';

export interface Props extends React.HTMLAttributes<HTMLElement> {
    /** Node(s) to be rendered inside the container */
    children: NotEmptyReactNode;
    /** HTML tag to be used to render the container */
    As?: string;
    /** Ref to access the main wrapper element */
    ref?: React.RefObject<HTMLElement>;
}

const { block } = bem('BlockWidthRestrictor', styles);

export const BlockWidthRestrictor = React.forwardRef<HTMLElement, Props>((props, ref) => {
    const { children, As = 'div', ...rest } = props;

    return (
        <As {...rest} ref={ref} {...block(props)}>
            {children}
        </As>
    );
});

BlockWidthRestrictor.displayName = 'BlockWidthRestrictor';

BlockWidthRestrictor.defaultProps = {
    As: 'div',
};
