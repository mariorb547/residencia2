import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Modal, Form, Input, Radio, Select, Icon, message, Tabs, Timeline, Tooltip, DatePicker, AutoComplete } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import axios from 'axios';
import moment from 'moment';



const CreateFormAddTarea = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form, carrera, alumnos_rechazados, addToPeriodo } = props;
        const { getFieldDecorator } = form;
        // console.warn(alumnos_rechazados)
        return (
            <Modal
                visible={visible}
                title={`Registrar tarea`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
                width={600}
            >
                <Form layout="vertical">
                    <FormItem label={(
                        <span>
                            Fecha de asesoría&nbsp;
                                        <Tooltip title="La fecha de asesoría tiene 3 dias habiles.">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                    >
                        {getFieldDecorator('fecha', {
                            rules: [{ required: true, message: 'La fecha de asesoría es obligatoria.' }]
                        })(<DatePicker format="ll" disabledDate={current => {
                            return moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD') || moment(current).format('YYYY-MM-DD') > moment().add(3, 'days').format('YYYY-MM-DD');
                        }
                        } />)}
                    </FormItem>
                    <FormItem label="Temas a asesorar">
                        {getFieldDecorator('temas_a_asesorar', {
                            rules: [{ required: true, message: 'Los temas a asesorar son obligatorios.' }, { min: 5, message: 'El minimo de caracteres es 5.' }, { max: 500, message: 'El maximo de caracteres es 500.' }]
                        })(<Input.TextArea placeholder="Describa los temas a asesorar" rows={4} />)}
                    </FormItem>
                    <FormItem label="URL del avance de google drive">
                        {getFieldDecorator('url_avance', {
                            rules: [{ required: true, message: 'El url del archivo es necesario para la revisión.' }, { pattern: '^https:\/\/drive.google.com\/.*$', message: 'La URL esta mal formada ejemplo: https://drive.google.com/open?id=0B-agd1bGfOTYcHZNWmtFZ1BINzQ' }]
                        })(
                            <Input prefix={<Icon type="global" style={{ fontSize: 13 }} />} placeholder="URL del sitio donde esta almacenado el archivo del avance ejemplo: https://drive.google.com/open?id=0B-agd1bGfOTYcHZNWmtFZ1BINzQ" />
                        )
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    })
)

export default class FormAddTarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            proyecto: props.proyecto,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { visible, proyecto, usuario } = nextProps;
        this.setState({
            visible,
            proyecto,
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        const form = this.form;
        form.resetFields();
        this.setState({ visible: false });

    }
    handleCreate = () => {
        const { proyecto } = this.state
        console.log("proyecto" + proyecto)
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // crear post al servidor
            axios.post('/api/proyecto/asesoria', {
                id_proyecto: proyecto.id,
                id_asesor_interno: proyecto.anteproyecto.id_asesor_interno,
                fecha: values.fecha,
                url_avance: values.url_avance,
                temas_a_asesorar: values.temas_a_asesorar
            }).then((res) => {
                // console.log(res)
                if (res.status === 200) {
                    message.success("Asesoría registrada satisfactoriamente")
                    this.setState({ visible: false });
                    form.resetFields();
                    this.props.updateAsesorias();
                } else {
                    Modal.error({
                        title: 'Error al registrar asesoría. Revisar los siguientes campos',
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
        // console.warn(this.state.proyecto)
        return (
            <div>

                <CreateFormAddTarea
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}
