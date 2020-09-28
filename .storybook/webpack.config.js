const path = require('path');
const { getRules, SOURCE_PATH, STORIES_PATH } = require('../scripts/build/webpack.config');
const devConfig = require('../scripts/build/webpack.dev.config');

const rules = getRules('dev');

const tsCommonJSRule = {
    test: /\.(ts|tsx)$/,
    include: [SOURCE_PATH, STORIES_PATH],
    use: [
        {
            loader: 'ts-loader',
            options: {
                compilerOptions: {
                    module: 'commonjs',
                },
            },
        },
    ],
};

const tsDocRule = {
    test: /\.tsx$/,
    include: [SOURCE_PATH],
    use: [
        {
            loader: 'react-docgen-typescript-loader',
            options: {
                // Including prop that just was defined directly except extended props
                propFilter: propsInfo => {
                    if (propsInfo.parent) {
                        return !propsInfo.parent.fileName.includes('node_modules');
                    }
                    
                    return true;
                },
            },
        },
    ],
};

module.exports = ({ config: storybookBaseConfig }) => {
    // Resolve OneUI package
    storybookBaseConfig.resolve.alias['@textkernel/oneui'] = path.resolve(__dirname, '../dist/oneui');

    // Merge loader rules config
    storybookBaseConfig.module.rules = [
        ...storybookBaseConfig.module.rules,
        rules.js,
        tsCommonJSRule, // Storybook supports only commonJS module
        tsDocRule, // Generate docgen information from Typescript React components
        rules.scss,
    ];

    // Merge resolvers config
    storybookBaseConfig.resolve.modules = [
        ...storybookBaseConfig.resolve.modules,
        ...devConfig.resolve.modules,
    ];

    // Merge resolver extensions config
    storybookBaseConfig.resolve.extensions = [
        ...storybookBaseConfig.resolve.extensions,
        ...devConfig.resolve.extensions,
    ];

    // Return the altered config
    return storybookBaseConfig;
};
