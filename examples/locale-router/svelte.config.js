/* eslint-disable */
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    trailingSlash: 'never',
  },
};

export default config;
