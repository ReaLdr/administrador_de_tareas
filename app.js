require('colors');

const {guardarDB, leerDB} = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoCheclits } = require('./helpers/inquirer');
//const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

const main = async() =>{
    console.log('Hola mundo');

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){ //cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        // ESTA FUNCION IMPRIME EL MENÚ
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                // crear opción
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);
                break;
            case '2':
                // listar opcione
                tareas.listadoCompleto();
                break;
            case '3':
                //Listar completadas
                tareas.listarPendientesCompletadas(true);
                //el true es opcional
                break;
            case '4':
                //Listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':
                //COMPLETADO | PENDIENTE
                const ids = await mostrarListadoCheclits(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                //borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if(id !== '0'){
                    const ok = await confirmar('¿Estás seguro?');
                    // TODO: PREGUNTAR SI ESTÁ SEGURO
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada ');
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);

         await pausa();
    } while (opt !== '0');

}

main();
