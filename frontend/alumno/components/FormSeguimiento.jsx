import React, { Component } from 'react';

import { Row, Col, Button, Table, Icon, Switch, Popover, Modal, Badge, message, Form, Tooltip } from 'antd';
import moment from 'moment';
import WrappedAddEvidencia from './addEvidenciaSemanal.jsx';
import FormShowObservacionBadge from './FormShowObservacionBadge.jsx';
import FormShowObservacion from './FormShowObservacion.jsx';
import PDF2 from 'react-pdf-js-infinite';
// components
import uuid from 'uuid';
import axios from 'axios';
const FormItem = Form.Item;
var btn_generar_formato_disabled = false
var numero_semana = 0
var contadorSeguimiento = 0
export default class RevisionSemanal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proyecto: props.proyecto,
            seguimiento: props.seguimiento,
            seguimientos: props.seguimientos,
            numeroSeguimiento: props.numeroSeguimiento,
            visibleEvidencia: false,
            usuario: props.usuario,
            dataSource_tareas: [],
            dataSource_semanas: [],
            dataSource_evidencias: [],
            dataSource_actividades_generales: [],
            filename_evidencia: null,
            id_evidencia: null,
            dataSource_observaciones_mensual: [],
            dataSource_observaciones_semanal: [],
            visibleShowObservacionBadge: false,
            visibleShowObservacion: false,
            id_tarea: null,
            tipo_observacion: null
        }

    }
    componentWillReceiveProps = (nextProps) => {

        this.setState({
            filename_evidencia: nextProps.filename_evidencia,
            proyecto: nextProps.proyecto,
            seguimiento: nextProps.seguimiento,
            usuario: nextProps.usuario,
            dataSource_semanas: nextProps.dataSource_semanas,
            seguimientos: nextProps.seguimientos,
            numeroSeguimiento: nextProps.numeroSeguimiento,
            visibleShowObservacionBadge: false,
            visibleShowObservacion: false,

        })
        this.getSemanasActividadesGenerales()
        this.obtenerTareas()
        this.semanas()



    }

    componentDidMount = () => {
        this.getSemanasActividadesGenerales()
        this.obtenerTareas()
        this.semanas()



    }


    obtenerTareas = () => {

        var dataTemEvidencia = []
        var dataTemObservacion = []
        var dataTemObservacion_mensual = []
        var tareas = []
        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res => {

            if (res.status === 200) {
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                //se obtienen las evidencias 
                res.data.map((tarea) => {
                    tareas.push({
                        key: uuid.v1(),
                        id: tarea.id,
                        id_subactividad: tarea.id_subactividad,
                        id_orden: tarea.id_orden,
                        tarea: tarea.tarea,
                        horas: tarea.horas,
                        entregable: tarea.entregable,
                        fecha_entrega: tarea.fecha_entrega,
                        estado_revision_semanal: tarea.estado_revision_semanal,
                        estado_revision_mensual: tarea.estado_revision_mensual,

                    })
                })

                res.data.map((tarea) => {
                    tarea.evidencias.map((evidencia) => {
                        dataTemEvidencia.push({
                            key: uuid.v1(),
                            id: evidencia.id,
                            filename_evidencia: evidencia.filename_evidencia,
                            fecha_actualizacion: evidencia.updatedAt,
                            id_tarea: evidencia.id_tarea

                        })
                    })

                    tarea.observaciones.map((observacion) => {
                        if (observacion.tipo_observacion == "revision_mensual") {
                            dataTemObservacion_mensual.push({
                                key: uuid.v1(),
                                id: observacion.id,
                                id_tarea: observacion.id_tarea,
                                observacion: observacion.observacion,
                                estado: observacion.estado,
                                estado_alumno: observacion.estado_alumno,
                                fecha_entrega: tarea.fecha_entrega
                            })
                        } else if (observacion.tipo_observacion == "revision_semanal") {
                            dataTemObservacion.push({
                                key: uuid.v1(),
                                id: observacion.id,
                                id_tarea: observacion.id_tarea,
                                observacion: observacion.observacion,
                                estado: observacion.estado,
                                estado_alumno: observacion.estado_alumno,
                                fecha_entrega: tarea.fecha_entrega
                            })
                        }

                    })
                })

                this.setState({
                    dataSource_tareas: tareas,
                    dataSource_evidencias: dataTemEvidencia,
                    dataSource_observaciones_mensual: dataTemObservacion_mensual,
                    dataSource_observaciones_semanal: dataTemObservacion

                })


            }

        })
    }

    //se filtran las actividades generales por semana
    tareas = (fecha) => {
        let actividades_filter = this.state.dataSource_actividades_generales;
        actividades_filter = actividades_filter.filter((actividad) => actividad.fecha_entrega === fecha);


        var hash = {};
        actividades_filter = actividades_filter.filter(function (current) {
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
    evidencias = (id) => {

        let evidencias_filter = this.state.dataSource_evidencias
        evidencias_filter = evidencias_filter.filter((evidencia) => evidencia.id_tarea === id);


        const listItems = evidencias_filter.map((item) =>
            <li key={uuid.v1()}>
                <Button icon="file" onClick={() => this.showEvidencia(item.filename_evidencia, item.id, item.id_tarea)} />
            </li>
        );


        return <div><ul>{listItems}</ul></div>
    }


    showEvidencia = (filename_evidencia_recibe, id_evidencia_recibe, nuevo_id_tarea) => {

        this.setState({
            visibleEvidencia: true,
            filename_evidencia: filename_evidencia_recibe,
            id_evidencia: id_evidencia_recibe,
            id_tarea: nuevo_id_tarea
        })

    }

    semanas = () => {

        var posicionSeguimiento = 0

        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/get_tareas_completas`).then(res => {

            if (res.status === 200) {

                //se recorre los resultados para agregarlos a un arreglo con el key unico
                let semanas = []
                let fechaComparar = 0
                let numero_semana = 1
                res.data.map((tarea) => {

                    if (this.state.numeroSeguimiento == 0) {
                        //primer seguimiento
                        //se cargan las tareas correspondientes al seguimiento selecionado 
                        if (tarea.fecha_entrega <= this.state.seguimiento.seguimiento.fecha_final) {
                            if (tarea.fecha_entrega != fechaComparar) {
                                semanas.push({
                                    key: uuid.v1(),
                                    fecha_entrega: (
                                        <Popover content={this.tareas(tarea.fecha_entrega)} title="Actividades generales">
                                            {tarea.fecha_entrega}
                                        </Popover>
                                    ),
                                    numero_semana: numero_semana
                                },
                                )
                                numero_semana++
                            }
                            fechaComparar = tarea.fecha_entrega

                        }
                    } else if (this.state.numeroSeguimiento == 1) {
                        //segundo seguimiento 
                        //se cargan las tareas correspondientes al seguimiento selecionado 
                        if (tarea.fecha_entrega > this.state.seguimientos[0].fecha_final && tarea.fecha_entrega <= this.state.seguimiento.seguimiento.fecha_final) {
                            if (tarea.fecha_entrega != fechaComparar) {
                                semanas.push({
                                    key: uuid.v1(),
                                    fecha_entrega: (
                                        <Popover content={this.tareas(tarea.fecha_entrega)} title="Actividades generales">
                                            {tarea.fecha_entrega}
                                        </Popover>
                                    ),
                                    numero_semana: numero_semana
                                },
                                )
                                numero_semana++
                            }
                            fechaComparar = tarea.fecha_entrega

                        }

                    } else if (this.state.numeroSeguimiento == 2) {
                        //tercer seguimiento
                        if (tarea.fecha_entrega > this.state.seguimientos[1].fecha_final && tarea.fecha_entrega <= this.state.seguimiento.seguimiento.fecha_final) {
                            if (tarea.fecha_entrega != fechaComparar) {
                                semanas.push({
                                    key: uuid.v1(),
                                    fecha_entrega: (
                                        <Popover content={this.tareas(tarea.fecha_entrega)} title="Actividades generales">
                                            {tarea.fecha_entrega}
                                        </Popover>
                                    ),
                                    numero_semana: numero_semana
                                },
                                )
                                numero_semana++
                            }
                            fechaComparar = tarea.fecha_entrega

                        }

                    }

                })
                this.setState({ dataSource_semanas: semanas })

            }
        })

    }
    obtener_seguimientos = () => {
        axios.get(`/api/seguimientos/obtener_seguimientos/${this.state.proyecto.anteproyecto.id_periodo}`).then(res => {

            if (res.status === 200) {
                this.setState({
                    seguimientos: res.data
                })
            }
        })

    }
    getSemanasActividadesGenerales = () => {
        axios.get(`/api/alumno/getPlan_revision_semanal/${this.state.proyecto.id}`).then(res => {

            if (res.status === 200) {
                //se recorre los resultados para agregarlos a un arreglo con el key unico
                let semanas = []
                let fechaComparar = 0
                res.data.map((actividad_general) => {
                    actividad_general.subactividades.map((subactividad) => {
                        subactividad.tareas.map((tarea) => {
                            semanas.push({
                                fecha_entrega: tarea.fecha_entrega,
                                actividad: actividad_general.actividad,
                                id: subactividad.id_actividad_general,
                            })

                        })
                    })
                })

                this.setState({
                    dataSource_actividades_generales: semanas
                })

            }
        })

    }

    comprobarEstado = (estado_revision) => {
        let estado = false;
        if (estado_revision === "aprobado") {
            estado = true;
        }

        return estado;
    }

    // se comprueban las fechas 
    disabledEvidencia = (fecha_enetrega) => {
        let fecha_actual = moment(moment().format('YYYY-MM-DD'))
        let operacionFechas = fecha_actual.diff(fecha_enetrega, 'days')

        if (operacionFechas <= 4) {
            return false
        } else {
            return true
        }

    }

    showObservacionBadge = (id_tarea, tipo_observacion) => {
        // alert(id_tarea+"= "+tipo_observacion)
        this.setState({
            id_tarea: id_tarea,
            tipo_observacion: tipo_observacion,
            visibleShowObservacionBadge: true,


        })

    }

    showObservacion = (id_tarea, tipo_observacion) => {
        //  alert(id_tarea+"= "+tipo_observacion)
        this.setState({
            id_tarea: id_tarea,
            tipo_observacion: tipo_observacion,
            visibleShowObservacion: true,


        })

    }

    btn_generar_formato_disabled = (nuevo_disabled) => {

        btn_generar_formato_disabled = nuevo_disabled

    }

    generarFormatoRevision = () => {
        axios.get(`/api/revision_semanal/${this.state.proyecto.id}/generar_formato_revision/`)
            .then(res => {
                if (res.status === 200) {

                }
            })
    }


    notificarCorreccionObservacionesAsesorInterno = () => {
        this.obtenerTareas()
        let observaciones_filter = this.state.dataSource_observaciones_mensual;
        observaciones_filter = observaciones_filter.filter((observacion) => observacion.estado_alumno === false);
        if (observaciones_filter.length === 0) {
            //alert("No hay pendientes")
            axios.post('/api/revision_semanal/notificacion_correo', {
                correo: this.state.proyecto.anteproyecto.asesor_interno.usuario.correo,
                mensaje: "Se le notifica que el residente " + this.state.proyecto.anteproyecto.alumno.nombre + " " + this.state.proyecto.anteproyecto.alumno.ap_paterno + " " + this.state.proyecto.anteproyecto.alumno.ap_materno + " ha concluido con la correción de observaciones ",
                subject: "Notificación de correción de revisión semanal"
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    //  message.success('Notificaci');
                    message.loading('Notificando a asesor interno  de correciones finalizadas..', 2.5);

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
        } else {
            message.error("No se puede notificar hay observaciones pendientes")
        }
    }

    expandedRowRenderTareas = (fecha_enetrega, nuevo_numero_semana) => {
        let fecha = fecha_enetrega.props.children
        let tareas_filter = []
        numero_semana = nuevo_numero_semana
        let columnasTareas = [
            {
                width: "5%",
                title: 'No. orden',
                dataIndex: 'id_orden',
                key: 'id_orden'
            },

            {
                width: "30%",
                title: 'Tarea',
                dataIndex: 'tarea',
                key: 'tarea'
            },
            {
                width: "12%",
                title: 'Estado mensual',
                dataIndex: 'estado_revision_mensual',
                key: 'estado_revision_mensual',
                render: (text, record) => (
                    <Switch disabled defaultChecked={this.comprobarEstado(record.estado_revision_mensual)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                )
            },
            {
                width: "12%",
                title: 'Estado semanal',
                dataIndex: 'estado_revision_semanal',
                key: 'estado_revision_semanal',
                render: (text, record) => (
                    <Switch disabled defaultChecked={this.comprobarEstado(record.estado_revision_semanal)} checkedChildren="Aprobada" unCheckedChildren={<Icon type="cross" />} />
                )
            },
            {
                width: "6%",
                title: 'Evidencia',
                dataIndex: 'evidencia',
                key: 'evidencia_doc',
                render: (text, record) => (
                    <Popover id="PopoverEvidencia" content={this.evidencias(record.id)} title="Evidencias" trigger="click">
                        <Button icon="file-pdf"></Button>
                    </Popover>
                )
            },


        ]
        // se obtiene la diferencia de dias
        let fecha_actual = moment(moment().format('YYYY-MM-DD'))
        let operacionFechas = moment(fecha).diff(fecha_actual, 'days')
        //si la diferencias de dias es menor a 4 y la fecha de revision es menor a la fecha actual se habilita la opcion de abjuntar evidencia
        /* if(operacionFechas>=1 && operacionFechas<=4 && fecha>moment(fecha_actual).format('YYYY-MM-DD')){
             
             this.state.dataSource_tareas.map((tarea)=>{
                 //se obtienen las tareas pendientes
                /* if(tarea.fecha_entrega<fecha && tarea.estado_revision_semanal!="aprobado"){
                    tareas_filter.push(tarea)
                 }
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
                            <WrappedAddEvidencia ruta={"/api/alumno/file_evidencia/"+record.id} tarea={record.id}/>
                      )
                   }
             )
             // se habilita el boton generar formato de revisión semanal
             this.btn_generar_formato_disabled(false)
            
         }*/
        if (moment(fecha_actual).format('YYYY-MM-DD') >= moment(this.state.seguimiento.seguimiento.fecha_inicial).format('YYYY-MM-DD')) {
            //si ya paso la fecha de revisión entra aqui y valida las tareas que tienen observaciones pendientes habilita adjuntar una nuev aevidencia 
            this.state.dataSource_tareas.map((tarea) => {
                if (tarea.fecha_entrega === fecha) {
                    // se obtienen las tareas de la fecha de revisión
                    tareas_filter.push(tarea)
                    //si la tarea aun no ha sido aprobada se habilita para que el residente adjunte nueva evidencia 
                    if (tarea.estado_revision_mensual != "aprobado") {

                    }
                }
            })
            columnasTareas.push(
                {
                    width: 200,
                    title: 'Adjuntar evidencia',
                    dataIndex: 'evidencia',
                    key: 'evidencia',
                    render: (text, record) => (
                        <div >
                            <WrappedAddEvidencia disabledAddEvidencia={record.estado_revision_mensual}
                                ruta={"/api/alumno/file_evidencia/" + record.id} tarea={record.id} showEvidencia={this.obtenerTareas} />

                        </div>
                    )
                }
            )
            // se habilita el boton 
            this.btn_generar_formato_disabled(false)

        } else if (moment(this.state.seguimiento.seguimiento.fecha_inicial).format('YYYY-MM-DD') > moment(fecha_actual).format('YYYY-MM-DD')) {
            // si aun no es periodo de revisión entra aqui 
            this.state.dataSource_tareas.map((tarea) => {
                if (tarea.fecha_entrega === fecha) {
                    // se obtienen las tareas de la fecha de revisión
                    tareas_filter.push(tarea)

                }
            })


            columnasTareas.push(
                {
                    width: "20%",
                    title: 'Adjuntar evidencia',
                    dataIndex: 'evidencia',
                    key: 'evidencia',
                    render: (text, record) => (
                        <div>No se ha cumplido la fecha de seguimiento</div>
                    )
                },
            )
            // se desabilita el boton generar formato de revisión semanal
            this.btn_generar_formato_disabled(true)

        }

        columnasTareas.push(
            {
                width: "10%",
                title: "Observaciones seguimiento",
                dataIndex: 'observaciones',
                key: 'observaciones',
                render: (text, record) => (
                    this.state.dataSource_observaciones_mensual.length >= 1
                        ? (
                            <Row>
                                <span>
                                    <Badge count={this.state.dataSource_observaciones_mensual.filter(solucion => {
                                        return !solucion.estado && solucion.id_tarea === record.id
                                    }).length} >
                                        <Button icon="eye" type="primary" onClick={() => this.showObservacionBadge(record.id, "revision_mensual")}>Ver</Button>
                                    </Badge>
                                </span>
                            </Row>
                        ) : null
                ),
            },
            {
                width: "10%",
                title: "Observaciones asesor interno",
                dataIndex: 'observaciones',
                key: 'observacionesAI',
                render: (text, record) => (
                    this.state.dataSource_observaciones_semanal.length >= 1
                        ? (
                            <Row>
                                <span>
                                    <Badge count={this.state.dataSource_observaciones_semanal.filter(solucion => {
                                        return !solucion.estado && solucion.id_tarea === record.id
                                    }).length} >
                                        <Button icon="eye" type="primary" onClick={() => this.showObservacionBadge(record.id, "revision_semanal")}>Ver</Button>
                                    </Badge>
                                </span>
                            </Row>
                        ) : null
                ),
            }
        )

        return (
            <div>
                <Table
                    rowClassName={(record, index) => record.estado_revision_mensual === 'revision' ? 'ant-table-content-gris' : record.estado_revision_mensual === 'aprobado' ? 'ant-table-content-verde' : 'ant-table-content-rojo'}
                    title={() => 'Lista de tareas'}
                    columns={columnasTareas}
                    dataSource={tareas_filter}
                />
                <a href={`/api/revision_semanal/${this.state.proyecto.id}/${numero_semana}/generar_formato_revision`} target="_blank">
                    <Button type="primary" icon="file-pdf" disabled={btn_generar_formato_disabled} >Generar formato de revisión</Button>
                </a>
                <Button type="primary" icon="file-pdf" disabled={btn_generar_formato_disabled} onClick={() => this.notificarCorreccionObservacionesAsesorInterno()} >Notificar correción de observaciones</Button>

            </div>
        )


    }

    handleCancel = () => {

        this.setState({
            visibleEvidencia: false,
        });
    };

    getEvidencia_update = () => {
        if (this.state.id_evidencia > 0) {

            document.getElementById("evidencia").setAttribute("src", `/api/revision_semanal/get_evidencia_update/${this.state.id_evidencia}`)
        }
    }

    ocultarShowObservacionBadge = () => {
        this.setState({
            visibleShowObservacionBadge: false
        })
    }

    ocultarShowObservacion = () => {
        this.setState({
            visibleShowObservacion: false
        })
    }

    render() {

        const { proyecto } = this.state;
        // console.log('this',proyecto)

        const columnasSemanas = [
            {
                width: "85%",
                title: "Semana",
                dataIndex: 'fecha_entrega',
                key: 'fecha_entrega',

            },
            {
                width: "15%",
                title: "Observaciones",
                dataIndex: 'observaciones',
                key: 'observaciones',
                render: (text, record) => (

                    this.state.dataSource_observaciones_mensual.length >= 1
                        ? (
                            <Row>
                                <span>
                                    <Badge count={this.state.dataSource_observaciones_mensual.filter(solucion => {
                                        return !solucion.estado && solucion.fecha_entrega === record.fecha_entrega.props.children
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
                <Row>

                    <Col xs={24} lg={24}>
                        <Table
                            title={() => 'Lista de semanas'}
                            bordered={true}
                            columns={columnasSemanas}
                            dataSource={this.state.dataSource_semanas}
                            expandedRowRender={record => this.expandedRowRenderTareas(record.fecha_entrega, record.numero_semana)}

                        />

                    </Col>
                </Row>
                <Modal
                    title="Evidencia"
                    visible={this.state.visibleEvidencia}
                    onCancel={this.handleCancel}
                    maskClosable={true}
                    width={'90%'}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cerrar</Button>,

                    ]}
                >
                    <Row>
                        <Col span={16}>
                            <iframe id="evidencia" style={{ width: "100%", height: 500 }} src={`/api/revision_semanal/get_evidencia/${this.state.filename_evidencia}`}></iframe>
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
                            <WrappedAddEvidencia showEvidencia={this.mensaje} ruta={"/api/alumno/update_file_evidencia/" + this.state.id_evidencia} showEvidencia={this.getEvidencia_update} />
                            <Button icon="eye" type="primary" onClick={() => this.showObservacion(this.state.id_tarea, "revision_semanal")}>Ver observaciones semanal</Button>
                            <br />
                            <br />
                            <Button icon="eye" type="primary" onClick={() => this.showObservacion(this.state.id_tarea, "revision_mensual")}>Ver observaciones mensual</Button>

                        </Col>
                    </Row>

                </Modal>
                <FormShowObservacionBadge tipo={this.state.tipo_observacion} id_tarea={this.state.id_tarea} visible={this.state.visibleShowObservacionBadge} ocultarShowObservacion={this.ocultarShowObservacionBadge} />
                <FormShowObservacion tipo={this.state.tipo_observacion} id_tarea={this.state.id_tarea} visible={this.state.visibleShowObservacion} ocultarShowObservacion={this.ocultarShowObservacion} />

            </div>
        )
    }
}