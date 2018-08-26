import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Modal, Form, Input, Radio,Select, Icon, message } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

import axios from 'axios';
// import '../../styling.css';
const CreateFormAddPuesto = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator} = form;
        return(
            <Modal
                visible={visible}
                title={`Agregar puestos`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="Escribe el puesto ">
                        {getFieldDecorator('nombre', {
                            rules: [{required: true, message: 'El puesto debe tener un nombre'}]
                        })(<Input type="mayuscula" style={{ width: '100%' }} placeholder="Nombre del puesto"/>)}
                    </FormItem>
                </Form>

            </Modal>
        );
    })
)

export default class FormAddOficina extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: props.visible,
           
        }
    }
    componentWillReceiveProps(nextProps) {
        const {visible} = nextProps;
        this.setState({
            visible: visible,
       
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
        this.props.onload();
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log('Received values of form: ', values);
            
            // crear post al servidor
            axios.post('/api/puesto', {
                nombre: values.nombre,
                
            }).then((res) => {
                console.log(res)
                if(res.status === 200){
                    message.success("Puesto agregado satisfactoriamente")
                    this.setState({ visible: false });
                    form.resetFields();
                    this.props.onload();
                }else{
                    Modal.error({
                        title: 'Error al guardar el puesto. Revisar los siguientes campos',
                        content:(
                            <div>
                                {res.data.errores}
                            </div>
                        ), onOk(){}, 
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
    render(){
        return(
            <div>
                    <CreateFormAddPuesto
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    
                />
            </div>
        )
    }
}
