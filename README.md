# React + TypeScript + Vite
Proyecto Travel Agency :
La plataforma está diseñada para facilitar la búsqueda y compra de paquetes turísticos para los clientes y proporcionar una gestión eficiente de la empresa a través de un panel administrativo.

🔹 Página principal (Home - Cliente)
* Los clientes pueden explorar los paquetes turísticos disponibles, que incluyen información sobre destinos, precios y servicios incluidos.
* Un buscador permite filtrar paquetes según destino, precio o fechas.
  
<img width="966" alt="Screenshot 2025-02-20 at 10 11 46" src="https://github.com/user-attachments/assets/fef21ff2-07df-4a41-9cfe-2985bbdaf095" />




🔹 Panel Administrativo (Solo para empleados)

 En este panel el usuario puede gestionar la plataforma con las siguientes funcionalidades:
 
 
📦 Crear y administrar paquetes turísticos (subir imágenes, precios y descripciones).

<img width="1279" alt="Screenshot 2025-02-20 at 10 10 06" src="https://github.com/user-attachments/assets/05931371-3f5c-4ff8-933e-4f96ac4a5ec7" />

🏞 Subir banners promocionales para la página principal.

<img width="1280" alt="Screenshot 2025-02-20 at 10 07 59" src="https://github.com/user-attachments/assets/5fcb6e52-3c3e-4e43-8422-4a47a8f3be99" />

💰 Registrar ingresos y gastos de la empresa y visualizar facturas de clientes y proveedores

<img width="1273" alt="Screenshot 2025-02-20 at 10 08 26" src="https://github.com/user-attachments/assets/1504e3fc-e621-4d46-9fea-1e47578d6b71" />


📊 Generar reportes financieros para el análisis del negocio.

<img width="1278" alt="Screenshot 2025-02-20 at 10 09 23" src="https://github.com/user-attachments/assets/10524cf7-d80d-41a2-b2e1-caeb94c12362" />

Tecnología
React, TypeScript, Vite, Material-UI, Styled Compoment y Amplify Hosting.




- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

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
```
