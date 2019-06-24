const Proyecto = require('../models').Proyecto;
const actividades_generales = require('../models').actividades_generales;
const subactividades = require('../models').subactividades;
const tareas = require('../models').tareas;
const evidencias = require('../models').evidencias;
const formato = require('../models').formato;
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

const pdfs = require('../../config/pdfs');
const Sequelize = require('../models').Sequelize
const sequelize = require('../models').sequelize

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const transporter = require('../../config/email');
const MAX_FILE_SIZE_ANTEPROYECTO = 10 * 1000 * 1000;

const uploadFilePlanTrabajo = multer({
    dest: './storeFiles/evidencias',
    limits: { fileSize: MAX_FILE_SIZE_ANTEPROYECTO, files: 1, },
    fileFilter: (req, file, cb) => (file.mimetype !== 'application/pdf') ? cb(null, false, new Error('El archivo debe ser PDF')) : cb(null, true)
}).single('fileEvidencias');

const uploadFileFormatos = multer({
    dest: './storeFiles/formatos',
    limits: { fileSize: MAX_FILE_SIZE_ANTEPROYECTO, files: 1, },
    fileFilter: (req, file, cb) => (file.mimetype !== 'application/pdf') ? cb(null, false, new Error('El archivo debe ser PDF')) : cb(null, true)
}).single('fileFormatos');

module.exports.findTareaCompleta = (req, res) => {
    const id_proyecto = req.params.id_proyecto;
  
    actividades_generales.findAll({
        where: {id_proyecto},order: [
            ['id_orden', 'ASC'],[subactividades,'id_orden', 'ASC'],[subactividades,tareas,'id_orden', 'ASC']],
            include:[{model:subactividades, as: 'subactividades',include:[{model:tareas, as: 'tareas',include:[{model:evidencias, as: 'evidencias'},{model:observaciones, as: 'observaciones'}] }]}]
    }).then(actividadGeneral => {
        let tareas=[]
       actividadGeneral.map((actividad)=>{
          actividad.subactividades.map((subctividad)=>{
              subctividad.tareas.map((tarea)=>{
                  tareas.push(tarea)
              })
          })
       })
        
       res.status(200).json(tareas);

    }).catch(err => {
        console.log(err)
    })

}
          


module.exports.addFileEvidencia= (req, res) => {
    const id_tarea = req.params.id_tarea;
    uploadFilePlanTrabajo(req, res, err => {
        if (err) {
            console.error(err);
            res.status(406).json(err);
        } else {
            evidencias.create({
                id_tarea,
                filename_evidencia:req.file.filename
            }).then((_observacion)=>{
                res.status(200).json(_observacion);
                
            }).catch(Sequelize.ValidationError, (err) => {
                var errores = err.errors.map((element) => {
                    return `${element.path}: ${element.message}`
                })
                // console.log('==>', errores)
                res.status(202).json({errores})
            }).catch((err) => {
                console.log(err)
                res.status(406).json({err: err})
            }) 
            
        }
    })
}

module.exports.addFileFormatoSemanal= (req, res) => {
    const semana = req.params.semana,
          id_proyecto = req.params.id_proyecto;
    uploadFileFormatos(req, res, err => {
        if (err) {
            console.error(err);
            res.status(406).json(err);
        } else {
            formato.create({
                id_proyecto,
                semana,
                url_formato:req.file.filename
            }).then((_observacion)=>{
                res.status(200).json(_observacion);
                
            }).catch(Sequelize.ValidationError, (err) => {
                var errores = err.errors.map((element) => {
                    return `${element.path}: ${element.message}`
                })
                // console.log('==>', errores)
                res.status(202).json({errores})
            }).catch((err) => {
                console.log(err)
                res.status(406).json({err: err})
            }) 
            
        }
    })
}
module.exports.updateFileEvidencia= (req, res) => {
    const id_evidencia= req.params.id_evidencia;
    console.log("id evidencia"+id_evidencia)
    uploadFilePlanTrabajo(req, res, err => {
        if (err) {
            console.error(err);
            res.status(406).json(err);
        } else {
            sequelize.transaction(t => {
                return evidencias.findOne({ where: { id: id_evidencia } }, { transaction: t })
                    .then(_evidencia => {
                        // borramos el archivo del plan de trabajo si ya tiene uno
                        if (_evidencia.filename_evidencia) {
                            fs.unlink(`./storeFiles/evidencias/${_evidencia.filename_evidencia}`, function (err) {
                                if (err) throw err;
                                console.log('File deleted!');
                              });
                           
                        }
                        return evidencias.update({ filename_evidencia: req.file.filename }, { where: { id: id_evidencia } }, { transaction: t });
                    })
            }).then((_evidencia) => {
                // console.log('success=======>    ', result)
                res.status(200).json(_evidencia)
                
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
    })
    
}


module.exports.getPlanDeTrabajo = (req, res) => {
    const id = req.params.id;
           
                actividades_generales.findAll({ 
                    attributes: ['actividad'],
                    where: {id_proyecto:id},order: [
                        ['id_orden', 'ASC'],[subactividades,'id_orden', 'ASC'],[subactividades,tareas,'id_orden', 'ASC']],
                    include:[{model:subactividades, as: 'subactividades',include:[{model:tareas, as: 'tareas',include:[{model:observaciones, as: 'observaciones'}] }]}]
                }).then(_plan => {
                    res.status(200).json(_plan);
              
                    
                }).catch(err => {
                    console.log(err)
                    res.status(406).json({err: err})
                })
        
}

module.exports.getEvidencia = (req, res) => {
    const filename = req.params.filename;
    const ruta_pdf = path.join(__dirname, `../../storeFiles/evidencias/${filename}`)
    var pdf = fs.readFileSync(ruta_pdf);
    res.contentType("application/pdf");
    res.send(pdf);
}

module.exports.getEvidenciaUpdate = (req, res) => {
    const id = req.params.id;
   
    evidencias.findOne({ 
        where: {id}
    }).then(_evidencia => {
        const ruta_pdf = path.join(__dirname, `../../storeFiles/evidencias/${_evidencia.filename_evidencia}`)
        var pdf = fs.readFileSync(ruta_pdf);
        res.contentType("application/pdf");
        res.send(pdf);
        
    }).catch(err => {
        console.log(err)
        res.status(406).json({err: err})
    })
  
  
}

module.exports.getFormatoSemanal = (req, res) => {
    const id_proyecto = req.params.id_proyecto,
          semana=req.params.semana;
   
    formato.findOne({ 
        where: {id_proyecto,semana}
    }).then(_formato => {
        const ruta_pdf = path.join(__dirname, `../../storeFiles/formatos/${_formato.url_formato}`)
        var pdf = fs.readFileSync(ruta_pdf);
        res.contentType("application/pdf");
        res.send(pdf);
        
    }).catch(err => {
        console.log(err)
        res.status(406).json({err: err})
    })
  
  
}

module.exports.formato_semanal_adjuntado = (req, res) => {
    const id_proyecto = req.params.id_proyecto;
   
    formato.findAll({ 
        where: {id_proyecto}
    }).then(_formato => {
        res.status(200).json(_formato)
        
    }).catch(err => {
        console.log(err)
        res.status(406).json({err: err})
    })
  
  
}
module.exports.notificacionCorreo= (req, res) => {
    const  correo= req.body.correo,
            mensaje= req.body.mensaje,
            subject=req.body.subject ;
            console.log("correo "+correo+" mensaje "+mensaje+" subjet "+subject)
            const mailOptions = {
				from: 'seguimientoresidenciasitch@gmail.com',
				to: correo,
				subject: subject,
				text: mensaje
			}
			transporter.sendMail(mailOptions, (err, info) => {
				if(err){
                res.status(203).json(err)
            	}else{
                res.status(200).json({message:"enviado"})
                }
			})
           
}

module.exports.updateEstadoTareaAddObservacion = (req, res) => {
    const id = req.body.id_tarea;
             
                    tareas.update({
                        estado_revision_semanal:'no aprobado'
                    },{where: {id}}).then((_observacion)=>{
                        // console.log('success=======>    ', result)
                        res.status(200).json(_observacion)
                    }).catch(Sequelize.ValidationError, (err) => {
                        var errores = err.errors.map((element) => {
                            return `${element.path}: ${element.message}`
                        })
                        // console.log('==>', errores)
                        res.status(202).json({errores})
                    }).catch((err) => {
                         console.log(err);
                        res.status(406).json({err: err})
                    })
                

}

module.exports.updateEstadoTarea = (req, res) => {
        const id_tarea = req.body.id_tarea,
            estado = req.body.estado,
            tipo_observacion = req.body.tipo_observacion;
            console.log("-----------------------id tarea------------------------"+id_tarea)
            observaciones.count({
                where: {id_tarea,tipo_observacion,estado:false}
            }).then(_tareas => {
                  //si la tarea tiene alguna observacion pendiente
                if(_tareas>0){
                    res.status(201).json(_tareas);
    
                    console.log("----------------------------------hay observaciones pendientes-------")
                }else{
                  //si la tarea no tienen ninguna observacion pendiente
                       if(tipo_observacion==="revision_semanal"){
                            tareas.update({
                                estado_revision_semanal:estado
                            },{where: {id:id_tarea}}).then((_observacion)=>{
                                // console.log('success=======>    ', result)
                                res.status(200).json(_observacion)
                            }).catch(Sequelize.ValidationError, (err) => {
                                var errores = err.errors.map((element) => {
                                    return `${element.path}: ${element.message}`
                                })
                                // console.log('==>', errores)
                                res.status(202).json({errores})
                            }).catch((err) => {
                                console.log(err);
                                res.status(406).json({err: err})
                            })
                        }else   if(tipo_observacion==="revision_mensual"){
                            tareas.update({
                                estado_revision_mensual:estado
                            },{where: {id:id_tarea}}).then((_observacion)=>{
                                // console.log('success=======>    ', result)
                                res.status(200).json(_observacion)
                            }).catch(Sequelize.ValidationError, (err) => {
                                var errores = err.errors.map((element) => {
                                    return `${element.path}: ${element.message}`
                                })
                                // console.log('==>', errores)
                                res.status(202).json({errores})
                            }).catch((err) => {
                                console.log(err);
                                res.status(406).json({err: err})
                            })
                        }
                  
                }
            }).catch(err => {
                console.log(err)
                res.status(406).json({err: err})
            })
}

module.exports.generarFormatoRevision = (req, res) => {
            const id = req.params.id,numero_semana= req.params.numero_semana;
            console.log("si llegueueueueueueuueueueueueu------------------<----------")
                    Proyecto.findOne({
                        where: {id}, 
                        include:[{model: Anteproyecto, as: 'anteproyecto', include: [{model: Periodo, as: 'periodo', include: [{model: Carrera, as: 'carrera', include: [{model: Departamento, as: 'departamento'}]}]},{model: Alumno, as: 'alumno'},{model:Docente, as:"asesor_interno"}, {model: asesor_externo, as: 'asesor_externo', include: [{model: Empresa, as: 'empresa'}] }]}]
                    }).then((_proyecto)=>{
                        actividades_generales.findAll({
                            where: {id_proyecto:id},order: [
                                ['id_orden', 'ASC'],[subactividades,'id_orden', 'ASC'],[subactividades,tareas,'id_orden', 'ASC']],
                            include:[{model:subactividades, as: 'subactividades',include:[{model:tareas, as: 'tareas',include:[{model:observaciones, as:'observaciones'}] }]}]
                        }).then(_plan => {
                        pdfs.generarFormatoRevisionSemanal(_proyecto,numero_semana,_plan,res);
                        res.contentType("application/pdf");
                            
                        }).catch(err => {
                            console.log(err)
                            res.status(406).json({err: err})
                        })
                    }).catch(Sequelize.ValidationError, (err) => {
                        var errores = err.errors.map((element) => {
                            return `${element.path}: ${element.message}`
                        })
                        // console.log('==>', errores)
                        res.status(202).json({errores})
                    }).catch((err) => {
                        console.log(err)
                    })
        
}
        
