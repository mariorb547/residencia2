import React, {Component} from 'react';
import {message, Modal, Row, Col, Select, Table, Button, Input, Icon, Popconfirm, Badge, Spin} from 'antd';
const {Option, OptGroup}  = Select;

import axios from 'axios';
import moment from 'moment';
import PDF2 from 'react-pdf-js-infinite';
import uuid from 'uuid';

// components
import RevisionProyecto from './RevisionProyecto.jsx'
export default class revisionAnteproyectos extends Component{
    constructor(props){
        super(props);
        this.state = {
            usuario: props.usuario,
            carreras: props.carreras,
            renderProyecto: null,
            periodo: null,
            id_anteproyecto: null,
            spin: false,
        }
    }
    
    handleChangePeriodo = (id_periodo) => {
        axios.get(`/api/periodo/${id_periodo}/proyectos`)
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        periodo: res.data,
                    })
                }
            })
    }
    handleChangeResidente = (id_anteproyecto) => {
        this.setState({spin: true, renderProyecto: null});
        const {usuario} = this.state
        axios.get(`/api/alumno/revision_seguimiento/${id_anteproyecto}`)
            .then(res => {
                if(res.status === 200){
                
                    this.setState({
                        renderProyecto: (<RevisionProyecto key={uuid.v1()} updateProyecto={this.updateProyecto.bind(this)} proyecto={res.data} usuario={usuario}/>),
                        id_anteproyecto,
                        spin: false
                    })
                }else{
                    message.warning('Ops, ocurrio un error interno, favor de reportar al administrador.')
                }
            })
    }
    updateProyecto = () => {
        this.setState({spin: true, renderProyecto: null});
        const {usuario, id_anteproyecto} = this.state
        axios.get(`/api/alumno/revision_seguimiento/${id_anteproyecto}`)
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        renderProyecto: (<RevisionProyecto key={uuid.v1()} updateProyecto={this.updateProyecto.bind(this)} proyecto={res.data} usuario={usuario}/>),
                        id_anteproyecto,
                        spin: false
                    })
                }else{
                    message.warning('Ops, ocurrio un error interno, favor de reportar al administrador.')
                }
            })
    }
    obtenerResidentes=()=>{
        if(this.state.usuario.rol==="presidente_academia"){
  alert("tamaño "+this.state.periodo.anteproyectos.length)
        }
            this.state.periodo.anteproyectos.map((anteproyecto, i) => {
                return (<Option key={uuid.v1()} value={`${anteproyecto.id}`} >{` ${anteproyecto.alumno.no_control} - ${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`}</Option>)
            })
    }
    render(){
        const {carreras, renderProyecto, periodo, spin} = this.state
        return (
            <div>
                <Row type="flex" gutter={30}>
                    <Col xs={24} lg={6}>
                        <p>Seleccione el periodo</p>
                        <Select 
                            placeholder="Seleccione un periodo"
                            onChange={this.handleChangePeriodo}
                            style={{width: '100%'}}
                        >   
                            {carreras.map((carrera, i) => {
                                return (
                                    <OptGroup key={i} label={carrera.nombre}>
                                        {carrera.periodos.map((periodo, j) => {
                                            return (<Option key={uuid.v1()} value={`${periodo.id}`}>{`${periodo.periodo} ${periodo.ciclo}`}</Option>)
                                        })}
                                    </OptGroup>
                                )
                            })}
                        </Select>
                    </Col>
                    <Col xs={24} lg={10}>
                        <p>Seleccione un residente </p>
                        <Select
                            showSearch
                            placeholder="Seleccione un residente"
                            onChange={this.handleChangeResidente}
                            optionFilterProp="children"
                            style={{width: '100%'}}
                        >
                            {
                                periodo?
                                this.state.usuario.rol==="presidente_academia"? 
                                 periodo.anteproyectos.map((anteproyecto, i) => {
                                    return (<Option key={uuid.v1()} value={`${anteproyecto.id}`} >{` ${anteproyecto.alumno.no_control} - ${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`}</Option>)
                                }):false

                                  
                                :
                                    null
                            }
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} lg={24} style={{textAlign: 'center'}}>
                        {spin === true ? <Spin style={{marginTop: 20, marginBottom: 20}} size="large" tip="Cargado..."/> :  null}
                    </Col>
                </Row>
                {renderProyecto}                   
            </div>
        )
    }
}