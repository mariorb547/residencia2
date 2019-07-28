import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Modal, Form, Input, Radio,Select, Icon, message } from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

import axios from 'axios';
import '../../styling.css';
const CreateFormAddObservacion = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form, tipo} = props;
        const { getFieldDecorator} = form;
        return(
            <Modal
                visible={visible}
                title={`Agregar observación  ${tipo}`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="Descripción de la observación">
                        {getFieldDecorator('observacion', {
                            rules: [{required: true, message: 'La observación debe llevar una descripción'},{min: 5, message: 'El minimo de caracteres es de 5.'}, {max: 500, message: 'El mensaje debe tener como maximo 500 caracteres.'}]
                        })(<Input.TextArea style={{ width: '100%' }} placeholder="Descripción de la observacion..." rows={4}/>)}
                    </FormItem>
                </Form>
            </Modal>
        );
    })
)

export default class FormAddObservaciones extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: props.visible,
            tipo: props.tipo,
            id_tarea: props.id_tarea,
            usuario:props.usuario,
            actulizarCantidadObservacionesAddObservacion:props.actulizarCantidadObservacionesAddObservacion,
            ocultarAddObservacion:props.ocultarAddObservacion,
            rutaUpdateObservacion:props.rutaUpdateObservacion
        }
    }
    componentWillReceiveProps(nextProps) {
        const { tipo, id_tarea,usuario,ocultarAddObservacion,actulizarCantidadObservacionesAddObservacion} = nextProps;
        this.setState({
            visible:nextProps.visible,
            tipo,
            id_tarea,
            usuario,
            ocultarAddObservacion,
            actulizarCantidadObservacionesAddObservacion
           
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
        this.state.ocultarAddObservacion();
      
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log('Received values of form: ', values);
            // console.warn('oaqui', this.state.usuario.id_docente)
            // crear post al servidor
            axios.post('/api/proyecto/observacion', {
                observacion: values.observacion,
                tipo_observacion: this.state.tipo,
                id_tarea: this.state.id_tarea,
                id_asesor_interno: this.state.usuario.id_docente
            }).then((res) => {
                // console.log(res)
                if(res.status === 200){
                    message.success("Observación agregada correctamente")
                  //  this.setState({ visible: false });
                    form.resetFields();
                   
                    
                    this.state.actulizarCantidadObservacionesAddObservacion()

                    //se realiza el update de la tarea a no aprovada en el estado_revision_plan
                    
                    axios.put(this.state.rutaUpdateObservacion, {
                        id_tarea:this.state.id_tarea,
                        
                    }).then(res => {
                        if (res.status === 200) {
                           
                        } else {
                            message.error('No se han guardado los cambios, reportar error al administrador.')
                        }
                    })
                  
                   
                }else{
                    Modal.error({
                        title: 'Error al agregar la observación. Revisar los siguientes campos',
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
        // console.warn('Aqui merengues',this.state.usuario)
        return(
            <div>
               <CreateFormAddObservacion
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    tipo={this.state.tipo}
                />
            </div>
        )
    }
}
