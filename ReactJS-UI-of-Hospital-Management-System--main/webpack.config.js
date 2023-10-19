const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Archivo de entrada principal de tu aplicación
  output: {
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida para los archivos generados
    filename: 'bundle.js', // Nombre del archivo de salida
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Archivos JavaScript o JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Utiliza Babel para transpilar
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Presets de Babel
          },
        },
      },
      {
        test: /\.css$/, // Archivos CSS
        use: ['style-loader', 'css-loader'], // Utiliza style-loader y css-loader
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Limpia la carpeta de salida antes de generar nuevos archivos
    new HtmlWebpackPlugin({
      template: './public/index.html', // Plantilla HTML
      filename: 'index.html', // Nombre del archivo HTML generado
    }),
  ],
  devServer: {
    contentBase: './dist', // Carpeta base para servir archivos
    port: 3000, // Puerto del servidor de desarrollo
    hot: true, // Habilita la recarga en caliente
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Extensiones de archivo que se pueden importar sin especificar la extensión
    fallback: {
      "url": require.resolve("url/"),
      "crypto": require.resolve("crypto-browserify")
    }
  }
};
