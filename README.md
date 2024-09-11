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
6. Configura tu base de datos ejecutando el script de la base de datos `deser_el_camello_script_v1`. 

## Estructura del Proyecto
Listado de rutas de carpetas
El número de serie del volumen es 8A2E-349E
C:.
├───.github
│   └───workflows
├───diagramas
│   └───secuencia
│       ├───Estadisticas
│       ├───GestionCategorias
│       ├───GestionOfertasEmpleo
│       ├───GestionReportesEmpleo
│       └───GestionUsuarios
├───node_modules
│   ├───.bin
│   ├───abbrev
│   ├───abort-controller
│   │   └───dist
│   ├───accepts
│   ├───anymatch
│   ├───append-field
│   │   ├───lib
│   │   └───test
│   ├───array-buffer-byte-length
│   │   ├───.github
│   │   └───test
│   ├───array-flatten
│   ├───arraybuffer.prototype.slice
│   │   └───test
│   ├───asap
│   ├───available-typed-arrays
│   │   ├───.github
│   │   └───test
│   ├───balanced-match
│   │   └───.github
│   ├───base64-js
│   ├───basic-auth
│   │   └───node_modules
│   │       └───safe-buffer
│   ├───bcryptjs
│   │   ├───.vscode
│   │   ├───bin
│   │   ├───dist
│   │   ├───externs
│   │   ├───scripts
│   │   ├───src
│   │   │   └───bcrypt
│   │   │       ├───prng
│   │   │       └───util
│   │   └───tests
│   ├───bignumber.js
│   │   └───doc
│   ├───binary-extensions
│   ├───body-parser
│   │   └───lib
│   │       └───types
│   ├───brace-expansion
│   ├───braces
│   │   └───lib
│   ├───buffer
│   ├───buffer-equal-constant-time
│   ├───buffer-from
│   ├───busboy
│   │   ├───.github
│   │   │   └───workflows
│   │   ├───bench
│   │   ├───lib
│   │   │   └───types
│   │   └───test
│   ├───bytes
│   ├───call-bind
│   │   ├───.github
│   │   └───test
│   ├───chokidar
│   │   ├───lib
│   │   └───types
│   ├───ci
│   │   └───dist
│   ├───concat-map
│   │   ├───example
│   │   └───test
│   ├───concat-stream
│   ├───connect
│   │   └───node_modules
│   ├───content-disposition
│   ├───content-type
│   ├───cookie
│   ├───cookie-signature
│   ├───core-util-is
│   │   └───lib
│   ├───debug
│   │   └───src
│   ├───define-data-property
│   │   ├───.github
│   │   └───test
│   ├───define-properties
│   │   └───.github
│   ├───depd
│   │   └───lib
│   │       └───browser
│   ├───destroy
│   ├───dezalgo
│   ├───dotenv
│   │   └───lib
│   ├───ecdsa-sig-formatter
│   │   └───src
│   ├───ee-first
│   ├───encodeurl
│   ├───es-abstract
│   │   ├───2015
│   │   ├───2016
│   │   ├───2017
│   │   ├───2018
│   │   ├───2019
│   │   ├───2020
│   │   │   ├───BigInt
│   │   │   └───Number
│   │   ├───2021
│   │   │   ├───BigInt
│   │   │   └───Number
│   │   ├───2022
│   │   │   ├───BigInt
│   │   │   └───Number
│   │   ├───2023
│   │   │   ├───BigInt
│   │   │   └───Number
│   │   ├───5
│   │   ├───helpers
│   │   └───operations
│   ├───es-errors
│   │   ├───.github
│   │   └───test
│   ├───es-set-tostringtag
│   │   └───test
│   ├───es-to-primitive
│   │   ├───.github
│   │   ├───helpers
│   │   └───test
│   ├───escape-html
│   ├───etag
│   ├───event-target-shim
│   │   └───dist
│   ├───events
│   │   ├───.github
│   │   └───tests
│   ├───express
│   │   ├───lib
│   │   │   ├───middleware
│   │   │   └───router
│   │   └───node_modules
│   │       ├───body-parser
│   │       │   └───lib
│   │       │       └───types
│   │       ├───finalhandler
│   │       └───raw-body
│   ├───express-validator
│   │   ├───check
│   │   ├───declarations
│   │   ├───filter
│   │   └───src
│   │       ├───chain
│   │       ├───context-items
│   │       └───middlewares
│   ├───fill-range
│   ├───finalhandler
│   │   └───node_modules
│   │       ├───on-finished
│   │       └───statuses
│   ├───for-each
│   │   └───test
│   ├───formidable
│   │   └───src
│   │       ├───parsers
│   │       └───plugins
│   ├───forwarded
│   ├───fresh
│   ├───function-bind
│   │   ├───.github
│   │   └───test
│   ├───function.prototype.name
│   │   ├───.github
│   │   ├───helpers
│   │   └───test
│   ├───functions-have-names
│   │   ├───.github
│   │   └───test
│   ├───get-intrinsic
│   │   ├───.github
│   │   └───test
│   ├───get-symbol-description
│   │   ├───.github
│   │   └───test
│   ├───glob-parent
│   ├───globalthis
│   │   └───test
│   ├───gopd
│   │   ├───.github
│   │   └───test
│   ├───has-bigints
│   │   ├───.github
│   │   └───test
│   ├───has-flag
│   ├───has-property-descriptors
│   │   ├───.github
│   │   └───test
│   ├───has-proto
│   │   ├───.github
│   │   └───test
│   ├───has-symbols
│   │   ├───.github
│   │   └───test
│   │       └───shams
│   ├───has-tostringtag
│   │   ├───.github
│   │   └───test
│   │       └───shams
│   ├───hasown
│   │   └───.github
│   ├───hexoid
│   │   └───dist
│   ├───http-errors
│   ├───iconv-lite
│   │   ├───encodings
│   │   │   └───tables
│   │   └───lib
│   ├───ieee754
│   ├───ignore-by-default
│   ├───inherits
│   ├───internal-slot
│   │   ├───.github
│   │   └───test
│   ├───ipaddr.js
│   │   └───lib
│   ├───is-array-buffer
│   │   ├───.github
│   │   └───test
│   ├───is-bigint
│   │   ├───.github
│   │   └───test
│   ├───is-binary-path
│   ├───is-boolean-object
│   │   ├───.github
│   │   └───test
│   ├───is-callable
│   │   ├───.github
│   │   └───test
│   ├───is-date-object
│   │   ├───.github
│   │   └───test
│   ├───is-extglob
│   ├───is-glob
│   ├───is-negative-zero
│   │   ├───.github
│   │   └───test
│   ├───is-number
│   ├───is-number-object
│   │   ├───.github
│   │   └───test
│   ├───is-regex
│   │   └───test
│   ├───is-shared-array-buffer
│   │   ├───.github
│   │   └───test
│   ├───is-string
│   │   ├───.github
│   │   └───test
│   ├───is-symbol
│   │   ├───.github
│   │   └───test
│   ├───is-typed-array
│   │   ├───.github
│   │   └───test
│   ├───is-weakref
│   │   ├───.github
│   │   └───test
│   ├───isarray
│   ├───jsonwebtoken
│   │   ├───lib
│   │   └───node_modules
│   │       └───ms
│   ├───jwa
│   ├───jws
│   │   └───lib
│   ├───lodash
│   │   └───fp
│   ├───lodash.includes
│   ├───lodash.isboolean
│   ├───lodash.isinteger
│   ├───lodash.isnumber
│   ├───lodash.isplainobject
│   ├───lodash.isstring
│   ├───lodash.once
│   ├───media-typer
│   ├───merge-descriptors
│   ├───methods
│   ├───mime
│   │   └───src
│   ├───mime-db
│   ├───mime-types
│   ├───minimatch
│   ├───minimist
│   │   ├───.github
│   │   ├───example
│   │   └───test
│   ├───mkdirp
│   │   └───bin
│   ├───morgan
│   │   └───node_modules
│   │       └───on-finished
│   ├───ms
│   ├───multer
│   │   ├───lib
│   │   └───storage
│   ├───mysql
│   │   ├───lib
│   │   │   └───protocol
│   │   │       ├───constants
│   │   │       ├───packets
│   │   │       └───sequences
│   │   └───node_modules
│   │       ├───readable-stream
│   │       │   ├───doc
│   │       │   │   └───wg-meetings
│   │       │   └───lib
│   │       │       └───internal
│   │       │           └───streams
│   │       └───safe-buffer
│   ├───negotiator
│   │   └───lib
│   ├───nodemon
│   │   ├───bin
│   │   ├───doc
│   │   │   └───cli
│   │   ├───lib
│   │   │   ├───cli
│   │   │   ├───config
│   │   │   ├───help
│   │   │   ├───monitor
│   │   │   ├───rules
│   │   │   └───utils
│   │   └───node_modules
│   │       ├───debug
│   │       │   └───src
│   │       └───ms
│   ├───nopt
│   │   ├───bin
│   │   ├───examples
│   │   └───lib
│   ├───normalize-path
│   ├───object-assign
│   ├───object-inspect
│   │   ├───.github
│   │   ├───example
│   │   └───test
│   │       └───browser
│   ├───object-keys
│   │   └───test
│   ├───object.assign
│   │   ├───.github
│   │   ├───dist
│   │   └───test
│   ├───on-finished
│   ├───on-headers
│   ├───once
│   ├───parseurl
│   ├───path-to-regexp
│   ├───picomatch
│   │   └───lib
│   ├───process
│   ├───process-nextick-args
│   ├───proxy-addr
│   ├───pstree.remy
│   │   ├───lib
│   │   └───tests
│   │       └───fixtures
│   ├───qs
│   │   ├───.github
│   │   ├───dist
│   │   ├───lib
│   │   └───test
│   ├───range-parser
│   ├───raw-body
│   ├───readable-stream
│   │   ├───doc
│   │   │   └───wg-meetings
│   │   ├───lib
│   │   │   └───internal
│   │   │       └───streams
│   │   └───node_modules
│   │       └───safe-buffer
│   ├───readdirp
│   ├───regexp.prototype.flags
│   │   └───test
│   ├───safe-array-concat
│   │   ├───.github
│   │   ├───node_modules
│   │   │   └───isarray
│   │   └───test
│   ├───safe-buffer
│   ├───safe-regex-test
│   │   ├───.github
│   │   └───test
│   ├───safer-buffer
│   ├───semver
│   │   └───bin
│   ├───send
│   │   └───node_modules
│   │       └───ms
│   ├───serve-static
│   ├───set-function-length
│   │   └───.github
│   ├───set-function-name
│   │   └───.github
│   ├───setprototypeof
│   │   └───test
│   ├───side-channel
│   │   ├───.github
│   │   └───test
│   ├───simple-update-notifier
│   │   ├───build
│   │   ├───node_modules
│   │   │   ├───.bin
│   │   │   └───semver
│   │   │       ├───bin
│   │   │       ├───classes
│   │   │       ├───functions
│   │   │       ├───internal
│   │   │       └───ranges
│   │   └───src
│   ├───sqlstring
│   │   └───lib
│   ├───statuses
│   ├───str
│   │   └───types
│   ├───streamsearch
│   │   ├───.github
│   │   │   └───workflows
│   │   ├───lib
│   │   └───test
│   ├───string.prototype.replaceall
│   │   ├───.github
│   │   └───test
│   ├───string.prototype.trim
│   │   └───test
│   ├───string.prototype.trimend
│   │   └───test
│   ├───string.prototype.trimstart
│   │   └───test
│   ├───string_decoder
│   │   ├───lib
│   │   └───node_modules
│   │       └───safe-buffer
│   ├───supports-color
│   ├───test
│   │   ├───.github
│   │   │   └───workflows
│   │   ├───bin
│   │   ├───lib
│   │   │   ├───internal
│   │   │   │   ├───console
│   │   │   │   ├───main
│   │   │   │   ├───per_context
│   │   │   │   ├───process
│   │   │   │   ├───test_runner
│   │   │   │   │   └───reporter
│   │   │   │   └───util
│   │   │   └───timers
│   │   ├───node_modules
│   │   │   ├───readable-stream
│   │   │   │   └───lib
│   │   │   │       ├───internal
│   │   │   │       │   └───streams
│   │   │   │       ├───ours
│   │   │   │       └───stream
│   │   │   └───string_decoder
│   │   │       └───lib
│   │   └───test
│   │       ├───common
│   │       ├───fixtures
│   │       │   ├───node-core-test
│   │       │   └───test-runner
│   │       │       ├───custom_reporters
│   │       │       ├───node_modules
│   │       │       ├───subdir
│   │       │       └───test
│   │       ├───message
│   │       └───parallel
│   ├───to-regex-range
│   ├───toidentifier
│   ├───touch
│   │   └───bin
│   ├───type-is
│   ├───typed-array-buffer
│   │   ├───.github
│   │   └───test
│   ├───typed-array-byte-length
│   │   ├───.github
│   │   └───test
│   ├───typed-array-byte-offset
│   │   ├───.github
│   │   └───test
│   ├───typed-array-length
│   │   ├───.github
│   │   └───test
│   ├───typedarray
│   │   ├───example
│   │   └───test
│   │       └───server
│   ├───unbox-primitive
│   │   ├───.github
│   │   └───test
│   ├───undefsafe
│   │   ├───.github
│   │   │   └───workflows
│   │   └───lib
│   ├───unpipe
│   ├───util-deprecate
│   ├───utils-merge
│   ├───validator
│   │   ├───es
│   │   │   └───lib
│   │   │       └───util
│   │   └───lib
│   │       └───util
│   ├───vary
│   ├───which-boxed-primitive
│   │   ├───.github
│   │   └───test
│   ├───which-typed-array
│   │   ├───.github
│   │   └───test
│   ├───wrappy
│   └───xtend
├───out
│   └───diagramas
│       └───secuencia
│           ├───Estadisticas
│           │   └───GeneracionDeReportesEstadisticos
│           ├───GestionCategorias
│           │   ├───ConsultarCategorias
│           │   ├───ModificarCategoria
│           │   └───RegistrarCategoria
│           ├───GestionOfertasEmpleo
│           │   ├───ConsultarOfertaEmpleo
│           │   ├───ConsultarSolicitudes
│           │   └───ModificarOfertaEmpleo
│           ├───GestionReportesEmpleo
│           │   └───ConsultarEmpleosReportados
│           ├───GestionUsuarios
│           │   ├───ConsultarUsuarios
│           │   ├───RegistrarAspirante
│           │   ├───RegistrarDemandante
│           │   └───RegistrarEmpleador
│           └───RegistrarOfertaEmpleo
├───settings
├───src
│   ├───componentes
│   │   ├───AccesoSistema
│   │   │   ├───data
│   │   │   └───modelo
│   │   ├───Estadisticas
│   │   │   ├───data
│   │   │   └───dataType
│   │   ├───GestionCategoriasEmpleo
│   │   │   ├───data
│   │   │   └───modelo
│   │   ├───GestionContratacionesEmpleo
│   │   │   ├───data
│   │   │   ├───dataType
│   │   │   └───modelo
│   │   ├───GestionOfertasEmpleo
│   │   │   ├───data
│   │   │   ├───datatype
│   │   │   └───modelo
│   │   ├───GestionReportesEmpleo
│   │   │   ├───data
│   │   │   └───modelo
│   │   ├───GestionServicios
│   │   │   ├───data
│   │   │   └───modelo
│   │   ├───GestionSolcitudesEmpleo
│   │   │   └───data
│   │   ├───GestionUsuarios
│   │   │   ├───data
│   │   │   └───modelo
│   │   └───Mensajeria
│   │       ├───data
│   │       ├───datatype
│   │       └───modelo
│   ├───paths
│   └───utils
├───Test
└───utils
    ├───certificates
    └───validaciones

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
    
