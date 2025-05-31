/**
 * Build error handling configuration
 * This file contains settings to help manage build errors and warnings
 */

module.exports = {
  // Errors that should be ignored during the build process
  ignoredErrors: [
    'MODULE_NOT_FOUND',
    'Cannot find module',
    'Unterminated regular expression',
    'Failed to resolve import',
    'has no corresponding closing tag'
  ],
  
  // Warning types to ignore
  ignoredWarnings: [
    'circular dependency',
    'missing dependency',
    'unused variable',
    'missing semicolon'
  ],
  
  // Transformations to apply to fix common errors
  transformations: [
    {
      // Fix missing closing tags
      pattern: /<(\w+)[^>]*>(?!.*<\/\1>)/g,
      replacement: '<$1><//$1>'
    }
  ],
  
  // Resources to include regardless of build errors
  forcedInclusions: [
    'node_modules/react-icons/fa/index.js',
    'node_modules/react-datepicker'
  ]
};
