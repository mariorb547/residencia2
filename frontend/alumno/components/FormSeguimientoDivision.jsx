import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button, Modal, Form, Input, Row, Col, Icon, message, Upload, Collapse, Badge, Alert, Table } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Panel } = Collapse;
import axios from 'axios';
import moment from 'moment';

class FormSeguimiento extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                axios.put('/api/proyecto/seguimiento', {
                    id_seguimiento: this.props.seguimiento.id,
                    url_seguimiento: values.url_seguimiento
                }).then(res => {
                    if (res.status === 200) {
                        message.success('Seguimiento actualizado satisfactoriamente');
                    } else {
                        message.error('Error al actualizar al seguimiento, favor de reportar al administrador.')
                    }
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { seguimiento, residentes, numeroseguimiento } = this.props;


        // const residentes = [];
        // for (var i = 0; i < 100; i++) {
        //     residentes.push({

        //         key: i,
        //         NO: i + 1,
        //         control: '13520541',
        //         nombre: 'FRANCISCO ARCOS JAIMES',
        //         Anteproyecto: 'Desarrollo de actividades profesionales en apoyo al Departamento de Sistemas y Computación en el Instituto Tecnológico de Chilpancingo.',
        //         asesor: 'ING. JOSE DANIEL SANCHEZ RODRIGUEZ',
        //         fecha: '20 DE MARZO DEL 2018',
        //         lugar: 'CHILPANCINGO DE LOS BRAVO',
        //         cumplio: i % 2 == 0 ? 'SI' : 'NO'
        //     })
        // }

        const loadTable = false;
        const columns = [
            {
                title: 'No',
                dataIndex: 'NO',
                key: 'NO',
                // fixed: 'left',
                width: 25

            },

            {
                title: 'No. Control',
                dataIndex: 'control',
                key: 'control',
                // fixed: 'left',
                width: 100
            },

            {
                title: 'Nombre del Residente',
                dataIndex: 'nombre',
                key: 'nombre',
                // fixed: 'left',
                width: 200,
            },
            {

                title: 'INSTITUTO TECNOLOGICO DE CHILPANCINGO',
                dataIndex: 'Anteproyecto1',
                key: 'Anteproyecto1',


                children: [


                    {
                        title: 'Anteproyecto',
                        dataIndex: 'Anteproyecto',
                        key: 'Anteproyecto',
                        // width: 300

                    }, {
                        title: 'Fecha de entrega',
                        dataIndex: 'fecha',
                        key: 'fecha', width: 110


                    }, {
                        title: 'Asesor Interno',
                        dataIndex: 'asesor',
                        key: 'asesor', width: 200

                    }, {
                        title: 'Lugar',
                        dataIndex: 'lugar',
                        key: 'lugar',
                        width: 200

                    },

                ]


            },
            {
                title: 'Estado',
                dataIndex: 'cumplio',
                key: 'cumplio',
                // fixed: 'right',
                width: 100,
                render: (text, record) => {
                    if (record.cumplio === 'SI') {
                        return (
                            <p style={{ color: '#080C27' }}  >CUMPLIO</p>
                        )
                    } else {
                        return (
                            <p style={{ color: '#FF0000' }}  > NO CUMPLIO</p>
                        )
                    }

                },
                filters: [
                    {
                        text: 'CUMPLIERON',
                        value: 'SI'
                    },
                    {
                        text: 'NO COMPLIERON',
                        value: 'NO'
                    }

                ],
                onFilter: (value, record) => record.cumplio.indexOf(value) === 0,
            }





        ]
        const panelStyleSolucionado = {
            background: '#f4f8f9',
            borderRadius: 10,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
        };
        // console.log('aui', seguimiento)
        // axios.get(`/api/seguimiento/generar/${seguimiento.id}`).then(res=>{
        //     if(res.status == 200 ){
        //           residentes = res.data.map((seguimiento, key) => {
        //             return {
        //                 NO:key+1,
        //                 control: seguimiento.proyecto.anteproyecto.alumno.no_control,
        //                 nombre: seguimiento.proyecto.anteproyecto.alumno.nombre+" "+seguimiento.proyecto.anteproyecto.alumno.ap_paterno+" "+seguimiento.proyecto.anteproyecto.alumno.ap_materno,
        //                 Anteproyecto:seguimiento.proyecto.anteproyecto.nombre,
        //                 asesor:seguimiento.proyecto.anteproyecto.asesor_interno.titulo+". "+seguimiento.proyecto.anteproyecto.asesor_interno.nombre+" "+seguimiento.proyecto.anteproyecto.asesor_interno.ap_paterno+" "+seguimiento.proyecto.anteproyecto.asesor_interno.ap_materno,
        //                 fecha:seguimiento.seguimiento_proyecto.fecha_final,
        //                 lugar:seguimiento.proyecto.anteproyecto.asesor_interno.empresa.domicilio,
        //                 cumplio:seguimiento.url_seguimiento? 'SI':'NO',
        //                 key,
        //             }
        //         })


        //     }
        // })
        return (
            <div>




                <Row  >
                    <Col xs={24} lg={24}>
                        <Button icon="file-pdf" style={{ left: 800 }}><a href={`/api/generar/${seguimiento.id}/seguimiento/${numeroseguimiento}/seguimiento`} target="_blank">Genera</a></Button>
                        <br /><br />
                        <Table bordered title={() => `Seguimiento ${numeroseguimiento}`} columns={columns} dataSource={residentes} pagination={{ pageSize: 5 }} className="full-width" loading={loadTable} scroll={{ x: 1000 }} />
                    </Col>
                </Row>
            </div >

        )
    }
}

const WrappedFormSeguimiento = Form.create({
    mapPropsToFields(props) {
        return {
            props
        }
    }
})(FormSeguimiento);
export default WrappedFormSeguimiento;