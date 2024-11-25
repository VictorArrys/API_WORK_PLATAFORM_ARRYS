# Proyecto: API Work Plataform

<p align="center">
  <img src="https://miro.medium.com/v2/resize:fit:1055/1*dZA2XUPPibLK59U4-PK82Q.png" width="400">
</p>

## Descripción
API Work Plataform es un sistema de gestión de funciones laborales desarrollado en Node.js, diseñado para facilitar la interacción y administración eficiente entre clientes ricos y API REST. Con un enfoque en la optimización del desarrollo backend, el sistema utiliza tecnologías avanzadas como Node.js y MySQL.

## Tecnologías Utilizadas
- **Node.js**
- **MySQL**
- ...

## Instalación
1. Clona el repositorio: `git clone https://tu-repositorio.git`
2. Asegúrate de tener instalado Node.js y npm: [Descargar e instalar Node.js](https://nodejs.org/)
3. Instala las dependencias: `npm install`
4. Anexa en archivo `.env` en la raíz del proyecto con las variables de entorno necesarias (ver sección Configuración del entorno de desarrollo).
5.  Si usas MySQL localmente, instala MySQL siguiendo los pasos [aquí](https://dev.mysql.com/downloads/mysql/).
6. Configura tu base de datos ejecutando el script de la base de datos `deser_el_camello_script_v1` finalmente ingresa los valores de tu usuario en el .env para poder usarlo. 

## Estructura del Proyecto
Listado de rutas de carpetas


## Configuración del entorno de desarrollo (Favor de solicitar por correo los archivos .env y scripts)
1. Solicita el archivo `.env` en la raíz del proyecto que contará con las credenciales de la BD, entre otros detalles necesarios.
2. Ejecutar Scripts en MySQL:
  2.1. Desde MySQL Workbench:
    Abre MySQL Workbench.
    Conéctate a tu servidor MySQL usando la contraseña que configuraste durante la instalación.
    En el panel izquierdo, selecciona la base de datos donde deseas ejecutar el script.
    Haz clic en la pestaña "SQL Editor" en la parte superior.
    Abre tu script SQL en un editor de texto.
    Copia y pega el contenido del script en el SQL Editor.
    Ejecuta el script haciendo clic en el ícono de rayo o presionando Ctrl + Enter.

  2.2. Desde la Consola de Comandos:
    Abre una consola de comandos (cmd) o terminal.
    Navega al directorio donde tienes el script SQL.
    Usa el comando mysql para ejecutar el script:
    
      mysql -u tu_usuario -p tu_base_de_datos < nombre_del_script.sql

      Reemplaza tu_usuario con tu nombre de usuario de MySQL.
      Reemplaza tu_base_de_datos con el nombre de la base de datos.
      nombre_del_script.sql debe ser reemplazado con el nombre de tu script SQL.

3. Estos pasos te permitirán ejecutar tus scripts SQL en MySQL. Asegúrate de tener permisos adecuados y que tu usuario tenga acceso a la base de datos que estás utilizando. Si encuentras algún problema específico, házmelo saber para proporcionarte asistencia adicional.

## Contribución
¡Gracias por considerar contribuir! Detalles sobre cómo los desarrolladores pueden contribuir al proyecto.

## Contacto
Encargado del Proyecto: Víctor Arrys
Correo Electrónico: vctmanuel.arrys@gmail.com

## Estado del Proyecto
En preproducción.

## Documentación
Encuentra más detalles en nuestra [documentación](https://victor-manuel-arredondo-reyes.atlassian.net/l/cp/dNLAXB2h).

## Commits estructura
Cada mensaje de commit sigue el siguiente formato estructurado:
  "asunto": "<tipo>",
  "ubicacion": "<ruta o ubicacion>",
  "detalles": "<informacion detallada>",
  "adicional": "<mensaje adicional opcional>"

  1. Instrucciones Detalladas:
    - Tipo (obligatorio):
        Puede ser uno de los siguientes:
            "fix": Para corrección de errores.
            "feat": Para nuevas funcionalidades.
            "chore": Para tareas de mantenimiento.
            "refactor": Para cambios en la estructura del código.
            "update": Para actualizaciones de dependencias/librerías/archivos.
    - Ubicación (obligatorio):
        Especifica dónde se realizó el cambio. Puede ser una ruta, configuración, componente, modelo, data, etc.
    - Detalles (obligatorio):
        Proporciona información adicional sobre el cambio. Incluye detalles específicos sobre componentes, modelos o archivos afectados.
    - Mensaje Adicional (opcional):
        Puede incluir información adicional que ayude a comprender el cambio. Por ejemplo, explicaciones detalladas, enlaces a documentación, etc.
  
  2. Ejemplos:
    - Corrección de un Error:
      "asunto": "fix",
      "ubicacion": "src/componentes",
      "detalles": "soluciona error de renderizado en ComponenteX"
    - Nueva Funcionalidad:
      "asunto": "feat",
      "ubicacion": "src/funcionalidades",
      "detalles": "agrega funcionalidad de autenticación de usuarios"
    - Actualización de Librerías:
      "asunto": "update",
      "ubicacion": "package.json",
      "detalles": "actualiza la versión de Express a 4.17.1"
    - Refactorización:
      "asunto": "refactor",
      "ubicacion": "src/utils",
      "detalles": "reorganiza la lógica de manejo de archivos"
    - Tarea de Mantenimiento:
      "asunto": "chore",
      "ubicacion": "build",
      "detalles": "actualiza configuración de Webpack"
    
