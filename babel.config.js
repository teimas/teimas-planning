module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
            '@app': './app',
            '@components': './components',
            '@constants': './constants',
            '@hooks': './hooks',
            '@assets': './assets',
            '@src': './src',
            '@types': './src/types'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ]
    ]
  };
}; 