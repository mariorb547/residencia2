
import React, { Component } from 'react';
import { render } from 'react-dom';
import { TreeSelect, Button, Modal, Form, Input, Radio, Select, Icon, message, Tabs, Timeline, Tooltip, DatePicker, AutoComplete, Row, Col, Menu, Dropdown, InputNumber, Alert } from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import axios from 'axios';
import moment from 'moment';

import ObtenerPlanDeTrabajo from './ObtenerPlanDeTrabajo.jsx';



const CreateFormAddTarea = Form.create()(
    (props => {
        const { visibleTarea, onCancel, onCreate, form, nuevaSubactividad } = props;
        const { getFieldDecorator } = form;

        function onChange(value) {
            console.log('changed', value);
        }


        // console.warn(alumnos_rechazados)
        return (

            <Modal
                visible={visibleTarea}
                title={`Registrar tarea`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
                width={600}
                maskClosable={false}
                centered
            ><Form layout="vertical">
                    <Row>
                        <Col span={20}>
                            <FormItem label="Tarea">
                                {getFieldDecorator('tarea', {
                                    rules: [{ required: true, message: 'Tarea es obligatoria..' }, { min: 5, message: 'El minimo de caracteres es 5.' }, { max: 500, message: 'El maximo de caracteres es 500.' }]

                                })(
                                    <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Tarea" />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label="Horas">
                                {getFieldDecorator('horas', {
                                    rules: [{ required: true, message: 'Horas es obligatoria..' }], InitialValue: 0, valuePropName: 'option'

                                })(
                                    <InputNumber min={1} max={60} defaultValue={1} onChange={onChange} />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label="Entregable">
                                {getFieldDecorator('entregable', {
                                    rules: [{ required: true, message: 'Entregable es obligatoria..' }, { min: 5, message: 'El minimo de caracteres es 5.' }, { max: 400, message: 'El maximo de caracteres es 400.' }]

                                })(
                                    <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Entregable" />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label={(
                                <span>
                                    Fecha de entrega&nbsp;
                                    <Tooltip title="La fecha en la que se entregará la evidencia">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                            >
                                {getFieldDecorator('fecha_entrega', {
                                    rules: [{ required: true, message: 'La fecha de asesoría es obligatoria.' }]
                                })(<DatePicker format="ll" />)}
                            </FormItem>
                        </Col>

                    </Row>
                </Form>

            </Modal>
        );
    })
)
export default class FormAddSubactividad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleTarea: props.visibleTarea,
            subactividad: props.subactividad,
            obtenerTareas: props.obtenerTareas

        }

    }
    componentWillReceiveProps(nextProps) {
        const { subactividad, visibleTarea } = nextProps;
        this.setState({
            subactividad,
            visibleTarea
        })
    }



    handleCancelTarea = () => {
        const form = this.form;
        form.resetFields();
        this.setState({ visibleTarea: false });

    }

    handleCreateTarea = () => {

        const { subactividad } = this.state
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }


            console.log("Tarea " + values.tarea + values.horas, values.entregable + values.fecha_entrega)
            // crear post al servidor
            axios.post('/api/plan_de_trabajo/addTarea', {
                id_proyecto: subactividad,
                tipo: "agregarTarea",
                tarea: values.tarea,
                horas: values.horas,
                entregable: values.entregable,
                fecha_entrega: values.fecha_entrega
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Tarea registrada satisfactoriamente")

                    form.resetFields();
                    this.props.obtenerTareas()

                } else {
                    Modal.error({
                        title: 'Error al registrar la tarea. Revisar los siguientes campos',
                        content: (
                            <div>
                                {res.data.errores}
                            </div>
                        ), onOk() { },
                    })
                }
            }).catch((err) => {
                message.error(err);
            });


        });
    }

    saveFormRef = (form) => {
        this.form = form;
    }


    render() {
        const { visibleRegistrarTarea, visibleTareao } = this.state

        // console.warn(this.state.visibleTareao)
        return (
            <div>


                <CreateFormAddTarea
                    ref={this.saveFormRef}
                    visibleTarea={this.state.visibleTarea}
                    onCancel={this.handleCancelTarea}
                    onCreate={this.handleCreateTarea}
                    nuevaSubactividad={this.nuevaSubactividad}
                />


            </div>
        )
    }
}
