## Live Demo

- Click [here](https://lagooneration.netlify.app/) to view the live demo.

# Neuro-steered headphones

This is a concept for EEG integrated Neuro-steered headphones that utilizes Auditory Attention Detection (AAD) to enhance the listening experience. The project is built using Three.js and Webpack.

## How To Use:

To get started, follow these simple steps:

### Prerequisites

Make sure you have node `16.0.0` or higher and npm `9.0.0` or higher installed.

### Setup

- With git, clone the code to your machine, or download a ZIP of all the files directly.

```
git clone https://github.com/lagooneration/lagooneration.github.io.git
```

- Once the files are on your machine, open the **Next-Internalization** folder in [Visual Studio Code](https://code.visualstudio.com/download).

```
cd Neurophones && code .
```

## Install

- After opening the files in Visual Studio Code, open the **VS Code** integrated terminal and run the following commands:

```
npm install
```

This will install all the packages and dependencies used in the project.

## Usage

- Run the following command to start a local server:

```
npm run dev
```

This will open up the project on a browser on `http://localhost:8080` / `http://192.168.0.12:8080`

## Build

- To create a production build:

```
npm run build
```

## Built With

- Three.js
- JavaScript
- HTML
- CSS
- GLSL
- Webpack

## Resources

- [adrianhajdin concept](https://github.com/adrianhajdin/iphone/tree/main)
- Brain Shader by [Laniman](https://github.com/Laniman/threejs-brain-animation)
- Neural Interface by [OpenTechLab](https://www.printables.com/@OpenTechLab_85377)
- [Arizona State University Research](https://www.youtube.com/watch?v=00WOao4kpwM)

## Authors

👤 **Puneet Lagoo**

- GitHub: [@lagooneration](https://github.com/lagooneration)
- LinkedIn: [Puneet Lagoo](https://www.linkedin.com/in/lagooneration)


## Expanding the ESLint configuration (Production Ready)

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})

## Feedback and Contributions

If you have any feedback, suggestions, or would like to contribute to this project, your involvement is highly valued. Feel free to open an [issue](../../issues/) or submit a pull request with your ideas and enhancements.

Happy coding and showcasing!

## Show your support

Give a ⭐️ if you like this project!


```
