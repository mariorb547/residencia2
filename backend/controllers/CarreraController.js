const Carrera = require('../models').Carrera;
const Sequelize = require('../models').Sequelize;
const sequelize = require('../models').sequelize;
const docente_carreras = require('../models').docente_carreras;
const Periodo = require('../models').Periodo;
const Anteproyecto = require('../models').Anteproyecto;
const Alumno = require('../models').Alumno;
const Seguimiento = require('../models').Seguimiento;
const docente_oficinas = require('../models').docente_oficinas;
const Oficina = require('../models').Oficina;
module.exports.docenteHabilitado = (req, res) => {
    const id_docente = req.body.id_docente,
        id_periodo = req.body.id_periodo;
    // console.log('====>',req.body)
    Periodo.findOne({ where: { id: id_periodo } })
        .then(periodo => {
            // console.log('=>', periodo)
            docente_carreras.findOne({ where: { id_docente, id_carrera: periodo.id_carrera } })
                .then((_docente_carreras) => {
                    // console.log(_docente_carreras)
                    if (_docente_carreras) {
                        if (_docente_carreras.rol !== 'deshabilitado') {
                            res.status(200).json({ habilitado: true, rol: _docente_carreras.rol })
                        } else {
                            res.status(200).json({ habilitado: false });
                        }
                    } else {
                        res.status(200).json({ habilitado: false });
                    }
                }).catch(err => {
                    console.log(err)
                    res.status(406).json({ err: err })
                })
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })

}
module.exports.findPeriodos = (req, res) => {
    const id_carrera = req.params.id_carrera
    Periodo.findAll({
        where: { id_carrera },
        include: [{ model: Carrera, as: 'carrera', include: [{ model: docente_carreras, as: 'docentes_carreras' }] }]
    }).then((periodos) => {
        res.status(200).json(periodos);
    }).catch(err => {
        console.log(err)
        res.status(406).json({ err: err })
    })
}


module.exports.findAnteproyectosByPeriodo = (req, res) => {
    const id_periodo = req.params.id_periodo;

    sequelize.query(`select * from anteproyectos join alumnos on anteproyectos.id_alumno=alumnos.id where anteproyectos.id_periodo=${id_periodo};`, { model: Anteproyecto })
        .then((anteproyectos) => {
            res.status(200).json(anteproyectos);
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
}
module.exports.findAllPeriodos = (req, res) => {


    // sequelize.query(`select DISTINCT periodo, ciclo from periodos`)
    Periodo.findAll({ group: ['periodo', 'ciclo'], order: ['ciclo'] })
        .then((periodo) => {

            res.status(200).json(periodo);
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
}


module.exports.findById = (req, res) => {
    Carrera.findOne({
        where: { id: req.params.id_carrera },
        include: [{ model: Periodo, as: 'periodos', attributes: ['id', 'periodo', 'ciclo', 'fecha_inicio', 'fecha_fin', 'fecha_inicio_entrega_anteproyecto', 'fecha_fin_entrega_anteproyecto', 'id_carrera'], include: [{ model: Seguimiento, as: 'seguimientos' }] }]
    })
        .then((carrera) => {
            res.status(200).json(carrera);
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
}
// module.exports.findByPeridos = (req, res) => {
//      const fecha_inicio = req.params.value;
//      console.log(fecha_inicio)
//     Periodo.findAll({

//     attributes: ['id', 'periodo', 'ciclo', 'fecha_inicio', 'fecha_fin', 'fecha_inicio_entrega_anteproyecto', 'fecha_fin_entrega_anteproyecto', 'id_carrera'], group:['periodo','ciclo'],   where: { fecha_inicio }, include: [{ model: Seguimiento, as: 'seguimientos' }] 
//     })
//         .then((periodo) => {
//             res.status(200).json(periodo);
//         }).catch(err => {
//             console.log(err)
//             res.status(406).json({ err: err })
//         })
// }
module.exports.findByPeridos = (req, res) => {
    const fecha_inicio = req.params.value.split('+');
    console.log(fecha_inicio)
    Periodo.findAll({//group:['periodo','ciclo'],

    attributes: ['id', 'periodo', 'ciclo', 'fecha_inicio', 'fecha_fin', 'fecha_inicio_entrega_anteproyecto', 'fecha_fin_entrega_anteproyecto','fecha_inicio_dictamen','fecha_fin_dictamen','fecha_inicio_lai','fecha_fin_lai','fecha_inicio_eef','fecha_fin_eef','fecha_inicio_entrega_empresa','fecha_fin_entrega_empresa','fecha_inicio_liberacion_empresa','fecha_fin_liberacion_empresa', 'id_carrera'], where: { periodo:fecha_inicio[0],ciclo:[fecha_inicio[1]] }, include: [{ model: Seguimiento, as: 'seguimientos' }]
    })
        .then((periodo) => {
            res.status(200).json(periodo);
        }).catch(err => {
            console.log(err)
            res.status(406).json({ err: err })
        })
}
module.exports.addPeriodo = (req, res) => {
    const id_carrera = req.body.id_carrera,
        periodo = req.body.periodo_residencia,
        ciclo = req.body.ciclo,
        fecha_inicio = req.body.fechas_periodo[0],
        fecha_fin = req.body.fechas_periodo[1],
        fecha_inicio_entrega_anteproyecto = req.body.fechas_entrega_anteproyecto[0],
        fecha_fin_entrega_anteproyecto = req.body.fechas_entrega_anteproyecto[1];

    Periodo.create({
        periodo,
        ciclo,
        fecha_inicio, fecha_fin,
        fecha_inicio_entrega_anteproyecto, fecha_fin_entrega_anteproyecto,
        id_carrera
    }).then((periodo_added) => {
        res.status(200).json(periodo_added);
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
module.exports.addPeriodos = (req, res) => {
    const periodo = req.body.periodo_residencia,
        ciclo = req.body.ciclo,
        fecha_inicio = req.body.fechas_periodo[0],
        fecha_fin = req.body.fechas_periodo[1],
        fecha_inicio_entrega_anteproyecto = req.body.fechas_entrega_anteproyecto[0],
        fecha_fin_entrega_anteproyecto = req.body.fechas_entrega_anteproyecto[1],
        fecha_inicio_dictamen = req.body.fechas_dictamen[0],
        fecha_fin_dictamen = req.body.fechas_dictamen[1],
        fecha_inicio_lai = req.body.fechas_liberacion_asesor_interno[0],
        fecha_fin_lai = req.body.fechas_liberacion_asesor_interno[1],
        fecha_inicio_eef = req.body.fechas_liberacion_asesor_externo[0],
        fecha_fin_eef = req.body.fechas_liberacion_asesor_externo[1],
        fecha_inicio_entrega_empresa = req.body.fechas_entrega_empresa[0],
        fecha_fin_entrega_empresa = req.body.fechas_entrega_empresa[1],
        fecha_inicio_liberacion_empresa = req.body.fechas_liberacion_empresa[0],
        fecha_fin_liberacion_empresa = req.body.fechas_liberacion_empresa[1];
        sequelize.transaction((t) => {

            return Carrera.findAll().then(carreras => {
                carreras.map((carrera, key) => {
                    var id_carrera = carrera.id;
                    Periodo.create({
                        periodo,
                        ciclo,
                        fecha_inicio, fecha_fin,
                        fecha_inicio_entrega_anteproyecto, fecha_fin_entrega_anteproyecto,
                        fecha_inicio_dictamen,fecha_fin_dictamen,
                        fecha_inicio_lai,fecha_fin_lai,
                        fecha_inicio_eef,fecha_fin_eef,
                        fecha_inicio_entrega_empresa,
                        fecha_fin_entrega_empresa,
                        fecha_inicio_liberacion_empresa,
                        fecha_fin_liberacion_empresa,
                        id_carrera,
                    })

                })
            })
        }).then((carreras) => {

            res.status(200).json(carreras);
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
module.exports.docentesAsignados = (req, res) => {
    const id_carrera = req.params.id_carrera
    docente_carreras.findAll({ where: { id_carrera: id_carrera } })
        .then(docentes_asignados => {
            // console.log(docentes_asignados)
            res.status(200).json(docentes_asignados);
        }).catch(err => {
            res.status(406).json({ err: err });
        });
}
module.exports.asignarEncargadoss = (req, res) => {
    console.log(req.body);
    const id_carrera = req.body.id_carrera,
        id_presidente_academia = req.body.id_presidente_academia;

    filterUpdate = {
        id_carrera: id_carrera,
        $or: [
            { rol: 'presidente_academia' }

        ]
    }

    // insertamos o actualizamos al presidente de academia
    sequelize.transaction((t) => {
        return docente_carreras.update({ rol: 'deshabilitado' }, { where: filterUpdate }, { transaction: t })
            .then(presidente_updated => {
                return docente_carreras.upsert({
                    id_docente: id_presidente_academia,
                    id_carrera: id_carrera,
                    rol: 'presidente_academia'
                }, { transaction: t });
            })
    }).then((docente_carreras) => {
        res.status(200).json(docente_carreras);
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
module.exports.asignarEncargados = (req, res) => {
    console.log(req.body);
    const id_carrera = req.body.id_carrera,
        id_jefe_proyecto = req.body.id_jefe_proyecto,
        id_presidente_academia = req.body.id_presidente_academia;

    filterUpdate = {
        id_carrera: id_carrera,
        $or: [
            { rol: 'presidente_academia' },
            { rol: 'jefe_proyecto' }
        ]
    }

    // insertamos o actualizamos al presidente de academia
    sequelize.transaction((t) => {
        return docente_carreras.update({ rol: 'deshabilitado' }, { where: filterUpdate }, { transaction: t })
            .then(presidente_updated => {
                return docente_carreras.upsert({
                    id_docente: id_presidente_academia,
                    id_carrera: id_carrera,
                    rol: 'presidente_academia'
                }, { transaction: t }).then(() => {
                    // insertamos o actualizamos al jefe de departamento
                    if (id_jefe_proyecto) {
                        console.log('aqui')
                        return docente_carreras.upsert({
                            id_docente: id_jefe_proyecto,
                            id_carrera: id_carrera,
                            rol: 'jefe_proyecto'
                        }, { transaction: t })
                    } else {
                        return sequelize.Promise.resolve();
                    }
                })
            })
    }).then((docente_carreras) => {
        res.status(200).json(docente_carreras);
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
module.exports.asignarCoordinadores = (req, res) => {

    const id = req.params.id,
        nombre = req.body.nombre.toUpperCase(),
        id_coordinador = req.body.id_coordinador;
    console.log(id_coordinador, "----------")
    filterUpdate = {
        id_carrera: id,
        $or: [
            { rol: 'coordinador_carrera' }
        ]
    }

    // insertamos o actualizamos al presidente de academia
    sequelize.transaction((t) => {

        return docente_carreras.update({ rol: 'deshabilitado' }, { where: filterUpdate }, { transaction: t })
            .then((presidente_coordinador) => {
                return Carrera.update({ nombre }, { where: { id } }, { transaction: t }).then(() => {
                    return docente_carreras.upsert({
                        id_docente: id_coordinador,
                        id_carrera: id,
                        rol: 'coordinador_carrera'
                    }, { transaction: t })
                })
            })
    }).then((docente_carreras) => {

        res.status(200).json(docente_carreras);
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



module.exports.asignarEncargado = (req, res) => {

    const id = req.params.id,
        nombre = req.body.nombre.toUpperCase(),
        id_coordinador = req.body.id_coordinador;
    filterUpdate = {
        id_oficina: id,
        $or: [
            { rol: 'encargado' }
        ]
    }

    // insertamos o actualizamos al presidente de academia
    sequelize.transaction((t) => {

        return docente_oficinas.update({ rol: 'deshabilitado' }, { where: filterUpdate }, { transaction: t })
            .then((presidente_coordinador) => {
                return Oficina.update({ nombre }, { where: { id } }, { transaction: t }).then(() => {
                    return docente_oficinas.upsert({
                        id_docente: id_coordinador,
                        id_oficina: id,
                        rol: 'encargado'
                    }, { transaction: t })
                })
            })
    }).then((docente_carreras) => {

        res.status(200).json(docente_carreras);
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



module.exports.asignarDocentes = (req, res) => {
    const id_carrera = req.body.id_carrera,
        array_docentes = req.body.array_docentes;
    console.log(array_docentes)
    console.log(id_carrera)
    sequelize.transaction((t) => {
        return docente_carreras.update({ rol: 'deshabilitado' }, { where: { id_carrera, rol: 'docente' } }, { transaction: t })
            .then(updated_docentes => {
                return sequelize.Promise.map(array_docentes, (docente) => {
                    return docente_carreras.upsert({
                        id_docente: docente.id,
                        id_carrera: id_carrera,
                        rol: 'docente'
                    }, { transaction: t });
                })
            })
    }).then((docentes) => {
        res.status(200).json(docentes);
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
module.exports.add = (req, res) => {
    const nombre = req.body.nombre.toUpperCase(),
        id_departamento = req.body.id_departamento;
    Carrera.create({
        nombre,
        id_departamento
    }).then((carrera) => {
        res.status(200).json(carrera)
    }).catch(Sequelize.ValidationError, (err) => {
        var errores = err.errors.map((element) => {
            return `${element.path}: ${element.message}`
        })
        // console.log('==>', errores)
        res.status(202).json({ errores })
    }).catch((err) => {
        res.status(406).json({ err: err })
    })
}