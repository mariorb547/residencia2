import React, { Component } from 'react';
import { Select, Table, Divider, Row, Popconfirm, message, Button, Col, Badge, Icon, Switch } from 'antd';
import '../../styling.css';

import axios from 'axios';
import uuid from 'uuid';

//import FormAgregarTarea from "./FormAgregarTarea.jsx";
//import FormAddSubactividad from './FormAddSubactividad.jsx';
import FormAddObservacion from '../components/FormAddObservacion.jsx';
import FormShowObservacion from '../components/FormShowObservacion.jsx';

const ButtonGroup = Button.Group;

export default class ObtenerPlanDeTrabajo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: props.usuario,
      proyecto: props.proyecto,
      visibleRegistrarSubactividad: props.visibleRegistrarSubactividad,
      actividad_general: null,
      subactividad: null,
      visibleRegistrarTarea: props.visibleRegistrarTarea,
      dataSource_subactividades: [],
      dataSource_tareas: [],
      dataSubactividades: props.dataSubactividades,
      visibleAddObservacion: false,
      id_tarea: null,
      tipo_observacion: null,
      dataSource_observaciones: [],
      visibleShowObservacion: false,
      dataSource_actividad_general: []


    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visibleShowObservacion: false,
      visibleAddObservacion: false
    })
    //se cargan las subactividades y tareas
    this.obtenerSubactividades()

  }


  componentDidMount() {
    this.obtenerSubactividades()

  }

  componentDidUpdate() {

  }

  /*obtenerTareas =()=>{
  
    let tareasData=[]
   
               this.state.dataSource_subactividades.map((subactividad)=>{
                      
                    axios.get(`/api/plan_de_trabajo/${subactividad.id}/get_tareas`)
                    .then(res =>{
                    
                        if(res.status === 200){
                            //se recorre los resultados para agregarlos a un arreglo con el key unico
                            res.data.map((tarea) => {
                                tareasData.push( {
                                    key: uuid.v1(),
                                    id:tarea.id,
                                    id_subactividad:tarea.id_subactividad,
                                    id_orden:tarea.id_orden,
                                    tarea: tarea.tarea,
                                    horas:tarea.horas,
                                    entregable:tarea.entregable,
                                    fecha_entrega:tarea.fecha_entrega,
                                    estado_revision_plan:tarea.estado_revision_plan                         
                                })
                              
                            })
                            this.state({
                              dataSource_tareas:tareasData,visibleAddObservacion:false
                            })
                       }
                    })
                
               }) 

              
  }*/
  obtenerTareas = () => {

    var observacionData = []
    var tareas = []
    axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res => {

      if (res.status === 200) {
        //se recorre los resultados para agregarlos a un arreglo con el key unico
        //se obtienen las evidencias 
        const tareas = res.data.map((tarea) => {

          return {
            key: uuid.v1(),
            id: tarea.id,
            id_subactividad: tarea.id_subactividad,
            id_orden: tarea.id_orden,
            tarea: tarea.tarea,
            horas: tarea.horas,
            entregable: tarea.entregable,
            fecha_entrega: tarea.fecha_entrega,
            estado_revision_plan: tarea.estado_revision_plan

          }


        })


        this.setState({
          dataSource_tareas: tareas

        })


      }

    })
  }

  visibleAddObservacion = () => {
    this.setState({ visibleAddObservacion: false })
  }


  obtenerSubactividades = () => {
    let data_actividad_general = []
    let subData = []
    let tareasData = []
    let observacionData = []


    axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_plan_de_trabajo`).then(res => {

      if (res.status === 200) {
        console.log("plan de trabaj " + JSON.stringify(res.data))
        res.data.map((actividad_general) => {
          data_actividad_general.push({
            key: uuid.v1(),
            id: actividad_general.id,
            id_proyecto: actividad_general.id_proyecto,
            id_orden: actividad_general.id_orden,
            actividad: actividad_general.actividad,
            objetivo: actividad_general.objetivo,
            entregable: actividad_general.entregable,
          })

          actividad_general.subactividades.map((subactividad) => {
            subData.push({
              key: uuid.v1(),
              id: subactividad.id,
              id_orden: subactividad.id_orden,
              id_actividad_general: subactividad.id_actividad_general,
              actividad: subactividad.actividad,
            })
            subactividad.tareas.map((tarea) => {

              tareasData.push({
                key: uuid.v1(),
                id: tarea.id,
                id_subactividad: tarea.id_subactividad,
                id_orden: tarea.id_orden,
                tarea: tarea.tarea,
                horas: tarea.horas,
                entregable: tarea.entregable,
                fecha_entrega: tarea.fecha_entrega,
                estado_revision_plan: tarea.estado_revision_plan
              })

              tarea.observaciones.map((observacion) => {
                observacionData.push({
                  key: uuid.v1(),
                  id: observacion.id,
                  id_tarea: observacion.id_tarea,
                  observacion: observacion.observacion,
                  estado: observacion.estado,
                  tipo_observacion: observacion.tipo_observacion,
                  id_subactividad: tarea.id_subactividad,
                  id_actividad_general: subactividad.id_actividad_general
                })
              })

              this.setState({
                dataSource_tareas: tareasData,
                dataSource_observaciones: observacionData
              })
            })
            this.setState({ dataSource_subactividades: subData })

          })
          this.setState({ dataSource_actividad_general: data_actividad_general })

        })




      }
    })
    /*
        axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_actividad_general`)
        .then(res =>{
            if(res.status === 200){
              
              const proyectoPlan = res.data.map((actividad_general, index) => {
                               //let dataSubactividades=[];
          axios.get(`/api/plan_de_trabajo/${actividad_general.id}/get_subactividades`)
          .then(res1 =>{
          
              if(res1.status === 200){
                  //se recorre los resultados para agregarlos a un arreglo con el key unico
                  
                  res1.data.map((actividad, index) => {
                
                      subData.push({
                      key: uuid.v1(),
                      id:actividad.id,
                      id_orden:actividad.id_orden,
                      id_actividad_general:actividad.id_actividad_general,
                      actividad: actividad.actividad,                           
                      })
    
                      axios.get(`/api/plan_de_trabajo/${actividad.id}/get_tareas`)
                        .then(res =>{
                        
                            if(res.status === 200){
                                //se recorre los resultados para agregarlos a un arreglo con el key unico
                                res.data.map((tarea) => {
                                    tareasData.push({
                                      key: uuid.v1(),
                                      id:tarea.id,
                                      id_subactividad:tarea.id_subactividad,
                                      id_orden:tarea.id_orden,
                                      tarea: tarea.tarea,
                                      horas:tarea.horas,
                                      entregable:tarea.entregable,
                                      fecha_entrega:tarea.fecha_entrega,
                                      estado_revision_plan:tarea.estado_revision_plan                         
                                  })
    
                                      axios.get(`/api/plan_de_trabajo/${tarea.id}/${"plan_de_trabajo"}/get_observaciones`)
                                      .then(res =>{
                                      
                                          if(res.status === 200){
                                           
                                              //se recorre los resultados para agregarlos a un arreglo con el key unico
                                             res.data.map((observacion) => {
                                              observacionData.push({
                                                    key: uuid.v1(),
                                                    id:observacion.id,
                                                    id_tarea:observacion.id_tarea,
                                                    observacion:observacion.observacion,
                                                    estado:observacion.estado,
                                                    id_subactividad:observacion.tareas.subactividades.id,
                                                    id_actividad_general:observacion.tareas.subactividades.actividad_general.id                           
                                                })
                                              })
                                              this.setState({
                                                dataSource_observaciones:observacionData
                  
                                              })
                                          }
                                          
                                    })
                                    
                                })
                               
                            }
                      })
                    
                          
                      this.setState({
                            dataSource_tareas:tareasData
                      })
    
                  })
    
              }
          })
                    return{
                        key: uuid.v1(),
                        id:actividad_general.id,
                        id_proyecto:actividad_general.id_proyecto,
                        id_orden:actividad_general.id_orden,
                        actividad: actividad_general.actividad,
                        objetivo: actividad_general.objetivo,
                        entregable: actividad_general.entregable,
                       
                    }
                })
               
               
                this.setState({
                    
                   dataSource_actividad_general:proyectoPlan
                    
                })
                
            }
          })
       
    
             
         this.setState({  dataSource_subactividades:subData })*/
  }


  actulizarCantidadObservaciones = () => {
    let observacionData = []
    this.state.dataSource_tareas.map((tarea) => {


      axios.get(`/api/plan_de_trabajo/${tarea.id}/${"plan_de_trabajo"}/get_observaciones`)
        .then(res => {

          if (res.status === 200) {

            //se recorre los resultados para agregarlos a un arreglo con el key unico
            res.data.map((observacion) => {
              observacionData.push({
                key: uuid.v1(),
                id: observacion.id,
                id_tarea: observacion.id_tarea,
                observacion: observacion.observacion,
                estado: observacion.estado,
                tipo_observacion: observacion.tipo_observacion,
                id_subactividad: observacion.tareas.subactividades.id,
                id_actividad_general: observacion.tareas.subactividades.actividad_general.id
              })
              this.setState({
                dataSource_observaciones: observacionData,

              })
            })

          }

        })

    })

  }

  actulizarCantidadObservacionesAddObservacion = () => {
    let observacionData = []


    axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_plan_de_trabajo`).then(res => {

      if (res.status === 200) {
        console.log("plan de trabaj " + JSON.stringify(res.data))
        res.data.map((actividad_general) => {
          actividad_general.subactividades.map((subactividad) => {
            subactividad.tareas.map((tarea) => {
              tarea.observaciones.map((observacion) => {
                observacionData.push({
                  key: uuid.v1(),
                  id: observacion.id,
                  id_tarea: observacion.id_tarea,
                  observacion: observacion.observacion,
                  estado: observacion.estado,
                  tipo_observacion: observacion.tipo_observacion,
                  id_subactividad: tarea.id_subactividad,
                  id_actividad_general: subactividad.id_actividad_general
                })
              })

            })
          })
        })

        this.setState({
          dataSource_observaciones: observacionData
        })
        this.obtenerTareas()

      }



      /* axios.get(`/api/plan_de_trabajo/${tarea.id}/${"plan_de_trabajo"}/get_observaciones`)
       .then(res =>{
       
           if(res.status === 200){
            
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                res.data.map((observacion) => {
                  observacionData.push({
                        key: uuid.v1(),
                        id:observacion.id,
                        id_tarea:observacion.id_tarea,
                        observacion:observacion.observacion,
                        estado:observacion.estado,
                        id_subactividad:observacion.tareas.subactividades.id,
                        id_actividad_general:observacion.tareas.subactividades.actividad_general.id                           
                    })
                      this.setState({
                        dataSource_observaciones:observacionData,
                                    
                      })
                })
                  
                //se actualizan las tareas para cambiar el color en la tabla 
                this.obtenerTareas()

           }
           
     })*/

    })
  }


  onInputChange = (e) => {
    this.setState({
      searchText: e.target.value
    })
  }
  showAddObservacion = (id_tarea, tipo_observacion) => {
    this.setState({
      visibleAddObservacion: true,
      visibleShowObservacion: false,
      id_tarea: id_tarea,
      tipo_observacion: tipo_observacion
    });
  }
  showObservacion = (id_tarea, tipo_observacion) => {

    this.setState({
      visibleShowObservacion: true,
      visibleAddObservacion: false,
      id_tarea: id_tarea,
      tipo_observacion: tipo_observacion
    });
  }




  onChangeEstado = (id, estado) => {

    if (estado) {
      estado = "aprobado"
    } else {
      estado = "no_aprobado"
    }
    axios.post('/api/plan_de_trabajo/update_estado_tarea', {
      id_tarea: id,
      estado: estado,
      tipo_observacion: "plan_de_trabajo",

    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Estado actializado")
        //se obtiene las tareas
        //this.obtenerTareas()
        //se verifica que el total de las tareas esten aprobadas

      } else {
        message.error("¡No se puede actualizar el estado! la tarea tiene observaciones pendientes")
        //se recargan las tareas para que la tabla regrese el Switch

      }
      //se obtiene las tareas
      this.obtenerTareas()
      //se obtiene la cantidad de tareas que no estan aprobadas
      let estadoTarea = this.state.dataSource_tareas.filter((tarea) => {
        return tarea.estado_revision_plan != "aprobado"
      }).length


      //si no hay tareas pendientes se envia correo al reseidente notificacndo que suplan de trabajo esta aprobado
      if (estadoTarea - 1 === 0) {

        axios.post('/api/plan_de_trabajo/notificacion_observaciones_plan', {
          correo: this.state.proyecto.anteproyecto.alumno.usuario.correo,
          mensaje: "Para continuar con el proceso de residencia debe descargar el plan de trabjo, recolectar las firmas correspondientes y adjuntar nuvamente el plan de trabjo al sistema",
          subject: "Estimado residente se le notifica que su plan de trabajo ha sido aprobado en su totalidad"
        }).then((res) => {
          // console.log(res)
          if (res.status === 200) {

            message.loading('Notificación de aprobación de plan de trabajo realizada al residente..', 4.5);

            // message.success(res.data)
          } else {
            Modal.error({
              title: 'Error ',
              content: (
                <div>
                  {res.data.errores}
                </div>
              ), onOk() { },
            })
          }
        }).catch((err) => {
          message.error(err);
        })
      }
      this.setState({
        visibleAddObservacion: false,
        visibleShowObservacion: false
      })

    }).catch((err) => {
      message.error(err);
    })


  }

  expandedRowRenderSubactividades = (id_actividad_general) => {

    let subactividades_filter = this.state.dataSource_subactividades;
    subactividades_filter = subactividades_filter.filter((actividad) => actividad.id_actividad_general == id_actividad_general);

    const columns = [
      { width: 80, title: 'No. Orden', dataIndex: 'id_orden', key: 'id_orden', },
      { title: 'Subactividad', dataIndex: 'actividad', key: 'actividad' },
      {
        width: 100, title: 'Observaciones',
        dataIndex: 'observaciones',
        render: (text, record) => (
          this.state.dataSource_observaciones.length >= 1
            ? (
              <Row>
                <span>

                  <Badge count={this.state.dataSource_observaciones.filter(solucion => {


                    return !solucion.estado && solucion.id_subactividad === record.id && solucion.tipo_observacion === "plan_de_trabajo"
                  }).length} >

                  </Badge>

                </span>

              </Row>
            ) : null
        ),
      },


    ];

    return (

      <Table
        columns={columns}
        dataSource={subactividades_filter}
        pagination={false}
        expandedRowRender={record => this.expandedRowRenderTarea(record.id)}
      />
    )


  }

  comprobarEstado = (estado_revision_plan) => {
    let estado = false;
    if (estado_revision_plan === "aprobado") {
      estado = true;
    }

    return estado;
  }


  expandedRowRenderTarea = (id_subactividad) => {

    let tareas_filter = this.state.dataSource_tareas;

    //se filtra por el id de la subactividad para mostrar en la tabla
    tareas_filter = this.state.dataSource_tareas.filter((tarea) => tarea.id_subactividad == id_subactividad);

    const columns = [
      { width: 80, title: 'No. Orden', dataIndex: 'id_orden', key: 'id_orden' },
      { width: 260, title: 'Tarea', dataIndex: 'tarea', key: 'tarea' },
      { width: 60, title: 'Horas', dataIndex: 'horas', key: 'horas' },
      { width: 260, title: 'Entregable', dataIndex: 'entregable', key: 'entregable' },
      { width: 115, title: 'Fecha de entrega', dataIndex: 'fecha_entrega', key: 'fecha_entrega' },
      {
        width: 110,
        title: 'Estado',
        dataIndex: 'estado_revision_plan',
        key: 'estado_revision_plan',
        render: (text, record) => (
          <Switch onChange={(check) => this.onChangeEstado(record.id, check)} defaultChecked={this.comprobarEstado(record.estado_revision_plan)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
        )
      },
      {
        width: 100, title: 'operaciones',
        dataIndex: 'operaciones',
        render: (text, record) => (
          tareas_filter.length >= 1
            ? (
              <Row>
                <div>
                  <Popconfirm title="¿Seguro de agregar una nueva observación?" onConfirm={() => this.showAddObservacion(record.id, "plan_de_trabajo")}>
                    <Button type={"primary"} key="submit" icon="plus">
                      Observación
                    </Button>
                  </Popconfirm>
                </div>

                <div>
                  <br />
                  <span>
                    <Badge count={this.state.dataSource_observaciones.filter(solucion => {
                      console.log(solucion);

                      return !solucion.estado && solucion.id_tarea === record.id && solucion.tipo_observacion === "plan_de_trabajo"
                    }).length} >

                      <Button type={"primary"} onClick={() => this.showObservacion(record.id, "plan_de_trabajo")} >Ver observaciones</Button>
                    </Badge>
                  </span>
                </div>


              </Row>
            ) : null
        ),
      },

    ];


    return (
      <Table
        rowClassName={(record, index) => record.estado_revision_plan === 'revision' ? 'ant-table-content-gris' : record.estado_revision_plan === 'aprobado' ? 'ant-table-content-verde' : 'ant-table-content-rojo'}
        columns={columns}
        dataSource={tareas_filter}
        pagination={false}

      />
    )
  }


  render() {


    let columns = [
      { width: 80, title: 'No. Orden', dataIndex: 'id_orden', key: 'id_orden', },
      { width: 300, title: 'Actividad general', dataIndex: 'actividad', key: 'actividad', },
      { width: 300, title: 'Objetivo', dataIndex: 'objetivo', key: 'objetivo' },
      { width: 300, title: 'Entregable', dataIndex: 'entregable', key: 'entregable' },
      {
        width: 100, title: 'Observaciones',
        dataIndex: 'observaciones',
        render: (text, record) => (
          this.state.dataSource_observaciones.length >= 1
            ? (
              <Row>
                <span>
                  <Badge count={this.state.dataSource_observaciones.filter(solucion => {


                    return !solucion.estado && solucion.id_actividad_general === record.id && solucion.tipo_observacion === "plan_de_trabajo"
                  }).length} >

                  </Badge>
                </span>

              </Row>
            ) : null
        ),
      },


    ]

    return (
      <div>
        <Table
          bordered title={() => 'Actividades generales del plan de trabajo'}
          dataSource={this.state.dataSource_actividad_general}
          className="full-width"
          columns={columns}
          expandedRowRender={record => this.expandedRowRenderSubactividades(record.id)}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1000 }}
        />

        <FormAddObservacion visible={this.state.visibleAddObservacion} actulizarCantidadObservacionesAddObservacion={this.actulizarCantidadObservacionesAddObservacion} tipo={this.state.tipo_observacion} id_tarea={this.state.id_tarea} usuario={this.state.usuario} rutaUpdateObservacion={'/api/proyecto/updateEstadoTareaAddObservacionPlan'} ocultarAddObservacion={this.visibleAddObservacion} />
        <FormShowObservacion visible={this.state.visibleShowObservacion} actulizarCantidadObservaciones={this.actulizarCantidadObservaciones} tipo={this.state.tipo_observacion} id_tarea={this.state.id_tarea} />

      </div>



    )
  }

}