import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import uglify from 'rollup-plugin-uglify'; // Transpile/polyfill with reasonable browser support
import { minify } from 'uglify-es';

export default {
    input: 'src/index.js', // Path relative to package.json
    output: {
        name: 'inputkeyboard',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble(), // Transpile to ES5
        uglify.uglify({},minify),
    ],
};
