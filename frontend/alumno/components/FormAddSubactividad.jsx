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


const CreateFormAddSubactividad = Form.create()(
    (props => {
        const { visible1, onCancel, onCreate, form, carrera, alumnos_rechazados, addToPeriodo } = props;
        const { getFieldDecorator } = form;

        function onChange(value) {
            console.log('changed', value);
        }

        const onClick = ({ key }) => {
            message.info(`Click on item ${key}`);
        };




        // console.warn(alumnos_rechazados)
        return (
            <Modal
                visible={visible1}
                title={`Registrar subactividad`}
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
                            <FormItem label="Subactividad">
                                {getFieldDecorator('subactividad', {
                                    rules: [{ required: true, message: 'La subactividad es requerida.' },{pattern: new RegExp("^[A-Z].*"), message: 'La subactividad debe iniciar con una letra mayúscula.'}]
                                })(
                                    <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Subactividad" />
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
                                    rules: [{ required: true, message: 'La tarea es requira.' },{ pattern: new RegExp("^[A-Z].*"), message: 'La tarea debe iniciar con una letra mayúscula.' }]

                                })(
                                    <Input prefix={<Icon type="laptop" style={{ fontSize: 12 }} />} placeholder="Tarea" />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label="Horas">
                                {getFieldDecorator('horas', {
                                    rules: [{ required: true, message: 'Horas es obligatoria..' }], InitialValue: 1, 

                                })(
                                    <InputNumber id="horas" min={1} max={60} onChange={onChange} />
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={20}>
                            <FormItem label="Entregable">
                                {getFieldDecorator('entregable', {
                                    rules: [{ required: true, message: 'Entregable es obligatoria.' }, {pattern: new RegExp("^[A-Z].*"),message: 'El entregable debe iniciar con una letra mayúscula.'}]

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
                        <Col span={20}>
                            <Button type="primary" onClick={nuevaSubactividad}>
                                Nueva subactividad
                </Button>
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
            visible1: props.visible1,
            proyecto: props.proyecto,
            visibleRegistrarTarea: props.visibleRegistrarTarea,
            visibleTarea: false,
            obtenerSubactividades: props.obtenerSubactividades,
            hideAddActividadGenal:props.hideAddActividadGenal


        }

    }
    componentWillReceiveProps(nextProps) {
        const { visible1, proyecto, visibleRegistrarTarea,hideAddActividadGenal } = nextProps;
        this.setState({
            visible1,
            proyecto,
            visibleRegistrarTarea,
            hideAddActividadGenal
        })
    }

    showModal = () => {
        this.setState({
            visible1: true,
        });
    }
    showAddTarea = () => {
        this.setState({
            visibleTarea: true
        })
    }
    handleCancel = () => {
        const form = this.form;
        form.resetFields();
        this.setState({ visible1: false, visibleTarea: false });
        this.state.hideAddActividadGenal()

    }
    handleCancelTarea = () => {
        const form = this.form;
        form.resetFields();
        this.setState({ visibleTarea: false, visible1: false });
        this.state.hideAddActividadGenal()

    }
    handleCreate = () => {

        const { proyecto } = this.state
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            var id_actividad_general;
            var tipo;
            if (proyecto.id === undefined) {
                //si proyecto.id es undefined es porque se añidara una subactivida a una activida general ya existente 
                id_actividad_general = proyecto
                tipo = "agregar"

            } else {
                //se agrega una subactividad de forma normal     
                id_actividad_general = proyecto.id
                tipo = "nueva"

            }


            // crear post al servidor
            axios.post('/api/plan_de_trabajo/addSubactividad', {
                id_proyecto: id_actividad_general,
                actividad: this.maysPrimera(values.subactividad),
                tipo: tipo
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Subactividad registrada satisfactoriamente")
                    this.setState({ visible1: false });
                    this.showAddTarea();
                    form.resetFields();

                } else {
                    Modal.error({
                        title: 'Error al registrar la subactividad. Revisar los siguientes campos',
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


    handleCreateTarea = () => {

        const { proyecto } = this.state
        const form1 = this.formTarea;
        form1.validateFields((err, values) => {
            if (err) {
                return;
            }
            var id_actividad_general;
            var tipo;
            if (proyecto.id === undefined) {
                //si proyecto.id es undefined es porque se añidara una tarea a una subactividad ya existente 
                id_actividad_general = proyecto
                tipo = "agregar"

            } else {
                //se agrega una tarea de forma normal     
                id_actividad_general = proyecto.id
                tipo = "nueva"

            }

             // crear post al servidor
            axios.post('/api/plan_de_trabajo/addTarea', {
                id_proyecto: id_actividad_general,
                tipo: tipo,
                tarea:this.maysPrimera(values.tarea),
                horas: values.horas,
                entregable: this.maysPrimera(values.entregable),
                fecha_entrega: values.fecha_entrega
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Tarea registrada satisfactoriamente")

                    form1.resetFields();
                     
               
                document.getElementById("horas").defaultValue=1;
                    this.props.obtenerSubactividades()
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
    saveFormRefTarea = (form) => {
        this.formTarea = form;
    }
    nuevaSubactividad = () => {
        this.setState({
            visible1: true,
            visibleTarea: false
        });


    }

    maysPrimera=(dato)=>{
        return dato.charAt(0).toUpperCase() + dato.slice(1);
      }
    render() {
        const { visibleRegistrarTarea, proyecto } = this.state

        // console.warn(this.state.proyecto)
        return (
            <div>

                <CreateFormAddSubactividad
                    ref={this.saveFormRef}
                    visible1={this.state.visible1}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />

                <CreateFormAddTarea
                    ref={this.saveFormRefTarea}
                    visibleTarea={this.state.visibleTarea}
                    onCancel={this.handleCancelTarea}
                    onCreate={this.handleCreateTarea}
                    nuevaSubactividad={this.nuevaSubactividad}
                />


            </div>
        )
    }
}
