const { createWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createWebpackConfigAsync(env, argv);
  return config;
};