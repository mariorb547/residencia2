import React, { Component } from 'react';
import { Popover, Table, Row, Popconfirm, message, Button, Col, Icon, Form, Modal, Input, DatePicker, Tooltip, InputNumber, Badge, Switch } from 'antd';

import axios from 'axios';
import uuid from 'uuid';
import moment from 'moment';
import FormAgregarTarea from "./FormAgregarTarea.jsx";
import FormAddSubactividad from './FormAddSubactividad.jsx';
import FormShowObservacion from '../components/FormShowObservacion.jsx';
import FormAddActividadGeneral from './FormAddActividadGeneral.jsx';

import '../../styling.css';
const FormItem = Form.Item;

const ButtonGroup = Button.Group;

//var dataSource_subactividades=[];
//let dataSource_tareas=[];
export default class ObtenerPlanDeTrabajo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proyecto: props.proyecto,
      dataSource_actividad_general: [],
      visibleRegistrarSubactividad: false,
      actividad_general: null,
      subactividad: null,
      visibleRegistrarTarea: false,
      dataSource_subactividades: [],
      dataSource_tareas: [],
      visibleEditActividadGeneral: false,
      id_actividad: null,
      id_proyecto: null,
      actividad: null,
      objetivo: null,
      entregable: null,
      visibleEditSubactividad: false,
      visibleEditTarea: false,
      tarea: null,
      horas: null,
      fecha_entrega: null,
      dataSource_observaciones: [],
      tipo_observacion: null,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      planAprobado: false,
      totalHoras: 0



    }
    // this.obtenerDatos()

  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      visibleRegistrarSubactividad: false,
      visibleRegistrarTarea: false,
      visibleEditActividadGeneral: false,
      visibleEditSubactividad: false,
      visibleEditTarea: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      dataSource_actividad_general: nextProps.dataSource_actividad_general,
      dataSource_subactividades: nextProps.dataSource_subactividades,
      dataSource_tareas: nextProps.dataSource_tareas,
      planAprobado: nextProps.planAprobado,
      totalHoras: nextProps.totalHoras

    })
    //se cargan las subactividades y tareas
    this.obtenerActividadesGenerales()

  }


  componentDidMount() {

    this.obtenerActividadesGenerales()
    // this.obtenerTareas()

  }

  componentDidUpdate() {

  }

  reset = () => {
    this.setState({
      visibleRegistrarSubactividad: false,
      visibleRegistrarTarea: false,
      visibleRegistrarActividadGeneral: false
    })
  }
  ocultarShowObservacion = () => {
    this.setState({
      visibleShowObservacion: false
    })
  }
  showAddActividadGenal = () => {

    this.setState({
      visibleRegistrarActividadGeneral: true,
      visibleRegistrarSubactividad: false,
      visibleRegistrarTarea: false,
      visibleEditTarea: false,
      visibleEditSubactividad: false,
      visibleEditActividadGeneral: false,
      visibleShowObservacion: false,
    })
  }

  obtenerActividadesGenerales = () => {
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

          /* actividad_general.subactividades.map((subactividad)=>{
               subData.push({
                 key: uuid.v1(),
                 id:subactividad.id,
                 id_orden:subactividad.id_orden,
                 id_actividad_general:subactividad.id_actividad_general,
                 actividad: subactividad.actividad,                           
               })
               subactividad.tareas.map((tarea)=>{
                     
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
 
                     tarea.observaciones.map((observacion)=>{
                         observacionData.push({
                           key: uuid.v1(),
                           id:observacion.id,
                           id_tarea:observacion.id_tarea,
                           observacion:observacion.observacion,
                           estado:observacion.estado,
                           id_subactividad:tarea.id_subactividad,
                           id_actividad_general:subactividad.id_actividad_general                          
                         })
                     })
                     
                     this.setState({
                       dataSource_tareas:tareasData,
                       dataSource_observaciones:observacionData
                     })
               })
               this.setState({ dataSource_subactividades:subData})
 
           })*/
          this.setState({ dataSource_actividad_general: data_actividad_general })


        })
        this.obtenerSubactividades()



      }
    })


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

          actividad_general.subactividades.map((subactividad) => {
            subData.push({
              key: uuid.v1(),
              id: subactividad.id,
              id_orden: subactividad.id_orden,
              id_actividad_general: subactividad.id_actividad_general,
              actividad: subactividad.actividad,
            })

            this.setState({ dataSource_subactividades: subData })
          })
        })
        this.obtenerTareas()
      }
    })

  }


  /* obtenerSubactividades =()=>{
     let subData=[]
     let tareasData=[]
     let observacionData=[]
 
     this.state.dataSource_actividad_general.map((actividad_general)=>{
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
           this.setState({  dataSource_subactividades:subData })
       })
               
     })
   }*/



  obtenerTareas = () => {

    var observacionData = []
    var tareasData = []
    var horas = 0;



    axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_plan_de_trabajo`).then(res => {

      if (res.status === 200) {
        console.log("plan de trabaj " + JSON.stringify(res.data))
        res.data.map((actividad_general) => {
          actividad_general.subactividades.map((subactividad) => {
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

              //si  hay alguna tarea no aproda entra al if 
              if (tarea.estado_revision_plan !== "aprobado") {
                this.setState({
                  planAprobado: true
                })
              }

              horas += parseInt(tarea.horas);
            })
          })
        })

        this.setState({
          dataSource_observaciones: observacionData,
          dataSource_tareas: tareasData,
          totalHoras: horas
        })


      }
    })
    /*axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res =>{
 
         if(res.status === 200){
             
         const tareas= res.data.map((tarea) => {
         
              return{
               key: uuid.v1(),
               id:tarea.id,
               id_subactividad:tarea.id_subactividad,
               id_orden:tarea.id_orden,
               tarea: tarea.tarea,
               horas:tarea.horas,
               entregable:tarea.entregable,
               fecha_entrega:tarea.fecha_entrega,
               estado_revision_plan:tarea.estado_revision_plan    
                                      
             }

               
         })

        
             this.setState({
                 dataSource_tareas:tareas
                
             })  
                 
          
         }  
                  
     })*/
  }
  /*obtenerTareas =()=>{
    
    let tareasData=[]
    let  observacionData=[]
            
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
              
                                      }
                                      this.setState({
                                        dataSource_observaciones:observacionData

                                      })
                                })
                            })
                            this.setState({
                              dataSource_tareas:tareasData
                            })
                        }
                    })
                
               }) 
             
  }*/


  onInputChange = (e) => {
    this.setState({
      searchText: e.target.value
    })
  }

  expandedRowRenderSubactividades = (id_actividad_general) => {

    let subactividades_filter = this.state.dataSource_subactividades;
    subactividades_filter = subactividades_filter.filter((actividad) => actividad.id_actividad_general == id_actividad_general);

    const columns = [
      { width: 80, title: 'No. Orden', dataIndex: 'id_orden', key: 'id_orden' },
      { title: 'Subactividad', dataIndex: 'actividad', key: 'actividad' },
      {
        width: 150, title: 'Operaciones',
        dataIndex: 'operaciones',
        render: (text, record) => (
          this.state.dataSource_subactividades.length >= 1
            ? (
              <Row>

                <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>
                    <Popconfirm title="¿Seguro de añadir una nueva tarea?" onConfirm={() => this.addTarea(record.id)}>
                      <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="plus">

                      </Button>
                    </Popconfirm>
                  </div>
                </Col>
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>
                    <Popconfirm title="¿Seguro de editar la subactividad?" onConfirm={() => this.showEditSubactividad(record.id, record.actividad)}>
                      <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="edit">

                      </Button>
                    </Popconfirm>
                  </div>
                </Col>
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>
                    <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => this.deleteSubactividad(record.id, record.id_actividad_general, record.id_orden)}>
                      <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="delete" />

                    </Popconfirm>
                  </div>
                </Col>

              </Row>
            ) : null
        ),
      },
      {
        width: 100, title: 'Recorrer',
        dataIndex: 'recorrer',
        render: (text, record) => (
          this.state.dataSource_subactividades.length >= 1
            ? (
              <Row>

                <ButtonGroup>
                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerSubactividad(record.id, record.id_actividad_general, record.id_orden, "subir")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="up" />
                  </Popconfirm>

                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerSubactividad(record.id, record.id_actividad_general, record.id_orden, "bajar")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="down" />
                  </Popconfirm>
                </ButtonGroup>
              </Row>
            ) : null
        ),
      },
      {
        width: 110, title: 'Observaciones',
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
      { width: 80, title: 'No.Orden', dataIndex: 'id_orden', key: 'id_orden' },
      { width: 240, title: 'Tarea', dataIndex: 'tarea', key: 'tarea' },
      { width: 60, title: 'Horas', dataIndex: 'horas', key: 'horas' },
      { width: 240, title: 'Entregable', dataIndex: 'entregable', key: 'entregable' },
      { width: 100, title: 'Fecha  entrega', dataIndex: 'fecha_entrega', key: 'fecha_entrega' },
      {
        width: 100, title: 'Operaciones',
        dataIndex: 'operaciones',
        render: (text, record) => (
          tareas_filter.length >= 1
            ? (
              <Row>


                <Col span={12}>

                  <Popconfirm title="¿Seguro de editar la tarea?" onConfirm={() => this.showEditTarea(record.id, record.tarea, record.horas, record.entregable, record.fecha_entrega)}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="edit" />
                  </Popconfirm>

                </Col>
                <Col span={12}>
                  <div>
                    <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => this.deleteTarea(record.id, record.id_subactividad, record.id_orden)}>
                      <Button key="submit" disabled={!this.state.planAprobado} type="primary" icon="delete">

                      </Button>
                    </Popconfirm>
                  </div>
                </Col>

              </Row>
            ) : null
        ),
      },
      {
        width: 80, title: 'Recorrer',
        dataIndex: 'recorrer',
        render: (text, record) => (
          tareas_filter.length >= 1
            ? (
              <Row>
                <ButtonGroup>
                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerTarea(record.id, record.id_subactividad, record.id_orden, "subir")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="up" />
                  </Popconfirm>

                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerTarea(record.id, record.id_subactividad, record.id_orden, "bajar")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="down" />
                  </Popconfirm>
                </ButtonGroup>

              </Row>
            ) : null
        ),
      }, {
        width: 110,
        title: 'Estado',
        dataIndex: 'estado_revision_plan',
        key: 'estado_revision_plan',
        render: (text, record) => (
          <Switch disabled defaultChecked={this.comprobarEstado(record.estado_revision_plan)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
        )
      },
      {
        width: 100,
        title: 'Observaciones',
        dataIndex: 'observaciones',
        render: (text, record) => (
          this.state.dataSource_observaciones.length >= 1
            ? (
              <Row>

                <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>
                    <span>
                      <Badge count={this.state.dataSource_observaciones.filter(solucion => {
                        console.log(solucion);

                        return !solucion.estado && solucion.id_tarea === record.id && solucion.tipo_observacion === "plan_de_trabajo"
                      }).length} >

                        <Button type={"primary"} icon="eye" onClick={() => this.showObservacion(record.id, "plan_de_trabajo")} >Ver</Button>
                      </Badge>
                    </span>
                  </div>
                </Col>


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

  handleDeleteActividadGeneral = (id, id_proyecto, id_orden) => {
    this.reset()//ocultar los modales
    if (id !== "" & id_proyecto !== "") {
      axios.post('/api/plan_de_trabajo/delete_actividad_general', {
        id_actividad_general: id,
        id_proyecto: id_proyecto,
        id_orden: id_orden

      }).then((res) => {
        if (res.status === 200) {
          message.success("Actividad general eliminada ")
          this.obtenerActividadesGenerales()

        }
      }).catch((err) => {
        message.error(err);
      })

    }

  }

  deleteSubactividad = (id_subactividad, id_actividad_general, id_orden) => {
    this.reset()//ocultar los modales
    //se recibe el id de la actividad general y se elina 
    axios.post('/api/plan_de_trabajo/delete_subactividad', {
      id_subactividad: id_subactividad,
      id_actividad_general: id_actividad_general,
      id_orden: id_orden

    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Subactividad eliminada ")
        this.obtenerSubactividades()
      }
    }).catch((err) => {
      message.error(err);
    })


  }


  addSubactividad = (id) => {

    this.setState({
      visibleRegistrarSubactividad: true,
      visibleRegistrarTarea: false,
      visibleEditTarea: false,
      visibleEditSubactividad: false,
      visibleEditActividadGeneral: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      actividad_general: id
    });

  }

  addTarea = (id) => {

    this.setState({
      visibleRegistrarTarea: true,
      visibleEditTarea: false,
      visibleEditSubactividad: false,
      visibleEditActividadGeneral: false,
      visibleRegistrarSubactividad: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      subactividad: id
    });

  }

  deleteTarea = (id_tarea, id_subactividad, id_orden) => {
    this.reset()//ocultar los modales
    //se recibe el id de la actividad general y se elina 
    axios.post('/api/plan_de_trabajo/delete_tarea', {
      id_tarea: id_tarea,
      id_subactividad: id_subactividad,
      id_orden: id_orden
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Tarea eliminada ")
        this.obtenerTareas()
      }
    }).catch((err) => {
      message.error(err);
    })

  }

  //recorre  una posion hacia arriba la actividad general 
  recorrerActividadGeneral = (id_proyecto, id_actividad_general, id_orden, tipo) => {
    //alert("actividad general "+id_actividad_general+" id proyecto "+id_proyecto+" id_orden "+id_orden)
    //se recibe el id de la actividad general y se elina 

    this.reset()//ocultar los modales
    axios.post('/api/plan_de_trabajo/up_actividad_general', {
      id_proyecto: id_proyecto,
      id_actividad_general: id_actividad_general,
      id_orden: id_orden,
      tipo: tipo
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Recorrido de posición finalizado ")

        this.obtenerActividadesGenerales()


      } else {
        message.error("EL recorrido de posición no se puede realizar ")
      }
    }).catch((err) => {
      message.error(err);
    })

  }



  //recorre  una posion hacia arriba la actividad general 
  recorrerSubactividad = (id_subactividad, id_actividad_general, id_orden, tipo) => {
    //alert("actividad general "+id_actividad_general+" id proyecto "+id_proyecto+" id_orden "+id_orden)
    //se recibe el id de la actividad general y se elina 
    this.reset()//ocultar los modales
    axios.post('/api/plan_de_trabajo/recorrer_subactividad', {
      id_subactividad: id_subactividad,
      id_actividad_general: id_actividad_general,
      id_orden: id_orden,
      tipo: tipo
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Recorrido de posición finalizado ")
        this.obtenerSubactividades()

      } else {
        message.error("EL recorrido de posición no se puede realizar ")
      }
    }).catch((err) => {
      message.error(err);
    })



  }


  //recorre  una tarea
  recorrerTarea = (id_tarea, id_subactividad, id_orden, tipo) => {
    this.reset()//ocultar los modales
    axios.post('/api/plan_de_trabajo/recorrer_tarea', {
      id_tarea: id_tarea,
      id_subactividad: id_subactividad,
      id_orden: id_orden,
      tipo: tipo
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success("Recorrido de posición finalizado ")
        //despues de realizar el recorrido se recargan las tareas
        this.obtenerTareas()



      } else {
        message.error("EL recorrido de posición no se puede realizar ")
      }
    }).catch((err) => {
      message.error(err);
    })
    // this.setState({ dataSource_tareas:this.state.dataSource_tareas });


  }

  showEditActividadGeneral = (id_actividad, actividad, objetivo, entregable, id_proyecto) => {

    this.setState({
      visibleEditActividadGeneral: true,
      visibleRegistrarTarea: false,
      visibleEditTarea: false,
      visibleEditSubactividad: false,
      visibleRegistrarSubactividad: false,
      visibleRegistrarSubactividad: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      actividad: actividad,
      id_actividad: id_actividad,
      objetivo: objetivo,
      entregable: entregable,
      id_proyecto: id_proyecto
    })

  }

  handleCancelActividadGeneral = () => {
    const form = this.form;
    form.resetFields();
    this.setState({ visibleEditActividadGeneral: false });

  }

  handleCreateEditActividadGeneral = () => {

    const form = this.form;

    form.validateFields((err, values) => {

      if (err) {
        return;
      }

      // crear post al servidor
      axios.post('/api/plan_de_trabajo/update_actividad_general', {
        id: this.state.id_actividad,
        actividad: values.actividad,
        objetivo: values.objetivo,
        entregable: values.entregable
      }).then((res) => {

        if (res.status === 200) {
          message.success("Actividad general actualizada satisfactoriamente")
          this.setState({ visibleEditActividadGeneral: false });
          form.resetFields();

          /////////////
          axios.get(`/api/plan_de_trabajo/${this.state.id_proyecto}/get_actividad_general`)
            .then(res => {

              if (res.status === 200) {
                const proyectoPlan = res.data.map((actividad_general, index) => {

                  return {
                    key: uuid.v1(),
                    id: actividad_general.id,
                    id_proyecto: actividad_general.id_proyecto,
                    id_orden: actividad_general.id_orden,
                    actividad: actividad_general.actividad,
                    objetivo: actividad_general.objetivo,
                    entregable: actividad_general.entregable,

                  }
                })

                this.setState({
                  dataSource_actividad_general: proyectoPlan

                })
              }
            })

        } else {
          Modal.error({
            title: 'Error al modificar. Revisar los siguientes campos',
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
    });
  }


  saveFormRefActividadGeneral = (form) => {
    this.form = form;
  }

  saveFormRefSubactividad = (form) => {
    this.formSubactividad = form;
  }



  showEditSubactividad = (id_subactividad, actividad) => {

    this.setState({
      visibleEditSubactividad: true,
      visibleRegistrarTarea: false,
      visibleEditTarea: false,
      visibleEditActividadGeneral: false,
      visibleRegistrarSubactividad: false,
      visibleRegistrarSubactividad: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      id_actividad: id_subactividad,
      actividad: actividad,

    })

  }

  handleCancelEditSubactividad = () => {
    const form = this.formSubactividad;
    form.resetFields();
    this.setState({ visibleEditSubactividad: false });

  }

  handleCreateEditSubactividad = () => {

    const form = this.formSubactividad;

    form.validateFields((err, values) => {

      if (err) {
        return;
      }

      // crear post al servidor
      axios.post('/api/plan_de_trabajo/update_subactividad', {
        id: this.state.id_actividad,
        actividad: values.subactividad,

      }).then((res) => {

        if (res.status === 200) {
          message.success("Subactividad actualizada satisfactoriamente")
          this.setState({ visibleEditSubactividad: false });
          form.resetFields();
          this.obtenerSubactividades()

        } else {
          Modal.error({
            title: 'Error al modificar. Revisar los siguientes campos',
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
    });
  }


  //editar tareas 


  showEditTarea = (id_tarea, tarea, horas, entregable, fecha_entrega) => {

    this.setState({
      visibleEditTarea: true,
      visibleRegistrarTarea: false,
      visibleEditSubactividad: false,
      visibleEditActividadGeneral: false,
      visibleRegistrarSubactividad: false,
      visibleRegistrarSubactividad: false,
      visibleShowObservacion: false,
      visibleRegistrarActividadGeneral: false,
      id_actividad: id_tarea,
      tarea: tarea,
      horas: horas,
      entregable: entregable,
      fecha_entrega: fecha_entrega

    })

  }

  handleCancelEditTarea = () => {
    const form = this.formTarea;
    form.resetFields();
    this.setState({ visibleEditTarea: false });

  }

  handleCreateEditTarea = () => {

    const form = this.formTarea;

    form.validateFields((err, values) => {

      if (err) {
        return;
      }

      // crear post al servidor
      axios.post('/api/plan_de_trabajo/update_tarea', {
        id: this.state.id_actividad,
        tarea: values.tarea,
        horas: values.horas,
        entregable: values.entregable,
        fecha_entrega: values.fecha_entrega

      }).then((res) => {

        if (res.status === 200) {
          message.success("Tarea actualizada satisfactoriamente")
          this.setState({ visibleEditTarea: false });
          form.resetFields();
          this.obtenerTareas()

        } else {
          Modal.error({
            title: 'Error al modificar. Revisar los siguientes campos',
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
    });
  }

  saveFormRefTarea = (form) => {
    this.formTarea = form;
  }

  showObservacion = (id_tarea, tipo_observacion) => {

    this.setState({
      visibleShowObservacion: true,
      id_actividad: id_tarea,
      tipo_observacion: tipo_observacion
    });
  }
  statusPlanDeTrabajo = () => {
    let estado = false;
    let tareas = []
    axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_actividad_general`)
      .then(res => {
        if (res.status === 200) {

          res.data.map((actividad) => {
            actividad.subactividades.map((subactividad) => {
              subactividad.tareas.map((tarea) => {
                tarea.observaciones.map((observacion) => {
                  if (observacion.tipo_observacion === "plan_de_trabajo" && !observacion.estado_alumno) {
                    estado = true
                  } else if (observacion.tipo_observacion === "plan_de_trabajo" && observacion.estado_alumno) {
                    tareas.push(tarea.id_orden + ".-" + tarea.tarea + "\n")
                  }
                })


              })
            })
          })
        }
        if (estado) {
          message.warning('No se puede notificar al asesor interno, existen observaciones sin corregir');
        } else {

          this.enviarNotificacion(this.state.proyecto.anteproyecto.asesor_interno.usuario.correo, tareas)
        }
      })


  }
  enviarNotificacion = (correo, mensaje) => {
    const { proyecto } = this.state
    axios.post('/api/plan_de_trabajo/notificacion_observaciones_plan', {
      correo: correo,
      mensaje: mensaje + "\n Por favor de revisarlas y aprobarlas ",
      subject: "Se le notifica que el residente " + proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno + " ha correguido las observaciones del plan de trabajo de las siguientes tareas: "
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        message.success('Notificación realizada al asesor interno');

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



  render() {
    const { dataSource_actividad_general } = this.state

    let columns = [
      { width: 80, title: 'No.Orden', dataIndex: 'id_orden', key: 'id_orden' },
      { width: 260, title: 'Actividad general', dataIndex: 'actividad', key: 'actividad' },
      { width: 260, title: 'Objetivo', dataIndex: 'objetivo', key: 'objetivo' },
      { width: 260, title: 'Entregable', dataIndex: 'entregable', key: 'entregable' },
      {
        width: 150, title: 'Operaciones',
        dataIndex: 'operaciones',
        render: (text, record) => (
          dataSource_actividad_general.length >= 1
            ? (

              <Row>

                <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>

                    <Popconfirm title="¿Seguro de añadir una nueva subactividad?" onConfirm={() => this.addSubactividad(record.id)}>
                      <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="plus" >

                      </Button>
                    </Popconfirm>
                  </div>
                </Col>
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                  <Popconfirm title="¿Seguro de editar actividad general?" onConfirm={() => this.showEditActividadGeneral(record.id, record.actividad, record.objetivo, record.entregable, record.id_proyecto)}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="edit" />
                  </Popconfirm>


                </Col>
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                  <div>
                    <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => this.handleDeleteActividadGeneral(record.id, record.id_proyecto, record.id_orden)}>
                      <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="delete">

                      </Button>
                    </Popconfirm>
                  </div>
                </Col>
              </Row>

            ) : null
        ),
      },
      {
        width: 100, title: 'Recorrer',
        dataIndex: 'recorrer',
        render: (text, record) => (
          dataSource_actividad_general.length >= 1
            ? (

              <Row>
                <ButtonGroup>
                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerActividadGeneral(record.id_proyecto, record.id, record.id_orden, "subir")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="up" />
                  </Popconfirm>

                  <Popconfirm title="¿Seguro de recorrer de posición?" onConfirm={() => this.recorrerActividadGeneral(record.id_proyecto, record.id, record.id_orden, "bajar")}>
                    <Button disabled={!this.state.planAprobado} type="primary" icon="down" />
                  </Popconfirm>

                </ButtonGroup>

              </Row>

            ) : null
        ),
      },
      {
        width: 110, title: 'Observaciones',
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
    ];


    return (
      <div>

        <Table
          bordered title={() => 'Actividades generales del plan de trabajo, total de horas: ' + this.state.totalHoras}
          dataSource={dataSource_actividad_general}
          className="full-width"
          columns={columns}
          expandedRowRender={record => this.expandedRowRenderSubactividades(record.id)}
          pagination={{ pageSize: 6 }}
        />
        <Col span={4}>
          <Button disabled={!this.state.planAprobado} key="submit" type="primary" icon="plus" onClick={this.showAddActividadGenal}  >
            Agregar actividad general
                  </Button>
        </Col>
        <Col span={12}>
          <Popover content={"Se podrá notificar al asesor interno una vez que todas las observaciones estén corregidas"} >
            <Button disabled={!this.state.planAprobado} type="primary" onClick={this.statusPlanDeTrabajo} >
              Notificar a asesor interno de observaciones corregidas
                      </Button>
          </Popover>
        </Col>
        <FormAddSubactividad visible1={this.state.visibleRegistrarSubactividad} obtenerSubactividades={this.obtenerSubactividades} proyecto={this.state.actividad_general} />

        <FormAgregarTarea visibleTarea={this.state.visibleRegistrarTarea} obtenerTareas={this.obtenerTareas} subactividad={this.state.subactividad} />
        <FormShowObservacion visible={this.state.visibleShowObservacion} tipo={this.state.tipo_observacion} id_tarea={this.state.id_actividad} ocultarShowObservacion={this.ocultarShowObservacion} />
        <FormAddActividadGeneral visible={this.state.visibleRegistrarActividadGeneral} obtenerSubactividades={this.obtenerActividadesGenerales} proyectoActividadGeneral={this.state.proyecto} visibleRegistrarSubactividad={false} />

        <CreateFormEditActividadGeneral
          ref={this.saveFormRefActividadGeneral}
          visible={this.state.visibleEditActividadGeneral}
          onCancel={this.handleCancelActividadGeneral}
          onCreate={this.handleCreateEditActividadGeneral}
          id_actividad_general={this.state.id_actividad_general}
          actividad={this.state.actividad}
          objetivo={this.state.objetivo}
          entregable={this.state.entregable}

        />
        <CreateFormEditSubactividad
          ref={this.saveFormRefSubactividad}
          visible={this.state.visibleEditSubactividad}
          onCancel={this.handleCancelEditSubactividad}
          onCreate={this.handleCreateEditSubactividad}
          actividad={this.state.actividad}
        />
        <CreateFormEditTarea
          ref={this.saveFormRefTarea}
          visible={this.state.visibleEditTarea}
          onCancel={this.handleCancelEditTarea}
          onCreate={this.handleCreateEditTarea}
          tarea={this.state.tarea}
          horas={this.state.horas}
          entregable={this.state.entregable}
          fecha_entrega={this.state.fecha_entrega}

        />
      </div>



    )
  }

}

//de aqui hacia abajo es para editar 

const CreateFormEditActividadGeneral = Form.create()(
  (props => {
    const { visible, onCancel, onCreate, form, actividad, objetivo, entregable } = props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title={`Editar actividad general`}
        okText="Guardar"
        onCancel={onCancel}
        onOk={onCreate}
        width={600}
        maskClosable={false}
        centered
      >
        <Form layout="vertical">
          <Row>

            <Col span={20}>
              <FormItem label="Actividad general">
                {getFieldDecorator('actividad', {
                  rules: [{ required: true, message: 'Actividad principal es obligatoria.' }],
                  initialValue: actividad
                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Actividad Principal" />
                )
                }
              </FormItem>
            </Col>

            <Col span={20}>
              <FormItem label="Objetivo">
                {getFieldDecorator('objetivo', {
                  rules: [{ required: true, message: 'Objetivo es obligatorio.' }],
                  initialValue: objetivo
                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Objetivo" />
                )
                }
              </FormItem>
            </Col>
            <Col span={20}>
              <FormItem label="Entregable">
                {getFieldDecorator('entregable', {
                  rules: [{ required: true, message: 'Entregable es obligatorio.' }],
                  initialValue: entregable
                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Entregable" />
                )
                }
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    );
  })
)



const CreateFormEditSubactividad = Form.create()(
  (props => {
    const { visible, onCancel, onCreate, form, actividad } = props;
    const { getFieldDecorator } = form;



    return (
      <Modal
        visible={visible}
        title={`Editar subactividad`}
        okText="Guardar"
        onCancel={onCancel}
        onOk={onCreate}
        width={600}
        maskClosable={false}
        centered
      >
        <Form layout="vertical">
          <Row>

            <Col span={20}>
              <FormItem label="Actividad ">
                {getFieldDecorator('subactividad', {
                  rules: [{ required: true, message: 'Actividad  es obligatoria.' }],
                  initialValue: actividad
                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Subactividad" />
                )
                }
              </FormItem>
            </Col>


          </Row>

        </Form>
      </Modal>
    );
  })
)


const CreateFormEditTarea = Form.create()(
  (props => {
    const { visible, onCancel, onCreate, form, tarea, entregable, horas, fecha_entrega } = props;
    const { getFieldDecorator } = form;

    function onChange(value) {
      console.log('changed', value);
    }


    // console.warn(alumnos_rechazados)
    return (

      <Modal
        visible={visible}
        title={`Editar tarea`}
        okText="Guardar"
        onCancel={onCancel}
        onOk={onCreate}
        width={600}
        maskClosable={false}
        centered
      ><Form layout="vertical">
          <Row>
            <Col span={20}>
              <FormItem label="Tarea">
                {getFieldDecorator('tarea', {
                  rules: [{ required: true, message: 'Tarea es obligatoria..' }, { min: 5, message: 'El minimo de caracteres es 5.' }, { max: 500, message: 'El maximo de caracteres es 500.' }],
                  initialValue: tarea
                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Tarea" />
                )
                }
              </FormItem>
            </Col>
            <Col span={20}>
              <FormItem label="Horas">
                {getFieldDecorator('horas', {
                  rules: [{ required: true, message: 'Horas es obligatoria..' }],
                  initialValue: horas,
                  valuePropName: 'option'

                })(
                  <InputNumber min={1} max={60} defaultValue={horas} onChange={onChange} />
                )
                }
              </FormItem>
            </Col>
            <Col span={20}>
              <FormItem label="Entregable">
                {getFieldDecorator('entregable', {
                  rules: [{ required: true, message: 'Entregable es obligatoria..' }, { min: 5, message: 'El minimo de caracteres es 5.' }, { max: 400, message: 'El maximo de caracteres es 400.' }],
                  initialValue: entregable

                })(
                  <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Entregable" />
                )
                }
              </FormItem>
            </Col>
            <Col span={20}>
              <FormItem label={(
                <span>
                  Fecha de entrega&nbsp;
                                  <Tooltip title="La fecha en la que se entregará la evidencia">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              >
                {getFieldDecorator('fecha_entrega', {
                  rules: [{ required: true, message: 'La fecha de asesoría es obligatoria.' }],
                  initialValue: moment(fecha_entrega)

                })(<DatePicker format="ll" />)}
              </FormItem>
            </Col>

          </Row>
        </Form>

      </Modal>
    );
  })
)
