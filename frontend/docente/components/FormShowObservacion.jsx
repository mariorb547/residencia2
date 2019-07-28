import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Modal, Form, Input, Switch, Select, Icon, message, Table } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

import axios from 'axios';
import uuid from 'uuid';
import moment from 'moment';

import ObtenerPlanDeTrabajo from '../components/ObtenerPlanDeTrabajo.jsx';

export default class FormAddObservaciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            tipo: props.tipo,
            id_tarea: props.id_tarea,
            dataSource_observaciones: [],
            actulizarCantidadObservaciones: props.actulizarCantidadObservaciones,
            disabledEstadoAsesorInterno: props.disabledEstadoAsesorInterno,
            ocultarShowObservacion: props.ocultarShowObservacion,
            onChangeEstadoTarea: props.onChangeEstadoTarea

        }
    }

    componentWillMount() {

    }
    componentWillReceiveProps(nextProps) {
        const { visible, tipo, id_tarea, disabledEstadoAsesorInterno } = nextProps;
        this.setState({
            visible,
            tipo,
            id_tarea,
            disabledEstadoAsesorInterno,
            

        })

        axios.get(`/api/plan_de_trabajo/${id_tarea}/${tipo}/get_observaciones`)
            .then(res => {

                if (res.status === 200) {

                    //se recorre los resultados para agregarlos a un arreglo con el key unico
                    const dataSource = res.data.map((observacion) => {
                        return {
                            key: uuid.v1(),
                            id: observacion.id,
                            id_tarea: observacion.id_tarea,
                            observacion: observacion.observacion,
                            estado: observacion.estado,
                            estado_alumno: observacion.estado_alumno,
                            fecha_creacion: moment(observacion.createdAt).utc().format('LL'),



                        }
                    })
                    this.setState({
                        dataSource_observaciones: dataSource

                    })
                }

            })

    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {

        this.setState({ visible: false });
        this.state.ocultarShowObservacion()

    }
    saveFormRef = (form) => {
        this.form = form;
    }

    onChangeObservacion = (id, estado) => {
        axios.put('/api/proyecto/observacion', {
            id,
            estado
        }).then(res => {
            if (res.status === 200) {
                message.success('Los cambios se han guardado.')
                this.props.actulizarCantidadObservaciones()
                let observacionesPendientes=false
                axios.get(`/api/plan_de_trabajo/${this.state.id_tarea}/${"plan_de_trabajo"}/get_observaciones`)
                    .then(res => {
                        if (res.status === 200) {

                            //si hay observaciones pendiente
                            res.data.map((observacion) => {
                                if (!observacion.estado) {
                                    observacionesPendientes = true
                                }
                            })

                            //si no hay observaciones pendientes automaticamente se aprueba la tarea
                            if (!observacionesPendientes) {
                                this.props.onChangeEstadoTarea(this.state.id_tarea, true)
                            } else {
                                //si hay observaciones pendientes automaticamente la tarea cambia de estado a no_aprobado
                              //  this.props.onChangeEstadoTarea(this.state.id_tarea, false)
                            }

                        }
                    })
            } else {
                message.error('No se han guardado los cambios, reportar error al administrador.')
            }
        })


    }
    render() {

        const columns = [

            {
                width: 140,
                title: 'Estado asesor interno',
                dataIndex: 'estado',
                key: 'estado',
                render: (text, record) => (
                    <Switch disabled={this.state.disabledEstadoAsesorInterno} onChange={(check) => this.onChangeObservacion(record.id, check)} defaultChecked={record.estado} checkedChildren="Solucionada" unCheckedChildren={<Icon type="cross" />} />
                )
            },
            {
                width: 570,
                title: 'Observación',
                dataIndex: 'observacion',
                key: 'observacion'
            },
            {
                width: 120,
                title: 'Estado residente',
                dataIndex: 'estado_alumno',
                key: 'estado_alumno',
                render: (text, record) => (
                    <Switch disabled defaultChecked={record.estado_alumno} checkedChildren="Solucionada" unCheckedChildren={<Icon type="cross" />} />
                )
            },
            {
                width: 180,
                title: 'Fecha de creación',
                dataIndex: 'fecha_creacion',
                key: 'createdAT'
            },
        ]
        // console.warn('Aqui merengues',this.state.usuario)
        return (
            <div>


                <Modal
                    visible={this.state.visible}
                    title={`Observación  ${this.state.tipo}`}
                    width={1000}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cerrar</Button>,

                    ]}
                >

                    <Form layout="vertical">
                        <Table

                            dataSource={this.state.dataSource_observaciones}
                            className="full-width"
                            columns={columns}

                        />
                    </Form>

                </Modal>


            </div>
        )
    }
}

