import React, { Component } from 'react';
import { render } from 'react-dom';
import { Tag, Badge, Button, Modal, Form, Input, Radio, Select, Icon, message, Tabs, onChange, Tooltip, DatePicker, AutoComplete, Row, Col, Menu, Dropdown, InputNumber, Alert } from 'antd';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import axios from 'axios';
import moment from 'moment';
import uuid from 'uuid';
import ObtenerPlanDeTrabajo from './ObtenerPlanDeTrabajo.jsx';


export default class FormPlanDeTrabajo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            proyeproyectoActividadGeneral: props.proyectoActividadGeneral,
            visibleRegistrarSubactividad: props.visibleRegistrarSubactividad,
            renderPlanDeTrabajo: null,
            subactividades: null,



        }
    }

    componentWillReceiveProps(nextProps) {
        const { visible, proyectoActividadGeneral, visibleRegistrarSubactividad } = nextProps;
        this.setState({
            visible,
            proyectoActividadGeneral, visibleRegistrarSubactividad
        })

        this.setState({
            renderPlanDeTrabajo: <ObtenerPlanDeTrabajo proyecto={this.state.proyeproyectoActividadGeneral} />
            // renderPlanDeTrabajo: <ObtenerTarea />
        })





    }
    componentDidMount() {

    }

    getActividadesGenerales = () => {



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

        this.setState({ visible: false });

    }

    handleUpdate = () => {
        //se actualizan los datos en la tabla
        //se cargan las actividades principales
        //se cargan las actividades principales


        this.setState({
            renderPlanDeTrabajo: <ObtenerPlanDeTrabajo proyecto={this.state.proyeproyectoActividadGeneral} />,

            // renderPlanDeTrabajo: <ObtenerTarea />

        })



        message.success("Actulización finalizada")

    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render() {
        // console.warn(this.state.proyecto)
        const { visibleRegistrarSubactividad, proyectoActividadGeneral } = this.state;

        return (
            <div>


                <Modal
                    visible={this.state.visible}
                    title={`Plan de trabajo`}
                    okText="Guardar"
                    onCancel={this.handleCancel}
                    onOk={this.handleUpdate}
                    width={1300}
                    height={1500}
                    maskClosable={false}
                    centered
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cerrar</Button>,
                        <Button key="submit" type="primary" onClick={this.handleUpdate} >
                            Actualizar
                </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Row>
                            <Col span={24}>
                                {this.state.renderPlanDeTrabajo}
                            </Col>
                        </Row>
                    </Form>
                </Modal>

            </div>
        )
    }
}
