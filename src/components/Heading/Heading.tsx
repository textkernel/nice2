import * as React from 'react';
import { bem } from '../../utils';
import styles from './Heading.scss';
import { HEADING_SIZES } from '../../constants';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    /** Heading text */
    children: NotEmptyReactNode;
    /** Heading size (h1, h2, ...) */
    level?: typeof HEADING_SIZES[number];
    /** Heading text alignment */
    align?: 'left' | 'center' | 'right';
    /** Ref to access the span element */
    ref?: React.RefObject<HTMLElement>;
}

const { block } = bem('Heading', styles);

export const Heading = React.forwardRef<HTMLHeadingElement, Props>((props, ref) => {
    const { align, children, level = 'h1', ...rest } = props;
    const HtmlNodeType = level;

    return (
        <HtmlNodeType ref={ref} {...rest} {...block(props)}>
            {children}
        </HtmlNodeType>
    );
});

Heading.displayName = 'Heading';

Heading.defaultProps = {
    align: 'left',
    level: 'h1',
};
