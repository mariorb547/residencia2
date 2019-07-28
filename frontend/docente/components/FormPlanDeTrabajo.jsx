import React, { Component } from 'react';
import { render } from 'react-dom';
import { Badge, Tag, Button, Modal, Form, Input, Popover, Select, Icon, message, Tabs, Row, Col, Menu, Dropdown, InputNumber, Alert } from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import axios from 'axios';
import moment from 'moment';
import uuid from 'uuid';
import ObtenerPlanDeTrabajo from '../components/ObtenerPlanDeTrabajo.jsx';



export default class FormPlanDeTrabajo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: props.usuario,
            visible: props.visible,
            proyecto: props.proyecto,
            visibleRegistrarSubactividad: props.visibleRegistrarSubactividad,
            renderPlanDeTrabajo: null,
            subactividades: null,


        }
    }

    componentWillReceiveProps(nextProps) {
        const { visible, proyectoActividadGeneral, visibleRegistrarSubactividad } = nextProps;
        this.setState({
            visible,
            proyectoActividadGeneral, visibleRegistrarSubactividad
        })

        /* //se cargan las actividades principales
    axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_actividad_general`)
    .then(res =>{
        if(res.status === 200){
          
            const proyectoPlan = res.data.map((actividad_general, index) => {
             
                return{
                    key: uuid.v1(),
                    id:actividad_general.id,
                    id_proyecto:actividad_general.id_proyecto,
                    id_orden:actividad_general.id_orden,
                    actividad: actividad_general.actividad,
                    objetivo: actividad_general.objetivo,
                    entregable: actividad_general.entregable,
                }
                    
            })*/


        this.setState({
            renderPlanDeTrabajo: <ObtenerPlanDeTrabajo proyecto={this.state.proyecto} usuario={this.state.usuario} />
        })




    }
    componentDidMount() {

    }

    getActividadesGenerales = () => {



    }


    showAddSubactividad = () => {
        this.setState({
            visibleRegistrarSubactividad: true
        })
    }

    handleCancel = () => {

        this.setState({ visible: false });

    }

    handleUpdate = () => {
        //se actualizan los datos en la tabla
        //se cargan las actividades principales
        //se cargan las actividades principales
        /*axios.get(`/api/plan_de_trabajo/${this.state.proyectoActividadGeneral.id}/get_actividad_general`)
        .then(res =>{
            if(res.status === 200){
                const proyectoPlan = res.data.map((actividad_general, index) => {
     
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
                    renderPlanDeTrabajo: <ObtenerPlanDeTrabajo  proyecto_id={proyectoPlan}  />
                   // renderPlanDeTrabajo: <ObtenerTarea />
                    
                })
                
            }
        })*/
        this.setState({
            renderPlanDeTrabajo: <ObtenerPlanDeTrabajo proyecto={this.state.proyecto} usuario={this.state.usuario} />
        })


        message.success("Actulización finalizada")

    }

    saveFormRef = (form) => {
        this.form = form;
    }

    statusPlanDeTrabajo = () => {
        let estado = false;
        let tareas = []
        let observaciones=[]
        axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_actividad_general`)
            .then(res => {
                if (res.status === 200) {
                    const datos = res.data
                    res.data.map((actividad) => {
                        actividad.subactividades.map((subactividad) => {
                            subactividad.tareas.map((tarea) => {

                                if (tarea.estado_revision_plan === "revision") {
                                    estado = true
                                } else if (tarea.estado_revision_plan === "no_aprobado") {
                                    tareas.push(tarea.id_orden + ".-" + tarea.tarea + ":\n")

                                    tarea.observaciones.map((observacion)=>{
                                        if(observacion.id_tarea===tarea.id && observacion.tipo_observacion==="plan_de_trabajo" && !observacion.estado){
                                            tareas.push(observacion.observacion+ "\n")
                                        }
                                     
                                    })
                                    
                                }
                            })
                        })
                    })
                }
                if (estado) {
                    console.log("proyecto " + JSON.stringify(this.state.proyecto))
                    message.warning('No se puede notificar al residente, existen tareas sin revisar');
                } else {
                    this.enviarNotificacion(this.state.proyecto.anteproyecto.alumno.usuario.correo, tareas)
                }
            })


    }

    enviarNotificacion = (correo, mensaje) => {

        axios.post('/api/plan_de_trabajo/notificacion_observaciones_plan', {
            correo: correo,
            mensaje:"Se le notifica que durante la revisión del plan de trabajo, por parte del asesor interno, se realizaron las siguientes observaciones:\n" 
            +mensaje + "\n Por favor de revisarlas y corregirlas lo antes posible, una vez corregidas notificar a su asesro interno",
            subject: "Notificación de correcciones "
        }).then((res) => {
            // console.log(res)
            if (res.status === 200) {

                message.loading('Notificación realizada al residente..', 2.5);

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
        // console.warn(this.state.proyecto)
        const { visibleRegistrarSubactividad, proyectoActividadGeneral } = this.state;

        return (
            <div>


                <Modal
                    visible={this.state.visible}
                    title={`Plan de trabajo`}
                    okText="Guardar"
                    width={1300}
                    height={1500}
                    onCancel={this.handleCancel}
                    centered
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cerrar</Button>,

                    ]}
                >
                    <Form layout="vertical">
                        <Row>
                            <Col span={24}>
                                {this.state.renderPlanDeTrabajo}
                            </Col>
                            <Col span={24}>
                                <Popover content={"Se podrá notificar al residente una vez que todas las tareas  han sido revisadas"} >
                                    <Button key="back" type="primary" onClick={this.statusPlanDeTrabajo}>Notificar observaciones a residente</Button>,
                        </Popover>
                            </Col>
                        </Row>
                    </Form>
                </Modal>

            </div>
        )
    }
}
