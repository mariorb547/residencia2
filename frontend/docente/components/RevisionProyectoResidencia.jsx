import React, {Component} from 'react';

import {Select, Row, Col, Spin,Avatar,img,Table} from 'antd';
const {Option} = Select

import axios from 'axios';
import uuid from 'uuid';
// Components
import Proyecto from '../components/Proyecto.jsx'

export default class RevisionProyectoResidencia extends Component{
    constructor(props){
        super(props);
        this.state = {
            proyectos: props.proyectos,
            usuario: props.usuario,
            renderProyecto: null,
            id_proyecto: null,
            spin: false,
            dataFotos:[]
        }
        this.getImagen()
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            proyectos: nextProps.proyectos,
            usuario: props.usuario,
            renderProyecto: null,
            id_proyecto: null,
            spin: false,
        })
    }
    componentDidMount=()=>{
        this.getImagen()
    
    }

    onChangeResidente = (id_proyecto) => {
        this.setState({spin: true, renderProyecto: null})
        axios.get(`/api/alumno/proyecto_para_asesor_interno/${id_proyecto}`)
            .then((res) => {
                if(res.status === 200){
                    // console.warn('proyecto', res.data)
                    this.setState({
                        renderProyecto:(<Proyecto key={uuid.v1()} updateProyecto={this.updateProyectoResidente.bind(this)} proyecto={res.data} usuario={this.state.usuario}/>),
                        id_proyecto,
                        spin: false,
                    })
        
                }
            })
    }

    
    updateProyectoResidente = () => {
        this.setState({spin: true, renderProyecto: null})
        axios.get(`/api/alumno/proyecto_para_asesor_interno/${this.state.id_proyecto}`)
        .then((res) => {
            if(res.status === 200){
                // console.warn('proyecto', res.data)
                this.setState({
                    renderProyecto:(<Proyecto key={uuid.v1()} updateProyecto={this.updateProyectoResidente.bind(this)} proyecto={res.data} usuario={this.state.usuario}/>),
                    spin: false,
                })
            }
        })
    }
    getImagen = () => {
       
        var fotos=[]
        this.state.proyectos.map((proyecto)=>{
              axios.get(`/api/usuario/foto/${proyecto.anteproyecto.alumno.usuario.id}`)
            .then(res => {
                  fotos.push(
                           { key: uuid.v1(),id:proyecto.anteproyecto.alumno.usuario.id,url:res.data}
                            
                            )
                         this.setState({
                             dataFotos:fotos
                         })
                
            })
        })
       
    }

    //metodo para filtrar la imagen del residente
    URLFoto=(id)=>{
       
    var url
     this.state.dataFotos.map((foto)=>{
         if(foto.id===id){
            
              url=foto.url
         }
     })
    return url

    }
    
    render(){
        const {proyectos, renderProyecto, spin} = this.state
       
         
        // console.warn(')>', proye)
        return (
            <Row>
               
                <Col xs={24} lg={24}>
                    <Select 
                        showSearch
                        optionFilterProp="children"
                        
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        placeholder="Seleccione al residente"
                        onChange={this.onChangeResidente}
                        style={{width:400}}
                        size={"large"}
                                         
                    >
                        {proyectos.map((proyecto, index) => {
                            return (
                                <Option  key={index} value={`${proyecto.id}`}> 
                                        <Avatar className="img-alumno" alt="logo_tec" style={{ textAlign: 'center' }}  src={`data:image/[png|gif|jpg|jpeg]; base64,${this.URLFoto(proyecto.anteproyecto.alumno.usuario.id)}`}  />
                                 {`${proyecto.anteproyecto.alumno.no_control} - ${proyecto.anteproyecto.alumno.nombre} ${proyecto.anteproyecto.alumno.ap_paterno} ${proyecto.anteproyecto.alumno.ap_materno}`}</Option>
                            )
                        })}
                    </Select>
                    
                </Col>
                <Col xs={24} lg={24} style={{marginTop: 25}}>
                    <Row>
                        <Col xs={24} lg={24} style={{textAlign: 'center'}}>
                            {spin === true ? <Spin style={{marginTop: 20, marginBottom: 20}} size="large" tip="Cargando..."/> :  null}
                        </Col>
                    </Row>
                    {renderProyecto}
                </Col>
            </Row>
        )
    }
}
