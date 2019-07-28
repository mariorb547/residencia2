import React, {Component} from 'react';

import {Row, Col, Button, Table, Icon, Switch,Popover,Modal,Badge,message,Form,Tooltip,Steps,Tag} from 'antd';
import moment from 'moment';
import WrappedAddEvidencia from './addEvidenciaSemanal.jsx';
import WrappedAddFormatoSemanal from './addFormatoSemanal.jsx';
import FormShowObservacionBadge from './FormShowObservacionBadge.jsx';
import FormShowObservacion from './FormShowObservacion.jsx';
import PDF2 from 'react-pdf-js-infinite';

const Step = Steps.Step;

// components
import uuid from 'uuid';
import axios from 'axios';
const FormItem = Form.Item;
var btn_generar_formato_disabled=false
var numero_semana=0
var semana=""
var disabledFormatoSemanal=false
export default class RevisionSemanal extends Component{
    constructor(props){
        super(props);
        this.state = {
            proyecto: props.proyecto,
            visibleEvidencia: false,
            usuario: props.usuario,
            dataSource_tareas:[],
            dataSource_semanas:[],
            dataSource_evidencias:[],
            dataSource_actividades_generales:[],
            dataSource_formato_semanal:[],
            filename_evidencia:null,
            id_evidencia:null,
            dataSource_observaciones:[],
            visibleShowObservacion:false,
            visibleShowObservacionBadge:false,
            id_tarea:null,
            visibleAdjuntarFormatoSemanal:false,
            
            

        }
    }
    componentWillReceiveProps=(nextProps)=>{
      this.setState({
          filename_evidencia:nextProps.filename_evidencia,
          
      })
    }
    componentDidMount=()=>{
        this.getSemanasActividadesGenerales()
        this.obtenerTareas() 
        this.semanas()
        this.formatoSemanalAdjuntado()

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
                    tarea.evidencias.map((evidencia)=>{
                        dataTemEvidencia.push({
                          key: uuid.v1(),
                          id:evidencia.id,
                          filename_evidencia:evidencia.filename_evidencia,
                          fecha_actualizacion:evidencia.updatedAt,
                          id_tarea:evidencia.id_tarea
                      
                        })
            })

            res.data.map((tarea)=>{
                
                  })
                 
                  tarea.observaciones.map((observacion)=>{
                      if(observacion.tipo_observacion=="revision_semanal"){
                          dataTemObservacion.push({
                              key: uuid.v1(),
                              id:observacion.id,
                              id_tarea:observacion.id_tarea,
                              observacion:observacion.observacion,
                              estado:observacion.estado,
                              estado_alumno:observacion.estado_alumno,
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
                let numero_semana=1
                res.data.map((tarea) => {
                    if(tarea.fecha_entrega!=fechaComparar){
                        semanas.push({
                            key: uuid.v1(),
                            fecha_entrega:(
                                <Popover content={this.tareas(tarea.fecha_entrega)} title="Actividades generales">
                                    {tarea.fecha_entrega}
                                </Popover>
                                    ),
                            numero_semana:numero_semana
                        },
                        
                        
                        )
                        numero_semana++
                    }
                    fechaComparar=tarea.fecha_entrega
                   

                })
            

                this.setState({
                    dataSource_semanas:semanas
                })
                
            }             
        })
      
    }

    formatoSemanalAdjuntado=()=>{
        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/formato_semanal_adjuntado`).then(res =>{
            if(res.status === 200){
                 console.log("formato "+JSON.stringify(res.data))
                 const formato=res.data.map((formato) => {
                    return {
                            key: uuid.v1(),
                            semana:formato.semana
                    }
                 })

                this.setState({dataSource_formato_semanal:formato})
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

    comprobarFormatoAdjundo=(semana)=>{
        let fecha_actual=moment().format('YYYY-MM-DD')
        //si aun no se cumple la fecha de revisión no se puede generar el formato
        if(semana>fecha_actual){
            disabledFormatoSemanal=true
            return true
        }else{
            let formato_filter =this.state.dataSource_formato_semanal;
            formato_filter=formato_filter.filter((formato) => formato.semana === semana);
            
            // si es mayor o iguala uno significa que ya se angunto el formato ya no se podra genererar nueva menete 
            if(formato_filter.length>=1){
                disabledFormatoSemanal=true
                return true;
                
            }else{
                disabledFormatoSemanal=false
                return false;

            }
        }
    }

      // se comprueban las fechas 
    disabledEvidencia=(fecha_enetrega)=>{
          let fecha_actual=moment(moment().format('YYYY-MM-DD'))
        let operacionFechas=fecha_actual.diff(fecha_enetrega, 'days')
        
        if(operacionFechas<=4){
            return false
        }else{
            return true
        }
       
    }

    showObservacionBadge = (id_tarea) => {
        this.setState({
            visibleShowObservacionBadge:true,
            id_tarea:id_tarea
         })
       
    }

    showObservacion = (id_tarea) => {
        this.setState({
            visibleShowObservacion:true,
            id_tarea:id_tarea
         })
       
    }
    
    btn_generar_formato_disabled=(nuevo_disabled)=>{
        
        btn_generar_formato_disabled=nuevo_disabled
    
    }

    generarFormatoRevision=()=>{
        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/generar_formato_revision/`)
        .then(res =>{
            if(res.status === 200){
              
            }
        })
    }
   

    notificarCorreccionObservacionesAsesorInterno=()=>{
       // this.obtenerTareas()
        let observaciones_filter =this.state.dataSource_observaciones;
        observaciones_filter =observaciones_filter.filter((observacion) => observacion.estado_alumno === false);
        if(observaciones_filter.length===0){
            //alert("No hay pendientes")
            axios.post('/api/revision_semanal/notificacion_correo', {
                correo: this.state.proyecto.anteproyecto.asesor_interno.usuario.correo,
                mensaje:"Se le notifica que el residente "+this.state.proyecto.anteproyecto.alumno.nombre+" "+this.state.proyecto.anteproyecto.alumno.ap_paterno+" "+this.state.proyecto.anteproyecto.alumno.ap_materno+" ha concluido con la correción de observaciones ",
                subject:"Notificación de correción de revisión semanal"
            }).then((res) => {
                // console.log(res)
                if(res.status === 200){
                //  message.success('Notificaci');
                    message.loading('Notificando a asesor interno  de correciones finalizadas..', 2.5);
                    
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
        }else {
           message.warning("No se puede notificar hay observaciones pendientes")
        }
    }

    expandedRowRenderTareas=(fecha_enetrega,nuevo_numero_semana)=>{
        let fecha=fecha_enetrega.props.children
        let tareas_filter=[]
        semana=fecha_enetrega.props.children
        numero_semana=nuevo_numero_semana
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
                    <Popover id="PopoverEvidencia" content={this.evidencias(record.id)} title="Evidencias"  trigger="hover">
                            <Button icon="file-pdf"></Button>
                    </Popover>
                )
           },
       
          
        ]
        // se obtiene la diferencia de dias
        let fecha_actual=moment(moment().format('YYYY-MM-DD'))
        let operacionFechas=moment(fecha).diff(fecha_actual, 'days')
        //si la diferencias de dias es menor a 4 y la fecha de revision es menor a la fecha actual se habilita la opcion de abjuntar evidencia
        if(operacionFechas>=1 && operacionFechas<=4 && fecha>moment(fecha_actual).format('YYYY-MM-DD')){
            
            this.state.dataSource_tareas.map((tarea)=>{
                //se obtienen las tareas pendientes
               /* if(tarea.fecha_entrega<fecha && tarea.estado_revision_semanal!="aprobado"){
                   tareas_filter.push(tarea)
                }*/
                if(tarea.fecha_entrega===fecha){ 
                   // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                }
            })

            columnasTareas.push(
                {
                    width:200,
                   title: 'Adjuntar evidencia',
                   dataIndex: 'evidencia',
                   key: 'evidencia',
                   render: (text, record) => (
                           <WrappedAddEvidencia ruta={"/api/alumno/file_evidencia/"+record.id} tarea={record.id} showEvidencia={this.obtenerTareas}/>
                     )
                  }
            )
            // se habilita el boton generar formato de revisión semanal
            this.btn_generar_formato_disabled(false)
           
        }else if(moment(fecha_actual).format('YYYY-MM-DD')>=fecha){
            //si ya paso la fecha de revisión entra aqui y valida las tareas que tienen observaciones pendientes habilita adjuntar una nuev aevidencia 
            this.state.dataSource_tareas.map((tarea)=>{
                if(tarea.fecha_entrega===fecha){ 
                   // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                    //si la tarea aun no ha sido aprobada se habilita para que el residente adjunte nueva evidencia 
                   if(tarea.estado_revision_semanal!="aprobado"){
                        
                   }
                }
            })
            columnasTareas.push(
                {
                    width:200,
                title: 'Adjuntar evidencia',
                dataIndex: 'evidencia',
                key: 'evidencia',
                render: (text, record) => (
                    <div disabled>
                        <WrappedAddEvidencia  disabledAddEvidencia={record.estado_revision_semanal} fecha_entrega={record.fecha_entrega}
                        ruta={"/api/alumno/file_evidencia/"+record.id} tarea={record.id} showEvidencia={this.obtenerTareas}/>

                    </div>
                    )
                }
            )
            // se habilita el boton 
            this.btn_generar_formato_disabled(false)

        }else if(fecha>moment(fecha_actual).format('YYYY-MM-DD') ){
            // si aun no es periodo de revisión entra aqui 
            this.state.dataSource_tareas.map((tarea)=>{
                if(tarea.fecha_entrega===fecha){ 
                   // se obtienen las tareas de la fecha de revisión
                   tareas_filter.push(tarea)
                   //si la tarea aun no ha sido aprobada se habilita para que el residente adjunte nueva evidencia 
                 /*  if(tarea.estado_revision_semanal!="aprobado"){
                        columnasTareas.push(
                            {
                                width:200,
                            title: 'Adjuntar evidencia',
                            dataIndex: 'evidencia',
                            key: 'evidencia',
                            render: (text, record) => (
                                    <WrappedAddEvidencia ruta={"/api/alumno/file_evidencia/"+record.id} tarea={record.id}/>
                                )
                            }
                        )
                   }*/
                }
            })


            columnasTareas.push(
                {
                   width:200,
                   title: 'Adjuntar evidencia',
                   dataIndex: 'evidencia',
                   key: 'evidencia',
                   render: (text, record) => (
                          <div>Entrega no disponible</div> 
                    )
                  },
            )
            // se desabilita el boton generar formato de revisión semanal
            this.btn_generar_formato_disabled(true)

        }

        columnasTareas.push({
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
                                        <Button icon="eye" type="primary" onClick={()=>this.showObservacionBadge(record.id)}>Ver</Button>   
                                    </Badge>
                                </span>
                        </Row>
                        ) : null
                    ),
            } 
        )

        return (
            <div>
                <Row>
                    <Col span={8}>
                        <div>
                            <Badge status="processing" />
                            <Tag color="#979997">En revisión</Tag>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div>
                            <Badge status="processing" />
                            <Tag color="#00CC00">Aprobado</Tag>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div>
                            <Badge status="processing" />
                            <Tag color=" #FF1A1A">No aprobado</Tag>
                        </div>
                    </Col>

                </Row>
                <Table 
                    rowClassName={(record, index) =>record.estado_revision_semanal==='revision'?'ant-table-content-gris' :record.estado_revision_semanal==='aprobado'  ?  'ant-table-content-verde':'ant-table-content-rojo' } 
                    title={()=> 'Lista de tareas'} 
                    columns={columnasTareas} 
                    dataSource={tareas_filter}
                />
                 <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        
                            <a  href={`/api/revision_semanal/${this.state.proyecto.id}/${numero_semana}/generar_formato_revision`} target="_blank">
                                <Button disabled={this.comprobarFormatoAdjundo(semana)} type="primary" icon="file-pdf"  >Generar formato de revisión semanal</Button>
                            </a>
                        
                    </Col>
                    <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                            <Button type="primary" icon="upload"  onClick={()=>this.showAddFormatoSemanal()} > Adjuntar formato de revisión semanal con firmas</Button>
                        
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        
                            <Button type="primary" icon="bell" disabled={this.comprobarFormatoAdjundo(semana)} onClick={()=>this.notificarCorreccionObservacionesAsesorInterno()} >Notificar correción de observaciones</Button>
                        
                    </Col>
                 </Row>,
               
                
               
                
            </div>
        )
       
  
      }

     
      handleCancelEvidencia = () => {
        
        this.setState({
          visibleEvidencia: false
        });
      };
      
      getEvidencia_update=()=>{
          if(this.state.id_evidencia>0){
            document.getElementById("evidencia").setAttribute("src",`/api/revision_semanal/get_evidencia_update/${this.state.id_evidencia}`)
          }
      }

      ocultarShowObservacionBadge=()=>{
        this.setState({
            visibleShowObservacionBadge:false
        })
       }

       ocultarShowObservacion=()=>{
        this.setState({
            visibleShowObservacion:false
        })
       }

       handleCancel = ()=> {
    
        this.setState({
          visibleAdjuntarFormatoSemanal: false
        })
       }

       showAddFormatoSemanal=()=>{
           
           this.setState({
              visibleAdjuntarFormatoSemanal: true
            })
       }


    
    render(){

        const {proyecto} = this.state;
        // console.log('this',proyecto)
        
        const columnasSemanas = [
            {  
                width:"85%",
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
                <div style={{ paddingLeft: "95%" }} >
                <Badge  count={ this.state.dataSource_observaciones.filter(solucion => {
                 return !solucion.estado
                 }).length} >
                  <img src="/img/notification.png" alt="notificacion" height="30px" />
                </Badge>
          
          </div>
                <Row>
                     <Col xs={24} lg={24}>
                        <Table 
                        title={()=> 'Lista de semanas'} 
                        bordered={true}
                        columns={columnasSemanas}
                        dataSource={this.state.dataSource_semanas}
                        expandedRowRender={record =>this.expandedRowRenderTareas(record.fecha_entrega, record.numero_semana)}

                        />
                     </Col>
                </Row>
                <Modal
                title="Evidencia"
                visible={this.state.visibleEvidencia}
                onCancel={this.handleCancelEvidencia}
                maskClosable= {true}
                width={'90%'}
                footer={[
                    <Button key="back" onClick={this.handleCancelEvidencia}>Cerrar</Button>,
                    
                  ]}
                >
                    <Row>
                        <Col span={16}>
                            <iframe id="evidencia" style={{width:"100%",height:500}} src={`/api/revision_semanal/get_evidencia/${this.state.filename_evidencia}`}></iframe>
                        </Col>
                        <Col span={8} >
                        <FormItem label={(
                                <span>
                                    Actualizar evidencia&nbsp;
                                    <Tooltip title="En caso de haberse equivocado de archivo agregue uno nuevo para reemplazar al anterior ">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            
                        </FormItem>
                            
                           <WrappedAddEvidencia showEvidencia={this.mensaje} ruta={"/api/alumno/update_file_evidencia/"+this.state.id_evidencia } showEvidencia={this.getEvidencia_update} />
                          {/* <Button onClick={()=>this.getEvidencia_update()}>Recarcar evidencia</Button>*/}
                           <Button icon="eye" type="primary" onClick={()=>this.showObservacion(this.state.id_tarea)}>Ver observaciones</Button>   

                        </Col>
                    </Row>
                    
                </Modal>
                <FormShowObservacionBadge  visible={this.state.visibleShowObservacionBadge}  tipo={"revision_semanal"} id_tarea={this.state.id_tarea}  ocultarShowObservacion={this.ocultarShowObservacionBadge} actualizarCantidadObservaciones={this.obtenerTareas}/>
               
                <FormShowObservacion  visible={this.state.visibleShowObservacion}  tipo={"revision_semanal"} id_tarea={this.state.id_tarea}  ocultarShowObservacion={this.ocultarShowObservacion} />
                <div>
                   <Modal
                        title="Adjuntar formato semanal"
                        visible={this.state.visibleAdjuntarFormatoSemanal}
                        onCancel={this.handleCancel}
                        footer={[ ]}
                    >
                    <WrappedAddFormatoSemanal ruta={"/api/alumno/file_formato_semanal/"+this.state.proyecto.id+"/"+semana} proyecto={this.state.proyecto} semana={semana} disabledFormatoSemanal={disabledFormatoSemanal}/>
                    </Modal>     
               </div>
            </div>
        )
    }
}