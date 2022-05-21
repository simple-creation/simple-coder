// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'nosources-source-map',
  define: {
    API_URL: 'http://localhost:5389', // API地址
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
});
