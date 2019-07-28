const Proyecto = require('../models').Proyecto;
const actividades_generales = require('../models').actividades_generales;
const subactividades = require('../models').subactividades;
const tareas = require('../models').tareas;
const observaciones = require('../models').observaciones;
const Periodo = require('../models').Periodo;
const Anteproyecto = require('../models').Anteproyecto;
const asesor_externo = require('../models').asesor_externo;
const Empresa = require('../models').Empresa;
const Alumno = require('../models').Alumno;
const Docente = require('../models').Docente;
const Carrera = require('../models').Carrera;
const Departamento = require('../models').Departamento;
const Seguimiento = require('../models').Seguimiento;
const Usuario = require('../models').Usuario;
const transporter = require('../../config/email');

const Sequelize = require('../models').Sequelize
const sequelize = require('../models').sequelize
const pdfs = require('../../config/pdfs');

module.exports.addActividadGeneral = (req, res) => {
    const id_proyecto = req.body.id_proyecto;
    // console.log(')===========>', req.body)
    actividades_generales.max('id_orden', { where: { id_proyecto } }).then(max => {
        let id_orden = 1;

        if (max >= 1) {//si ya hay actividades generales agregadas
            id_orden = parseInt(max) + 1;

        }
        const actividad = req.body.actividad,
            objetivo = req.body.objetivo,
            entregable = req.body.entregable;
        actividades_generales.create({
            id_proyecto,
            id_orden,
            actividad,
            objetivo,
            entregable,
        }).then((_actividad_general) => {
            res.status(200).json(_actividad_general);
        }).catch(Sequelize.ValidationError, (err) => {
            var errores = err.errors.map((element) => {
                return `${element.path}: ${element.message}`
            })
            // console.log('==>', errores)
            res.status(202).json({ errores })
        }).catch((err) => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    })


}

// este metodo es para agregar una nueva suabactividad 
module.exports.addSubactividad = (req, res) => {
    const id_proyecto = req.body.id_proyecto,
        tipo = req.body.tipo;
    console.log(')===id proyecto ========>', id_proyecto)

    //si estas agregando normal el plan de trbajo 
    if (tipo === "nueva") {

        actividades_generales.max('id_orden', { where: { id_proyecto } }).then(max => {
            let id_actividad_general;

            //se obtiene el id de la ultima tarea principal para hacer la conexion con las subactivides
            actividades_generales.find({ where: { id_orden: max, id_proyecto: id_proyecto } })
                .then(actividadGeneral => {
                    id_actividad_general = actividadGeneral.id;
                    //se obtiene el maximo del orden de las subactividades
                    subactividades.max('id_orden', { where: { id_actividad_general } }).then(max1 => {
                        //con id_orden de la ultima actividad principla se le agrega a la sub actividad para el orden del plan

                        let id_orden = max + "1";//valor por defecto por si aun no hay subactividades agregadas

                        if (max1 >= 1) {//si ya hay subactividades agregadas a la tarea principal
                            id_orden = max1 + 1;// se obtiene el mas grade y se le suma uno 
                        }
                        const actividad = req.body.actividad;
                        subactividades.create({
                            id_orden,
                            id_actividad_general,
                            actividad
                        }).then((_subactividades) => {
                            res.status(200).json(_subactividades);
                        }).catch(Sequelize.ValidationError, (err) => {
                            var errores = err.errors.map((element) => {
                                return `${element.path}: ${element.message}`
                            })
                            // console.log('==>', errores)
                            res.status(202).json({ errores })
                        }).catch((err) => {
                            console.log(err)
                            res.status(406).json({ err: err })
                        })
                    }).catch(err => {
                        console.log(err)
                        res.status(406).json({ err: err })
                    })


                })
        })


    } else if (tipo === "agregar") {
        //si se añide una nueva subactivida a una tarea principal ya existente

        //se obtiene la actividad general para obtener datos necesarios 
        //la varieble id_proyecto en este caso es el id de la ctividad general 
        actividades_generales.find({ where: { id: id_proyecto } })
            .then(actividadGeneral => {
                id_orden_actividad_general = actividadGeneral.id_orden;
                let id_actividad_general = actividadGeneral.id;
                //se obtiene el maximo del orden de las subactividades
                subactividades.max('id_orden', { where: { id_actividad_general: id_proyecto } }).then(max1 => {
                    //con id_orden de la ultima actividad principla se le agrega a la sub actividad para el orden del plan

                    let id_orden = id_orden_actividad_general + "1";//valor por defecto por si aun no hay subactividades agregadas

                    if (max1 >= 1) {//si ya hay subactividades agregadas a la tarea principal
                        id_orden = max1 + 1;// se obtiene el mas grade y se le suma uno 
                    }
                    const actividad = req.body.actividad;
                    subactividades.create({
                        id_orden,
                        id_actividad_general,
                        actividad
                    }).then((_subactividades) => {
                        res.status(200).json(_subactividades);
                    }).catch(Sequelize.ValidationError, (err) => {
                        var errores = err.errors.map((element) => {
                            return `${element.path}: ${element.message}`
                        })
                        // console.log('==>', errores)
                        res.status(202).json({ errores })
                    }).catch((err) => {
                        console.log(err)
                        res.status(406).json({ err: err })
                    })
                }).catch(err => {
                    console.log(err)
                    res.status(406).json({ err: err })
                })


            })




    }


}


module.exports.addTarea = (req, res) => {
    const id_proyecto = req.body.id_proyecto,
        tipo = req.body.tipo;

    if (tipo === "nueva") {
        // console.log(')===========>', req.body)
        actividades_generales.max('id_orden', { where: { id_proyecto } }).then(max => {
            let id_actividad_general;
            //se obtiene el id de la ultima tarea principal para hacer la conexion con las subactivides
            actividades_generales.find({ where: { id_orden: max, id_proyecto: id_proyecto } })
                .then(actividadGeneral => {
                    id_actividad_general = actividadGeneral.id;
                    //se obtiene el maximo del orden de las subactividades
                    subactividades.max('id_orden', { where: { id_actividad_general } }).then(max1 => {
                        //con id_orden de la ultima actividad principla se le agrega a la sub actividad para el orden del plan

                        //se obtiene el id de la ultima  subCtividad para hacer la conexion con las subactivides
                        subactividades.find({ where: { id_orden: max1, id_actividad_general: id_actividad_general } })
                            .then(subctividad => {
                                let id_subactividad = subctividad.id;
                                //se obtiene el maximo del orden de las tareas
                                tareas.max('id_orden', { where: { id_subactividad } }).then(max2 => {

                                    let id_orden = max1 + "1";//valor por defecto por si no hay tareas agregadas


                                    if (max2 >= 1) {//si ya hay tareas agregadas a la ultima subactividad agregadas

                                        id_orden = parseInt(max2) + 1;// se obtiene el mas grade y se le suma uno 

                                    }

                                    const tarea = req.body.tarea,
                                        horas = req.body.horas,
                                        entregable = req.body.entregable,
                                        fecha_entrega = req.body.fecha_entrega;
                                    tareas.create({
                                        id_subactividad,
                                        id_orden,
                                        tarea,
                                        horas,
                                        entregable,
                                        fecha_entrega,
                                    }).then((_tareas) => {
                                        res.status(200).json(_tareas);
                                    }).catch(Sequelize.ValidationError, (err) => {
                                        var errores = err.errors.map((element) => {
                                            return `${element.path}: ${element.message}`
                                        })
                                        // console.log('==>', errores)
                                        res.status(202).json({ errores })
                                    }).catch((err) => {
                                        console.log(err)
                                        res.status(406).json({ err: err })
                                    })

                                })
                            })

                    }).catch(err => {
                        console.log(err)
                        res.status(406).json({ err: err })
                    })


                })
        })
    } else if (tipo === "agregar") {
        // console.log(')===========>', req.body)


        //se obtiene el maximo del orden de las subactividades
        subactividades.max('id_orden', { where: { id_actividad_general: id_proyecto } }).then(max1 => {
            //con id_orden de la ultima actividad principla se le agrega a la sub actividad para el orden del plan

            //se obtiene el id de la ultima  subCtividad para hacer la conexion con las subactivides
            subactividades.find({ where: { id_orden: max1, id_actividad_general: id_proyecto } })
                .then(subctividad => {
                    let id_subactividad = subctividad.id;
                    //se obtiene el maximo del orden de las tareas
                    tareas.max('id_orden', { where: { id_subactividad } }).then(max2 => {

                        let id_orden = max1 + "1";//valor por defecto por si no hay tareas agregadas


                        if (max2 >= 1) {//si ya hay tareas agregadas a la ultima subactividad agregadas

                            id_orden = parseInt(max2) + 1;// se obtiene el mas grade y se le suma uno 

                        }

                        const tarea = req.body.tarea,
                            horas = req.body.horas,
                            entregable = req.body.entregable,
                            fecha_entrega = req.body.fecha_entrega;
                        tareas.create({
                            id_subactividad,
                            id_orden,
                            tarea,
                            horas,
                            entregable,
                            fecha_entrega,
                        }).then((_tareas) => {
                            res.status(200).json(_tareas);
                        }).catch(Sequelize.ValidationError, (err) => {
                            var errores = err.errors.map((element) => {
                                return `${element.path}: ${element.message}`
                            })
                            // console.log('==>', errores)
                            res.status(202).json({ errores })
                        }).catch((err) => {
                            console.log(err)
                            res.status(406).json({ err: err })
                        })

                    })
                })

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })

    } else if (tipo === "agregarTarea") {
        //esta opcion es solo cuando se agrera una tarea a una subactividad ya existente 
        //se obtiene la subactividad
        subactividades.find({ where: { id: id_proyecto } })
            .then(subctividad => {
                let id_subactividad = subctividad.id;
                let id_orden_subactividad = subctividad.id_orden;
                //se obtiene el maximo del orden de las tareas
                tareas.max('id_orden', { where: { id_subactividad } }).then(max2 => {

                    let id_orden = id_orden_subactividad + "1";//valor por defecto por si no hay tareas agregadas


                    if (max2 >= 1) {//si ya hay tareas agregadas a la ultima subactividad agregadas

                        id_orden = parseInt(max2) + 1;// se obtiene el mas grade y se le suma uno 

                    }

                    const tarea = req.body.tarea,
                        horas = req.body.horas,
                        entregable = req.body.entregable,
                        fecha_entrega = req.body.fecha_entrega;
                    tareas.create({
                        id_subactividad,
                        id_orden,
                        tarea,
                        horas,
                        entregable,
                        fecha_entrega,
                    }).then((_tareas) => {
                        res.status(200).json(_tareas);
                    }).catch(Sequelize.ValidationError, (err) => {
                        var errores = err.errors.map((element) => {
                            return `${element.path}: ${element.message}`
                        })
                        // console.log('==>', errores)
                        res.status(202).json({ errores })
                    }).catch((err) => {
                        console.log(err)
                        res.status(406).json({ err: err })
                    })

                })
            })





    }

}

module.exports.findPlanDeTrabajoAlumno = (req, res) => {
    const id_proyecto = req.params.id_proyecto;
    actividades_generales.findAll({
        where: { id_proyecto }, order: [
            ['id_orden', 'ASC']],
        include: [{ model: subactividades, as: 'subactividades', include: [{ model: tareas, as: 'tareas', include: [{ model: observaciones, as: 'observaciones' }] }] }]
    }).then(_observacion => {
        res.status(200).json(_observacion);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })

}





module.exports.findAllSubActividades = (req, res) => {
    const id_actividad_general = req.params.id_subactividad;
    //se actuaiza el id_orden las tareas

    subactividades.findAll({
        where: { id_actividad_general }, order: [
            ['id_orden', 'ASC'],],

    }).then(_tareas => {
        res.status(200).json(_tareas);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })

}



module.exports.findAllTareas = (req, res) => {
    const id_subactividad = req.params.id_subactividad;
    tareas.findAll({
        where: { id_subactividad }, order: [
            ['id_orden', 'ASC'],],
    }).then(_tareas => {
        res.status(200).json(_tareas);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}
module.exports.deleteActividadGeneral = (req, res) => {
    const id_actividad_general = req.body.id_actividad_general,
        id_proyecto = req.body.id_proyecto,
        id_orden = req.body.id_orden;
    console.log("----------------------id orden 1-------------" + id_orden)

    actividades_generales.destroy({
        where: {
            id: id_actividad_general
        }
    }).then(_actividad => {
        console.log("----------------------id orden 2-------------" + id_orden)
        //se actualizan el id_orden de las actividades_genereles         
        sequelize.query('update  actividades_generales set id_orden=id_orden-1 where id_proyecto=' + id_proyecto + " and id_orden >" + id_orden)
            .then(projects => {

            })
        //se actuaiza el id_orden las suabctividades
        sequelize.query('update  subactividades join actividades_generales on subactividades.id_actividad_general=actividades_generales.id  set subactividades.id_orden=subactividades.id_orden-10 where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id_orden >=" + id_orden)//mayor o igual a id_orden porque las actividades generales ya se actualizo el id_orden lineas de arriba 
            .then(projects => {

            })
        //se actuaiza el id_orden las tareas
        sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id set tareas.id_orden=tareas.id_orden-100 where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id_orden >=" + id_orden)
            .then(projects => {

            })
        res.status(200).json(_actividad);

    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}



module.exports.deleteSubactividad = (req, res) => {
    const id = req.body.id_subactividad,
        id_actividad_general = req.body.id_actividad_general,
        id_orden = req.body.id_orden;

    subactividades.destroy({
        where: {
            id: id
        }
    }).then(_subactividad => {
        //se actuaiza el id_orden las suabctividades
        sequelize.query('update  subactividades  set id_orden=id_orden-1 where id_actividad_general=' + id_actividad_general + " and id_orden >" + id_orden)
            .then(projects => {

            })
        //se actuaiza el id_orden las tareas
        sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id set tareas.id_orden=tareas.id_orden-10 where subactividades.id_actividad_general=' + id_actividad_general + " and subactividades.id_orden >=" + id_orden)
            .then(projects => {

            })
        res.status(200).json(_subactividad);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}

module.exports.deleteTarea = (req, res) => {
    const id_tarea = req.body.id_tarea,
        id_subactividad = req.body.id_subactividad,
        id_orden = req.body.id_orden;

    tareas.destroy({
        where: {
            id: id_tarea
        }
    }).then(_tarea => {
        //se actuaiza el id_orden las tareas
        sequelize.query('update  tareas  set id_orden=id_orden-1 where id_subactividad=' + id_subactividad + " and id_orden >" + id_orden)
            .then(projects => {

            })
        res.status(200).json(_tarea);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}


//recorre de posición a las actividades generales
module.exports.upActividadGeneral = (req, res) => {

    const id_actividad_general = req.body.id_actividad_general
    id_proyecto = req.body.id_proyecto,
        id_orden = req.body.id_orden,
        tipo = req.body.tipo;

    if (tipo === "subir") {
        id_orden_buscar = id_orden - 1;

        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        actividades_generales.find({
            where: { id_proyecto, id_orden: id_orden_buscar }
        }).then(_actividad_general => {
            //si existe una actividad general antes de la actividad general selecionada se realiza el proceso
            if (_actividad_general != null) {

                actividades_generales.update({
                    id_orden: id_orden
                }, { where: { id: _actividad_general.id } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)
                    //se actuaiza el id_orden las suabctividades
                    sequelize.query('update  subactividades  set id_orden=id_orden+10 where id_actividad_general=' + _actividad_general.id)
                        .then(projects => {

                        })

                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id set tareas.id_orden=tareas.id_orden+100,fecha_entrega="0000-00-00" where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id=" + _actividad_general.id)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                console.log("--------------------activida id " + id_actividad_general + "-----------------------------------")

                actividades_generales.update({
                    id_orden: _actividad_general.id_orden
                }, { where: { id: id_actividad_general } }).then((_observacion) => {
                    //se actuaiza el id_orden las suabctividades
                    sequelize.query('update  subactividades  set id_orden=id_orden-10 where id_actividad_general=' + id_actividad_general)
                        .then(projects => {

                        })

                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id set tareas.id_orden=tareas.id_orden-100,fecha_entrega="0000-00-00" where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id=" + id_actividad_general)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                res.status(200).json({ _actividad_general })
            } else {
                res.status(201).json({ message: "error actividad general no existe" })
            }

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    } else if (tipo === "bajar") {
        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        id_orden_buscar = id_orden + 1;
        actividades_generales.find({
            where: { id_proyecto, id_orden: id_orden_buscar }
        }).then(_actividad_general => {
            //si existe una actividad general despues de la actividad general selecionada se realiza el proceso
            if (_actividad_general != null) {
                console.log("actividad jajajaj " + _actividad_general.id)
                actividades_generales.update({
                    id_orden: id_orden
                }, { where: { id: _actividad_general.id } }).then((_observacion) => {

                    //se actuaiza el id_orden las suabctividades
                    sequelize.query('update  subactividades  set id_orden=id_orden-10 where id_actividad_general=' + _actividad_general.id)
                        .then(projects => {

                        })
                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id set tareas.id_orden=tareas.id_orden-100,fecha_entrega="0000-00-00" where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id=" + _actividad_general.id)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                actividades_generales.update({
                    id_orden: _actividad_general.id_orden
                }, { where: { id: id_actividad_general } }).then((_observacion) => {
                    //se actuaiza el id_orden las suabctividades
                    sequelize.query('update  subactividades  set id_orden=id_orden+10 where id_actividad_general=' + id_actividad_general)
                        .then(projects => {

                        })
                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id set tareas.id_orden=tareas.id_orden+100,fecha_entrega="0000-00-00" where actividades_generales.id_proyecto=' + id_proyecto + " and actividades_generales.id=" + id_actividad_general
                    )
                        .then(projects => { })
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)
                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })
                res.status(200).json({ _actividad_general })
            } else {
                res.status(201).json({ message: "error activida general no existe" })
            }

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })

    }

}


//recorre de posición a las subactividades 
module.exports.recorrerSubactividad = (req, res) => {

    const id_actividad_general = req.body.id_actividad_general
    id_subactividad = req.body.id_subactividad,
        id_orden = req.body.id_orden,
        tipo = req.body.tipo;

    if (tipo === "subir") {
        id_orden_buscar = id_orden - 1;

        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        subactividades.find({
            where: { id_actividad_general, id_orden: id_orden_buscar }
        }).then(_subactividad => {
            //si la existe una subactividad antes de la posicion de la subactividad seleciona entra    
            if (_subactividad != null) {

                subactividades.update({
                    id_orden: id_orden
                }, { where: { id: _subactividad.id } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)

                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas set id_orden=id_orden+10,fecha_entrega="0000-00-00" where id_subactividad=' + _subactividad.id)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })


                subactividades.update({
                    id_orden: _subactividad.id_orden
                }, { where: { id: id_subactividad } }).then((_observacion) => {


                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas  set id_orden=id_orden-10,fecha_entrega="0000-00-00" where id_subactividad=' + id_subactividad)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                res.status(200).json({ _subactividad })
            } else {
                res.status(201).json({ message: "error subactividad no existe" })
            }
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    } else if (tipo === "bajar") {
        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        id_orden_buscar = id_orden + 1;

        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        subactividades.find({
            where: { id_actividad_general, id_orden: id_orden_buscar }
        }).then(_subactividad => {
            //si la existe una subactividad despues de la posicion de la subactividad seleciona entra    
            if (_subactividad != null) {

                subactividades.update({
                    id_orden: id_orden
                }, { where: { id: _subactividad.id } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)

                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas set id_orden=id_orden-10,fecha_entrega="0000-00-00" where id_subactividad=' + _subactividad.id)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })


                subactividades.update({
                    id_orden: _subactividad.id_orden
                }, { where: { id: id_subactividad } }).then((_observacion) => {


                    //se actuaiza el id_orden las tareas
                    sequelize.query('update  tareas  set id_orden=id_orden+10,fecha_entrega="0000-00-00" where id_subactividad=' + id_subactividad)
                        .then(projects => { })

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                res.status(200).json({ _subactividad })
            } else {
                res.status(201).json({ message: "error subactividad no existe" })

            }

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    }

}


//recorre de posición a las subactividades 
module.exports.recorrerTarea = (req, res) => {

    const id_tarea = req.body.id_tarea
    id_subactividad = req.body.id_subactividad,
        id_orden = req.body.id_orden,
        tipo = req.body.tipo,
        fecha_entrega = req.body.fecha_entrega;

    if (tipo === "subir") {
        id_orden_buscar = id_orden - 1;

        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 1 para realizar el intercambio de posicion
        tareas.find({
            where: { id_subactividad, id_orden: id_orden_buscar }
        }).then(_tarea => {
            //si la existe una tarea antes de la posicion de la tarea seleciona entra    
            if (_tarea != null) {
                //a la tarea encontrada se re lealiza el update del orden id_orden
                tareas.update({
                    id_orden: id_orden, fecha_entrega
                }, { where: { id: _tarea.id } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                //se cambia el id_orden con el id_orden de la tarea que esta arriba de ella
                tareas.update({
                    id_orden: _tarea.id_orden, fecha_entrega: _tarea.fecha_entrega
                }, { where: { id: id_tarea } }).then((_observacion) => {


                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })

                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                res.status(200).json({ _tarea })
            } else {
                res.status(201).json({ message: "error tarea no existe" })

            }

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    } else if (tipo === "bajar") {
        //si la posion que se va a modificar es 2 entonces se bucara la ctividad con la posion 3 para realizar el intercambio de posicion
        id_orden_buscar = id_orden + 1;

        //se busca la tarea con la posicion mas abajo que la tarea selecionada 
        tareas.find({
            where: { id_subactividad, id_orden: id_orden_buscar }
        }).then(_tarea => {
            console.log("tareaaaaaaaaaaaaaaaaaaaaaaaaaa------------" + _tarea)
            //si la existe una tarea despues de la posicion de la tarea seleciona entra    
            if (_tarea != null) {
                console.log("-------------------no esta vacia---------------------")

                //se  modifica la tarea encontrada con el id_orden de la tarea seleccionda
                tareas.update({
                    id_orden: id_orden, fecha_entrega
                }, { where: { id: _tarea.id } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    // res.status(200).json(_observacion)

                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                //se cambia la tarea selecionada con el id_orden de la tarea que esta sespues de ella
                tareas.update({
                    id_orden: _tarea.id_orden, fecha_entrega: _tarea.fecha_entrega
                }, { where: { id: id_tarea } }).then((_observacion) => {


                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })

                res.status(200).json({ _tarea })
            } else {
                res.status(201).json({ message: "error tarea no existe" })
                console.log("----------------------esta muy vacia------------------------------")
            }

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    }

}

module.exports.addObservacion = (req, res) => {
    // console.log('==========>',req.body)
    const id_tarea = req.body.id_tarea,
        id_asesor_interno = req.body.id_asesor_interno,
        tipo_observacion = req.body.tipo_observacion,
        observacion = req.body.observacion;

    observaciones.create({
        id_tarea,
        observacion,
        tipo_observacion,
        estado: false,
        id_asesor_interno
    }).then((_observacion) => {
        res.status(200).json(_observacion);

    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err)
        res.status(406).json({ err: err })
    })

}

module.exports.findAllObservaciones = (req, res) => {
    const id_tarea = req.params.id_tarea,
        tipo_observacion = req.params.tipo_observacion;

    //el estado 1 se refiere a que la tarea aun esta pendiente de revizar
    observaciones.findAll({
        where: { id_tarea, tipo_observacion },
        include: [{ model: tareas, as: 'tareas', include: [{ model: subactividades, as: 'subactividades', include: [{ model: actividades_generales, as: 'actividad_general' }] }] }]
    }).then(_observacion => {
        res.status(200).json(_observacion);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}
module.exports.updateObservacion = (req, res) => {
    const id = req.body.id,
        estado = req.body.estado;
    console.log("<<<<< id : " + id + " estado: " + estado)
    observaciones.update({
        estado
    }, { where: { id: id } }).then((_observacion) => {
        // console.log('success=======>    ', result)
        res.status(200).json(_observacion)
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err);
        res.status(406).json({ err: err })
    })
}
module.exports.updateObservacionAlumno = (req, res) => {
    const id = req.body.id,
        estado = req.body.estado;
    console.log("<<<<< id : " + id + " estado: " + estado)
    observaciones.update({
        estado_alumno: estado
    }, { where: { id: id } }).then((_observacion) => {
        // console.log('success=======>    ', result)
        res.status(200).json(_observacion)
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err);
        res.status(406).json({ err: err })
    })
}
module.exports.updateEstadoTareaAddObservacionPlan = (req, res) => {
    const id = req.body.id_tarea;

    tareas.update({
        estado_revision_plan: 'no_aprobado'
    }, { where: { id } }).then((_observacion) => {
        // console.log('success=======>    ', result)
        res.status(200).json(_observacion)
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err);
        res.status(406).json({ err: err })
    })


}

module.exports.updateEstadoTarea = (req, res) => {
    const id_tarea = req.body.id_tarea,
        estado = req.body.estado,
        tipo_observacion = req.body.tipo_observacion;
    console.log("-----------------------id tarea------------------------" + id_tarea)
    observaciones.count({
        where: { id_tarea, tipo_observacion, estado: false }
    }).then(_tareas => {
        //si la tarea tiene alguna observacion pendiente
        if (_tareas > 0) {
            res.status(201).json(_tareas);

            console.log("----------------------------------hay observaciones pendientes-------")
        } else {
            //si la tarea no tienen ninguna observacion pendiente
            if (tipo_observacion === "plan_de_trabajo") {
                tareas.update({
                    estado_revision_plan: estado
                }, { where: { id: id_tarea } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    res.status(200).json(_observacion)
                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })
            } else if (tipo_observacion === "estado_revision_semanal") {
                tareas.update({
                    estado_revision_semanal: estado
                }, { where: { id_tarea, tipo_estado } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    res.status(200).json(_observacion)
                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })
            } else if (tipo_observacion === "estado_revision_mensual") {
                tareas.update({
                    estado_revision_mensual: estado
                }, { where: { id_tarea, tipo_estado } }).then((_observacion) => {
                    // console.log('success=======>    ', result)
                    res.status(200).json(_observacion)
                }).catch(Sequelize.ValidationError, (err) => {
                    var errores = err.errors.map((element) => {
                        return `${element.path}: ${element.message}`
                    })
                    // console.log('==>', errores)
                    res.status(202).json({ errores })
                }).catch((err) => {
                    console.log(err);
                    res.status(406).json({ err: err })
                })
            }
            console.log("----------------------------------no hay observaciones pendientes-------")
            // res.status(200).json(_tareas);

        }
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}


module.exports.updateActividadGeneral = (req, res) => {
    const id = req.body.id,
        actividad = req.body.actividad,
        objetivo = req.body.objetivo,
        entregable = req.body.entregable;
    actividades_generales.update({ actividad, objetivo, entregable }, { where: { id } })
        .then((_proyecto) => {
            res.status(200).json(_proyecto);
        }).catch(Sequelize.ValidationError, (err) => {
            var errores = err.errors.map((element) => {
                return `${element.path}: ${element.message}`
            })
            // console.log('==>', errores)
            res.status(202).json({ errores })
        }).catch((err) => {
            console.log(err)
        })
}

module.exports.updateSubactividad = (req, res) => {
    const id = req.body.id,
        actividad = req.body.actividad;
    subactividades.update({ actividad }, { where: { id } })
        .then((_proyecto) => {
            res.status(200).json(_proyecto);
        }).catch(Sequelize.ValidationError, (err) => {
            var errores = err.errors.map((element) => {
                return `${element.path}: ${element.message}`
            })
            // console.log('==>', errores)
            res.status(202).json({ errores })
        }).catch((err) => {
            console.log(err)
        })
}

module.exports.updateTarea = (req, res) => {
    const id = req.body.id,
        tarea = req.body.tarea,
        horas = req.body.horas,
        entregable = req.body.entregable,
        fecha_entrega = req.body.fecha_entrega;
    tareas.update({ tarea, horas, entregable, fecha_entrega }, { where: { id } })
        .then((_proyecto) => {
            res.status(200).json(_proyecto);
        }).catch(Sequelize.ValidationError, (err) => {
            var errores = err.errors.map((element) => {
                return `${element.path}: ${element.message}`
            })
            // console.log('==>', errores)
            res.status(202).json({ errores })
        }).catch((err) => {
            console.log(err)
        })
}

module.exports.getPlanDeTrabajo = (req, res) => {
    const id = req.params.id;

    actividades_generales.findAll({
        where: { id_proyecto: id }, order: [
            ['id_orden', 'ASC'], [subactividades, 'id_orden', 'ASC'], [subactividades, tareas, 'id_orden', 'ASC']],
        include: [{ model: subactividades, as: 'subactividades', include: [{ model: tareas, as: 'tareas', include: [{ model: observaciones, as: 'observaciones' }] }] }]
    }).then(_plan => {
        res.status(200).json(_plan);


    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })

}
module.exports.generarPlanTrabajo = (req, res) => {
    const id = req.params.id;
    Proyecto.findOne({
        where: { id },
        include: [{ model: Anteproyecto, as: 'anteproyecto', include: [{ model: Periodo, as: 'periodo', include: [{ model: Carrera, as: 'carrera', include: [{ model: Departamento, as: 'departamento', include: [{ model: Docente, as: 'docentes', include: [{ model: Usuario, as: 'usuario', where: { rol: 'jefe_departamento' } }] }] }] }, { model: Seguimiento, as: 'seguimientos' }] }, { model: Alumno, as: 'alumno' }, { model: Docente, as: "asesor_interno" }, { model: asesor_externo, as: 'asesor_externo', include: [{ model: Empresa, as: 'empresa' }] }] }]
    }).then((_proyecto) => {
        actividades_generales.findAll({
            where: { id_proyecto: id }, order: [
                ['id_orden', 'ASC'], [subactividades, 'id_orden', 'ASC'], [subactividades, tareas, 'id_orden', 'ASC']],
            include: [{ model: subactividades, as: 'subactividades', include: [{ model: tareas, as: 'tareas' }] }]
        }).then(_plan => {
            pdfs.generarPlanDeTrabajo(_proyecto, _plan, res);
            res.contentType("application/pdf");

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err)
    })

}
module.exports.getCronograma = (req, res) => {
    const id = req.params.id;
    Proyecto.findOne({
        where: { id },
        include: [{ model: Anteproyecto, as: 'anteproyecto', include: [{ model: Periodo, as: 'periodo', include: [{ model: Carrera, as: 'carrera', include: [{ model: Departamento, as: 'departamento', include: [{ model: Docente, as: 'docentes', include: [{ model: Usuario, as: 'usuario', where: { rol: 'jefe_departamento' } }] }] }] }, { model: Seguimiento, as: 'seguimientos' }] }, { model: Alumno, as: 'alumno' }, { model: Docente, as: "asesor_interno" }, { model: asesor_externo, as: 'asesor_externo', include: [{ model: Empresa, as: 'empresa' }] }] }]
    }).then((_proyecto) => {
        actividades_generales.findAll({
            where: { id_proyecto: id }, order: [
                ['id_orden', 'ASC'], [subactividades, 'id_orden', 'ASC'], [subactividades, tareas, 'id_orden', 'ASC']],
            include: [{ model: subactividades, as: 'subactividades', include: [{ model: tareas, as: 'tareas', include: [{ model: observaciones, as: 'observaciones' }] }] }]
        }).then(_plan => {
            pdfs.generarCronograma(_proyecto, _plan, res);
            res.contentType("application/pdf");

        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        console.log(err)
    })

}

module.exports.notificacionObservacionesPlan = (req, res) => {
    const correo = req.body.correo,
        mensaje = req.body.mensaje,
        subject = req.body.subject;

    const mailOptions = {
        from: 'seguimientoresidenciasitch@gmail.com',
        to: correo,
        subject: subject,
        text: mensaje
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(203).json(err)
        } else {
            res.status(200).json({ message: "enviado" })
        }
    })

}

module.exports.maxActividadesGenerales = (req, res) => {
    const id_proyecto = req.params.id_proyecto;
    actividades_generales.max('id_orden', { where: { id_proyecto } }).then(_actividadGeneral => {
        res.status(200).json(_actividadGeneral);
    }).catch(err => {
        res.status(406).json({ err: err })
    })
}

module.exports.maxSubactividades = (req, res) => {
    const id_proyecto = req.params.id_proyecto;
    subactividades.max('subactividades.id_orden', {
         
    include: [{ model: actividades_generales, as: 'actividad_general',where: { id_proyecto }} ]}).then(_subactividad => {
        res.status(200).json(_subactividad);
       
    }).catch(err => {
        res.status(406).json({ err: err })
    })
}

module.exports.maxTareas = (req, res) => {
    const id_proyecto = req.params.id_proyecto;

    sequelize.query('select max(tareas.id_orden) as id_orden from tareas join subactividades on tareas.id_subactividad=subactividades.id join actividades_generales on subactividades.id_actividad_general=actividades_generales.id where actividades_generales.id_proyecto=' + id_proyecto)
    .then(_tareas => {
       
        _tareas.map((max)=>{
            res.status(200).json(max);
        })
        console.log("--------------------------------------------------------------------")
        console.log("tareas"+JSON.stringify(_tareas))
        console.log("--------------------------------------------------------------------")

    }).catch(err => {
        res.status(406).json({ err: err })
    })
}


module.exports.updateProrrogaPlanTrabajo = (req, res) => {
    const id = req.body.id,
    prorroga_fecha_entrega_plan = req.body.prorroga_fecha_entrega_plan;
       
    Proyecto.update({ prorroga_fecha_entrega_plan }, { where: { id } })
        .then((_proyecto) => {
            res.status(200).json(_proyecto);
        }).catch(Sequelize.ValidationError, (err) => {
            var errores = err.errors.map((element) => {
                return `${element.path}: ${element.message}`
            })
            // console.log('==>', errores)
            res.status(202).json({ errores })
        }).catch((err) => {
            console.log(err)
        })
}