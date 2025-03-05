import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import appleTouchIcon from '../assets/apple-touch-icon.png';
import icon from '../assets/icon.png'
import '../assets/index.css';



export default () => {
  const action = useSelector((state) => state.actions);
  const document = action.get("document");

  return (
    <div>
      <Helmet>
        {/* Cambiar el título */}
        <title>{document.head.title}</title>


        {/* Cambiar el icono de la pestaña */}
        <link rel="icon" href={icon}/>

        {/* Definir el color del tema */}
        <meta name="theme-color" content="#000000" />

        {/* Agregar una descripción */}
        <meta name="description" content={document.head.description} />

        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href={icon} />

      </Helmet>
    </div>
  );
};

