const plugin = require('tailwindcss/plugin')
const selectorParser = require('postcss-selector-parser');
const _ = require('lodash')

module.exports = {
  purge: {
    content: [
      './*.html',
    ],
    options: {
      keyframes: true,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      width: ['aos', 'disabled'],
    },
  },
  plugins: [
    plugin(function({
      addUtilities,
      addVariant,
      e,
      config,
      theme,
      variants,
      target
    }) {
      // aos variant
      addVariant('aos', ({ modifySelectors, separator }) => {
        modifySelectors(({ selector }) => {
          return selectorParser(selectors => {
            const clonedSelectors = selectors.clone();
            [selectors, clonedSelectors].forEach((sel, i) => {
              sel.walkClasses(classNode => {
                classNode.value = `aos${separator}${classNode.value}`;
                classNode.parent.insertBefore(classNode, selectorParser().astSync(`.aos${i === 0 ? '' : ' '}`));
              });
            });
            selectors.append(clonedSelectors);
          }).processSync(selector);
        });
      });

      addVariant('disabled', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`
        })
      })
    }),
  ]
}

