import React, { Component } from 'react';
import { render } from 'react-dom';
import { TreeSelect, Button, Modal, Form, Input, Radio, Select, Icon, message, Tabs, onChange, Tooltip, DatePicker, AutoComplete, Row, Col, Menu, Dropdown, InputNumber, Alert } from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import axios from 'axios';
import moment from 'moment';
import FormAddSubactividad from './FormAddSubactividad.jsx';
import '../../styling.css';

const CreateFormAddActividadGeneral = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form, carrera, alumnos_rechazados, addToPeriodo } = props;
        const { getFieldDecorator } = form;

        function onChange(value) {
            console.log('changed', value);
        }

        const onClick = ({ key }) => {
            message.info(`Click on item ${key}`);
        };

        const Add = props => {
            return (
                <Col span={24}>
                    <FormItem label="Modelo de desarrollo">
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
                                Metodología <Icon type="down" />
                            </a>
                        </Dropdown>
                    </FormItem>
                </Col>
            )
        }


        // console.warn(alumnos_rechazados)
        return (
            <Modal
                visible={visible}
                title={`Registrar actividad general`}
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
                                    rules: [{ required: true,message: 'La actividad principal es requerida.' },{pattern: new RegExp("^[A-Z].*"),message: 'La actividad principal debe iniciar con una letra mayúscula' }]
                                })(
                                    <Input  prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Actividad general" />
                                )
                                }
                            </FormItem>
                        </Col>

                        <Col span={20}>
                            <FormItem label="Objetivo">
                                {getFieldDecorator('objetivo', {
                                    rules: [{ required: true, message: 'El objetivo es requerido.' },{ pattern: new RegExp("^[A-Z].*"),message: 'El objetivo debe iniciar con una letra mayúscula.'}]
                                })(
                                    <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Objetivo" />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label="Entregable">
                                {getFieldDecorator('entregable', {
                                    rules: [{ required: true, message: 'El entregable es requerido.' },{pattern: new RegExp("^[A-Z].*"), message: 'El entregable debe iniciar con una letra mayúscula.'}]
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


export default class FormAddActividadGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            proyeproyectoActividadGeneral: props.proyectoActividadGeneral,
            visibleRegistrarSubactividad: props.visibleRegistrarSubactividad,
            obtenerSubactividades: props.obtenerSubactividades,
            hideAddActividadGenal:props.hideAddActividadGenal
        }
    }

    componentWillReceiveProps(nextProps) {
        const { visible, proyectoActividadGeneral, visibleRegistrarSubactividad } = nextProps;
        this.setState({
            visible,
            proyectoActividadGeneral,
             visibleRegistrarSubactividad,
            
        })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showAddSubactividad = () => {
        this.setState({
            visibleRegistrarSubactividad: true
        })
    }

    handleCancel = () => {
        const form = this.form;
        form.resetFields();
        this.setState({ visible: false });

    }
    handleCreate = () => {
        const { proyectoActividadGeneral } = this.state
        const form = this.form;

        form.validateFields((err, values) => {

            if (err) {
                return;
            }

            // crear post al servidor
            axios.post('/api/plan_de_trabajo/actividad_general', {
                id_proyecto: proyectoActividadGeneral.id,
                actividad: this.maysPrimera(values.actividad),
                objetivo: this.maysPrimera(values.objetivo),
                entregable: this.maysPrimera(values.entregable)
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Actividad general registrada satisfactoriamente")
                    this.setState({ visible: false });
                    form.resetFields();
                    this.showAddSubactividad();
                    // this.props.updateAsesorias();
                     
                } else {
                    Modal.error({
                        title: 'Error al registrar actividad general. Revisar los siguientes campos',
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
    saveFormRef = (form) => {
        this.form = form;
    }

    maysPrimera = (dato) => {
        return dato.charAt(0).toUpperCase() + dato.slice(1);
    }
    render() {
        // console.warn(this.state.proyecto)
        const { visibleRegistrarSubactividad, proyectoActividadGeneral } = this.state;

        return (
            <div>

                <CreateFormAddActividadGeneral
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
                <FormAddSubactividad visible1={visibleRegistrarSubactividad} obtenerSubactividades={this.state.obtenerSubactividades} proyecto={proyectoActividadGeneral} hideAddActividadGenal={this.state.hideAddActividadGenal} />

            </div>
        )
    }
}
