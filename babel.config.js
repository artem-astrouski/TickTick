module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      // This needs to be mirrored in tsconfig.json
      {
        root: ['./src'],
        alias: { src: './src' },
      },
    ],
  ],
};
