export const SUGGESTIONS = [
    { name: 'Sun' },
    { name: 'Moon' },
    { name: 'Mercury' },
    { name: 'Venus' },
    { name: 'Earth' },
    { name: 'Mars' },
    { name: 'Jupiter' },
    { name: 'Saturn' },
    { name: 'Neptun' },
];

export const COMPLEX_SUGGESTIONS = [
    { name: 'Sun', type: 'Star', count: 1234 },
    { name: 'Moon', type: 'Star', count: 1234 },
    { name: 'Mercury', type: 'Planet', count: 1234 },
    { name: 'Venus', type: 'Planet', count: 1234 },
    { name: 'Earth', type: 'Planet', count: 1234 },
    { name: 'Mars', type: 'Planet', count: 1234 },
    { name: 'Jupiter', type: 'Planet', count: 1234 },
    { name: 'Saturn', type: 'Planet', count: 1234 },
    { name: 'Neptun', type: 'Planet', count: 1234 },
];

export const SUGGESTION_TO_STRING = (item) => (item ? item.name : '');
