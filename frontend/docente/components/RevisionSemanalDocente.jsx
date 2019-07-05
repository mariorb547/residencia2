import React, {Component} from 'react';

import {Row, Col, Button, Table, Icon, Switch,Popover,Modal,message,Badge,Steps} from 'antd';
import moment from 'moment';
import PDF2 from 'react-pdf-js-infinite';
import FormAddObservacion from '../components/FormAddObservacion.jsx';
import FormShowObservacion from '../components/FormShowObservacion.jsx';
import FormShowObservacionBadge from '../components/FormShowObservacionBadge.jsx';

// components
import uuid from 'uuid';
import axios from 'axios';
const Step = Steps.Step;
var disabledBtnAddObservacion
var disabledEstadoAsesorInterno

   
export default class RevisionSemanal extends Component{
    constructor(props){
        super(props);
        this.state = {
            proyecto: props.proyecto,
            visibleEvidencia: false,
            usuario: props.usuario,
            nombre_asesor_interno:props.nombre_asesor_interno,
            dataSource_tareas:[],
            dataSource_semanas:[],
            dataSource_evidencias:[],
            dataSource_actividades_generales:[],
            filename_evidencia:null,
            id_evidencia:null,
            visibleAddObservacion:false,
            visibleShowObservacion:false,
            visibleShowObservacionBadge:false,
            id_tarea:null,
            dataSource_observaciones:[]
           

        }
        
    }

    componentWillReceiveProps=(nextProps)=>{
      this.setState({
          filename_evidencia:nextProps.filename_evidencia, 
          dataSource_tareas:nextProps.dataSource_tareas,
          dataSource_semanas:nextProps.dataSource_semanas,
          dataSource_evidencias:nextProps.dataSource_evidencias,
          dataSource_observaciones:nextProps.dataSource_observaciones

      })
    }
    componentDidMount=()=>{
        this.getSemanasActividadesGenerales()
        this.obtenerTareas() 
        this.semanas()
     
    }
       

    obtenerTareas=()=>{
        
        var dataTemEvidencia=[]
        var dataTemObservacion=[]
        var tareas=[]
       axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res =>{
   
            if(res.status === 200){
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                //se obtienen las evidencias 
             res.data.map((tarea) => {
                  tareas.push({
                    key: uuid.v1(),
                    id:tarea.id,
                    id_subactividad:tarea.id_subactividad,
                    id_orden:tarea.id_orden,
                    tarea: tarea.tarea,
                    horas:tarea.horas,
                    entregable:tarea.entregable,
                    fecha_entrega:tarea.fecha_entrega,
                    estado_revision_semanal:tarea.estado_revision_semanal,
                                           
                    })
            })

            res.data.map((tarea)=>{
                tarea.evidencias.map((evidencia)=>{
                    dataTemEvidencia.push({
                      key: uuid.v1(),
                      id:evidencia.id,
                      filename_evidencia:evidencia.filename_evidencia,
                      fecha_actualizacion:evidencia.updatedAt,
                      id_tarea:evidencia.id_tarea
                  
                    })
                  })
                 
                  tarea.observaciones.map((observacion)=>{
                      if(observacion.tipo_observacion=="revision_semanal"){
                          dataTemObservacion.push({
                              key: uuid.v1(),
                              id:observacion.id,
                              id_tarea:observacion.id_tarea,
                              observacion:observacion.observacion,
                              estado:observacion.estado,
                              fecha_entrega:tarea.fecha_entrega
                          })
                      }
                   
                    })
            })
           
                this.setState({
                    dataSource_tareas:tareas,
                    dataSource_evidencias:dataTemEvidencia,
                    dataSource_observaciones:dataTemObservacion
        
                })  
                    
             
            }  
                     
        })
    }

    obtenerTareas2=()=>{
        
        var dataTemEvidencia=[]
        var dataTemObservacion=[]
        var tareas=[]
       axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res =>{
   
            if(res.status === 200){
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                
                res.data.map((tarea)=>{
                    tarea.evidencias.map((evidencia)=>{
                        dataTemEvidencia.push({
                        key: uuid.v1(),
                        id:evidencia.id,
                        filename_evidencia:evidencia.filename_evidencia,
                        fecha_actualizacion:evidencia.updatedAt,
                        id_tarea:evidencia.id_tarea
                    
                        })
                    })
                    
                    tarea.observaciones.map((observacion)=>{
                        if(observacion.tipo_observacion=="revision_semanal"){
                            dataTemObservacion.push({
                                key: uuid.v1(),
                                id:observacion.id,
                                id_tarea:observacion.id_tarea,
                                observacion:observacion.observacion,
                                estado:observacion.estado,
                                fecha_entrega:tarea.fecha_entrega
                            })
                        }
                           
                     })

                    tareas.push({
                        key: uuid.v1(),
                        id:tarea.id,
                        id_subactividad:tarea.id_subactividad,
                        id_orden:tarea.id_orden,
                        tarea: tarea.tarea,
                        horas:tarea.horas,
                        entregable:tarea.entregable,
                        fecha_entrega:tarea.fecha_entrega,
                        estado_revision_semanal:tarea.estado_revision_semanal,
                                            
                    })
                    
                })
            
                this.setState({
                    dataSource_tareas:tareas,
                    dataSource_evidencias:dataTemEvidencia,
                    dataSource_observaciones:dataTemObservacion
                }) 
                    
             
            }  
                     
        })

       
        
                       
    }

    
    
    //se filtran las actividades generales por semana
    tareas=(fecha)=>{
        let actividades_filter =this.state.dataSource_actividades_generales;
        actividades_filter =actividades_filter.filter((actividad) => actividad.fecha_entrega === fecha);
        
       
        var hash = {};
        actividades_filter = actividades_filter.filter(function(current) {
          var exists = !hash[current.id] || false;
          hash[current.id] = true;
          return exists;
        });

        const listItems = actividades_filter.map((item) =>
                <li key={uuid.v1()}>{item.actividad}</li>
        );
 
        
     return <div><ul>{listItems}</ul></div>
        
        
      
    }

    //se filtran las actividades generales por semana
    evidencias=(id)=>{
        
        let evidencias_filter =this.state.dataSource_evidencias
        evidencias_filter =evidencias_filter.filter((evidencia) => evidencia.id_tarea === id);
        
        evidencias_filter=evidencias_filter.reverse();
            
        const listItems = evidencias_filter.map((item,index) =>
        <li key={uuid.v1()}>
        <Steps direction="vertical" size="small" current={1}>
         <Step title={"Evidencia "+(index+1)}  icon="file" onClick={()=>this.showEvidencia(item.filename_evidencia,item.id,item.id_tarea)}/>
        </Steps>
             
        </li>
        );
 
        disabledBtnAddObservacion=false
        disabledEstadoAsesorInterno=false
     return <div><ul>{listItems}</ul></div>
    }

    //se filtran las evidencias ...este metodo es para lefecha actual > fecha de revision
    evidenciasRevisionRealizada=(id)=>{
        
        let evidencias_filter =this.state.dataSource_evidencias
        evidencias_filter =evidencias_filter.filter((evidencia) => evidencia.id_tarea === id);
        
        evidencias_filter=evidencias_filter.reverse();
            
        const listItems = evidencias_filter.map((item,index) =>
        <li key={uuid.v1()}>
        <Steps direction="vertical" size="small" current={1}>
         <Step title={"Evidencia "+(index+1)}  icon="file" onClick={()=>this.showEvidencia(item.filename_evidencia,item.id,item.id_tarea)}/>
        </Steps>
             
        </li>
        );
 
        disabledBtnAddObservacion=true
        disabledEstadoAsesorInterno=true
     return <div><ul>{listItems}</ul></div>
    }


    showEvidencia = (filename_evidencia_recibe,id_evidencia_recibe,nuevo_id_tarea) => {

        this.setState({
            visibleEvidencia:true,
            filename_evidencia:filename_evidencia_recibe,
            id_evidencia:id_evidencia_recibe,
            id_tarea:nuevo_id_tarea
        })
    
    }

    semanas=()=>{
        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res =>{
   
            if(res.status === 200){
                 //se recorre los resultados para agregarlos a un arreglo con el key unico
                let semanas=[]
                let fechaComparar=0
                res.data.map((tarea) => {
                    if(tarea.fecha_entrega!=fechaComparar){
                        semanas.push({
                            key: uuid.v1(),
                            fecha_entrega:(
                                <Popover content={this.tareas(tarea.fecha_entrega)} title="Actividades generales">
                                    {tarea.fecha_entrega}
                                </Popover>
                                    ),
                        })
                    }
                    fechaComparar=tarea.fecha_entrega
                   

                })
            

                this.setState({
                    dataSource_semanas:semanas
                })
                
            }             
        })
      
    }

    getSemanasActividadesGenerales=()=>{
        axios.get(`/api/alumno/getPlan_revision_semanal/${this.state.proyecto.id}`).then(res =>{
   
            if(res.status === 200){
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                let semanas=[]
                let fechaComparar=0
                 res.data.map((actividad_general)=>{
                      actividad_general.subactividades.map((subactividad)=>{
                         subactividad.tareas.map((tarea)=>{
                               semanas.push({
                                     fecha_entrega:tarea.fecha_entrega,
                                     actividad:actividad_general.actividad,
                                     id:subactividad.id_actividad_general,
                                 })
                             
                         })
                     })
                 })
                 
                this.setState({
                    dataSource_actividades_generales:semanas
                })
                
            }             
        })
      
    }
    
    comprobarEstado=(estado_revision)=>{
        let estado=false;
        if(estado_revision==="aprobado"){
          estado=true;
        }
  
        return estado;
    }

    notificarResidenteYJefeDepartameto=(correo,semana,tareas)=>{
           axios.post('/api/revision_semanal/notificacion_correo', {
                    correo: correo,
                    mensaje:"Se le notifica que el asesor interno "+this.state.nombre_asesor_interno+ " no realizo la revisión semanal correspondiente a la fecha de entrega  "+semana+
                    " con las tareas:\n"+tareas+"\n Dichas tareas serán revisadas en la próxima fecha de revisión  ",
                    subject:"Notificación de incumplimiento de asesor interno"
            }).then((res) => {
                // console.log(res)
                if(res.status === 200){
                  //  message.success('Notificaci');
                    
                    // message.success(res.data)
                }else{
                    Modal.error({
                        title: 'Error ',
                        content:(
                            <div>
                                {res.data.errores}
                            </div>
                        ), onOk(){}, 
                    })
                }
            }).catch((err) => {
                message.error(err);                                    
            })
    }
    notificarResidenteRevisionFinalizada=(correo,semana)=>{
       
            axios.post('/api/revision_semanal/notificacion_correo', {
                    correo: correo,
                    mensaje:"Se le notifica que el asesor interno "+this.state.nombre_asesor_interno+ "ha concluido con la revisión semanal correspondiente a la fecha de entrega  "+semana+
                    " ",
                    subject:"Notificación de finalización de revisión semanal"
            }).then((res) => {
                // console.log(res)
                if(res.status === 200){
                  //  message.success('Notificaci');
                    
                    // message.success(res.data)
                }else{
                    Modal.error({
                        title: 'Error ',
                        content:(
                            <div>
                                {res.data.errores}
                            </div>
                        ), onOk(){}, 
                    })
                }
            }).catch((err) => {
                message.error(err);                                    
            })
    }

    onChangeEstado = (id, estado,fecha_entrega) => {
      
        if(estado){
          estado="aprobado"
        }else{
          estado="no aprobado"
        }
        axios.post('/api/revision_semanal/update_estado_tarea', {
          id_tarea: id,
          estado: estado,
          tipo_observacion:"revision_semanal",
         
      }).then((res) => {
          // console.log(res)
          if(res.status === 200){
            
              let evidencias_tareas =this.state.dataSource_tareas;
              evidencias_tareas =evidencias_tareas.filter((tarea) => tarea.fecha_entrega === fecha_entrega && tarea.estado_revision_semanal === "revision");
               if(evidencias_tareas.length===1){
                  //no hay tareas pendientes se notifca al residente que se ha finalizado la revisión
                  message.loading('Notificando a residente de revisión finalizada..', 2.5);
                  let correoResidente=this.state.proyecto.anteproyecto.alumno.usuario.correo
                  this.notificarResidenteRevisionFinalizada(correoResidente,fecha_entrega)
               
               }else{
                   //hay tareas pendientes
                  message.success("Estado actializado")
              }
          }else{
              message.error("¡No se puede actualizar el estado! la tarea tiene observaciones pendientes")
              //se recargan las tareas para que la tabla regrese el Switch
                
          }
          //se obtiene las tareas
          this.obtenerTareas()
          
      }).catch((err) => {
          message.error(err);                                    
      })
  
      
    }


    expandedRowRenderTareas=(fecha_entrega)=>{
        let fecha=fecha_entrega.props.children
        let tareas_filter =[]
        
       
        let columnasTareas = [
            {
                width: 100,
                title: 'No. orden',
                dataIndex: 'id_orden',
                key: 'id_orden'
            },

            {
                title: 'Tarea',
                dataIndex: 'tarea',
                key: 'tarea'
            },
            
           
          
        ]
        
        let fecha_actual=moment(moment().format('YYYY-MM-DD'))
       
        //si la diferencias de dias es menor a 4 y la fecha de revision es menor a la fecha actual se habilita la opcion de abjuntar evidencia
        if(moment(fecha_actual).format('YYYY-MM-DD')===fecha){

            this.state.dataSource_tareas.map((tarea)=>{
                //se obtienen las tareas pendientes
                if(tarea.fecha_entrega<fecha_entrega.props.children && tarea.estado_revision_semanal!="aprobado"){
                   tareas_filter.push(tarea)
                }else if(tarea.fecha_entrega===fecha_entrega.props.children){ 
                   // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                }
            })

             tareas_filter.map((tarea)=>{
                //se valida que la tarea tenga evidencia de lo contrario se agrega una observacion para que sea revisa en la siguiente fecha
                let evidencias_filter =this.state.dataSource_evidencias;
                evidencias_filter =evidencias_filter.filter((evidencia) => evidencia.id_tarea === tarea.id);
                let observacion_filter =this.state.dataSource_observaciones;
                observacion_filter =observacion_filter.filter((observacion) => observacion.id_tarea === tarea.id);
                
                
                if(evidencias_filter.length==0 && observacion_filter.length==0){
                      axios.post('/api/proyecto/observacion', {
                           observacion: "Evidencia no entregada, se reprograma para la siguiente revisión ",
                           tipo_observacion: "revision_semanal",
                           id_tarea: tarea.id,
                           id_asesor_interno: this.state.usuario.id_docente
                       }).then((res) => {
                       // console.log(res)
                           if(res.status === 200){
                               //se realiza el update de la tarea a no aprovada en el estado_revision_semanal
                               axios.put('/api/revision_semanal/updateEstadoTareaAddObservacion', {
                                   id_tarea:tarea.id,
                               }).then(res => {
                                   if (res.status === 200) {
                                         this.obtenerTareas()
                                    } 
                     
                                })
                           
                           }else{
                               Modal.error({
                                   title: 'Error al agregar la observación. Revisar los siguientes campos',
                                   content:(
                                       <div>
                                           {res.data.errores}
                                       </div>
                                   ), onOk(){}, 
                               })
                           }
                      }).catch((err) => {
                         message.error(err);                                    
                      })
                      
               }
            })
            columnasTareas.push(
                {
                    width:110,
                   title: 'Estado',
                   dataIndex: 'estado_revision_semanal',
                   key: 'estado_revision_semanal',
                   render: (text, record) => (
                       <Switch onChange={(check) => this.onChangeEstado(record.id, check, record.fecha_entrega)}  defaultChecked={this.comprobarEstado(record.estado_revision_semanal)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                   )
               },
                {
                   width:110,
                   title: 'Evidencia',
                   dataIndex: 'evidencia',
                   key: 'evidencia_doc',
                   render: (text, record) => (
                     <Popover id="PopoverEvidencia" content={this.evidencias(record.id)} title="Evidencias" trigger="hover">
                            <Button icon="file-pdf"></Button>
                     </Popover>
                    )
               },
               {
                    width:"15%",
                    title:"Observaciones",
                    dataIndex:'observaciones',
                    key: 'observaciones',
                    render: (text, record) => (
                        
                        this.state.dataSource_observaciones.length >= 1
                            ? (
                            <Row>
                                    <span>
                                        <Badge  count={ this.state.dataSource_observaciones.filter(solucion => {
                                                      return !solucion.estado&&solucion.id_tarea===record.id
                                                      }).length} >
                                            <Button icon="eye" type="primary" onClick={()=>this.showObservacionBadge(record.id,true)}>Ver</Button>   
                                        </Badge>
                                    </span>
                            </Row>
                            ) : null
                        ),
                } 
            )
        }else if(moment(fecha_actual).format('YYYY-MM-DD')>fecha){
            // se filtran las tareas pertenecientes a la semana selecionada 
            this.state.dataSource_tareas.map((tarea)=>{
                if(tarea.fecha_entrega===fecha_entrega.props.children){ // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                }
            })
            //si ya paso la fecha de revisión entra aqui
            var estado_revision_docente
            tareas_filter.map((tarea)=>{
                //si hay una tarea ya sea revisado o aprobada significa que el docente entro a revisar en fecha establecida
                if(tarea.estado_revision_semanal!="revision"){
                  estado_revision_docente=true
                }
            })

            if(estado_revision_docente){
                columnasTareas.push(
                    {
                        width:110,
                        title: 'Estado',
                        dataIndex: 'estado_revision_semanal',
                        key: 'estado_revision_semanal',
                        render: (text, record) => (
                            <Switch disabled  defaultChecked={this.comprobarEstado(record.estado_revision_semanal)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                        )
                    },
                    {
                        width:110,
                        title: 'Evidencia',
                        dataIndex: 'evidencia',
                        key: 'evidencia_doc',
                        render: (text, record) => (
                        <Popover id="PopoverEvidencia" content={this.evidenciasRevisionRealizada(record.id)} title="Evidencias" trigger="hover">
                                <Button icon="file-pdf"></Button>
                        </Popover>
                        )
                    },
                    {
                         width:"15%",
                         title:"Observaciones",
                         dataIndex:'observaciones',
                         key: 'observaciones',
                         render: (text, record) => (
                             
                             this.state.dataSource_observaciones.length >= 1
                                 ? (
                                 <Row>
                                         <span>
                                             <Badge  count={ this.state.dataSource_observaciones.filter(solucion => {
                                                           return !solucion.estado&&solucion.id_tarea===record.id
                                                           }).length} >
                                                 <Button icon="eye" type="primary" onClick={()=>this.showObservacionBadge(record.id,true)}>Ver</Button>   
                                             </Badge>
                                         </span>
                                 </Row>
                                 ) : null
                             ),
                     } 
                
                )
              //  btn_disabled=false
            }else{
                
                //el asesor interno no entro a revisar en fecha establecida, se notifica al jefe de departamento,residente  y a las tareas se les agrega una observación para que sea revisada en la siguimete fecha
                let correoResidente=this.state.proyecto.anteproyecto.alumno.usuario.correo
                let correoJefedepartamento
                this.state.proyecto.anteproyecto.periodo.carrera.departamento.docentes.map((docente)=>{
                            correoJefedepartamento=docente.usuario.correo
                });
                columnasTareas.push(
                    {
                        width:110,
                        title: 'Estado',
                        dataIndex: 'estado_revision_semanal',
                        key: 'estado_revision_semanal',
                        render: (text, record) => (
                            <Switch disabled  defaultChecked={this.comprobarEstado(record.estado_revision_semanal)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                        )
                    },
                    {
                        width:300,
                        title: 'Evidencia',
                        dataIndex: 'evidencia',
                        key: 'evidencia_doc',
                        render: (text, record) => (
                           <div>Estimado asesor interno, no reviso en fecha programada, se le ha notifico al residente y al jefe de departamento,las tareas de esta fecha, se acumulan para la próxima revisión</div>
                        )
                    }
                )
                
                let tareas=[]
                let notificar=false
                tareas_filter.map((tarea)=>{
                           tareas.push(tarea.id_orden+".-"+tarea.tarea+"\n")
                             
                            //se agrega la observación a cada tarea para que se revisada en la siguinete fecha 
                            axios.post('/api/proyecto/observacion', {
                                    observacion: "Asesor interno no reviso en fecha establecida, será revisada en la proxima fecha de revisión",
                                    tipo_observacion: "revision_semanal",
                                    id_tarea: tarea.id,
                                    id_asesor_interno: this.state.usuario.id_docente
                            }).then((res) => {
                                // console.log(res)
                                   
                                        //se realiza el update de la tarea a no aprovada en el estado_revision_semanal
                                        axios.put('/api/revision_semanal/updateEstadoTareaAddObservacion', {
                                            id_tarea:tarea.id,
                                        }).then(res => {
                                            if (res.status === 200) {
                                            
                                            } 
                                        })
                                    
                                   
                            }).catch((err) => {
                                message.error(err);                                    
                            })
                           
                          
                })

                    this.notificarResidenteYJefeDepartameto(correoResidente,fecha,tareas)
                    this.notificarResidenteYJefeDepartameto(correoJefedepartamento,fecha,tareas)
                   
               
            }
            //btn_disabled=true
        }else if(fecha>moment(fecha_actual).format('YYYY-MM-DD') ){
            // se filtran las tareas pertenecientes a la semana selecionada 
            this.state.dataSource_tareas.map((tarea)=>{
                if(tarea.fecha_entrega===fecha_entrega.props.children){ // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                }
            })
            // si aun no es periodo de revisión entra aqui 
            columnasTareas.push(
                {
                    width:110,
                   title: 'Estado',
                   dataIndex: 'estado_revision_semanal',
                   key: 'estado_revision_semanal',
                   render: (text, record) => (
                       <Switch  disabled defaultChecked={this.comprobarEstado(record.estado_revision_semanal)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                   )
               },
                {
                   width:110,
                   title: 'Evidencia',
                   dataIndex: 'evidencia',
                   key: 'evidencia_doc',
                   render: (text, record) => (
                       <div>Evidencia no disponible</div>
                    )
                }
            )
           // btn_disabled=true
        }

        return (
            <div>
                <Table 
                rowClassName={(record, index) =>record.estado_revision_semanal==='revision'?'ant-table-content-gris' :record.estado_revision_semanal==='aprobado'  ?  'ant-table-content-verde':'ant-table-content-rojo' } 
                title={()=> 'Lista de tareas'} 
                columns={columnasTareas} 
                dataSource={tareas_filter}
                />
            </div>
        )
       
  
      }

    ocultarShowObservacion=()=>{
          this.setState({
              visibleShowObservacion:false
          })
    }
    ocultarShowObservacionBadge=()=>{
        this.setState({
            visibleShowObservacionBadge:false
        })
    } 

    ocultarAddObservacion=()=>{
        this.setState({
            visibleAddObservacion:false
        })
    }

    handleCancel = () => {
        
        this.setState({
          visibleEvidencia: false,
        });
    };
       
    
    getEvidencia_update=()=>{
          if(this.state.id_evidencia>0){
           
            document.getElementById("evidencia").setAttribute("src",`/api/revision_semanal/get_evidencia_update/${this.state.id_evidencia}`)
          }
    }
     

    actulizarCantidadObservacionesAddObservacion =()=>{
         
    }
       
    showAddObservacion = () => {
        this.setState({
            visibleAddObservacion: true,
            visibleShowObservacion:false

        });
    }

    showObservacion = () => {
        this.setState({
            visibleAddObservacion: false,
            visibleShowObservacion:true
        });
    }
    showObservacionBadge = (id_tarea,disabled) => {
        this.setState({
                visibleShowObservacionBadge:true,
                id_tarea:id_tarea
        });
       
    }
    
    render(){

        // console.log('this',proyecto)
        
        const columnasSemanas = [
            {  
                width:"90%",
                title:"Semana",
                dataIndex:'fecha_entrega',
                key: 'fecha_entrega',
              
            },
            {  
                width:"15%",
                title:"Observaciones",
                dataIndex:'observaciones',
                key: 'observaciones',
                render: (text, record) => (
                   
                    this.state.dataSource_observaciones.length >= 1
                      ? (
                        <Row>
                            <span>
                                   <Badge  count={ this.state.dataSource_observaciones.filter(solucion => {
                                        return !solucion.estado&&solucion.fecha_entrega===record.fecha_entrega.props.children
                                    }).length} >
                                    
                                     </Badge>
                                     
                                </span>
                        </Row>
                      ) : null
                  ),
              
            },
       ]
        
        return(
            <div>
                <Row>
                    
                    <Col xs={24} lg={24}>
                    <Table 
                     title={()=> 'Lista de semanas'} 
                     bordered={true}
                     columns={columnasSemanas}
                     dataSource={this.state.dataSource_semanas}
                     expandedRowRender={record =>this.expandedRowRenderTareas(record.fecha_entrega)}

                    />

                    </Col>
                </Row>
                <Modal
                title="Evidencia"
                visible={this.state.visibleEvidencia}
                onCancel={this.handleCancel}
                maskClosable= {true}
                width={'90%'}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>Cerrar</Button>,
                    
                  ]}
                >
                    <Row>
                        <Col span={20}>
                            <iframe id="evidencia" style={{width:"100%",height:500}} src={`/api/revision_semanal/get_evidencia/${this.state.filename_evidencia}`}></iframe>
                        </Col>
                        <Col span={4} >
                            <Button type="primary" disabled={disabledBtnAddObservacion} icon="plus" onClick={this.showAddObservacion}>Agregar observación</Button>
                            <br></br>
                            <br></br>
                            <Button type="primary" icon="eye" onClick={this.showObservacion}>Visualizar observaciones</Button>
                       
                        </Col>
                    </Row>
                    
                </Modal>
            <FormAddObservacion visible={this.state.visibleAddObservacion} actulizarCantidadObservacionesAddObservacion={this.obtenerTareas}  tipo={"revision_semanal"} id_tarea={this.state.id_tarea} usuario={this.state.usuario} ocultarAddObservacion={this.ocultarAddObservacion} rutaUpdateObservacion={'/api/revision_semanal/updateEstadoTareaAddObservacion'}/>
            <FormShowObservacion  visible={this.state.visibleShowObservacion} actulizarCantidadObservaciones={this.obtenerTareas} tipo={"revision_semanal"} id_tarea={this.state.id_tarea} disabledEstadoAsesorInterno={disabledEstadoAsesorInterno} ocultarShowObservacion={this.ocultarShowObservacion}/>
            <FormShowObservacionBadge  visible={this.state.visibleShowObservacionBadge}  tipo={"revision_semanal"} id_tarea={this.state.id_tarea}  ocultarShowObservacion={this.ocultarShowObservacionBadge}/>

            </div>
        )
    }
}