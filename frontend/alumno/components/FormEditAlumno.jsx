import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Modal, Form, Input, Radio, Select, Icon, message, Tabs, Timeline, Row, Col } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import '../../styling.css';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
const CreateFormAddAlumno = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form, datosAlumno, cerrar } = props;
        const { getFieldDecorator } = form;
        // console.warn(alumnos_rechazados)
        const TipoDeSeguro = getFieldDecorator('id_tipo_seguro', {
        })(
            <Select style={{ width: 80 }}>
                <Option value="1">IMMS.</Option>
                <Option value="2">ISSTE</Option>
                <Option value="3">METLIFE</Option>
                <Option value="4">GNP</Option>
                <Option value="5">QUÁLITAS</Option>
                <Option value="6">INBURSA</Option>
                <Option value="7">OTRO</Option>
            </Select>
        );
        return (
            <Modal
                visible={visible}
                title={`Datos del alumno `}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
                style={{ top: 10 }}
                width={600}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="user-add" />candidato</span>} key="1">

                        <Form layout="vertical">
                            <Row >
                                <Col xs={24} lg={24}>
                                    <Row gutter={16}>
                                        <Col xs={24} lg={12}>
                                            <FormItem label="Número de control">
                                                {getFieldDecorator('no_control', {
                                                    rules: [{ required: true, message: 'El número de control es obligatorio.' }, { len: 8, message: 'El numero de control contiene 8 digitos' }],
                                                    initialValue: datosAlumno ? datosAlumno.no_control : ''
                                                })(<Input type="number" disabled style={{ width: '100%' }} placeholder="Ingrese el número de control del alumno" />)}

                                            </FormItem>
                                        </Col>
                                        <Col xs={24} lg={12}>
                                            <FormItem label="Plan de estudios">
                                                {getFieldDecorator('plan_estudios', {
                                                    rules: [{ required: true, message: 'El plan de estudio es obligatorio.' }]
                                                })(<Select>
                                                    <Option key="2009-2010" value="2009-2010">2009-2010</Option>
                                                    <Option key="2015-2016" value="2015-2016">2015-2016</Option>
                                                </Select>)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <FormItem label="Nombre">
                                        {getFieldDecorator('nombre', {
                                            rules: [{ required: true, message: 'El alumno debe tener un nombre' }],
                                            initialValue: datosAlumno ? datosAlumno.nombre : ''
                                        })(<Input type="mayuscula" placeholder="Ingrese el nombre(s) del alumno" />)}
                                    </FormItem>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <FormItem label="Apellido paterno">
                                        {getFieldDecorator('ap_paterno', {
                                            rules: [{ required: true, message: 'El alumno debe tener un apellido paterno.' }],
                                            initialValue: datosAlumno ? datosAlumno.ap_paterno : ''
                                        })(<Input type="mayuscula" placeholder="Ingrese el apellido paterno del alumno" />)}
                                    </FormItem>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <FormItem label="Apellido materno">
                                        {getFieldDecorator('ap_materno', {
                                            rules: [{ required: true, message: 'El alumno debe tener un apellido materno' }],
                                            initialValue: datosAlumno ? datosAlumno.ap_materno : ''
                                        })(<Input type="mayuscula" placeholder="Ingrese el apellido materno del alumno" />)}
                                    </FormItem>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <Row gutter={16}>
                                        <Col xs={24} lg={12}>
                                            <FormItem label="Sexo">
                                                {getFieldDecorator('sexo', {
                                                    rules: [{ required: true, message: 'El alumno debe indicar su sexo.' }]
                                                })(<Select placeholder="Seleccione una opción">
                                                    <Option key="H" value="H">Hombre</Option>
                                                    <Option key="M" value="M">Mujer</Option>
                                                </Select>)}
                                            </FormItem>
                                        </Col>
                                        <Col xs={24} lg={12} >
                                            <FormItem label="Seguridad social">
                                                {getFieldDecorator('no_seguro', {
                                                    rules: [{ required: true, message: 'Debe indicar el número de seguro del alumno.' }]
                                                })(<Input addonBefore={TipoDeSeguro} style={{ width: '100%' }} placeholder="Número de seguro" />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={24} lg={24}>
                                    <FormItem label="Ciudad">
                                        {getFieldDecorator('ciudad', {
                                            rules: [{ required: true, message: 'El alumno debe indicar su ciudad.' }]
                                        })(<Input type="mayuscula" placeholder="Ingrese la ciudad del alumno" />)}
                                    </FormItem>
                                </Col>
                                <Col xs={24} lg={24}>
                                    <FormItem label="Domicilio">
                                        {getFieldDecorator('domicilio', {
                                            rules: [{ required: true, message: 'El alumno debe indicar su domicilio.' }]
                                        })(<Input type="mayuscula" placeholder="Ingrese el domicilio del alumno" />)}
                                    </FormItem>
                                </Col>
                                {/* <Col xs={24} lg={24}>
                                    <FormItem label="Correo electronico">
                                        {getFieldDecorator('correo', {
                                            rules: [{ type: 'email', message: 'El correo no es correcto' }, { required: true, message: 'Necesita su correo para autentificarse en el sistema.' }],
                                            initialValue: datosAlumno? datosAlumno.usuario.correo:''
                                        })(
                                            <Input disabled={''} prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="email" placeholder="Ingrese el correo electronico del alumno" />
                                            )}
                                    </FormItem>
                                </Col> */}
                                <Col xs={24} lg={24}>
                                    <FormItem label="Télefono (no celular)">
                                        {getFieldDecorator('numero_celular', {
                                            rules: [{ required: true, message: 'Ingrese el número de telefono celular del alumno.' }]
                                        })(
                                            <Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="Ingrese el número de telefono celular del alumno" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    //
                    </TabPane>
                    {/* <TabPane tab={<span><Icon type="usergroup-delete" />Candidato a residente rechazado</span>} key="2">
                        <Timeline style={{ marginLeft: 10 }}>
                            {alumnos_rechazados.map((alumno, key) => {
                                return (<Timeline.Item dot={<Icon type="exclamation-circle-o" style={{ fontSize: '16px' }} />} color="red" key={key}>
                                    <p>{`${alumno.no_control} - ${alumno.nombre} ${alumno.ap_paterno} ${alumno.ap_materno}`}</p>
                                    <Button onClick={() => addToPeriodo(alumno.id)}>Agregar al periodo</Button>
                                </Timeline.Item>
                                )
                            })}
                        </Timeline>
                    </TabPane> */}

                    <TabPane tab={<span><Icon type="logout" />Salir</span>} key="2">

                        <Button type="danger" onClick={() => cerrar()}>Cerrar Sesion</Button>

                    </TabPane>
                </Tabs>

            </Modal>
        );
    })
)

export default class FormAddAlumno extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            datosAlumno: props.datosAlumno,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { visible, datosAlumno } = nextProps;
        this.setState({
            visible: visible,
            datosAlumno: datosAlumno,
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    cerrar = () => {
        this.setState({ visible: false });
        axios.get('/api/usuario/logout').then(res => {
            if (res.status == 200) {

                window.location.reload();
            }
        });
    }
    handleCancel = () => {
        this.setState({ visible: true });
        message.error('primero debes completar tu informacion para poder seguir')
    }
    addToPeriodo = (id_alumno) => {
        // alert('chi => '+id_alumno)
        axios.put('/api/alumno/retry_anteproyecto', {
            id_alumno,
            id_periodo: this.state.id_periodo
        }).then(res => {
            if (res.status === 200) {
                message.success("Alumno agregado al periodo !")
                this.setState({ visible: false });
            } else {
                Modal.error({
                    title: 'Error al actualizar al alumno. Revisar los siguientes campos',
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
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // crear post al servidor
            axios.put('/api/alumno', {
                no_control: values.no_control,
                nombre: values.nombre,
                ap_paterno: values.ap_paterno,
                ap_materno: values.ap_materno,
                // id_carrera: this.state.carrera.id,
                sexo: values.sexo,
                // correo: values.correo,
                // id_periodo: this.state.id_periodo,
                domicilio: values.domicilio,
                ciudad: values.ciudad,
                numero_celular: values.numero_celular,
                no_seguro: values.no_seguro,
                id_tipo_seguro: values.id_tipo_seguro,
                plan_estudios: values.plan_estudios
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Alumno agregado satisfactoriamente")
                    this.setState({ visible: false });
                    form.resetFields();
                } else {
                    Modal.error({
                        title: 'Error al guardar al alumno. Revisar los siguientes campos',
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
    render() {
        return (
            <div>

                <CreateFormAddAlumno
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    datosAlumno={this.state.datosAlumno}
                    cerrar={this.cerrar}
                />
            </div>
        )
    }
}
