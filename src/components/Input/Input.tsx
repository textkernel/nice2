import * as React from 'react';
import { bem } from '../../utils';
import styles from './Input.scss';
import { ValidationContext, InputType, Size } from '../../constants';

// Any other attributes (onChange, onKeyUp etc.) are
// supported although not defined in props type definition
interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** The input field context (e.g. brand, primary, bad, good etc. - defaults to brand) */
    context?: ValidationContext;
    /** Should the input field be disabled or not */
    disabled?: boolean;
    /** Whether or not to show block-level input field (full width) */
    isBlock?: boolean;
    /** The size of the input field */
    size?: Size;
    /** Type of the input field */
    type?: InputType;
    /** Ref to access the input field */
    ref?: React.RefObject<HTMLInputElement>;
}

const { block } = bem('Input', styles);

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { children, context, disabled, isBlock, size, type, value, ...rest } = props;
    const isLastPassDisabled = type !== 'password';
    return (
        <input
            {...rest}
            {...block(props)}
            ref={ref}
            type={type}
            disabled={disabled}
            value={value}
            data-lpignore={isLastPassDisabled}
        />
    );
});

Input.displayName = 'Input';

Input.defaultProps = {
    disabled: false,
    isBlock: false,
    type: 'text',
    size: 'normal',
};
