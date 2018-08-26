import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Modal, Form, Input, Radio,Select, Icon, message, Tabs, Timeline, Row, Col} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import '../styling.css';

import axios from 'axios';

const CreateFormAddAlumno = Form.create()(
    (props => {
        const { visible, onCancel, onCreate, form, carrera, alumnos_rechazados, addToPeriodo, handleChange, options} = props;
        const { getFieldDecorator} = form;
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
        return(
            <Modal
                visible={visible}
                title={`Agregar alumno a la carrera de ${carrera ? carrera.nombre: ''}`}
                okText="Guardar"
                onCancel={onCancel}
                onOk={onCreate}
                style={{ top: 10 }}
                width={600}
            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="user-add" />Nuevo candidato</span>} key="1">
                        
                        <Form layout="vertical">
                            <Row >
                            <Col xs={24} lg={24}>
                                <Row gutter={16}>
                                    <Col xs={24} lg={12}>
                                        <FormItem label="Número de control">
                                            {getFieldDecorator('no_control', {
                                                rules: [{required: true, message: 'El número de control es obligatorio.'},{len: 8, message: 'El numero de control contiene 8 digitos'}]
                                            })(<Input type="number" style={{ width: '100%' }} placeholder="Ingrese el número de control del alumno"/>)}

                                        </FormItem>
                                    </Col>
                                    
                                </Row>
                            </Col>
                            <Col xs={24} lg={24}>
                            <FormItem label="Nombre">
                                {getFieldDecorator('nombre', {
                                    rules: [{required: true, message: 'El alumno debe tener un nombre'}]
                                })(<Input type="mayuscula"
                          
                                placeholder="Ingrese el nombre(s) del alumno"/>)}
                            </FormItem>
                            </Col>
                            <Col xs={24} lg={24}>
                            <FormItem label="Apellido paterno">
                                {getFieldDecorator('ap_paterno', {
                                    rules: [{required: true, message: 'El alumno debe tener un apellido paterno.'}]
                                })(<Input type="mayuscula" placeholder="Ingrese el apellido paterno del alumno"/>)}
                            </FormItem>
                            </Col>
                            <Col xs={24} lg={24}>
                            <FormItem label="Apellido materno">
                                {getFieldDecorator('ap_materno', {
                                    rules: [{required: true, message: 'El alumno debe tener un apellido materno'}]
                                })(<Input  type="mayuscula" placeholder="Ingrese el apellido materno del alumno"/>)}
                            </FormItem>
                            </Col>
                            

                           
                            <Col xs={24} lg={24}>
                            <FormItem label="Correo electronico">
                                {getFieldDecorator('correo', {
                                    rules: [{type: 'email',message: 'El correo no es correcto'},{required: true, message: 'Necesita su correo para autentificarse en el sistema.'}]
                                })(
                                    // <Input  prefix={<Icon type="user" style={{fontSize: 13}} />} type="email" placeholder="Ingrese el correo electronico del alumno" />
                                    <Select
                                    mode="combobox"
                                    // style={{ width: 200 }}
                                    onChange={handleChange}
                                    filterOption={false}
                                    placeholder="Ingrese el correo electronico del alumno"
                                   
                                  >
                                    {options}
                                  </Select>
                                )}
                            </FormItem>
                            </Col>
                             
                            </Row>
                        </Form>
                        
                    </TabPane>
                    <TabPane tab={<span><Icon type="usergroup-delete" />Candidato a residente rechazado</span>} key="2">
                        <Timeline style={{marginLeft: 10}}>
                            {alumnos_rechazados.map((alumno, key) => {
                                return (<Timeline.Item  dot={<Icon type="exclamation-circle-o" style={{ fontSize: '16px' }} />} color="red" key={key}>
                                            <p>{`${alumno.no_control} - ${alumno.nombre} ${alumno.ap_paterno} ${alumno.ap_materno}`}</p>
                                            <Button onClick={() => addToPeriodo(alumno.id)}>Agregar al periodo</Button>
                                        </Timeline.Item>
                                        )
                            })}
                        </Timeline>
                    </TabPane>
                </Tabs>

            </Modal>
        );
    })
)

export default class FormAddAlumno extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: props.visible,
            carrera: props.carrera,
            id_periodo: props.id_periodo,
            alumnos_rechazados: props.alumnos_rechazados_por_carrera,
            options: [],
        }
    }
    handleChange = (value) => {
        let options;
        if (!value || value.indexOf('@') >= 0) {
          options = [];
        } else {
          options = ['gmail.com', 'hotmail.com', 'outlook.com'].map((domain) => {
            const email = `${value}@${domain}`;
            return <Option key={email.toLowerCase()}>{email.toLowerCase()}</Option>;
          });
        }
        this.setState({ options });
      }
      
    componentWillReceiveProps(nextProps) {
        const {visible, carrera} = nextProps;
        this.setState({
            visible: visible,
            carrera: carrera,
            id_periodo: nextProps.id_periodo,
            alumnos_rechazados: nextProps.alumnos_rechazados_por_carrera
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
    addToPeriodo = (id_alumno) => {
        // alert('chi => '+id_alumno)
        axios.put('/api/alumno/retry_anteproyecto',{
            id_alumno,
            id_periodo: this.state.id_periodo
        }).then(res => {
            if(res.status === 200){
                message.success("Alumno agregado al periodo !")
                this.setState({ visible: false });
            }else{
                Modal.error({
                    title: 'Error al actualizar al alumno. Revisar los siguientes campos',
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
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }            
            // crear post al servidor
            axios.post('/api/pre_registro', {
                no_control: values.no_control,
                nombre: values.nombre,
                ap_paterno: values.ap_paterno,
                ap_materno: values.ap_materno,
                correo: values.correo,
                id_carrera: this.state.carrera.id,
                estado:true,
            }).then((res) => {
                // console.log(res)
                if(res.status === 200){
                    message.success("Alumno agregado satisfactoriamente")
                    this.setState({ visible: false });
                    form.resetFields();
                }else{
                    Modal.error({
                        title: 'Error al guardar al alumno. Revisar los siguientes campos',
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

                <CreateFormAddAlumno
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    carrera={this.state.carrera}
                    addToPeriodo={this.addToPeriodo}
                    alumnos_rechazados={this.state.alumnos_rechazados}
                    handleChange={this.handleChange}
                    options={this.state.options}
        
                />
            </div>
        )
    }
}
