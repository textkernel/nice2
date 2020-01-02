import React from 'react';
import toJson from 'enzyme-to-json';
import Footer from '../Footer';

describe('Footer component that renders a copyright text on the left and optional children on the right side', () => {
    it('should render correctly with TK copyright', () => {
        const wrapper = mount(<Footer year={2019}>This is a placeholder for children</Footer>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correctly with custom copyright', () => {
        const wrapper = mount(
            <Footer copyright="my special copyright">This is a placeholder for children</Footer>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
