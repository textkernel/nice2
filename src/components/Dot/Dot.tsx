import * as React from 'react';
import { bem } from '../../utils';
import { Context } from '../../constants';
import styles from './Dot.scss';

const { block } = bem('Dot', styles);

interface Props {
    context?: Context;
    isHoverable?: boolean;
    isPulsating?: boolean;
    isClickable?: boolean;
    size?: number;
    style?: object;
}

export const Dot: React.FC<Props> = (props) => {
    const { context, isHoverable, isPulsating, isClickable, size, style, ...rest } = props;

    return (
        <div
            role="button"
            style={{
                ...style,
                ...((s) => {
                    if (!s) {
                        return {};
                    }
                    return {
                        width: s,
                        height: s,
                    };
                })(size),
            }}
            {...rest}
            {...block(props)}
        />
    );
};

Dot.displayName = 'Dot';

Dot.defaultProps = {
    context: 'brand',
    isClickable: false,
    isHoverable: false,
    isPulsating: false,
    size: 8,
    style: {},
};
