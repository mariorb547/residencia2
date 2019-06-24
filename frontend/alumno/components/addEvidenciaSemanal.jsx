import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Modal, Form, Input,Icon, message, Upload} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

import axios from 'axios';
import moment from 'moment';

class FormPlanTrabajo extends Component{
    constructor(props){
        super(props);
        this.state = {
            showEvidencia:props.showEvidencia,
            ruta:props.ruta,
            disabledAddEvidencia:props.disabledAddEvidencia,
            fecha_entrega:props.fecha_entrega
            }
       
    }
    // FUNCTIONS UPLOAD FILE
    normFile = (e) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    }
    beforeUpload(file) {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('El archivo debe ser PDF!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('El archivo debe tener un tamaño menor de 10 MB.');
        }
        return isPDF && isLt10M;
    }
    afterUpload(){
        //alert("ruta "+this.state.ruta)
        axios.get(this.state.ruta).then(res =>{
              return res.data
        })
    }
    dummyRequest(ruta){
        alert("ruta"+ruta)
        axios.post(ruta, {
           
        }).then((res) => {
           
            if(res.status === 200){
                message.success("Actividad general actualizada satisfactoriamente")
                
              
            }else{
                Modal.error({
                    title: 'Error al modificar. Revisar los siguientes campos',
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
    
    onChange =()=>{
       
     this.state.showEvidencia()
     //alert("que hay")
    }

    // END FUNCTIONS UPLOAD FILE
    render(){
        let fecha_actual=moment().format('YYYY-MM-DD');
        
        const {ruta} = this.props
        // console.log('aui', this.props)
        return (
         
             <Form onSubmit={this.handleSubmit} >
               
                    <FormItem label="">
                       
                            <Upload.Dragger
                                name="fileEvidencias"
                                action={ruta}
                                accept=".pdf"
                                beforeUpload={this.beforeUpload}
                                disabled={this.state.disabledAddEvidencia!="aprobado" && this.state.fecha_entrega!=fecha_actual?false:this.state.disabledAddEvidencia=="no aprobado"?false:true}
                                onChange={()=>this.onChange()}
                            >
                                <Icon type="inbox"  style={{ fontSize: '50px', color: '#08c' }} />
                                <div className="ant-upload-hint">Debe pesar menos de 10 MB.</div>
                            </Upload.Dragger>
                        
                    </FormItem>
                
            </Form>
            

        )
    }
}

const WrappedFormPlanTrabajo = Form.create({
    mapPropsToFields(props) {
      return {
        props
      }
    }
  })(FormPlanTrabajo);
export default WrappedFormPlanTrabajo;