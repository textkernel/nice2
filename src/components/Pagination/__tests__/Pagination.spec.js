import React from 'react';
import toJson from 'enzyme-to-json';
import Pagination from '../Pagination';

describe('<Pagination> that renders a pagination component', () => {
    it('should render a default pagination', () => {
        const onClick = jest.fn();
        const wrapper = shallow(
            <Pagination
                maxPages={5}
                totalPages={20}
                onClick={onClick}
                prevLabel="Previous"
                nextLabel="Next"
                lastLabel="Last"
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();

        const e = {
            target: {
                dataset: {
                    page: 3
                }
            }
        };

        wrapper.find('[data-page=3]').simulate('click', e);

        expect(onClick).toHaveBeenCalledWith(e, 3);

        wrapper.setProps({
            currentPage: 5
        });

        expect(
            wrapper
                .find('Button')
                .first()
                .prop('data-page')
        ).toBe(4);

        wrapper.setProps({
            align: 'left'
        });

        expect(wrapper.hasClass('Pagination--align_left')).toBe(true);

        wrapper.setProps({
            align: 'right'
        });

        expect(wrapper.hasClass('Pagination--align_right')).toBe(true);
    });
});
