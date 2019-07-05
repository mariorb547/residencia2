import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Modal, Form, Input, Radio, Select, Icon, message, Popover, Badge, notification } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

import axios from 'axios';
const CreateFormAddColaborador = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                // title={`Agregar carrera al departamento de ${departamento.nombre_departamento}`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">

                    <FormItem label="Numero de control de tu colaborador">
                        {getFieldDecorator('numero_control', {
                            rules: [{ required: true, message: 'El colaborador debe tener un numero de control' }]
                        })(<Input type="number" style={{ width: '100%' }} placeholder="Numero de control del colaborador" />)}
                    </FormItem>
                </Form>

            </Modal>
        );
    })
)
const openNotification = (type, titulo_message, description) => {
    notification[type]({
        message: titulo_message,
        description: description,
    });
};

export default class FormAddColaborador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            id_alumno: props.id_alumno,
            id_alumno1: null,




        }
    }

    componentWillReceiveProps(nextProps) {
        const { visible, id_alumno } = nextProps;
        this.setState({
            visible: visible,
            idnuevo: id_alumno,
        })
    }
    showModal = () => {

        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
        const form = this.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const id = values.numero_control;

            axios.get(`/api/alumno/${id}`)
                .then(res => {
                    if (res.status === 200) {
                        axios.post('/api/colaborador', {
                            id_colaborador: this.state.idnuevo,
                            id_alumno: res.data.id,
                        }).then((res) => {
                            console.log(res)
                            if (res.status === 200) {
                                message.success("Colaborador agregado satisfactoriamente")
                                this.setState({ visible: false });
                                form.resetFields();
                                window.location.reload();
                            } else {
                                Modal.error({
                                    title: 'Error al guardar el colaborador. Revisar los siguientes campos',
                                    content: (
                                        <div>
                                            {res.data.errores}
                                        </div>
                                    ), onOk() { },
                                })
                            }
                        }).catch((err) => {
                            message.success(err);
                        })
                    }

                }).catch((err) => {
                    var descripcion = "No se encontro registro de ese numero de control, favor de pasar con el Jefe de division de estudios profesionales para  ver la situacion de tu compañero"
                    openNotification('warning', 'Error al añadir al colaborador', descripcion);
                })

        });
    }

    saveFormRef = (form) => {
        this.form = form;
    }
    render() {
        return (
            <div>
                <CreateFormAddColaborador
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    departamento={this.state.departamento}

                />
            </div>
        )
    }
}
