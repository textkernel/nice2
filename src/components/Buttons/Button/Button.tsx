import * as React from 'react';
import { bem } from '../../../utils';
import styles from './Button.scss';
import { ButtonType, Context, Size } from '../../../constants';

export interface Props
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement> &
            React.AnchorHTMLAttributes<HTMLAnchorElement>,
        'size'
    > {
    /** The label of the button */
    children: NotEmptySingleReactNode;
    /** The button context (e.g. brand, primary, bad, good etc. - defaults to neutral) */
    context?: Context | 'link';
    /** The size of the button */
    size?: Size;
    /** Whether or not to show block-level button (full width) */
    isBlock?: boolean;
    /** Whether or not to show inline button (without padding) */
    isInline?: boolean;
    /** Whether or not to show the button in loading state */
    isLoading?: boolean;
    /** Should button be disabled or not */
    disabled?: boolean;
    /** Type of the button */
    type?: ButtonType;
    /** Providing an href will render an <a> element, styled as a button. */
    href?: string;
    /** Ref to access the button */
    ref?: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
}

const { block } = bem('Button', styles);

export const Button: React.FC<Props> = React.forwardRef((props, ref) => {
    const {
        children,
        context,
        disabled,
        isBlock,
        isInline,
        isLoading,
        type,
        href,
        size,
        ...rest
    } = props;

    if (href) {
        return (
            <a {...rest} {...block(props)} ref={ref} href={href}>
                {children}
            </a>
        );
    }

    return (
        <button {...rest} {...block(props)} ref={ref} type={type} disabled={disabled}>
            {children}
        </button>
    );
});

Button.displayName = 'Button';

Button.defaultProps = {
    context: 'neutral',
    size: 'normal',
    isBlock: false,
    isInline: false,
    isLoading: false,
    disabled: false,
    type: 'button',
};
