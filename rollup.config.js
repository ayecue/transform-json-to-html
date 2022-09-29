const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const less = require('rollup-plugin-less');

const options = {
    input: 'dist/index.js',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/index.esm.js',
            format: 'es'
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'transformJSONToHTML'
        }
    ],
    plugins: [
        less({
            output: 'dist/index.css'
        }),
        commonjs(),
        babel({
            presets: ['@babel/preset-env', {
                exclude: "transform-typeof-symbol"
            }]
        }),
        terser()
    ]
};

export default options;