
// Controllers
const usuarioController = require('./controllers/UsuarioController');
const departamentoController = require('./controllers/DepartamentoController');
const docenteController = require('./controllers/DocenteController');
const EmpresaController = require('./controllers/EmpresaController');
const AsesorController = require('./controllers/AsesorExternoController');
const carreraController = require('./controllers/CarreraController');
const alumnoController = require('./controllers/AlumnoController');
const periodoController = require('./controllers/PeriodoController');
const anteproyectoController = require('./controllers/AnteproyectoController');
const proyectoController = require('./controllers/ProyectoController');
const DivisionController = require('./controllers/DivisionController');
const PreRegistroController = require('./controllers/PreRegistroController');
const ColaboracionController = require('./controllers/ColaboracionController');
const SeguimientoController = require('./controllers/SeguimientoController');
const oficinaController = require('./controllers/OficinaController');
const ConvenioController = require('./controllers/ConvenioController');
const puestoContrller = require('./controllers/puesto');
const TituloController = require('./controllers/TituloController');
const ColoniaController = require('./controllers/ColoniaController');
const FolioController = require('./controllers/FolioController');
const PlanDeTrabajoController = require('./controllers/PlanDeTrabajoController');
const RevisionSemanalController = require('./controllers/RevisionSemanalController');

module.exports =  (app, express, passport) => {
   
    const router = express.Router();
    // USUARIO
    router.post('/usuario/auth', passport.authenticate('local-login',
        {
            successRedirect: '/api/usuario/isAuth',
            failureRedirect: '/api/usuario/isAuth'
        }
    ))

    router.get('/usuario/isAuth', usuarioController.isAuth);
    router.get('/usuario/logout', usuarioController.logout);

    router.put('/usuario/cambiar_contrasenia', isAuth, usuarioController.updateContrasenia);
    router.put('/usuario/cambiar_contrasenia/email', isAuth, isAdmin, usuarioController.updateContraseniaEmail); // isAuth
    router.route('/usuarios')
        .get(isAuth, isAdmin, usuarioController.findAll);

    router.route('/usuario/foto/:id')
          .get(isAuth,usuarioController.getFotoUser)
    router.route('/usuario/foto_residente/:ruta')
          .get(isAuth,usuarioController.getFotoResidentes)

    // DEPARTAMENTO
    router.route('/departamento')
        .get(isAuth, departamentoController.findAll)
        .post(isAuth, isAdmin0Jefe, departamentoController.add)
    router.route('/departamentoD')
          .get(isAuth,departamentoController.findAllCarreras)

    router.route('/departamento/:id')
        .get(isAuth, departamentoController.findById) 
        .put(isAuth, isAdmin0Jefe, departamentoController.update)

        .put(isAuth, isAdmin, departamentoController.update)
     router.route('/carreraD/:id')
        .put(isAuth, isJefeDepartamento, carreraController.asignarCoordinadores)
    router.route('/oficinaD/:id')
        .put(isAuth, isJefeDepartamento, carreraController.asignarEncargado)

    router.route('/departamento_todos')
        .get(isAuth, departamentoController.todos)

    // CARRERA
    router.route('/carrera')
        .post(isAuth, carreraController.add)

    router.route('/oficina')
        .post(isAuth, oficinaController.add)


    router.route('/folio')
        .post(isAuth, FolioController.add)
        .get(isAuth,FolioController.folios)
        .put(isAuth,FolioController.update)
    
    router.route('/folio/otros')
    .get(isAuth, FolioController.folios_otros)
    .post(isAuth, FolioController.addDetalleFolioOtros);
    
    router.route('/folio/residentes')
    .get(isAuth,FolioController.folios_residentes);
    
    router.route('/folio/residentes')
    .post(isAuth, FolioController.addDetalleFolioResidentes);

    router.route('/folio/residentes/numero')
    .post(isAuth, FolioController.generarFolioCartaYAgradecimientos);

    router.route('/puesto')
        .post(isAuth, puestoContrller.add)
        .get(isAuth,puestoContrller.puestos)    
    router.route('/colonia')
        .post(isAuth, ColoniaController.add)
        .get(isAuth,ColoniaController.colonias)
        
    router.route('/titulo')
        .post(isAuth, TituloController.add)
        .get(isAuth,TituloController.titulos)

    //COLABORADOR
    router.route('/colaborador')
          .post(ColaboracionController.add)
    router.route('/colaboradores/:ids')
          .get(ColaboracionController.colaboradores)
    router.route('/alumno/:id')
          .get(isAuth, ColaboracionController.findById) 
    router.route('/informacion/seguimientos/:id')
          .get(isAuth,isJefeDepartamento, alumnoController.seguimientos) 
    router.route('/informacion/empresa/:id')
          .get(isAuth,isJefeDepartamento, alumnoController.empresa) 
    router.route('/carrera/asignar_encargados')
        .post(isAuth, isJefeDepartamento, carreraController.asignarEncargados)
    
    router.route('/carrera/asignar_encargadoss')
        .post(isAuth, isJefeDepartamento, carreraController.asignarEncargadoss)
    router.route('/carrera/asignar_docentes')
        .post(isAuth, isJefeDepartamento, carreraController.asignarDocentes)

    router.route('/docente/informacion/:id')
          .get(isAuth, docenteController.informacionDocente)
    
    router.route('/carrera/:id_carrera/docentes_asignados')
        .get(isAuth, carreraController.docentesAsignados);



    router.route('/docentesGestion')
        .get(isAuth,docenteController.departamentoGestion);

    router.route('/asesor_externos1')
        .get(isAuth,AsesorController.asesor_externos);

    router.route('/carrera/periodo')
        .post(isAuth, isJefeDepartamento, carreraController.addPeriodo)
     router.route('/carrera/periodos')
        .post(isAuth, isJefeDepartamento, carreraController.addPeriodos)
    
    router.route('/carrera/:id_carrera/periodos')
        .get(carreraController.findById)
    router.route('/carrera/periodos_todos/:value')
        .get(isAuth,isJefeDepartamento, carreraController.findByPeridos)

    router.route('/empresa/verificar/:id')
        .get(isAuth,isJefeDepartamento, EmpresaController.verificar)
    
    router.route('/periodo/dictamen/:periodo')
        .get(isAuth,isJefeDepartamento, periodoController.getPeriodo)
    router.route('/carreras')
        .get(DivisionController.carreras)
    
    router.route('/oficinas/:id')
        .get(oficinaController.oficinas)

    router.route('/carrera_coordinadores')
        .get(DivisionController.carrerasCordinadores)

    router.route('/oficina_encargados')
        .get(DivisionController.oficinasEncargados)



    router.route('/carrera_presidentes/:id')
        .get(DivisionController.carreraPresidentes)        
    
     router.route('/carrera/periodo')
        .post(DivisionController.addPeriodos)

    router.route('/carrera/docente_habilitado')
        .put(isAuth, carreraController.docenteHabilitado)
    // EMPRESAS
    router.route('/empresa')
        .get(isAuth, EmpresaController.findAll)
        .post(isAuth, isJefeDeptoOrAdmin, EmpresaController.add)
    
    router.route('/empresa/:id')
        .put(isAuth, isJefeDeptoOrAdmin, EmpresaController.update);
    //pre-registro

    router.route('/pre_registro')
          .post(PreRegistroController.add);

    router.route('/directorio/empresas')
          .get(isAuth,isJefeDepartamento, EmpresaController.directorio);


    router.route('/pre_registro')
          .get(isAuth,isJefeDepartamento, PreRegistroController.findAll);
    
          router.route('/directorio/telefonico')
          .get(isAuth,isJefeDepartamento, PreRegistroController.directorio);

    router.route('/periodos')
          .get(PreRegistroController.periodos);
  
    // DOCENTE
    router.route('/docente')
        .post(isAuth, isJefeDeptoOrAdmin, docenteController.add)
    
    router.route('/docente/encargado')
        .post(isAuth, isJefeDeptoOrAdmin, docenteController.addencargado)


    router.route('/docentes')
        .get(isAuth, docenteController.findAll)

    router.route('/carreracoordinador/:id_carrera')
          .get(isAuth,docenteController.carreraCoordinador);

    router.route('/encargadooficinas/:id')
          .get(isAuth,docenteController.oficinaEncargado);

    router.route('/docentesdivision')
          .get(isAuth,docenteController.docentesdivision);

    router.route('/docentesgestion')
          .get(isAuth,docenteController.docentesgestion);

    router.route('/docente/subdirector_academico')
        .put(isAuth, isAdmin0Jefe, docenteController.updateSubdirectorAcademico);
    
    router.route('/docente/jefeDivisionEstudiosProfesionales')
        .put(isAuth, isJefeDepartamento, docenteController.updateJefeDeDivisionDeEstudiosProfesionales);

    // ASESOR EXTERNO
    router.route('/asesor_externo')
        .post(isAuth,  AsesorController.add)
    //Anteproyectos por periodo
    router.route('/periodo/:id_periodo/anteproyectos')
        .get(isAuth, carreraController.findAnteproyectosByPeriodo);
    router.route('/periodoss')
        .get(isAuth, carreraController.findAllPeriodos);
    // ALUMNOS
    router.route('/alumno')
        .post(isAuth, isJefeDeptoOrDocente, alumnoController.add)
        .put(isAuth, isCandidatoAResidente, alumnoController.update)

    router.route('/alumno/situacion')
         .put(isAuth, alumnoController.situacion)

    router.route('/alumno/situacion/numeroseguimientos')
         .put(isAuth, alumnoController.numeroseguimientos)
         
    router.route('/alumno/entregables')
         .put(isAuth, isJefeDepartamento, alumnoController.entregables)

    router.route('/convenio/empresa')
         .put(isAuth, isJefeDepartamento, EmpresaController.convenio)

    router.route('/alumno/periodot/:id')
        .get(isAuth, isJefeDepartamento, alumnoController.findPeriodos)


    router.route('/alumno/cancelacion')
        .put(isAuth, isJefeDeptoOrDocente, alumnoController.cancelacionProyecto);

    router.route('/alumno/:id_alumno/cancelacion')
        .get(isAuth, alumnoController.getCancelacionProyecto);
    
    router.route('/alumno/cancelacion_justificacion')
        .put(isAuth, isResidente,alumnoController.justificacionCancelacionProyecto);

    router.route('/alumno/:id_cancelacion/generarFormatoDeCancelacion')
        .get(isAuth, isResidente, alumnoController.generarFormatoDeCancelacion);

    router.route('/alumno/:id/anteproyecto')
        .get(isAuth, alumnoController.getAnteproyecto)
        .put(isAuth, isCandidatoAResidente, alumnoController.updateDatosAnteproyecto);
    
    router.route('/alumno/:id_alumno/solicitud_residencia')
        .get(isAuth, isCandidatoAResidente, alumnoController.generarSolicitudDeResidencia);

    router.route('/jefe/:value/convenios')
        .get(isAuth, alumnoController.generarListaDeConvenios);

    router.route('/alumno/:id_alumno/situacion')
        .get( alumnoController.generarSituacion);
        
    router.route('/alumno/:id_alumno/portada_proyecto')
        .get(isAuth, isCandidatoAResidente, alumnoController.generarPortadaDeProyecto);

    router.route('/alumno/:id/portada_proyecto.docx')
        .get(isAuth, alumnoController.generarPortadaDeProyectoword);

    router.route('/alumno/comprobante/:id/comprobante.docx')
        .get( alumnoController.generarSituacionWord);

    router.route('/dictamen/word/:id/:filname')
        .get( alumnoController.getDictamenWord);

    router.route('/dictamen/generar/word/:id')
        .get( alumnoController.generarDictamenword);
        
    router.route('/residentes/:id_periodo/termino/:id_carrera')
        .get(isAuth,isJefeDepartamento, alumnoController.generarTerminoDeResidencias);

    router.route('/residentes/:id_periodo/periodo/:id_carrera')
        .get( alumnoController.reporteGeneralPorPeriodo);

    router.route('/residentes/:id_periodo/periodo/:id_carrera/reporte_por_periodo.docx')
        .get( alumnoController.reporteGeneralPorPeriodoword);
    
    router.route('/solicitud/:id/solicitud_prorroga.docx')
        .get( alumnoController.solicitudProrrogaWord);

    router.route('/solicitud/:id/oficio_prorroga.docx')
        .get( alumnoController.oficioProrrogaWord); 


    router.route('/residentes/ciclo/:ciclo')
        .get( alumnoController.reporteGeneralPorciclo);

    router.route('/residentes/ciclo/:ciclo/reporte_por_ciclo.docx')
        .get( alumnoController.reporteGeneralPorcicloword);

    router.route('/primerword/:id/solicitud.docx')
        .get( alumnoController.primerWordEjemplo);

    router.route('/alumno/:id_alumno/CartaPresentacion')
        .get( alumnoController.generarCartaPresentacion);

    router.route('/alumno/:id/CartaPresentacion.docx')
        .get( alumnoController.generarCartaPresentacionword);

    router.route('/alumno/:id/proyecto')
        .get(isAuth, alumnoController.getProyecto)

    router.route('/alumno/proyecto_para_asesor_externo/:id_proyecto')
        .get(isAuth, alumnoController.getProyectoAsesorExterno)

    router.route('/alumno/proyecto_para_asesor_interno/:id_proyecto')
        .get(isAuth, alumnoController.getProyectoAsesorInterno)

    router.route('/alumno/revision_seguimiento/:id_proyecto')
        .get(isAuth, alumnoController.getProyectoRevisionSeguimientos)

    router.route('/alumno/:id/proyecto_find_or_create')
        .get(isAuth, alumnoController.getProyectoFindOrCreate)
        
    router.route('/alumno/:id/_proyecto')
        .get(isAuth, alumnoController.get_Proyecto);

    router.route('/alumno/file_comprobante/:id')
        .post(isAuth, alumnoController.addFileComprobante);
    
    router.route('/alumno/file_anteproyecto/:id_anteproyecto')
        .post(isAuth, isCandidatoAResidente, alumnoController.addFileAnteproyecto);

    router.route('/empresa/file_convenio/:id')
        .post(isAuth,isJefeDepartamento, alumnoController.addfileconvenio)


    router.route('/empresa/convenio')
        .post(isAuth, isJefeDeptoOrDocente, EmpresaController.addConvenio)

    router.route('/empresa/nueva')
        .post(isAuth, EmpresaController.addEmpresaNueva)

    router.route('/empresa/convenio/actual')
        .put(isAuth, isJefeDepartamento, ConvenioController.ConvenioActualizacion);
    

    router.route('/empresa/nueva/registro/:id')
        .put(isAuth, EmpresaController.actualizarRegistroEmpresa);    

    router.route('/convenio/empresa/actualizar')
        .put(isAuth, isJefeDepartamento, ConvenioController.actualizarconvenio);

    router.route('/convenio/empresa/eliminar')
        .put(isAuth, isJefeDepartamento, ConvenioController.eliminarvacios);


    router.route('/convenio/empresa/eliminar/convenios')
        .put(isAuth, isJefeDepartamento, ConvenioController.eliminarvaciosconvenios);

    router.route('/alumno/file_foto/:id')
        .post(isAuth,usuarioController.addFoto);     
    router.route('/alumno/file_plan_trabajo/:id_proyecto')
        .post(isAuth, isResidente, alumnoController.addFilePlanTrabajo)

    router.route('/plan_de_trabajo/pdf/:filename')
        .get(isAuth, alumnoController.getPlanDeTrabajoPDF)

    router.route('/alumno/cronograma/:id_proyecto')
        .post(isAuth, isResidente, alumnoController.addCronograma)
    
    router.route('/cronograma/pdf/:filename')
        .get(isAuth, isJefeDeptoOrDocenteOrResidente, alumnoController.getCronogramaPDF)

    router.route('/alumnos/:id_carrera/rechazados')
        .get(isAuth, alumnoController.findAllRechazadosPorCarrera)

    router.route('/alumno/retry_anteproyecto')
        .put(isAuth, isJefeDeptoOrDocente, alumnoController.retryAnteproyecto)
    router.route('/alumno/informacion/:id')
          .get(isAuth, alumnoController.getAlumnodatos)
    // PROYECTO
    router.route('/proyectos/asesor_interno/:id_asesor_interno')
        .get(isAuth, proyectoController.getProyectosByAsesorInterno)
    router.route('/proyectos/asesor_externo/:id_asesor_externo')
        .get(isAuth, proyectoController.getProyectosByAsesorExterno)
    
    router.route('/proyectos/empresa/:id')
        .get(isAuth, proyectoController.getProyectosByEmpresa)  

  
    router.route('/proyecto/onChange_observacion_alumno')
    .put(isAuth, PlanDeTrabajoController.updateObservacionAlumno)

        router.route('/proyecto/observacion')
        .post(isAuth,  PlanDeTrabajoController.addObservacion)
        .put(isAuth, PlanDeTrabajoController.updateObservacion)
       
    router.route('/proyecto/updateEstadoTareaAddObservacionPlan')
         .put(isAuth, PlanDeTrabajoController.updateEstadoTareaAddObservacionPlan)

        
        
    router.route('/proyecto/:id_proyecto/observaciones')
        .get(isAuth, proyectoController.findObservaciones)

    router.route('/proyecto/:id_proyecto/asesorias')
        .get(isAuth, proyectoController.findAsesorias)
    
    router.route('/proyecto/asesoria/solucion_recomendada')
        .post(isAuth, isJefeDeptoOrDocente, proyectoController.addSolucionRecomendada)
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.updateSolucionRecomendada)

    router.route('/proyecto/evaluacionAnexoIII/criterios/asesor_interno')
        .get(isAuth, isJefeDeptoOrDocente, proyectoController.getCriteriosEvaluacionAnexoIIIAsesorInterno);

    router.route('/proyecto/evaluacionAnexoIII/criterios/asesor_externo')
        .get(isAuth, isAsesorExterno, proyectoController.getCriteriosEvaluacionAnexoIIIAsesorExterno);

    router.route('/proyecto/evaluacionAnexoXXX/criterios/asesor_interno')
        .get(isAuth,  isJefeDeptoOrDocente, proyectoController.getCriteriosEvaluacionAnexoXXXAsesorInterno);
    router.route('/proyecto/evaluacionAnexoXXX/criterios/asesor_externo')
        .get(isAuth, isAsesorExterno, proyectoController.getCriteriosEvaluacionAnexoXXXAsesorExterno);

    router.route('/proyecto/evaluacionAnexoXXIX/criterios/asesor_interno')
        .get(isAuth, isJefeDeptoOrDocente, proyectoController.getCriteriosEvaluacionAnexoXXIXAsesorInterno);
    router.route('/proyecto/evaluacionAnexoXXIX/criterios/asesor_externo')
        .get(isAuth, isAsesorExterno, proyectoController.getCriteriosEvaluacionAnexoXXIXAsesorExterno);



    router.route('/proyecto/evaluacion/asesor_interno')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.addEvaluacionAsesorInterno);
        
    router.route('/proyecto/evaluacion/asesor_externo')
        .put(isAuth, isAsesorExterno, proyectoController.addEvaluacionAsesorExterno);

    router.route('/proyecto/evaluacion_seguimiento/asesor_interno')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.addEvaluacionSeguimientoAsesorInterno);
    router.route('/proyecto/evaluacion_seguimiento/asesor_externo')
        .put(isAuth, isAsesorExterno, proyectoController.addEvaluacionSeguimientoAsesorExterno);

    router.route('/proyecto/autorizar_carta_liberacion/asesor_interno')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.autorizarCartaDeLiberacionAsesorInterno);
    router.route('/proyecto/autorizar_carta_liberacion/asesor_externo')
        .put(isAuth, isAsesorExterno, proyectoController.autorizarCartaDeLiberacionAsesorExterno);
    
    router.route('/seguimiento/carreras')
          .get(isAuth, isJefeDepartamento,SeguimientoController.getSeguimiento)
     router.route('/seguimiento/carreras1')
          .get(isAuth, isJefeDepartamento,SeguimientoController.getSeguimientos)
    router.route('/seguimiento/generar/:id')
          .get(isAuth, isJefeDepartamento,SeguimientoController.generarSeguimiento)

    router.route('/seguimiento/generar/reportefinal/:id')
          .get(isAuth, isJefeDepartamento,SeguimientoController.generarReporteFinal)  
          
          
    router.route('/generar/:id/seguimiento/:ids/seguimiento')
          .get( SeguimientoController.generarSeguimientopdf)

    router.route('/generar/:id/seguimiento/seguimientofinal')
          .get( SeguimientoController.generarSeguimientofinalPdf)
        
    router.route('/seguimientos/divi/:id')
          .get(isAuth,isJefeDepartamento,SeguimientoController.getSeguimientodivi)
    router.route('/proyecto/seguimientos')
        .put(isAuth, isJefeDeptoOrDocenteOrResidente, proyectoController.findOrCreateSeguimientos) // is jefe depto docente y residente
    router.route('/proyecto/informe_tecnico')
        .put(isAuth, isResidente, proyectoController.updateInformeTecnico)
    
        router.route('/situacion/periodo/:id')
        .get(isAuth, isJefeDepartamento, periodoController.ActulizandoEstadoResidentes)

    router.route('/revisar/seguimiento/:id')
        .put(isAuth, isJefeDepartamento,SeguimientoController.verseguimiento)


    router.route('/proyecto/:id_proyecto/seguimientos')
        .get(isAuth, proyectoController.findSeguimientos);

     router.route('/todos/los/seguimientos/:id')
        .get(isAuth, SeguimientoController.revisionDeTodosLosSeguimientos); 

    router.route('/proyecto/seguimiento')
        .put(isAuth, isResidente, proyectoController.updateSeguimiento);
    
    router.route('/proyecto/seguimiento/observacion')
        .post(isAuth, isJefeDeptoOrDocente, proyectoController.addObservacionSeguimiento)
    
    router.route('/proyecto/revision_seguimiento')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.updateRevisionSeguimiento)
    
    router.route('/proyecto/revision_seguimiento_entrego')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.updateRevisionSeguimientoentrega)

    router.route('/proyecto/asesoria/:id_asesoria/soluciones_recomendadas')
        .get(isAuth, proyectoController.findSolucionesRecomendadas)

    router.route('/proyecto/asesoria')
        .post(isAuth, isResidente, proyectoController.addAsesoria)
    router.route('/proyecto/asesoria_autorizar_formato')
        .put(isAuth, isJefeDeptoOrDocente, proyectoController.updateAutorizarFormatoAsesoria)

    router.route('/asesoria/:id_asesoria/generar_formato/')
        .get(isAuth, isResidente, proyectoController.generarFormatoDeAsesoria)

    router.route('/proyecto/:id_proyecto/formato_evaluacion/anexoIII')
        .get(isAuth, isResidente, proyectoController.generarFormatoDeEvaluacionAnexoIII)

    router.route('/proyecto/:id_proyecto/formato_evaluacion/anexoXXX')
        .get(isAuth, isResidente, proyectoController.generarFormatoDeEvaluacionAnexoXXX)
    
    router.route('/proyecto/:id_seguimiento/formato_evaluacion/anexoXXIX')
        .get( isAuth, isResidente, proyectoController.generarFormatoDeEvaluacionAnexoXXIX)
    
    router.route('/proyecto/:id_proyecto/carta_liberacion/asesor_externo')
        .get(isAuth, isResidente, proyectoController.generarCartaLiberacionAsesorExterno)

    router.route('/proyecto/:id_proyecto/carta_liberacion/asesor_interno')
        .get(isAuth, isResidente, proyectoController.generarCartaLiberacionAsesorInterno)    
    
    router.route('/asesoria/tipo')
        .put(isAuth,isJefeDeptoOrDocente, proyectoController.updateTipoAsesoria);
    // ANTEPROYECTO
    router.route('/anteproyectos/:id_periodo')
        .get(isAuth, anteproyectoController.findByPeriodo)

    router.route('/anteproyecto/pdf/:filename')
        .get(isAuth, anteproyectoController.getAnteproyectoPDF)
    
    router.route('/convenios/pdf/:id')
        .get(isAuth, anteproyectoController.getConvenio)

    router.route('/comprobantes/pdf/:id')
        .get(isAuth, anteproyectoController.getComprobante)


    router.route('/anteproyecto/factibilidad')
        .put(isAuth, isJefeDeptoOrDocente, anteproyectoController.addFactibilidad)
        
    router.route('/anteproyecto/factibilidad/correciones')
        .put(isAuth, isJefeDeptoOrDocente, anteproyectoController.addFactibilidadCorrecciones)

    router.route('/anteproyecto/set_dictamen')
        .put(isAuth,isJefeDeptoOrDocente, anteproyectoController.setDictamen);
    router.route('/anteproyecto/set_asesor_interno')
        .put(isAuth, isJefeDeptoOrDocente, anteproyectoController.setAsesorInterno);
    // PERIODO
    router.route('/periodo/:id/')
        .get(isAuth, periodoController.findById);
    
    router.route('/periodo/:id/dictamen')
        .get(isAuth, periodoController.findDictamen);
    
    router.route('/periodo/fecha_fin_entrega_anteproyecto')
        .put(isAuth, isJefeDepartamento, periodoController.updateFechaFinEntregaAnteproyectos);
    
    router.route('/periodo/fecha_fin_entrega_anteproyectos')
        .put(isAuth, isJefeDepartamento, periodoController.updateFechaFinEntregaAnteproyectoss);
        
    router.route('/dictamens/pdf/:filename')
        .get(isAuth, periodoController.getDictamenPDF);
        
    router.route('/periodo/generar_dictamen')
        .post(isAuth, isJefeDepartamento, periodoController.generarDictamen)
    
        router.route('/periodo/seguimiento')
        .post(isAuth, isJefeDepartamento, periodoController.addSeguimiento);
    router.route('/periodo/seguimientos')
        .post(isAuth, isJefeDepartamento, periodoController.addSeguimientos);
    
    router.route('/periodo/:id_periodo/proyectos')
        .get(isAuth, periodoController.getProyectos);

    router.route('/plan_de_trabajo/actividad_general')
        .post(isAuth, isResidente, PlanDeTrabajoController.addActividadGeneral);
        
    router.route('/plan_de_trabajo/update_actividad_general')
        .post(isAuth, isResidente, PlanDeTrabajoController.updateActividadGeneral);
        
    router.route('/plan_de_trabajo/addSubactividad')
    .post(isAuth, isResidente, PlanDeTrabajoController.addSubactividad);
    
    router.route('/plan_de_trabajo/update_subactividad')
    .post(isAuth, isResidente, PlanDeTrabajoController.updateSubactividad);

    router.route('/plan_de_trabajo/addTarea')
    .post(isAuth, isResidente, PlanDeTrabajoController.addTarea);

    router.route('/plan_de_trabajo/update_tarea')
    .post(isAuth, isResidente, PlanDeTrabajoController.updateTarea);
 
    router.route('/plan_de_trabajo/:id/get_plan_de_trabajo')
    .get(isAuth,PlanDeTrabajoController.getPlanDeTrabajo);

    router.route('/plan_de_trabajo/:id/generar_plan_de_trabajo')
    .get(isAuth,PlanDeTrabajoController.generarPlanTrabajo);

    router.route('/plan_de_trabajo/:id/get_cronograma')
    .get(isAuth,PlanDeTrabajoController.getCronograma);

    router.route('/plan_de_trabajo/:id_proyecto/max_actividades_generales')
    .get(isAuth,PlanDeTrabajoController.maxActividadesGenerales);

    router.route('/plan_de_trabajo/:id_proyecto/max_subactividades')
    .get(isAuth,PlanDeTrabajoController.maxSubactividades);

    router.route('/plan_de_trabajo/:id_proyecto/max_tareas')
    .get(isAuth,PlanDeTrabajoController.maxTareas);

    router.route('/plan_de_trabajo/:id_proyecto/get_actividad_general')
        .get(isAuth,PlanDeTrabajoController.findPlanDeTrabajoAlumno);

    router.route('/plan_de_trabajo/:id_subactividad/get_subactividades')
        .get(isAuth,PlanDeTrabajoController.findAllSubActividades);
    
    router.route('/plan_de_trabajo/:id_subactividad/get_tareas')
        .get(isAuth,PlanDeTrabajoController.findAllTareas);
    
    router.route('/revision_semanal/:id_proyecto/get_tareas_completas')
        .get(isAuth,RevisionSemanalController.findTareaCompleta);
    
       
    router.route('/plan_de_trabajo/:id_tarea/:tipo_observacion/get_observaciones')
        .get(isAuth,PlanDeTrabajoController.findAllObservaciones);
    
    router.route('/plan_de_trabajo/delete_actividad_general')
        .post(isAuth, isResidente,PlanDeTrabajoController.deleteActividadGeneral);

     
    router.route('/plan_de_trabajo/delete_subactividad')
        .post(isAuth, isResidente,PlanDeTrabajoController.deleteSubactividad);
    
    router.route('/plan_de_trabajo/delete_tarea')
        .post(isAuth, isResidente,PlanDeTrabajoController.deleteTarea);

    router.route('/plan_de_trabajo/up_actividad_general')
        .post(isAuth, isResidente,PlanDeTrabajoController.upActividadGeneral);
       
    router.route('/plan_de_trabajo/recorrer_subactividad')
        .post(isAuth, isResidente,PlanDeTrabajoController.recorrerSubactividad);
    
    router.route('/plan_de_trabajo/recorrer_tarea')
        .post(isAuth, isResidente,PlanDeTrabajoController.recorrerTarea);
       
    router.route('/plan_de_trabajo/update_estado_tarea')
        .post(isAuth,PlanDeTrabajoController.updateEstadoTarea);
    
    router.route('/plan_de_trabajo/notificacion_observaciones_plan')
        .post(isAuth,PlanDeTrabajoController.notificacionObservacionesPlan);
     
    router.route('/plan_de_trabajo/updateProrrogaPlanTrabajo')
        .post(isAuth,PlanDeTrabajoController.updateProrrogaPlanTrabajo);   
    
    router.route('/alumno/file_evidencia/:id_tarea')
        .post(isAuth, isResidente, RevisionSemanalController.addFileEvidencia)
    
    router.route('/alumno/file_formato_semanal/:id_proyecto/:semana')
        .post(isAuth, RevisionSemanalController.addFileFormatoSemanal)


    router.route('/alumno/update_file_evidencia/:id_evidencia')
        .post(isAuth, isResidente, RevisionSemanalController.updateFileEvidencia)

    router.route('/alumno/getPlan_revision_semanal/:id')
        .get(isAuth, RevisionSemanalController.getPlanDeTrabajo)
    
    router.route('/revision_semanal/get_evidencia/:filename')
        .get(isAuth, RevisionSemanalController.getEvidencia)
       
    router.route('/revision_semanal/get_evidencia_update/:id')
        .get(isAuth, RevisionSemanalController.getEvidenciaUpdate)
    
    router.route('/revision_semanal/get_formato_semanal/:id_proyecto/:semana')
        .get(isAuth, RevisionSemanalController.getFormatoSemanal)

    router.route('/revision_semanal/:id_proyecto/formato_semanal_adjuntado')
        .get(isAuth, RevisionSemanalController.formato_semanal_adjuntado)


    router.route('/revision_semanal/notificacion_correo')
        .post(isAuth,RevisionSemanalController.notificacionCorreo);

    router.route('/revision_semanal/updateEstadoTareaAddObservacion')
         .put(isAuth, RevisionSemanalController.updateEstadoTareaAddObservacion)

    router.route('/revision_semanal/update_estado_tarea')
         .post(isAuth,RevisionSemanalController.updateEstadoTarea);
    
    router.route('/revision_semanal/:id/:numero_semana/generar_formato_revision')
         .get(isAuth,RevisionSemanalController.generarFormatoRevision);
     
    router.route('/seguimientos/obtener_seguimientos/:id_periodo')
         .get(isAuth,SeguimientoController.obtenerSeguimientos)

    router.route('/revision_mensual/updateEstadoTareaAddObservacion')
         .put(isAuth, SeguimientoController.updateEstadoTareaAddObservacion)

    router.route('/seguimiento/onChange_observacion')
         .put(isAuth, SeguimientoController.updateEstadoObservacion)
     


       

    app.use('/api', router);
     // Redirect trafict to react app
     app.get('*', (req, res) => {
        res.render('index');
    });

    function isJefeDeptoOrDocenteOrResidente(req, res, next){
        if(req.user.rol === 'jefe_departamento' || req.user.rol === 'docente' || req.user.rol === 'residente')
            return next();
        res.status(203).json({error: "Acceso denegado debe tener permisos de jefe de departamento o presidente de academia."})
    }
    function isJefeDeptoOrDocente(req, res, next){
        if(req.user.rol === 'jefe_departamento' || req.user.rol === 'docente')
            return next();
        res.status(203).json({error: "Acceso denegado debe tener permisos de jefe de departamento o presidente de academia."})
    }
    function isJefeDeptoOrAdmin(req, res, next){
        if(req.user.rol === 'jefe_departamento' || req.user.rol === 'admin')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de jefe de departamento o administrador."})
    }
    function isDocente(req, res, next) {
        if(req.user.rol === 'docente')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isResidente(req, res, next) {
        if(req.user.rol === 'residente')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isJefeDepartamento(req, res, next) {
        if(req.user.rol === 'jefe_departamento')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isCandidatoAResidente(req, res, next) {
        if(req.user.rol === 'candidato_residente' )
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isAsesorExterno(req, res, next) {
        if(req.user.rol === 'asesor_externo')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isAdmin(req, res, next) {
        if(req.user.rol === 'admin')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }
    function isAdmin0Jefe(req, res, next) {
        if(req.user.rol === 'admin' ||req.user.rol === 'jefe_departamento')
            return next()
        res.status(203).json({error: "Acceso denegado debe tener permisos de docente en el sistema."})
    }

    function isAuth(req, res, next){
        if(req.isAuthenticated())
            return next()
        res.status(203).json({error: "Necesita autenticarse"});
    }
}