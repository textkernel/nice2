import * as React from 'react';
import { bem } from '../../utils';
import styles from './Link.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Link content */
    children: NotEmptyReactNode;
    /** Color context */
    context?: 'brand' | 'muted';
    /** Ref to access the anchor */
    ref?: React.RefObject<HTMLAnchorElement>;
}

const { block } = bem('Link', styles);

export const Link = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    const { children, context, ...rest } = props;
    return (
        <a ref={ref} {...rest} {...block(props)}>
            {children}
        </a>
    );
});

Link.displayName = 'Link';

Link.defaultProps = {
    context: 'brand',
};
