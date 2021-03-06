import * as React from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowDown, IoMdClose } from 'react-icons/io';
import { bem } from '../../../utils';
import { ENTER_KEY } from '../../../constants';
import styles from './PillButton.scss';

const { block, elem } = bem('PillButton', styles);

export const PillButton = React.forwardRef((props, ref) => {
    const { isOpen, isContentDefault, toggleDropdown, onClear, name, content, ...rest } = props;
    const isActive = !!content;
    const propsForBem = { ...props, isActive };

    const labelRef = React.createRef();
    const pillRef = React.createRef();
    const [pillMinWidth, setPillMinWidth] = React.useState(0);

    // make sure label is not longer then pill
    React.useLayoutEffect(() => {
        if (isActive) {
            const labelEl = labelRef.current;
            const { width: labelWidth } = labelEl.getBoundingClientRect();
            const pillEl = pillRef.current;
            const { width: pillWidth } = pillEl.getBoundingClientRect();

            if (labelWidth > pillWidth) {
                setPillMinWidth(labelWidth);
            }
        }
    }, [isActive, labelRef, pillMinWidth, pillRef]);

    let buttonIcon = <IoIosArrowDown {...elem('arrowIcon', propsForBem)} />;
    let isButtonClickable = false;

    if (isActive && !isOpen && !isContentDefault) {
        buttonIcon = <IoMdClose />;
        isButtonClickable = true;
    }

    const buttonClick = isButtonClickable
        ? (e) => {
              e.stopPropagation();
              e.preventDefault();
              onClear();
          }
        : undefined;

    const handleKeyDownOnButton = isButtonClickable
        ? (e) => {
              if (e.key === ENTER_KEY) {
                  buttonClick(e);
              }
          }
        : undefined;

    const handleKeyDownOnPill = (e) => {
        if (e.key === ENTER_KEY) {
            e.preventDefault();
            toggleDropdown();
        }
    };

    return (
        <div ref={ref} {...rest} {...block(propsForBem)}>
            <div ref={labelRef} {...elem('label', propsForBem)}>
                {isActive && name}
            </div>
            <div
                ref={pillRef}
                {...elem('pill', propsForBem)}
                style={pillMinWidth ? { minWidth: pillMinWidth } : undefined}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDownOnPill}
                tabIndex="0"
                role="button"
            >
                <span {...elem('pillLabel', propsForBem)}>{content || name}</span>
                <button
                    type="button"
                    {...elem('button', propsForBem)}
                    onClick={buttonClick}
                    onKeyDown={handleKeyDownOnButton}
                >
                    {buttonIcon}
                </button>
            </div>
        </div>
    );
});

PillButton.displayName = 'PillButton';

PillButton.propTypes = {
    /** Wether the dropdown is open or closed */
    isOpen: PropTypes.bool,
    /** If pill is in default state, meaning it has content but cannot be reset. */
    isContentDefault: PropTypes.bool,
    /** a function to be called when dropdown should be toggled */
    toggleDropdown: PropTypes.func.isRequired,
    /** a function to be called to clear the pill/filter content */
    onClear: PropTypes.func.isRequired,
    /** name describing the pill/filter */
    name: PropTypes.string.isRequired,
    /** label describing the content of an active filter/pill */
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

PillButton.defaultProps = {
    isOpen: false,
    isContentDefault: false,
    content: null,
};
