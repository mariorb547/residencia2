import React, { Component } from 'react';
import { Icon, Form, Input, Button, Row, Col, Popover, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Item } = Form;
// components
import WrappedFormPlanTrabajo from '../../periodo_residencia/plan_trabajo.jsx';
import WrappedCronograma from '../../periodo_residencia/cronograma.jsx';
import FormAddActividadGeneral from './FormAddActividadGeneral.jsx';
import FormPlanDeTrabajo from './FormPlanDeTrabajo.jsx';

const content = (
    <div>
        <p>El plan de trabajo debe contener las firmas correspondientes</p>
    </div>
);


export default class ProyectoDeResidencia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proyecto: props.proyecto,
            usuario: props.usuario,
            visibleRegistrarActividadGeneral: false,
            visiblePlanDeTrabajo: false,
            disabledDescargarPlan: false,
            visibleAdjuntarPlan: false

        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            proyecto: nextProps.proyecto,
            usuario: nextProps.usuario
        })


    }
    componentDidMount() {
        this.statusPlanDeTrabajo()
    }

    showAddActividadGeneral = () => {
        this.setState({
            visibleRegistrarActividadGeneral: true,
            visiblePlanDeTrabajo: false
        })
    }

    hideAddActividadGenal=()=>{
        this.setState({
            visibleRegistrarActividadGeneral: false,
           
        })
    }

    showPlanDeTrabajo = () => {
        this.setState({
            visiblePlanDeTrabajo: true,
            visibleRegistrarActividadGeneral: false
        })
    }

    obtenerSubactividades = () => {

    }


    statusPlanDeTrabajo = () => {

        axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_actividad_general`)
            .then(res => {
                if (res.status === 200) {
                    //si el plan de tbajo esta vacio 
                    if (res.data.length == 0) {
                        this.setState({
                            disabledDescargarPlan: true
                        })
                    }
                    res.data.map((actividad) => {
                        actividad.subactividades.map((subactividad) => {
                            subactividad.tareas.map((tarea) => {

                                if (tarea.estado_revision_plan !== "aprobado") {

                                    this.setState({
                                        disabledDescargarPlan: true
                                    })
                                }
                            })
                        })
                    })


                }
            })

    }

    generarPlanDeTrabajo = () => {
        axios.get(`/api/plan_de_trabajo/${this.state.proyecto.id}/get_plan_de_trabajo`)
            .then(res => {
                if (res.status === 200) {

                }
            })
    }
    visibleAdjuntarPlan = () => {
        this.setState({
            visibleAdjuntarPlan: true
        })

    }
    handleCancel = () => {

        this.setState({
            visibleAdjuntarPlan: false
        })
    }
    render() {
        const { proyecto, visibleRegistrarActividadGeneral, visiblePlanDeTrabajo } = this.state;

        return (
            <div>
                <Form>
                    <Item label="Título">
                        <Input value={proyecto.anteproyecto.nombre} readOnly />
                    </Item>
                    <Item label="Objetivo general">
                        <Input value={proyecto.anteproyecto.objetivo_general} readOnly />
                    </Item>

                    <Item label="Anteproyecto">
                        <a style={{ color: '#4da1ff' }} href={`/api/alumno/${proyecto.anteproyecto.id_alumno}/portada_proyecto.docx`} target="_blank"> Portada  <Icon type="file-word" style={{ color: '#4da1ff' }} /></a>
                        <a style={{ color: '#4da1ff' }} href={`/api/alumno/${proyecto.anteproyecto.id_alumno}/CartaPresentacion.docx`} target="_blank"> Carta de presentacion y agradecimientos     <Icon type="file-word" style={{ color: '#4da1ff' }} /></a>
                        <a style={{ color: '#4da1ff' }} href={`/api/anteproyecto/pdf/${proyecto.anteproyecto.path_file_anteproyecto}`} target="_blank"> Ver anteproyecto <Icon type="file-pdf" style={{ color: '#4da1ff' }} /></a>
                    </Item>

                </Form>
                {/* divider */}
                <Row className="border-top">
                    <Col xs={24} lg={24}>
                        <p style={{ marginBottom: 20 }}>Plan de trabajo</p>
                        <Col xs={24} lg={4} style={{padding:2}} >
                            <a style={{ color: '#4da1ff' }} href="/plantillas/plan_de_trabajo.docx">Plantilla de plan de trabajo <Icon type="cloud-download" /></a>
                        </Col>
                        
                        <Col xs={24} lg={4} style={{padding:2}}>
                            <Button icon="plus" disabled={!this.state.disabledDescargarPlan} type="primary" onClick={this.showAddActividadGeneral}>Registrar plan de trabajo</Button>
                        </Col>
                        <Col xs={24} lg={4} style={{padding:2}}>
                            <Button icon="eye" type="primary" onClick={this.showPlanDeTrabajo}>Visulizar plan de trabajo</Button>
                        </Col>
                        <Col xs={24} lg={4} style={{padding:2}}>
                            <a href={`/api/plan_de_trabajo/${this.state.proyecto.id}/generar_plan_de_trabajo`} target="_blank"><Button icon="file-pdf" disabled={this.state.disabledDescargarPlan} type="primary">Descargar plan de trabajo</Button></a>
                        </Col>
                        <Col xs={24} lg={4} style={{padding:2}}>

                            <Popover content={content} >
                                <Button icon="upload" type="primary" disabled={this.state.disabledDescargarPlan} onClick={this.visibleAdjuntarPlan}>Adjuntar plan de trabajo</Button>
                            </Popover>
                        </Col>
                    </Col>
    
                </Row>
               
                <Row className="border-top">

                    <Col xs={24} lg={24}>
                        <p style={{ marginBottom: 20 }}>Cronograma de actividades</p>
                        <a href={`/api/plan_de_trabajo/${this.state.proyecto.id}/get_cronograma`} target="_blank"><Button icon="file-pdf" disabled={this.state.disabledDescargarPlan} type="primary">Generar cronograma de actividades</Button></a>

                    </Col>

                </Row>
                <Row className="border-top">
                    <Item label="Documentos de prorroga">
                        <a style={{ color: '#C22121' }} href={`/api/solicitud/${proyecto.anteproyecto.id_alumno}/solicitud_prorroga.docx`} target="_blank"> Solicitud de prorroga <Icon type="file-word" style={{ color: '#4da1ff' }} /></a>
                        <a style={{ color: '#C22121' }} href={`/api/solicitud/${proyecto.anteproyecto.id_alumno}/oficio_prorroga.docx`} target="_blank"> Oficio de prorroga <Icon type="file-word" style={{ color: '#4da1ff' }} /></a>
                    </Item>
                </Row>
                <FormAddActividadGeneral obtenerSubactividades={this.obtenerSubactividades} visible={visibleRegistrarActividadGeneral} proyectoActividadGeneral={proyecto} visibleRegistrarSubactividad={false} hideAddActividadGenal={this.hideAddActividadGenal} />
                <FormPlanDeTrabajo visible={visiblePlanDeTrabajo} proyectoActividadGeneral={proyecto} visibleRegistrarSubactividad={false} />
                <div>
                    <Modal
                        title="Adjuntar plan de trabajo"
                        visible={this.state.visibleAdjuntarPlan}
                        onCancel={this.handleCancel}
                        footer={[]}
                    >
                        <WrappedFormPlanTrabajo proyecto={proyecto} />
                    </Modal>
                </div>
            </div>

        )
    }
}