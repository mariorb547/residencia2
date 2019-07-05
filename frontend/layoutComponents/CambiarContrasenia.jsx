import React, { Component } from 'react';
import { render } from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Button, Modal, Form, Input, Icon, message } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';


const CreateFormCambiarContrasenia = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title="Cambiar contraseña"
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="Nueva contraseña">
                        {getFieldDecorator('nueva_contrasenia', {
                            rules: [{ required: true, message: 'Indique su nueva contraseña' }]
                        })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Nueva contraseña" />)}
                    </FormItem>
                </Form>

            </Modal>
        );
    })
)

export default class FormCambiarContrasenia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            redirect: false
        }
    }
    componentWillReceiveProps(nextProps) {
        const { visible } = nextProps;
        this.setState({
            visible: visible
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

            // crear post al servidor
            axios.put('/api/usuario/cambiar_contrasenia', {
                nueva_contrasenia: values.nueva_contrasenia,
            }).then((res) => {
                console.log(res)
                if (res.status === 200) {
                    form.resetFields();
                    message.success("Contraseña actualizada satisfactoriamente")
                    this.setState({ visible: false, redirect: true });
                } else {
                    Modal.error({
                        title: 'Error al cambiar contraseña. Revisar los siguientes campos',
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
                <CreateFormCambiarContrasenia
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}
