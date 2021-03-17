# app_heroku

Pasos para subir la aplicación de django a heroku:

Primero se crea la carpeta estática en el directorio raíz (en este caso dentro de la carpeta parking): mkdir static
Luego se hace (https://stackoverflow.com/questions/53694341/heroku-django-deploy-why-am-i-getting-an-error-500-with-successful-deploy-and-s): python manage.py collectstatic
Luego se actualiza GitHub (ver repositorio https://github.com/roggerfq/mvp_deepParkingUser): 
	git add -A
	git commit -m "Added files and changes required for deployment to heroku9"
	git push origin HEAD:main
Luego se sube a heroku siguiendo estos pasos: 
   heroku config:set DISABLE_COLLECTSTATIC=1
   git push heroku main



#funcionamiento actual

Existen tres tipos de usuarios:

Parking lot user: es el usuario encargado de registrar los parqueaderos, este usuario debe aceder a la apliccacion desplegada en el siguiente link para registrarse y loguearse:
https://whispering-garden-05503.herokuapp.com/

worker user: este usuario debe logearse como  "deepvision" en el link:

https://whispering-garden-05503.herokuapp.com/

Esto abrir'a la pagina de administrador.

map user: este es el usuario final, que debe acceder a la siguiente pagina:

https://whispering-garden-05503.herokuapp.com/users/map

despues de acceder a esta pagina el usuario será direccionado a la pagina generada por ngrok.


Funcionamiento y características:

Inicialmente de debe acceder a la carpeta del servidor de deepvision: 

/home/deepvision/libraries/test_temporal/flask_sockets

Luego activar el entorno virtual e inicial la aplicacion: 

python application.py

El paso anterior activar'a la aplicacion localmente, para exportarla a la web se debe ir a la carpeta:

/home/deepvision/libraries/ngrok

y exportar el puerto correspondiente:

./ngrok http 127.0.0.1:5000

Despues de el anterior paso se debe accdeder a:

https://whispering-garden-05503.herokuapp.com/ 

y logearse como "deepvision". Esto cargar'a la pagina de administrador. En la pagina de administrador dirigase a la tabla Settings y establesca la variable url_geo_server con la url generada por ngrok agregando s a http (no [poner / al final de la URL). Luego dirigase a la pagina:

https://whispering-garden-05503.herokuapp.com/users/worker/

Esto abrir'a una pagina con dos botones que permiten iniciar o detener el proceso encargado de ejecutar la red convolucional en el localhost. 

Luego de lo anterior funcionamiento esperado de la aplicacion es el siguiente:

Despues de dar click al boton Start worker en la pagina del usuario worker este accedera por medio de ajax a la base de datos y descargara la informacion de los poligonos de todos los parqueaderos. Esta informacion ser'a enviada mediante un socket a la aplicacion local a la funcion "first_data". En esta funcion una variable de la clase workerInterface de la clase WorkerInterface almacenar'a los datos usando el metodo updateSnapshotData y acontinuacion iniciar'a un hilo secundario que se encargar'a de procesar los datos cada cierto tiempo (WorkerInterface.delay). En este hilo secundario dentro del while el procesamiento es como sigue:


se procesarán los datos almacenados en workerInterface.snapshotData usando un proceso secundario call_back_end_process
El proceso secundario devuelve una variable raw_packet
la variable raw_packet se pasa a la variable dataPacket de la clase DataPacket por medio del método raw_push. La clase DataPacket permite crear un diccionario que almacena para cada clave UTC un resultado de proccesar workerInterface.snapshotData (el n'umero de UTC almacenados se establece en dataPacket.length_history). 
finalmente se envía el ultimo UTC procesado a los parking lot users y a los map users conectados.
Cuando un parking lot user se conecta este reclama los datos del ultimo UTC.
Cuando un parking lot user actualiza sus datos ese primero los envía a la base de datos de la aplicación en heroku y luego emite un mensaje de actualización que contiene su id_user, este mensaje es recibido por el proceso worker en el servidor deepvision el cual descarga de heroku los datos correspondientes a ese usuario. Luego de descargar los datos estos se envían por medio del socket en worker a la funcion update_parking_lot_user, donde se actualiza la variable global workerInterface.
Los datos actualizados se reflejarán en el próximo UTC procesado.
Cuando un map user se conecta este pide los datos del ultimo UTC, si existe una desconexión este envía al servidor de deepvision los datos del ultimo UTC recibido y el servidor por medio del objeto dataPacket enviara las instrucciones necesarias (Eliminar, Modificar Y Nuevos) que harán que este map user se actualice al ultimo UTC. esto evita enviar todo el paquete de datos. Si el UTC enviado por el map user es muy antiguo (no existe historial en el servidor de deepvision) entonces se enviarán los datos completos.

#aplicacion mobil

NOTA: la aplicacion mobil en react-native carga la url https://whispering-garden-05503.herokuapp.com/users/map almacenada en el index.html de github:

https://github.com/roggerfq/parking_lot_developing/blob/gh-pages/index.html














































