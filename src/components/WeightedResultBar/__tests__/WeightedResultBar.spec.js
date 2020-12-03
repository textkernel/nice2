import React from 'react';
import toJson from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';
import { WeightedResultBar } from '../WeightedResultBar';

jest.useFakeTimers();

describe('WeightedResultBar', () => {
    it('should render correctly', () => {
        const wrapper = mount(
            <WeightedResultBar percentage={67} count={123}>
                Result
            </WeightedResultBar>
        );
        act(() => {
            jest.runAllTimers();
            wrapper.update();
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
