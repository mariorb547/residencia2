import React, {Component} from 'react';
import {Card, Icon, Form, Input, Button, Row, Col, Timeline} from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Item } = Form;
// components
import WrappedFormPlanTrabajo from '../../periodo_residencia/plan_trabajo.jsx';
import WrappedCronograma from '../../periodo_residencia/cronograma.jsx';
import FormAddActividadGeneral from './FormAddActividadGeneral.jsx';


export default class ProyectoDeResidencia extends Component{
    constructor(props){
        super(props);
        this.state = {
            proyecto: props.proyecto,
            visibleRegistrarActividadGeneral:false
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            proyecto: nextProps.proyecto
        })
    }
    showAddActividadGeneral= () => {
        this.setState({
            visibleRegistrarActividadGeneral: true
        })
    }
    render(){
        const {proyecto,visibleRegistrarActividadGeneral} = this.state;
        console.log('proyecto => ', this.state.proyecto)
        return (
            <div>
                <Form>
                    <Item label="Título">
                        <Input value={proyecto.anteproyecto.nombre}  readOnly />
                    </Item>
                    <Item label="Objetivo general">
                        <Input value={proyecto.anteproyecto.objetivo_general}  readOnly />
                    </Item>
                    
                    <Item label="Anteproyecto">
                    <a style={{color: '#4da1ff'}} href={`/api/alumno/${proyecto.anteproyecto.id_alumno}/portada_proyecto.docx`}  target="_blank"> Portada  <Icon type="file-word" style={{color: '#4da1ff'}}/></a>
                    <a style={{color: '#4da1ff'}} href={`/api/alumno/${proyecto.anteproyecto.id_alumno}/CartaPresentacion.docx`} target="_blank"> Carta de presentacion y agradecimientos     <Icon type="file-word" style={{color: '#4da1ff'}}/></a>
                    <a style={{color: '#4da1ff'}} href={`/api/anteproyecto/pdf/${proyecto.anteproyecto.path_file_anteproyecto}`} target="_blank"> Ver anteproyecto <Icon type="file-pdf" style={{color: '#4da1ff'}}  /></a>
                    </Item>
                    
                </Form>
                {/* divider */}
                <Row className="border-top">
                    <Col xs={24} lg={24}>
                        <p style={{marginBottom: 20}}>Plan de trabajo</p>
                        <Col xs={24} lg={4}>
                         <a style={{color: '#4da1ff'}} href="/plantillas/plan_de_trabajo.docx">Plantilla de plan de trabajo <Icon type="cloud-download"/></a>
                         </Col> 
                        <Col xs={24} lg={4}>
                        <Button icon="plus" type="primary" onClick={this.showAddActividadGeneral}>Registrar plan de trabajo</Button>
                        </Col>
                        <Col xs={24} lg={4}>
                        <Button icon="edit" type="primary">Modificar plan de trabajo</Button>
                        </Col>
                        <Col xs={24} lg={12} >
                        <p style={{marginLeft: 40, marginBottom: 15}}>Observaciones del plan de trabajo</p>
                            <Timeline className="center-block" style={{marginLeft: 40,overflow: 'scroll', height: 180, paddingLeft: 20, paddingTop: 20}}>
                               
                            </Timeline>
                    </Col>
                    </Col>
                    
                </Row>
                <Row className="border-top">

                    <Col xs={24} lg={24}>
                    <p style={{marginBottom: 20}}>Cronograma de actividades</p>
                        <a style={{color: '#4da1ff'}} href="/plantillas/cronograma.docx">Generar cronograma de actividades <Icon type="cloud-download"/></a>
                    </Col>
                    
                </Row>
                <Row className="border-top">
                    <Item label="Documentos de prorroga">
                        <a style={{color: '#C22121'}} href={`/api/solicitud/${proyecto.anteproyecto.id_alumno}/solicitud_prorroga.docx`} target="_blank"> Solicitud de prorroga <Icon type="file-word" style={{color: '#4da1ff'}}  /></a>
                        <a style={{color: '#C22121'}} href={`/api/solicitud/${proyecto.anteproyecto.id_alumno}/oficio_prorroga.docx`} target="_blank"> Oficio de prorroga <Icon type="file-word" style={{color: '#4da1ff'}}  /></a>
                    </Item>
                </Row>
                <FormAddActividadGeneral visible={visibleRegistrarActividadGeneral}/>
                
            </div>
        )
    }
}