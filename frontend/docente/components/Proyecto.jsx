import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Row, Col, Upload, Modal, Tooltip, Table, Switch, message, Tabs, Alert, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import uuid from 'uuid';
const { Item } = Form;
const TabPane = Tabs.TabPane;
const { Option } = Select
// Components
import FormAddObservacion from '../components/FormAddObservacion.jsx';
import FormAddSolucion from '../components/FormAddSolucion.jsx';
import RevisionSeguimiento from '../components/RevisionSeguimiento.jsx'
import RevisionSemanalDocente from '../components/RevisionSemanalDocente.jsx';
import FormPlanDeTrabajo from '../components/FormPlanDeTrabajo.jsx';
import SeguimientoProyecto from '../components/SeguimientoProyecto.jsx';

export default class Proyecto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuario: props.usuario,
            proyecto: props.proyecto,
            visibleAddObservacion: false,
            tipo_observacion: '',
            observaciones: [],
            asesorias: [],
            seguimientos: [],
            visibleAddSolucion: false,
            id_asesoria: null,
            renderSeguimiento: null,
            visibleEvaluacionAsesorInterno: false,
            criterios_evaluacion: [],
            nombre: null,
            visiblePlanDeTrabajo:false
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            usuario: nextProps.usuario,
            proyecto: nextProps.proyecto,
            visibleAddObservacion: false,
            tipo_observacion: '',
            observaciones: [],
            asesorias: [],
            visibleAddSolucion: false,
            id_asesoria: null,
            seguimientos: [],
            renderSeguimiento: null,
            visibleEvaluacionAsesorInterno: false,
            visiblePlanDeTrabajo:false
        })
    }
    componentWillMount() {
      
    }
    componentDidMount(){
        this.datosDocente();
    }
    
    showAgregarObservacionPlanTrabajo = () => {
        const { proyecto } = this.state;
        this.setState({
            tipo_observacion: 'plan_de_trabajo',
            visibleAddObservacion: true,
            visibleAddSolucion: false,
            visibleEvaluacionAsesorInterno: false,
        })
    }
    showAgregarObservacionCronograma = () => {
        const { proyecto } = this.state;
        this.setState({
            tipo_observacion: 'cronograma',
            visibleAddObservacion: true,
            visibleAddSolucion: false,
            visibleEvaluacionAsesorInterno: false
        })
    }
    onChangeObservacion = (id_observacion, solucionada) => {
        axios.put('/api/proyecto/observacion', {
            id_observacion,
            solucionada
        }).then(res => {
            if (res.status === 200) {
                message.success('Los cambios se han guardado.')
            } else {
                message.error('No se han guardado los cambios, reportar error al administrador.')
            }
        })
    }

    onChangeTabSeguimiento = (key) => {
        const { seguimientos, usuario } = this.state;
        const currentDate = moment().format('YYYY-MM-DD');
        if (key === "seguimiento_final") {

        } else {
            const seguimiento = seguimientos.find(seg => seg.id == key);
            alert("id seguimiento")
        }   
    }
    onChangeTab = (key) => {
        const { proyecto } = this.state;
        if (key === "asesorias") {
            axios.get(`/api/proyecto/${proyecto.id}/asesorias`)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            visibleAddObservacion: false,
                            visibleAddSolucion: false,
                            visibleEvaluacionAsesorInterno: false,
                            asesorias: res.data
                        })
                    }
                })
        } else if (key === "seguimientos") {

            axios.get(`/api/proyecto/${proyecto.id}/seguimientos`)
                .then(res => {
                    if (res.status === 200) {
                        // console.warn('a>', res.data);
                        this.setState({
                            
                            seguimientos: res.data,
                            
                        })
                    }
                })

                alert("id alumno : "+this.state.usuario.id_alumno+" proyecto id "+this.state.proyecto.id+" id_periodo "+this.state.proyecto.anteproyecto.id_periodo)
                axios.put(`/api/proyecto/seguimientos`, {
                    id_proyecto: this.state.proyecto.id,
                    id_periodo: this.state.proyecto.anteproyecto.id_periodo
                }).then(res => {
                    if (res.status === 200) {
                        axios.get(`/api/alumno/${this.state.proyecto.anteproyecto.alumno.id}/_proyecto`)
                            .then(res1 => {
        
                                if (res1.status === 200) {
                                    this.setState({
                                        visibleAddObservacion: false,
                            visibleAddSolucion: false,
                            visibleEvaluacionAsesorInterno: false,
                                      //   renderSeguimiento:<SeguimientoProyecto proyecto={res1.data} seguimientos={res.data} />
                                        
                                    })
                                }
                            })
        
                    }
                })
            
           
                
        }else if(key==="revisionSemanal"){
            
           {/* axios.get(`/api/proyecto/${proyecto.id}/seguimientos`)
                .then(res => {
                    if (res.status === 200) {
                        // console.warn('a>', res.data);
                        this.setState({
                            visibleAddObservacion: false,
                            visibleAddSolucion: false,
                            visibleEvaluacionAsesorInterno: false,
                            nombre: res.data.proyecto.anteproyecto.alumno.no_control,
                        })
                    }
                })*/}

        }

    }


    datosDocente = () =>{
        const {usuario} = this.state;
        axios.get(`/api/docente/informacion/${usuario.id}`).then(res => {

            this.setState({
                nombre: res.data.titulo + "" + res.data.nombre + " " + res.data.ap_paterno + " " + res.data.ap_materno,
            })

        })
        
    }

    datosEmpresa= () =>{

        const { proyecto} = this.state;
        console.log(proyecto.anteproyecto);
    }
     //alert(proyecto.anteproyecto.alumno.no_control+" nombre "+proyecto.anteproyecto.alumno.nombre +" " +proyecto.anteproyecto.alumno.ap_paterno+" "+proyecto.anteproyecto.alumno.ap_materno+" proyecto "+ proyecto.anteproyecto.nombre+
        //" empresa "+ nombre + "empresa"+ proyecto.anteproyecto.asesor_externo.nombre);
    updateSeguimientos = () => {
        const { proyecto } = this.state;
        axios.get(`/api/proyecto/${proyecto.id}/seguimientos`)
            .then(res => {
                if (res.status === 200) {
                    console.warn('a>', res.data);
                    this.setState({
                        visibleAddObservacion: false,
                        visibleAddSolucion: false,
                        seguimientos: res.data,
                        visibleEvaluacionAsesorInterno: false
                    })
                }
            })
    }
    showAddSolucion = (id_asesoria) => {
        this.setState({
            visibleEvaluacionAsesorInterno: false,
            visibleAddObservacion: false,
            visibleAddSolucion: true,
            id_asesoria
        })
    }
    checkSolucion = (check, id_solucion) => {
        // alert(check+'=>'+id_solucion);
        axios.put('/api/proyecto/asesoria/solucion_recomendada', {
            id_solucion,
            solucionado: check
        }).then(res => {
            if (res.status === 200) {
                message.success('Se ha actualizado la solución.')
            } else {
                message.error('Surgio un error al actualizar la solución. favor de reportarlo con el administrador.')
            }
        })
    }
    checkPermitirGenerarFormato = (check, id_asesoria) => {
        axios.put('/api/proyecto/asesoria_autorizar_formato', {
            permitir_generar_formato: check,
            id_asesoria
        }).then(res => {
            if (res.status === 200) {
                message.success('Se ha realizado el cambio de autorizar el formato de asesoría')
            } else {
                message.error('Surgio un error al actualizar la autorización de la asesoría, favor de reportarlo con el administrador.')
            }
        })

    }
    showSoluciones = (id_asesoria) => {
        axios.get(`/api/proyecto/asesoria/${id_asesoria}/soluciones_recomendadas`)
            .then(res => {
                if (res.status === 200) {
                    console.warn('soluciones', res.data)
                    const columnsSolucionesRecomendadas = [
                        {
                            title: 'Solucionado',
                            dataIndex: 'solucionado',
                            key: 'solucionado',
                            render: (text, record) => (
                                <Switch defaultChecked={record.solucionado} checkedChildren="Solucionado" onChange={(e) => this.checkSolucion(e, record.id)} unCheckedChildren={<Icon type="cross" />} />
                            )
                        },
                        {
                            title: 'Solución',
                            dataIndex: 'solucion',
                            key: 'solucion',
                        }
                    ]
                    const soluciones = res.data.map((solucion, index) => {
                        return {
                            key: index,
                            id: solucion.id,
                            solucionado: solucion.solucionado,
                            solucion: solucion.solucion
                        }
                    }
                    )
                    Modal.info({
                        width: 800,
                        title: 'Soluciones recomendadas',
                        content: (
                            <div>
                                <Table size="small" columns={columnsSolucionesRecomendadas} dataSource={soluciones} pagination={{ pageSize: 5 }} />
                            </div>
                        ),
                        onOk() { },
                    })
                }
            })
    }
    updateTipoAsesoria = (id_asesoria, tipo) => {
        axios.put('/api/asesoria/tipo', {
            id_asesoria,
            tipo
        }).then(res => {
            if (res.status === 200) {
                message.success('El tipo de asesoría se ha actualizado satisfactoriamente!')
            } else {
                message.error('Ops, hemos tenido un problema, favor de reportar al administrador.')
            }
        })
    }
  
    showEvaluacionAsesorInterno = (alumno) => {
        if (alumno.plan_estudios === '2009-2010') {
            axios.get('/api/proyecto/evaluacionAnexoIII/criterios/asesor_interno/')
                .then(res => {
                    if (res.status === 200) {
                        // console.warn('cri', res.data)
                        this.setState({
                            criterios_evaluacion: res.data,
                            visibleEvaluacionAsesorInterno: true,
                            visibleAddObservacion: false,
                            visibleAddSolucion: false,
                        })
                    } else {
                        message.warn('Error al realizar petición de criterios de evaluación, favor de reportar al administrador.')
                    }
                })
        } else if (alumno.plan_estudios === '2015-2016') {
            axios.get('/api/proyecto/evaluacionAnexoXXX/criterios/asesor_interno/')
                .then(res => {
                    if (res.status === 200) {
                        // console.warn('cri', res.data)
                        this.setState({
                            criterios_evaluacion: res.data,
                            visibleEvaluacionAsesorInterno: true,
                            visibleAddObservacion: false,
                            visibleAddSolucion: false,
                        })
                    } else {
                        message.warn('Error al realizar petición de criterios de evaluación, favor de reportar al administrador.')
                    }
                })
        }

    }
   
    
    autorizarCartaDeLiberacionAsesorInterno = (check, id_proyecto,id_alumno,situacion,numeroDeNoCumplidos) => {
        axios.put('/api/proyecto/autorizar_carta_liberacion/asesor_interno', {
            id_proyecto,
            autorizar: check
        }).then(res => {
            if (res.status === 200) {
                message.success('Se ha actualizado la autorización de la carta de liberación.')
                
            } else {
                message.warn('Error al autorizar la carta de liberación consultar al administrador.')
            }
        })
        // check && situacion==='activo' && numeroDeNoCumplidos ===0?
        // this.actualizacionASTF(id_alumno)
        // :''
    }
    updateProyecto = () => {
        this.props.updateProyecto();
    }
    actualizacionASTF = (id)=>{
        axios.put('/api/alumno/situacion', {
            id,
            estado: 'termino satisfactoriamente'
        }).then((res) => {
            if (res.status = 200) {

                console.log('ok se cambio el estado ')

            } else {
                message.error("Ups ha visto un problema, favor de contactar al administrador")
            }
        })
    }
    showPlan=()=>{
        this.setState({
            visiblePlanDeTrabajo:true
        })
    }
    render() {
        const { nombre,criterios_evaluacion, visibleEvaluacionAsesorInterno, proyecto, visibleAddObservacion, tipo_observacion, usuario, observaciones, asesorias, id_asesoria, visibleAddSolucion, seguimientos, renderSeguimiento } = this.state
        var numeroDeNoCumplidos = 0;
        var SituacionDelResidente=proyecto.anteproyecto.alumno.situacion[0].estado,idResidente= proyecto.anteproyecto.alumno.id;
        console.log(SituacionDelResidente+"--"+idResidente)
        seguimientos.map((seguimiento_proyecto, key) => {
            seguimiento_proyecto.estado_seguimiento === 'no cumplio' ? numeroDeNoCumplidos += 1 : ''
        })

          
        const observacionesPlanTrabajo = observaciones.filter(obs => obs.tipo === 'plan_de_trabajo').map((observacion) => {
            return {
                key: uuid.v1(),
                id: observacion.id,
                observacion: observacion.observacion,
                solucionada: observacion.solucionada
            }
        })

        const observacionesCronograma = observaciones.filter(obs => obs.tipo === 'cronograma').map((observacion) => {
            return {
                key: uuid.v1(),
                id: observacion.id,
                observacion: observacion.observacion,
                solucionada: observacion.solucionada
            }
        })
        const columnsPlanTrabajo = [

            {
                title: 'Solucionada',
                dataIndex: 'solucionada',
                key: 'solucionada',
                render: (text, record) => (
                    <Switch onChange={(check) => this.onChangeObservacion(record.id, check)} defaultChecked={record.solucionada} checkedChildren="Solucionada" unCheckedChildren={<Icon type="cross" />} />
                )
            },
            {
                title: 'Observación',
                dataIndex: 'observacion',
                key: 'observacion'
            }
        ]

        const columnsAsesorias = [
            {
                className: 'center-text',
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
            },
            {
                className: 'center-text',
                title: 'Temas a asesorar',
                dataIndex: 'temas_a_asesorar',
                key: 'temas_a_asesorar',

            },
            {
                className: 'center-text',
                title: 'Avance',
                dataIndex: 'url_avance',
                key: 'url_avance',
                render: (text, record) => (
                    <a href={record.url_avance} target="_blank">Archivo de avance<Icon type="file-pdf" /></a>
                )
            },
            {
                className: 'center-text',
                title: 'Soluciones recomendadas',
                dataIndex: 'soluciones_recomendadas',
                key: 'soluciones_recomendadas',
                render: (text, record) => (
                    <span>
                        <Button style={{ marginLeft: 2, marginRight: 2 }} icon="bars" onClick={() => this.showSoluciones(record.id)}>Soluciones</Button>
                        <Button style={{ marginLeft: 2, marginRight: 2 }} icon="plus" onClick={() => this.showAddSolucion(record.id)}>Agregar solución</Button>
                    </span>
                )
            },
            {
                className: 'center-text',
                title: 'Tipo de asesoría',
                dataIndex: 'tipo',
                key: 'tipo',
                render: (text, record) => (
                    <Select defaultValue={record.tipo} onChange={(value) => this.updateTipoAsesoria(record.id, value)} style={{ width: '100%' }}>
                        <Option key={uuid.v4()} value="virtual">
                            Virtual
                        </Option>
                        <Option key={uuid.v4()} value="presencial">
                            Presencial
                        </Option>
                    </Select>
                )
            },
            {
                className: 'center-text',
                title: 'Generar formato',
                dataIndex: 'permitir_generar_formato',
                key: 'permitir_generar_formato',
                render: (text, record) => (
                    <Switch defaultChecked={record.permitir_generar_formato} checkedChildren="Autorizado" onChange={(e) => this.checkPermitirGenerarFormato(e, record.id)} unCheckedChildren="No autorizado" />
                )
            }
        ]
        const _asesorias = asesorias.map((asesoria) => {
            return {
                key: uuid.v1(),
                id: asesoria.id,
                fecha: moment(asesoria.fecha, 'YYYY-MM-DD').format('ll'),
                temas_a_asesorar: asesoria.temas_a_asesorar,
                url_avance: asesoria.url_avance,
                soluciones_recomendadas: 'on',
                permitir_generar_formato: asesoria.permitir_generar_formato,
                tipo: asesoria.tipo
            }
        })

        return (
            <div>
                <Tabs animated key=".103." defaultActiveKey="1" onChange={(key) => this.onChangeTab(key)}>
                    <TabPane tab={<span><Icon type="book" />Proyecto</span>} key="proyecto">
                        <Form>
                            <Item label="Título: ">
                                <Input value={proyecto.anteproyecto.nombre} readOnly />
                            </Item>
                            <Item label="Objetivo general: ">
                                <Input value={proyecto.anteproyecto.objetivo_general} readOnly />
                            </Item>

                            <Item label="Anteproyecto: ">
                                <Upload

                                    listType="picture-card"
                                    fileList={[{
                                        uid: -1,
                                        name: 'anteproyecto.pdf',
                                        status: 'done',
                                        url: `/api/anteproyecto/pdf/${proyecto.anteproyecto.path_file_anteproyecto}`
                                    }]}
                                />
                            </Item>
                        </Form>
                        <Row className="border-top">
                            <Col xs={24} lg={6} >
                            
                             <Button type="primary" onClick={this.showPlan}>Plan de trabajo</Button>

                                
                            </Col>
                           
                        </Row>
                        <Row className="border-top">
                            <Col xs={24} lg={24}>
                                 <a  href={`/api/plan_de_trabajo/${this.state.proyecto.id}/get_cronograma`} target="_blank"><Button icon="file-pdf" disabled={this.state.disabledDescargarPlan} type="primary">Generar cronograma de actividades</Button></a>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab={<span><Icon type="solution" />Revisión semanal</span>} key="revisionSemanal">
                        <Row>
                            <RevisionSemanalDocente proyecto={this.state.proyecto} usuario={this.state.usuario} nombre_asesor_interno={this.state.nombre}/>
                        </Row>
                    </TabPane>
                    <TabPane tab={<span><Icon type="calendar" />Seguimientos</span>} key="seguimientos">
                        <Tabs animated key="-9kbasñdjboubj·#das9" tabPosition="left" defaultActiveKey="0" onChange={(key) => this.onChangeTabSeguimiento(key)} >
                            {seguimientos.map(((seguimiento, index) => {
                                // console.log('key', seguimiento.id)
                                return (
                                    <TabPane tab={<span><Icon type="schedule" />{`Seguimiento ${index + 1}`}</span>} key={seguimiento.id}>
                                        {renderSeguimiento}
                                        
                                    </TabPane>
                                )
                            }))}
                            <TabPane tab={<span><Icon type="schedule" />Seguimiento final</span>} key="seguimiento_final">
                                <Row gutter={20}>
                                    <Col xs={24} lg={24} style={{ marginTop: 20, marginBottom: 30 }}>
                                        {proyecto.url_informe_tecnico ?
                                            <div>
                                                <p>Link del informe técnico: </p>
                                                <Upload
                                                    defaultFileList={
                                                        [{
                                                            uid: -2,
                                                            name: 'informe_tecnico',
                                                            status: 'done',
                                                            url: proyecto.url_informe_tecnico
                                                        }]
                                                    }
                                                />
                                            </div>
                                            :
                                            <Alert message="El alumno no ha subido su informe técnico" type="warning" showIcon />
                                        }
                                    </Col>
                                    <Col xs={24} lg={24}>
                                        {
                                            proyecto.url_informe_tecnico
                                                ?
                                                <div>
                                                    <Button style={{ marginBottom: 30 }} onClick={() => this.showEvaluacionAsesorInterno(proyecto.anteproyecto.alumno)} icon="bars" type="primary">Realizar evaluación</Button>
                                                    <h4 style={{ marginBottom: 10 }}>Autorizar carta de liberación</h4>
                                                    <Tooltip title={(proyecto.id_evaluacion_asesor_interno === null) ? "Antes de autorizar la carta de liberación debe realizar la evaluación." : ""}>
                                                        <Switch disabled={(proyecto.id_evaluacion_asesor_interno === null) ? true : false} defaultChecked={proyecto.autorizar_carta_liberacion_asesor_interno} checkedChildren="Autorizado" onChange={(e) => this.autorizarCartaDeLiberacionAsesorInterno(e, proyecto.id,idResidente,SituacionDelResidente,numeroDeNoCumplidos)} unCheckedChildren={<Icon type="cross" />} />
                                                    </Tooltip>
                                                    {/* {
                                                        numeroDeNoCumplidos > 0 ?
                                                            <div>
                                                                <h4 style={{ marginBottom: 10 }}>Termino satisfactoriamente el alumno</h4>
                                                                <Switch disabled={(proyecto.id_evaluacion_asesor_interno === null) ? true : false} defaultChecked={proyecto.autorizar_carta_liberacion_asesor_interno} checkedChildren="Autorizado" onChange={(e) => this.autorizarCartaDeLiberacionAsesorInterno(e, proyecto.id)} unCheckedChildren={<Icon type="cross" />} />
                                                            </div> : ''
                                                    } */}
                                                </div>

                                                :
                                                <Alert message="El alumno debe subir su informe técnico para continuar con el proceso de evaluación" type="warning" showIcon />
                                        }
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </TabPane>
                </Tabs>
                <FormPlanDeTrabajo  visible={this.state.visiblePlanDeTrabajo} proyecto={this.state.proyecto}  usuario={this.state.usuario} nombre_asesor_interno={this.state.nombre}/>

                
            </div>
        )
    }
}