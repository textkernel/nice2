import * as React from 'react';
import { bem, scrollIntoViewIfNeeded } from '../../utils';
import { LIST_NAVIGATION_DIRECTIONS, ENTER_KEY } from '../../constants';
import styles from './List.scss';

interface Props extends React.HTMLAttributes<HTMLUListElement> {
    /** List items. They should be ListItem or li.
     * If you want to add an element that is not part of the list, but should be rendered within it
     * (e.g. an image to decorate the list) use `data-list-exception` as a prop to that child
     */
    children: React.ReactElement[] | null;
    /** Adds dividing lines between the list items */
    isDivided?: boolean;
    /** Defines if selection should be made on navigate */
    doSelectOnNavigate?: boolean;
    /** manage keyboard navigation externally */
    isControlledNavigation?: boolean;
    /** Ref to access the ul element */
    ref?: React.RefObject<HTMLUListElement>;
}

const { block, elem } = bem('List', styles);

export const NOT_LIST_CHILD = 'data-list-exception';
const NAVIGATION_STEP_VALUES = {
    [LIST_NAVIGATION_DIRECTIONS.UP]: -1,
    [LIST_NAVIGATION_DIRECTIONS.DOWN]: 1,
};

export const List = React.forwardRef<HTMLUListElement, Props>((props, ref) => {
    const { children, isDivided, doSelectOnNavigate, isControlledNavigation, ...rest } = props;

    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
    const [lastNavDirection, setLastNavDirection] = React.useState<'top' | 'bottom' | null>(null);
    const navigationElementRef = React.createRef();

    // set selectedIndex to first selectedItem that we can find
    React.useEffect(() => {
        if (!children) return;

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child.props[NOT_LIST_CHILD] && child.props.isSelected) {
                setSelectedIndex(i);
                break;
            }
        }
    }, [children]);

    // Scroll list if it's necessary to make the current item visible after keyboard navigation
    React.useLayoutEffect(() => {
        if (lastNavDirection) {
            scrollIntoViewIfNeeded(navigationElementRef.current, lastNavDirection);
        }
        setLastNavDirection(null);
    }, [navigationElementRef, lastNavDirection]);

    const getNextSelectedIndex = (keyCode) => {
        if (!children) {
            return -1;
        }

        const stepValue = NAVIGATION_STEP_VALUES[keyCode];
        const nextSelectedIndex = selectedIndex + stepValue;

        // Return 0 index if nextSelectedIndex has negative value or selectedIndex hasn't been updated before
        if (nextSelectedIndex < 0 || selectedIndex === -1) {
            return 0;
        }

        // Return last React.Children index if nextSelectedIndex is out of the right bound
        if (nextSelectedIndex >= children.length) {
            return children.length - 1;
        }

        // Return nextSelectedIndex without any changes for others cases
        return nextSelectedIndex;
    };

    const callOnClick = (index, e) => {
        if (!children) {
            return;
        }

        if (children[index] && children[index].props && children[index].props.onClick) {
            children[index].props.onClick(e);
        }
    };

    const handleKeyDown = (e) => {
        // Update selectedIndex with arrow navigation and make onNavigate function callback
        if (e.key === LIST_NAVIGATION_DIRECTIONS.UP || e.key === LIST_NAVIGATION_DIRECTIONS.DOWN) {
            const nextSelectedIndex = getNextSelectedIndex(e.key);

            if (selectedIndex !== nextSelectedIndex) {
                e.preventDefault();
                setSelectedIndex(nextSelectedIndex);

                const direction = e.key === LIST_NAVIGATION_DIRECTIONS.UP ? 'top' : 'bottom';
                setLastNavDirection(direction);

                if (doSelectOnNavigate) {
                    callOnClick(nextSelectedIndex, e);
                }
            }
        }

        if (e.key === ENTER_KEY) {
            callOnClick(selectedIndex, e);
        }
    };

    return isControlledNavigation ? (
        <ul {...rest} ref={ref} {...block(props)}>
            {React.Children.map(children, (child) => {
                if (child) {
                    return child.props[NOT_LIST_CHILD]
                        ? child
                        : React.cloneElement(
                              child,
                              elem('item', {
                                  ...props,
                                  elemClassName: child.props.className,
                              })
                          );
                }
                return null;
            })}
        </ul>
    ) : (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
        <ul {...rest} ref={ref} tabIndex="0" onKeyDown={handleKeyDown} {...block(props)}>
            {React.Children.map(children, (child, index) => {
                if (child) {
                    return child.props[NOT_LIST_CHILD]
                        ? child
                        : React.cloneElement(child, {
                              ...elem('item', {
                                  ...props,
                                  elemClassName: child.props.className,
                              }),
                              ref: index === selectedIndex ? navigationElementRef : null,
                              isHighlighted: index === selectedIndex,
                          });
                }
                return null;
            })}
        </ul>
    );
});

List.displayName = 'List';

List.propTypes = {};

List.defaultProps = {
    isDivided: false,
    doSelectOnNavigate: false,
    isControlledNavigation: false,
};
