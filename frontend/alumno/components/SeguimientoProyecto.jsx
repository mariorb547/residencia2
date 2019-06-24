import React, {Component} from 'react';
import {Col, Row, Tabs, Icon, Alert} from 'antd'
const {TabPane} = Tabs;

import uuid from 'uuid';
import moment from 'moment';
import axios from 'axios';
// components
import WrappedFormSeguimiento from '../components/FormSeguimiento.jsx';
import WrappedFormSeguimientoFinal from '../components/FormSeguimientoFinal.jsx';

var params = require(__dirname + '/../../../config/params.json');

export default class SeguimientoProyecto extends Component{
    constructor(props){
        super(props);
        this.state = {
            seguimientos: props.seguimientos,
            proyecto:props.proyecto,
            renderSeguimiento: null
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            seguimientos: nextProps.seguimientos,
            proyecto:nextProps.proyecto,
            renderSeguimiento: null
        })
    }
    onChangeSeguimiento = (id_seguimiento) => {
        const {seguimientos} = this.state;
        const currentDate = moment().format('YYYY-MM-DD');        
        if(id_seguimiento === 'seguimiento_final'){
            // console.log('aqui', );
            const periodo = seguimientos[0][0].proyecto.anteproyecto.periodo; // ver si no es diferente la primera y la ultima vez jeje
            // console.warn('Periodo',periodo.fecha_fin)
            // el seguimiento final esta habilitado 10 dias antes y 10 dias despues de la fecha final del periodo
            // console.log('params.days', params.periodo_residencia.dias_habiles_seguimiento_final);
           
           ///lo modifique para poder hacer el cambio
            if(currentDate >= moment(periodo.fecha_fin, 'YYYY-MM-DD').subtract(params.periodo_residencia.dias_habiles_seguimiento_final, 'days').format('YYYY-MM-DD') && currentDate<= moment(periodo.fecha_fin, 'YYYY-MM-DD').add(params.periodo_residencia.dias_habiles_seguimiento_final, 'days').format('YYYY-MM-DD')){
                this.setState({
                    renderSeguimiento: <WrappedFormSeguimientoFinal proyecto={seguimientos[0][0].proyecto} />
                })
            }else{
                this.setState({
                    renderSeguimiento: <Alert message={`El seguimiento final no esta disponible,\n Fecha inicial: ${moment(periodo.fecha_fin, 'YYYY-MM-DD').subtract(params.periodo_residencia.dias_habiles_seguimiento_final, 'days').format('LL')} - Fecha final: ${moment(periodo.fecha_fin, 'YYYY-MM-DD').add(params.periodo_residencia.dias_habiles_seguimiento_final, 'days').format('LL')}`} type="warning" showIcon />
                })
            }
            
        }else{//alert("id seguimiento "+id_seguimiento)

            const _seguimiento = seguimientos.find(seg => seg[0].id==id_seguimiento)[0];
            axios.get(`/api/seguimientos/obtener_seguimientos/${this.state.proyecto.anteproyecto.id_periodo}`).then(res =>{
   
                if(res.status === 200){
                    let contadorSeguimiento=0
                    let numeroSeguimiento=0
                    res.data.map((seguimiento)=>{
                      
                        //se comparan los seguimientos para saber la posion del seguimiento selecionado
                       // alert("ide seguimiento: "+id_seguimiento+" id de seguimientos: "+seguimiento.id)
                        if(_seguimiento.seguimiento.id==seguimiento.id){
                         //   alert("entre ompracion "+contadorSeguimiento)
                            numeroSeguimiento=contadorSeguimiento
                        }
                        contadorSeguimiento++
                        
                    })
                    this.setState({
                        renderSeguimiento: <WrappedFormSeguimiento proyecto={this.state.proyecto} seguimiento={_seguimiento} seguimientos={res.data} numeroSeguimiento={numeroSeguimiento}/>
                    })
                }             
            }) 
           {/* const seguimiento = seguimientos.find(seg => seg[0].id==id_seguimiento)[0];            
            if(currentDate >= seguimiento.seguimiento.fecha_inicial && currentDate <= seguimiento.seguimiento.fecha_final){
                this.setState({
                    renderSeguimiento: <WrappedFormSeguimiento proyecto={this.state.proyecto} seguimiento={seguimiento}/>
                })
            }else{
                this.setState({
                    renderSeguimiento: <Alert message={`No puede acceder al seguimiento,\n Fecha inicial: ${moment(seguimiento.seguimiento.fecha_inicial, 'YYYY-MM-DD').format('LL')} - Fecha final: ${moment(seguimiento.seguimiento.fecha_final, 'YYYY-MM-DD').format('LL')}`} type="warning" showIcon />
                })
            }*/}
        }
        
        
    }
    render(){
        const {seguimientos, renderSeguimiento} = this.state;
        // console.log(seguimientos);
        return(
            <div>
                <Row>
                    <Col xs={24} lg={4}>
                        <Tabs defaultActiveKey="-1" tabPosition="left" onChange={(key) => this.onChangeSeguimiento(key)}>
                            {seguimientos.map(((seguimiento, index) => {
                                console.log('key', seguimiento[0].id)
                                return (
                                    <TabPane  tab={<span><Icon type="schedule" />{`Seguimiento ${index+1}`}</span>} key={seguimiento[0].id}>
                                    </TabPane>
                                )
                            }))}
                            <TabPane tab={<span><Icon type="schedule"/>Seguimiento final</span>} key={"seguimiento_final"}>

                            </TabPane>
                        </Tabs>

                    </Col>
                    <Col xs={24} lg={20}>
                        {renderSeguimiento}
                    </Col>
                </Row>
            </div>
        )
    }
}