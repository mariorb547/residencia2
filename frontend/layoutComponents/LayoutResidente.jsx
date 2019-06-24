import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { Layout, Menu, message, Icon, Alert, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const ButtonGroup = Button.Group;
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import uuid from 'uuid';
import { getIsAuth } from '../api.jsx';

// components
import CambiarContrasenia from '../layoutComponents/CambiarContrasenia.jsx';
import FormJustificacionCancelacion from '../layoutComponents/FormJustificacionCancelacion.jsx';
import ProyectoDeResidencia from '../alumno/components/ProyectoDeResidencia.jsx';
import RevisionSemanal from '../alumno/components/RevisionSemanal.jsx'
import SeguimientoProyecto from '../alumno/components/SeguimientoProyecto.jsx';
import Foto from '../jefeDep/Foto.jsx';
export default class LayoutResidente extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: true,
            isAuth: true,
            usuario: null,
            imagen: null,
            nombre: null,
            componentRender: {
                title: null,
                render: null
            },
            visibleCambiarContrasenia: false,
            proyecto: null,
            cancelacion: null,
            visibleCancelacion: false,
            datosAlumno: null,
            planAprobado: false
        }
    }
    componentWillReceiveProps=(nextProps)=>{
        this.setState({
           planAprobado:nextProps.planAprobado
            
        })
      }
    componentWillMount() {
        this.getIsAuth()
       
    }
    imagens = (id) => {
        axios.get(`/api/usuario/foto/${id ? id : this.state.usuario.id}`)
            .then(res => {
                if (res.status == 200) {
                    this.setState({
                        imagen: res.data,

                    })

                }
            })

    }
    logo = (titulo) => {
        return (
            <div className="titulo" style={{ textAlign: 'down', top: 10, height: 40, width: 1000 }}>
                <img src="/img/logoprincipal.png" alt="logo_tec" height="250%" />

                <div style={{ fontSize: 20 }}>{titulo} </div>
            </div>
        )
    }
    getDatosCandidato(id) {
        axios.get(`/api/alumno/informacion/${id}`).then(res => {
            if (res.status == 200) {
                this.imagens(res.data.id_usuario);

                this.setState({
                    datosAlumno: res.data,
                    nombre: res.data.nombre + " " + res.data.ap_paterno + " " + res.data.ap_materno,
                })
            } else {
                message.error('Ups hubo un error inesperado favor de contactar al administrador')
            }
        });
    }
    getIsAuth() {
        getIsAuth().then((usuario) => {
            if (usuario.rol === 'residente') {
                this.getDatosCandidato(usuario.id_alumno);
                axios.get(`/api/alumno/${usuario.id_alumno}/_proyecto`)
                    .then(res => {

                        if (res.status === 200) {
                            this.setState({
                                proyecto: res.data,
                                isAuth: usuario.isAuth,
                                usuario: usuario,
                                componentRender: {
                                    title: this.logo("Proyecto de residencia"),
                                    render: <ProyectoDeResidencia proyecto={res.data} usuario={usuario} />

                                }
                            })
                        } else {
                            this.setState({ isAuth: false })
                        }
                    }).catch(err => {

                        axios.get(`/api/alumno/${usuario.id_alumno}/cancelacion`)
                            .then(res => {
                                if (res.status === 200) {
                                    this.setState({
                                        cancelacion: res.data
                                    })

                                }

                            })
                    })
            } else {
                this.setState({ isAuth: false })
            }
        })
    }
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            visibleCambiarContrasenia: false,
            visibleCancelacion: false,
        });
    }
    updateAsesorias = () => {
        const { usuario } = this.state;
        axios.get(`/api/alumno/${usuario.id_alumno}/_proyecto`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        visibleCambiarContrasenia: false,
                        visibleCancelacion: false,
                        componentRender: {
                            title: this.logo("Asesorias"),
                            render: <RevisionSemanal key={uuid.v1()} updateAsesorias={this.updateAsesorias.bind(this)} usuario={usuario} proyecto={res.data} />
                        }
                    })
                }
            })
    }

    handleMenu = ({ item, key, selectedKeys }) => {
        const { usuario, proyecto } = this.state;
        if (key == 1) {
            axios.get(`/api/alumno/${usuario.id_alumno}/_proyecto`)
                .then(res => {

                    if (res.status === 200) {
                        console.log(res.data);
                        this.setState({
                            componentSelected: key,
                            visibleCambiarContrasenia: false,
                            visibleCancelacion: false,
                            proyecto: res.data,
                            componentRender: {
                                title: this.logo("Proyecto de residencia"),
                                render: <ProyectoDeResidencia proyecto={res.data} usuario={usuario} />
                            }
                        })
                    }
                })

        } else if (key == 2) {
            axios.get(`/api/alumno/${usuario.id_alumno}/_proyecto`)
                .then(res => {
                    if (res.status === 200) {
                        this.statusPlanDeTrabajo(res.data.id,key,usuario,res.data)
                                               
                    }
                })


        } else if (key == 4) {
            axios.put(`/api/proyecto/seguimientos`, {
                id_proyecto: proyecto.id,
                id_periodo: proyecto.anteproyecto.id_periodo
            }).then(res => {
                if (res.status === 200) {
                    axios.get(`/api/alumno/${usuario.id_alumno}/_proyecto`)
                        .then(res1 => {

                            if (res1.status === 200) {
                                this.statusPlanDeTrabajoSeguimiento(res1.data.id,key,res1.data,res.data)
                                
                            }
                        })

                }
            })

        } else if (key == 3) { // modal cambiar contraseña
            this.setState({
                visibleCambiarContrasenia: true,
                visibleCancelacion: false,
            })
        } else if (key == 5) {
            this.setState({
                componentSelected: key,
                componentRender: {
                    title: this.logo("Actualizacion de tu foto de perfil"),
                    render: <Foto ok={this.imagens.bind(this)} />
                }
            })
        }
    }
    showFormCancelacion = () => {
        this.setState({
            visibleCambiarContrasenia: false,
            visibleCancelacion: true
        })
    }
    
    statusPlanDeTrabajo = (id_proyecto,key,usuario,proyecto) => {
        var bandera=true;
        axios.get(`/api/plan_de_trabajo/${id_proyecto}/get_actividad_general`)
            .then(res => {
                if (res.status === 200) {
                    //si el plan de tbajo esta vacio 
                    if (res.data.length == 0) {
                        this.setState({
                            componentSelected: key,
                            visibleCambiarContrasenia: false,
                            visibleCancelacion: false,
                            componentRender: {
                                title: this.logo("Asesorias"),
                                render:<h1 style={{background:"red"}}>El plan de trabajo no ha sido aprobado, comuníquese con su asesor interno </h1>  }
                        })
                    }
                    res.data.map((actividad) => {
                        actividad.subactividades.map((subactividad) => {
                            subactividad.tareas.map((tarea) => {

                                if (tarea.estado_revision_plan !== "aprobado") {

                                    bandera=false;
                                }
                            })
                        })
                    })


                }

                if(bandera){
                    this.setState({
                        componentSelected: key,
                        visibleCambiarContrasenia: false,
                        visibleCancelacion: false,
                        componentRender: {
                            title: this.logo("Asesorias"),
                            render: <RevisionSemanal key={uuid.v1()} updateAsesorias={this.updateAsesorias.bind(this)} usuario={usuario} proyecto={proyecto} />
                        }
                    })
                }else{
                    this.setState({
                        planAprobado: true,
                        componentSelected: key,
                        visibleCambiarContrasenia: false,
                        visibleCancelacion: false,
                        componentRender: {
                            title: this.logo("Asesorias"),
                            render:<h1 style={{background:"red"}}>El plan de trabajo no ha sido aprobado, comuníquese con su asesor interno </h1>  }
                    })
                }
            })

    }

    statusPlanDeTrabajoSeguimiento = (id_proyecto,key,proyecto,seguimientos) => {
        var bandera=true;
        axios.get(`/api/plan_de_trabajo/${id_proyecto}/get_actividad_general`)
            .then(res => {
                if (res.status === 200) {
                    //si el plan de tbajo esta vacio 
                    if (res.data.length == 0) {
                        this.setState({
                            componentSelected: key,
                            visibleCambiarContrasenia: false,
                            visibleCancelacion: false,
                            componentRender: {
                                title: this.logo("Seguimientos"),
                                render:<h1 style={{background:"red"}}>El plan de trabajo no ha sido aprobado, comuníquese con su asesor interno  </h1>  
                               
                            }
                        })
                    }
                    res.data.map((actividad) => {
                        actividad.subactividades.map((subactividad) => {
                            subactividad.tareas.map((tarea) => {

                                if (tarea.estado_revision_plan !== "aprobado") {

                                    bandera=false;
                                }
                            })
                        })
                    })


                }

                if(bandera){
                    this.setState({
                        componentSelected: key,
                        visibleCambiarContrasenia: false,
                        visibleCancelacion: false,
                        componentRender: {
                            title: this.logo("Seguimientos"),
                            render: <SeguimientoProyecto proyecto={proyecto} seguimientos={seguimientos} />
                        }
                    })
                }else{
                    this.setState({
                        componentSelected: key,
                        visibleCambiarContrasenia: false,
                        visibleCancelacion: false,
                        componentRender: {
                            title: this.logo("Seguimientos"),
                            render:<h1 style={{background:"red"}}>El plan de trabajo no ha sido aprobado, comuníquese con su asesor interno </h1>  
                           
                        }
                    })
                   
                }
            })

    }
    render() {
        const { visibleCancelacion, cancelacion, isAuth, nombre, imagen, componentSelected, componentRender, usuario, visibleCambiarContrasenia, proyecto } = this.state
        return (
            isAuth ? (
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        breakpoint="lg"
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}

                    >
                        <center>

                            { //solo lo hago para que se
                                this.state.collapsed ?
                                    <div className="grises" >
                                        <img alt="logo_tec" src={`data:image/[png|gif|jpg|jpeg]; base64,${imagen}`} style={{ textAlign: 'center', left: 50, height: 50, width: 35 }} />
                                    </div>
                                    :
                                    <div className="grises" style={{ alignContent: 'center', textAlign: 'center', top: 10, height: 120, width: 150 }}>
                                        <img alt="logo_tec" src={`data:image/[png|gif|jpg|jpeg]; base64,${imagen}`} style={{ left: 35, height: 150, width: 150 }} />
                                        <div>{nombre}</div>
                                    </div>
                            }
                        </center>
                        {
                            this.state.collapsed ? '' : <div><br /><br /><br /></div>
                        }
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onSelect={this.handleMenu}>
                            <Menu.Item key="1" >
                                <Icon type="inbox" />
                                <span>Proyecto</span>
                            </Menu.Item>
                            <Menu.Item key="2" >
                                <Icon type="solution" />
                                <span>Asesorías</span>
                            </Menu.Item>
                            <Menu.Item key="4" >
                                <Icon type="calendar" />
                                <span>Seguimientos</span>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={<span><Icon type="user" /><span>Usuario</span></span>}
                            >
                                <Menu.Item key="3">Cambiar contraseña</Menu.Item>
                                <Menu.Item key="5">
                                    <Icon type="camera" />
                                    Actializar foto</Menu.Item>
                                <Menu.Item ><a href="/api/usuario/logout"> <strong>Cerrar sesión</strong> </a> </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0., height: 150 }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            <div style={{ float: 'right', left: 50 }} >
                                {componentRender.title}
                            </div>
                        </Header>
                        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                            {componentRender.render}


                            {proyecto ? null : <div>

                                <Alert message="Residente, usted no tiene proyecto, probablemente hubo una cancelación ó su anteproyecto no fue factible, para mas información preguntar al presidente de academia o jefe de departamento." type="error" showIcon />
                                {cancelacion === null ? null :
                                    <div>
                                        <ButtonGroup>
                                            <Button onClick={() => this.showFormCancelacion()} style={{ marginTop: 20 }} icon="plus">
                                                Agregar justificación de cancelación de residencia
                                                                </Button>
                                            <Button type="primary" icon="file-pdf">
                                                <a style={{ color: 'white' }} href={`/api/alumno/${cancelacion.id}/generarFormatoDeCancelacion`} target="_blank">
                                                    Generar formato
                                                                    </a>
                                            </Button>

                                        </ButtonGroup>
                                        <FormJustificacionCancelacion cancelacion={cancelacion} visible={visibleCancelacion} />
                                    </div>
                                }
                            </div>}
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Sistema de Seguimiento de residencias del ITCH ©2017 Francisco Arcos farcosj51@gmail.com
                        </Footer>
                    </Layout>
                    <CambiarContrasenia visible={visibleCambiarContrasenia} />
                </Layout>
            ) :
                (<Redirect to="/usuario/auth" />)
        )
    }
}
