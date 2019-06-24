const path = require('path');
const fs = require('fs');
const moment = require('moment');
// moment.locale(path.join(__dirname, '/../node_modules/moment/locale/es'));
moment.locale('es');
const fonts = {
    Roboto: {
        normal: path.join(__dirname, '/fonts/arial.ttf'),
        bold: path.join(__dirname, '/fonts/arial-bold.ttf'),
        italics: path.join(__dirname, '/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '/fonts/Roboto-MediumItalic.ttf')
    }
}
var params = require(__dirname + '/../config/params.json');

const pdfmake = require('pdfmake');
const PdfPrinter = require(path.join(__dirname, '/../node_modules/pdfmake/src/printer'));
const printer = new PdfPrinter(fonts);

function nivelDeDesempenio(calificacion_final) {
    if (calificacion_final >= 95 && calificacion_final <= 100) {
        return 'Excelente (Competencia alcanzada)'
    } else if (calificacion_final >= 85 && calificacion_final <= 94) {
        return 'Notable (Competencia alcanzada)'
    } else if (calificacion_final >= 75 && calificacion_final <= 84) {
        return 'Bueno (Competencia alcanzada)'
    } else if (calificacion_final >= 70 && calificacion_final <= 74) {
        return 'Suficiente (Competencia alcanzada)'
    } else {
        return 'Insufuciente (Competencia no alcanzada)'
    }
}

module.exports = {
    generarSeguimientofinal: (anteproyectos, periodo, res) => {
        var ordinales = [], seguimientoordinal = "";
        // if (parseInt(numeroseguimiento) == 1)
        //     seguimientoordinal = 'PRIMER'
        // else if (parseInt(numeroseguimiento) == 2)
        //     seguimientoordinal = 'SEGUNDO'
        // else if (parseInt(numeroseguimiento) == 3)
        //     seguimientoordinal = 'TERCERO'
        // else if (parseInt(numeroseguimiento) == 4)
        //     seguimientoordinal = 'CUARTO'
        // else if (parseInt(numeroseguimiento) == 5)
        //     seguimientoordinal = 'QUINTO'
        // else if (parseInt(numeroseguimiento) == 6)
        //     seguimientoordinal = 'SEXTO'
        // else if (parseInt(numeroseguimiento) == 7)
        //     seguimientoordinal = 'SEPTIMO'
        // else if (parseInt(numeroseguimiento) == 8)
        //     seguimientoordinal = 'OCTAVO'

        var total = 0, cumplieron = 0;
        var carrera = '';


        var content_table = anteproyectos != '' ? anteproyectos.filter(function (anteproyecto) { return anteproyecto.alumno.situacion[0].estado === 'activo'; }).map(function (anteproyecto) {
            total += 1;
            carrera = anteproyecto.alumno.carrera.nombre;
            return [
                { text: `${(cumplieron += 1)}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.no_control}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.nombre}`, style: 'row_table' },
                { text: `${periodo.fecha_fin}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_externo.empresa.nombre}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.situacion[0].estado}`, style: 'row_table' },

            ]


        }) : [{}, {}, {}, {}, {}, {}, {}, {}]
        console.log('aqui empiesa debe de estar vacia')
        console.log(content_table)
        var content_table_no_cumplieron = anteproyectos != '' ? anteproyectos.filter(function (anteproyecto) { return anteproyecto.alumno.situacion[0].estado !== 'activo' }).map(function (anteproyecto) {
            total += 1;
            return [
                { text: `${(total)}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.no_control}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.nombre}`, style: 'row_table' },
                { text: `${periodo.fecha_fin}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_externo.empresa.nombre}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.situacion[0].estado}`, style: 'row_table' },

            ]


        }) : [{}, {}, {}, {}, {}, {}, {}, {}]
        console.log('aqui empiesa debe de estar vacia')
        console.log(content_table_no_cumplieron)
        content_table.unshift([{ text: 'NP.', alignment: 'center', style: 'header_table' },
        { text: 'NO. DE CONTROL', alignment: 'center', style: 'header_table' },
        { text: 'NOMBRE DEL ESTUDIANTE', alignment: 'center', style: 'header_table' },
        { text: 'ANTEPROYECTO', alignment: 'center', style: 'header_table' },
        { text: 'FECHA DE ENTREGA DE REPORTE', alignment: 'center', style: 'header_table' },
        { text: 'ASESOR INTERNO', alignment: 'center', style: 'header_table' },
        { text: 'LUGAR DE  LA RESIDENCIA', alignment: 'center', style: 'header_table' },
        { text: 'ESTADO', alignment: 'center', style: 'header_table' }])

        content_table_no_cumplieron.unshift([{ text: 'NP.', alignment: 'center', style: 'header_table' },
        { text: 'NO. DE CONTROL', alignment: 'center', style: 'header_table' },
        { text: 'NOMBRE DEL ESTUDIANTE', alignment: 'center', style: 'header_table' },
        { text: 'ANTEPROYECTO', alignment: 'center', style: 'header_table' },
        { text: 'FECHA DE ENTREGA DE REPORTE', alignment: 'center', style: 'header_table' },
        { text: 'ASESOR INTERNO', alignment: 'center', style: 'header_table' },
        { text: 'LUGAR DE  LA RESIDENCIA', alignment: 'center', style: 'header_table' },
        { text: 'ESTADO', alignment: 'center', style: 'header_table' }])

        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `${carrera}`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().momentformat('YYYY-MM-DD')} `, style: 'subtitulo', decoration: 'underline' },
                        // { text: `${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]

                }, {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Reporte por seguimiento.`, style: 'subtitulo' },

                    ]

                }, {
                    margin: [0, 0, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${total} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: ` Reporte: `, style: 'titulo', bold: true },
                        { text: ` final `, style: 'subtitulo', decoration: 'underline' },

                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Cumplieron:`, style: 'titulo', bold: true },

                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: [20, 50, 120, '*', 50, 120, 120, 50],
                        body: content_table
                    }
                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${cumplieron} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `No Cumplieron:\n`, style: 'titulo', bold: true },

                    ]

                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: [20, 50, 120, '*', 50, 120, 120, 50],
                        body: content_table_no_cumplieron
                    }
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${total - cumplieron} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }

            ],
            styles: {
                grande: {
                    fontSize: 16
                },
                titulo: {
                    fontSize: 12,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();

    },
    generarSeguimiento: (seguimientos, nocumplierons, carrera, numeroseguimiento, seguimientofecha, res) => {
        var ordinales = [], seguimientoordinal = "";
        if (parseInt(numeroseguimiento) == 1)
            seguimientoordinal = 'PRIMER'
        else if (parseInt(numeroseguimiento) == 2)
            seguimientoordinal = 'SEGUNDO'
        else if (parseInt(numeroseguimiento) == 3)
            seguimientoordinal = 'TERCERO'
        else if (parseInt(numeroseguimiento) == 4)
            seguimientoordinal = 'CUARTO'
        else if (parseInt(numeroseguimiento) == 5)
            seguimientoordinal = 'QUINTO'
        else if (parseInt(numeroseguimiento) == 6)
            seguimientoordinal = 'SEXTO'
        else if (parseInt(numeroseguimiento) == 7)
            seguimientoordinal = 'SEPTIMO'
        else if (parseInt(numeroseguimiento) == 8)
            seguimientoordinal = 'OCTAVO'

        var total = 0, cumplieron = 0;


        var content_table = seguimientos != '' ? seguimientos.map((seguimientos, index) => {
            total += 1;
            return [
                { text: `${(cumplieron += 1)}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.alumno.no_control}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.alumno.nombre} ${seguimientos.proyecto.anteproyecto.alumno.ap_paterno} ${seguimientos.proyecto.anteproyecto.alumno.ap_materno}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.nombre}`, style: 'row_table' },
                { text: `${seguimientofecha.fecha_final}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.asesor_interno.titulo} ${seguimientos.proyecto.anteproyecto.asesor_interno.nombre} ${seguimientos.proyecto.anteproyecto.asesor_interno.ap_paterno} ${seguimientos.proyecto.anteproyecto.asesor_interno.ap_materno}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.asesor_externo.empresa.nombre}`, style: 'row_table' },
                // { text: `${seguimientos.proyecto.anteproyecto.nombre}`, style: 'row_table' },

            ]


        }) : [{}, {}, {}, {}, {}, {}, {}]
        var content_table_no_cumplieron = nocumplierons != '' ? nocumplierons.map((seguimientos, index) => {
            total += 1;
            return [
                { text: `${(total)}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.alumno.no_control}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.alumno.nombre} ${seguimientos.proyecto.anteproyecto.alumno.ap_paterno} ${seguimientos.proyecto.anteproyecto.alumno.ap_materno}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.nombre}`, style: 'row_table' },
                { text: `${seguimientofecha.fecha_final}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.asesor_interno.titulo} ${seguimientos.proyecto.anteproyecto.asesor_interno.nombre} ${seguimientos.proyecto.anteproyecto.asesor_interno.ap_paterno} ${seguimientos.proyecto.anteproyecto.asesor_interno.ap_materno}`, style: 'row_table' },
                { text: `${seguimientos.proyecto.anteproyecto.asesor_externo.empresa.domicilio}`, style: 'row_table' },
                // { text: `${seguimientos.proyecto.anteproyecto.nombre}`, style: 'row_table' },

            ]


        }) : [{}, {}, {}, {}, {}, {}, {}]
        seguimientos != '' ?
            content_table.unshift([{ text: 'NP.', alignment: 'center', style: 'header_table' },
            { text: 'NO. DE CONTROL', alignment: 'center', style: 'header_table' },
            { text: 'NOMBRE DEL ESTUDIANTE', alignment: 'center', style: 'header_table' },
            { text: 'ANTEPROYECTO', alignment: 'center', style: 'header_table' },
            { text: 'FECHA DE ENTREGA DE REPORTE', alignment: 'center', style: 'header_table' },
            { text: 'ASESOR INTERNO', alignment: 'center', style: 'header_table' },
            { text: 'LUGAR DE  LA RESIDENCIA', alignment: 'center', style: 'header_table' }])
            : content_table_no_cumplieron.unshift([{ text: 'NP.', alignment: 'center', style: 'header_table' },
            { text: 'NO. DE CONTROL', alignment: 'center', style: 'header_table' },
            { text: 'NOMBRE DEL ESTUDIANTE', alignment: 'center', style: 'header_table' },
            { text: 'ANTEPROYECTO', alignment: 'center', style: 'header_table' },
            { text: 'FECHA DE ENTREGA DE REPORTE', alignment: 'center', style: 'header_table' },
            { text: 'ASESOR INTERNO', alignment: 'center', style: 'header_table' },
            { text: 'LUGAR DE  LA RESIDENCIA', alignment: 'center', style: 'header_table' }])

        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `${carrera ? carrera.nombre : ''}`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().format('YYYY-MM-DD')} `, style: 'subtitulo', decoration: 'underline' },
                        // { text: `${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]

                }, {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Reporte por seguimiento.`, style: 'subtitulo' },

                    ]

                }, {
                    margin: [0, 0, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${total} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `${seguimientoordinal} SEGUIMIENTO: `, style: 'titulo', bold: true },
                        { text: ` ${parseInt(numeroseguimiento)} `, style: 'subtitulo', decoration: 'underline' },

                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Cumplieron:`, style: 'titulo', bold: true },

                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: [20, 50, 120, '*', 50, 120, 120],
                        body: content_table
                    }
                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${cumplieron} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `No Cumplieron:\n`, style: 'titulo', bold: true },

                    ]

                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        headerRows: 1,
                        widths: [20, 50, 120, '*', 50, 120, 120],
                        body: content_table_no_cumplieron
                    }
                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Total de Residentes:`, style: 'subtitulo' },
                        { text: ` ${total - cumplieron} `, style: 'subtitulo', decoration: 'underline' },
                    ]

                }

            ],
            styles: {
                grande: {
                    fontSize: 16
                },
                titulo: {
                    fontSize: 12,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var docDefinitionvacio = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROSECIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {

                    margin: [0, 0, 0, 0],
                    image: __dirname + '/../public/img/emoticon.png',
                    width: 150,
                    height: 150,
                    alignment: 'center'
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [


                        { text: `NO HAY DATOS DE NINGUN RESIDENTE AUN`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },



            ],
            styles: {
                grande: {
                    fontSize: 22
                },


            }
        }
        var pdfDoc = printer.createPdfKitDocument(seguimientos != '' || nocumplierons != '' ? docDefinition : docDefinitionvacio);
        pdfDoc.pipe(res);
        pdfDoc.end();

    },
    generarTermino: (situaciones, carrera, res) => {

        var observacionCancelados = "", observacionProrroga = "", terminados = 0, cancelados = 0, prorroga = 0, abandonados = 0, total = 0, solicitudProrroga = 0, solicitudCancelado = 0, aprobacionCancelacion = 0, aprobacionProrroga = 0;
        situaciones.map((situacion, key) => {
            situacion.estado === 'cancelado' ? cancelados += 1 : ''
            situacion.estado === 'prorroga' ? prorroga += 1 : ''
            situacion.estado === 'abandonado' ? abandonados += 1 : ''
            situacion.estado === 'activo' ? terminados += 1 : ''
            situacion.estado === 'cancelado' && situacion.solicitud_academica ? solicitudCancelado += 1 : ''
            situacion.estado === 'prorroga' && situacion.solicitud_academica ? solicitudProrroga += 1 : ''
            situacion.estado === 'cancelado' && situacion.aprobacion_academica ? aprobacionCancelacion += 1 : ''
            situacion.estado === 'prorroga' && situacion.aprobacion_academica ? aprobacionProrroga += 1 : ''


        })
        total = terminados + abandonados + prorroga + cancelados;
        ///solicitud
        var aprobacionP = "", solicitudP = "", aprobacionC = "", solicitudC = "";
        prorroga - aprobacionProrroga > 1 ? aprobacionP = "aprobaciones" : aprobacionP = 'aprobación'
        prorroga - solicitudProrroga > 1 ? solicitudP = "solicitudes" : solicitudP = 'solicitud'
        cancelados - aprobacionCancelacion > 1 ? aprobacionC = "aprobaciones" : aprobacionC = 'aprobación'
        cancelados - solicitudCancelado > 1 ? solicitudC = "solicitudes" : solicitudC = 'solicitud'

        cancelados === solicitudCancelado ? '' : observacionCancelados += `Falta ${cancelados - solicitudCancelado} ${solicitudC} que entregen\n`
        cancelados === aprobacionCancelacion ? '' : observacionCancelados += `Falta ${cancelados - aprobacionCancelacion} ${aprobacionC} que entregen`
        prorroga === solicitudProrroga ? '' : observacionProrroga += `Falta${prorroga - solicitudProrroga} ${solicitudP} que entregen\n`
        prorroga === aprobacionProrroga ? '' : observacionProrroga += `Falta ${prorroga - aprobacionProrroga} ${aprobacionP} que entregen`
        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `${carrera ? carrera : ''}`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().format('YYYY-MM-DD')} `, style: 'subtitulo', decoration: 'underline' },
                        // { text: `${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]

                },
                {
                    margin: [210, 30, 10, 10],
                    alignment: 'center',
                    columns: [
                        {
                            width: 500,
                            table: {
                                widths: [280, 110],
                                body: [
                                    ['', { text: 'Total', alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'Proyectos concluidos.................................................', alignment: 'left', style: 'titulo' }, { text: terminados, alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'Proyectos en Prorroga...............................................', alignment: 'left', style: 'titulo' }, { text: prorroga, alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'Proyectos cancelados................................................', alignment: 'left', style: 'titulo' }, { text: cancelados, alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'Proyectos abandonados.............................................', alignment: 'left', style: 'titulo' }, { text: abandonados, alignment: 'left', style: 'subtitulo' }],
                                    ['', { text: 'Total........' + total, alignment: 'center', style: 'subtitulo' }]
                                ]
                            }, layout: 'noBorders'
                        }]
                    // layout: 'noBorders'


                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Resumen`, style: 'subtitulo' },

                    ]

                }, {
                    margin: [110, 20, 10, 10],
                    alignment: 'center',
                    columns: [
                        {
                            width: 900,
                            table: {
                                widths: [170, 30, 100, 95, 130],
                                body: [
                                    [{ text: 'SITUACIÓN DEL PROYECTO', alignment: 'left', style: 'subtitulo' }, { text: 'No', alignment: 'left', style: 'subtitulo' }, { text: 'Solicitud ante comité', alignment: 'left', style: 'subtitulo' }, { text: 'Aprobados por comité académico', alignment: 'left', style: 'subtitulo' }, { text: 'Observaciones', alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'TERMINARON SATISFACTORIAMENTE', alignment: 'left', style: 'subtitulo' }, { text: terminados, alignment: 'left', style: 'subtitulo' }, { text: '', alignment: 'left', style: 'subtitulo' }, { text: '', alignment: 'left', style: 'subtitulo' }, { text: '', alignment: 'left', style: 'subtitulo' }],
                                    [{ text: 'CANCELADOS', alignment: 'left', style: 'subtitulo' }, { text: cancelados, alignment: 'left', style: 'subtitulo' }, { text: solicitudCancelado, alignment: 'left', style: 'subtitulo' }, { text: aprobacionCancelacion, alignment: 'left', style: 'subtitulo' }, { text: observacionCancelados, alignment: 'left', style: 'min' }],
                                    [{ text: 'PRORROGA', alignment: 'left', style: 'subtitulo' }, { text: prorroga, alignment: 'left', style: 'subtitulo' }, { text: solicitudProrroga, alignment: 'left', style: 'subtitulo' }, { text: aprobacionProrroga, alignment: 'left', style: 'subtitulo' }, { text: observacionProrroga, alignment: 'left', style: 'min' }],

                                ]
                            }, //layout:'noBorders'
                        }]
                    // layout: 'noBorders'


                }, {
                    margin: [110, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Total....................................................  ${total - abandonados}`, style: 'subtitulo' },

                    ]

                },

            ],
            styles: {
                grande: {
                    fontSize: 16
                },
                titulo: {
                    fontSize: 12,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var docDefinitionvacio = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {

                    margin: [0, 0, 0, 0],
                    image: __dirname + '/../public/img/emoticon.png',
                    width: 150,
                    height: 150,
                    alignment: 'center'
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [


                        { text: `NO HAY DATOS DE NINGUN RESIDENTE AUN`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },



            ],
            styles: {
                grande: {
                    fontSize: 22
                },


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();

    },
    generarTerminoPorPeriodo: (situaciones, ciclo, res) => {
        var tabla = [];
        //  tabla.push(['','','','']);
        //  tabla.push(['','','','']);
        //  tabla.push(['','','','']);
        //  tabla.unshift(['',{ text: '2018', alignment: 'center',  rowSpan: 2, style: 'header_table' },'', { text: 'TOTAL', alignment: 'center',    style: 'header_table' }])
        //  tabla.unshift(['',{ text: 'ENERO - JUNIO', alignment: 'center',  rowSpan: 2, style: 'header_table' },'',''])
        //   tabla.unshift([{ text: 'CARRERA', alignment: 'center', colSpan:3, style: 'header_table' },{ text: 'HOMBRE', alignment: 'center',  style: 'header_table' },{ text: 'MUJER', alignment: 'center',  style: 'header_table' },{ text: '', alignment: 'center', colSpan:2,   style: 'header_table' }])
        // console.log(situaciones)
        Array.prototype.unique = function (a) {
            return function () { return this.filter(a) }
        }(function (a, b, c) {
            return c.indexOf(a, b + 1) < 0
        });
        var carreras = [];
        situaciones.map((anteproyecto, key) => {

            carreras.push(anteproyecto.alumno.carrera.nombre);


        });
        carreras = carreras.unique();
        var hombres = 0, mujeres = 0;
        carreras.forEach(function (valor, indice, array) {
            console.log("En el índice " + indice + " hay este valor: " + valor);
            var aux = true, hombre = 0, mujer = 0;
            situaciones.map((anteproyecto, key) => {

                if (anteproyecto.alumno.carrera.nombre === valor) {

                    anteproyecto.alumno.sexo === 'H' ? hombre += 1 : mujer += 1
                }



            })
            hombres += hombre;
            mujeres += mujer;

            tabla.push(
                [
                    { text: `${valor}`, style: 'row_table', alignment: 'left' },
                    { text: `${hombre}`, style: 'row_table' },
                    { text: `${mujer}`, style: 'row_table' },
                    { text: `${hombre + mujer}`, style: 'row_table' }


                ])
        });
        // 
        tabla.unshift(['', { text: 'HOMBRE', alignment: 'center', style: 'header_table' }, { text: 'MUJER', alignment: 'center', style: 'header_table' }, ''])
        tabla.unshift(['', { text: 'ENERO - JUNIO', alignment: 'center', colSpan: 2, style: 'header_table' }, '', { text: '', alignment: 'center', rowSpan: 2, style: 'header_table' }])

        tabla.unshift([{ text: 'CARRERA', alignment: 'center', rowSpan: 3, style: 'header_table' }, { text: ciclo, alignment: 'center', colSpan: 2, style: 'header_table' }, '', { text: 'TOTAL', alignment: 'center', style: 'header_table' }])

        console.log(tabla)
        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 45, alignment: 'left' }, { image: __dirname + '/../public/img/otra_parte1.png', width: 200, height: 45, alignment: 'right' }],


                                ]

                            }, layout: 'noBorders'
                        }
                    ]
                }

            },

            content: [
                {
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', alignment: 'center', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().format('YYYY-MM-DD')} `, style: 'subtitulo', decoration: 'underline' },
                        // { text: `${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]

                }, {
                    margin: [40, 50, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'RESIDENCIA PROFESIONAL\n', style: 'titulo', bold: true },

                    ]

                },

                {
                    margin: [80, 50, 0, 0],
                    table: {
                        // headerRows: 1,
                        widths: [400, 50, 50, 50],
                        body: tabla
                    }
                },
                {
                    margin: [490, 30, 0, 0],
                    table: {
                        widths: [50, 50, 50],
                        body: [
                            [{ text: hombres, alignment: 'center', style: 'row_table' }, { text: mujeres, alignment: 'center', style: 'row_table' }, { text: hombres + mujeres, alignment: 'center', style: 'row_table' }],

                        ]
                    }
                },

            ],
            styles: {
                grande: {
                    fontSize: 16
                },
                titulo: {
                    fontSize: 12,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var docDefinitionvacio = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {

                    margin: [0, 0, 0, 0],
                    image: __dirname + '/../public/img/emoticon.png',
                    width: 150,
                    height: 150,
                    alignment: 'center'
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [


                        { text: `NO HAY DATOS DE NINGUN RESIDENTE AUN`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },



            ],
            styles: {
                grande: {
                    fontSize: 22
                },


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();

    },
    generarTerminoPorCiclo: (situaciones, ciclo, res) => {
        var tabla = [];
        //  tabla.push(['','','','']);
        //  tabla.push(['','','','']);
        //  tabla.push(['','','','']);
        //  tabla.unshift(['',{ text: '2018', alignment: 'center',  rowSpan: 2, style: 'header_table' },'', { text: 'TOTAL', alignment: 'center',    style: 'header_table' }])
        //  tabla.unshift(['',{ text: 'ENERO - JUNIO', alignment: 'center',  colSpan : 2, style: 'header_table' },'','',{ text: 'AGOSTO - DICIEMBRE', alignment: 'center',  colSpan: 2, style: 'header_table' },'','',''])
        //   tabla.unshift([{ text: 'CARRERA', alignment: 'center', style: 'header_table' },{ text: 'HOMBRE', alignment: 'center',  style: 'header_table' },{ text: 'MUJER', alignment: 'center',  style: 'header_table' },{},{ text: 'HOMBRE', alignment: 'center',  style: 'header_table' },{ text: 'MUJER', alignment: 'center',  style: 'header_table' },{},{}])
        // // console.log(situaciones)
        Array.prototype.unique = function (a) {
            return function () { return this.filter(a) }
        }(function (a, b, c) {
            return c.indexOf(a, b + 1) < 0
        });
        var carreras = [];
        situaciones.map((anteproyecto, key) => {

            carreras.push(anteproyecto.alumno.carrera.nombre);


        });
        carreras = carreras.unique();
        var hombresFebrero = 0, hombresAgosto = 0, mujeresFebrero = 0, mujeresAgosto = 0, hombres = 0, mujeres = 0;
        carreras.forEach(function (valor, indice, array) {
            console.log("En el índice " + indice + " hay este valor: " + valor);
            var aux = true, hombre = 0, mujer = 0, hombre2 = 0, mujer2 = 0;
            situaciones.map((anteproyecto, key) => {

                if (anteproyecto.alumno.carrera.nombre === valor) {
                    anteproyecto.alumno.sexo === 'H' && anteproyecto.periodo.periodo === 'FEBRERO-JUNIO' ? hombre += 1 : ''
                    anteproyecto.alumno.sexo === 'M' && anteproyecto.periodo.periodo === 'FEBRERO-JUNIO' ? mujer += 1 : ''
                    anteproyecto.alumno.sexo === 'H' && anteproyecto.periodo.periodo === 'AGOSTO-DICIEMBRE' ? hombre2 += 1 : ''
                    anteproyecto.alumno.sexo === 'M' && anteproyecto.periodo.periodo === 'AGOSTO-DICIEMBRE' ? mujer2 += 1 : ''
                }



            })
            hombres += hombre;
            mujeres += mujer;

            tabla.push(
                [
                    { text: `${valor}`, style: 'row_table', alignment: 'left' },
                    { text: `${hombre}`, style: 'row_table' },
                    { text: `${mujer}`, style: 'row_table' },
                    { text: ``, style: 'row_table', fillColor: '#d7d9db' },
                    { text: `${hombre2}`, style: 'row_table' },
                    { text: `${mujer2}`, style: 'row_table' },
                    { text: ``, style: 'row_table', fillColor: '#d7d9db' },
                    { text: `${hombre + hombre2}`, style: 'row_table' },
                    { text: `${mujer + mujer2}`, style: 'row_table' },
                    { text: `${mujer + mujer2 + hombre + hombre2}`, style: 'row_table' }


                ])
            hombresFebrero += hombre;
            hombresAgosto += hombre2;
            mujeresFebrero += mujer;
            mujeresAgosto += mujer2;
        });

        tabla.unshift(['', { text: 'HOMBRE', alignment: 'center', style: 'header_table' }, { text: 'MUJER', alignment: 'center', style: 'header_table' }, { text: ``, style: 'row_table', fillColor: '#d7d9db' }, { text: 'HOMBRE', alignment: 'center', style: 'header_table' }, { text: 'MUJER', alignment: 'center', style: 'header_table' }, { text: ``, style: 'row_table', fillColor: '#d7d9db' }, { text: 'HOMBRE', alignment: 'center', style: 'header_table' }, { text: 'MUJER', alignment: 'center', style: 'header_table' }, { text: 'TODOS', alignment: 'center', style: 'header_table' }])

        tabla.unshift(['', { text: 'ENERO - JUNIO', alignment: 'center', colSpan: 2, style: 'header_table' }, '', { text: ``, style: 'row_table', fillColor: '#d7d9db' }, { text: 'AGOSTO - DICIEMBRE', alignment: 'center', colSpan: 2, style: 'header_table' }, '', { text: ``, style: 'row_table', fillColor: '#d7d9db' }, '', '', ''])
        tabla.unshift([{ text: 'CARRERA', alignment: 'center', rowSpan: 3, style: 'header_table' }, { text: ciclo, alignment: 'center', colSpan: 5, style: 'header_table' }, '', '', '', '', { text: ``, style: 'row_table', fillColor: '#d7d9db' }, { text: 'TOTAL', rowSpan: 2, colSpan: 3, alignment: 'center', style: 'header_table' }, '', ''])

        // console.log(situaciones)
        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 45, alignment: 'left' }, { image: __dirname + '/../public/img/otra_parte1.png', width: 200, height: 45, alignment: 'right' }],


                                ]

                            }, layout: 'noBorders'
                        }
                    ]
                }

            },

            content: [
                {
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', alignment: 'center', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().format('YYYY-MM-DD')} `, style: 'subtitulo', decoration: 'underline' },
                        // { text: `${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]

                }, {
                    margin: [40, 50, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'RESIDENCIA PROFESIONAL\n', style: 'titulo', bold: true },

                    ]

                },

                {
                    margin: [10, 50, 0, 0],
                    table: {
                        // headerRows: 1,
                        widths: [300, 50, 50, 5, 50, 50, 5, 50, 50, 50],
                        body: tabla
                    }
                },
                {
                    margin: [320, 30, 0, 0],
                    table: {
                        widths: [50, 50],
                        body: [
                            [{ text: hombresFebrero, alignment: 'center', style: 'row_table' }, { text: mujeresFebrero, alignment: 'center', style: 'row_table' }],

                        ]
                    }
                }, {
                    margin: [455, -16, 0, 0],
                    table: {
                        widths: [50, 50],
                        body: [
                            [{ text: hombresAgosto, alignment: 'center', style: 'row_table' }, { text: mujeresAgosto, alignment: 'center', style: 'row_table' }],

                        ]
                    }
                }, {
                    margin: [587, -16, 0, 0],
                    table: {
                        widths: [50, 50, 50],
                        body: [
                            [{ text: hombresAgosto + hombresFebrero, alignment: 'center', style: 'row_table' }, { text: mujeresAgosto + mujeresFebrero, alignment: 'center', style: 'row_table' }, { text: mujeresAgosto + mujeresFebrero + hombresAgosto + hombresFebrero, alignment: 'center', style: 'row_table' }],

                        ]
                    }
                },

            ],
            styles: {
                grande: {
                    fontSize: 16
                },
                titulo: {
                    fontSize: 12,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var docDefinitionvacio = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 20, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\n\n', style: 'titulo', bold: true },
                        { text: 'SUBDIRECCION ACADÉMICA\n', style: 'titulo', bold: true },
                        { text: 'DIVISIÓN DE ESTUDIOS PROFESIONALES', style: 'titulo', bold: true }
                    ]

                }


            },

            content: [
                {

                    margin: [0, 0, 0, 0],
                    image: __dirname + '/../public/img/emoticon.png',
                    width: 150,
                    height: 150,
                    alignment: 'center'
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [


                        { text: `NO HAY DATOS DE NINGUN RESIDENTE AUN`.toUpperCase(), style: 'grande', bold: true }

                    ]
                },



            ],
            styles: {
                grande: {
                    fontSize: 22
                },


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();

    },

    generarSolicitudDeResidencia: (anteproyecto, division_estudios, colaborador, coordinador, res) => {


        var numeroColaboradores = 1;
        var colaboradores = colaborador.map((alumno, key) => {
            numeroColaboradores += 1;
        });
        var coordinadorCarrera = coordinador ? `${coordinador.docente.titulo} ${coordinador.docente.nombre} ${coordinador.docente.ap_paterno} ${coordinador.docente.ap_materno}` : 'No hay coordinador'
        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 45, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: [100, '*', '*', 100],
                                body: [
                                    [{ image: __dirname + '/../public/img/tecnologicos.png', width: 80, height: 45, alignment: 'center', rowSpan: 2 }, { text: 'Solicitud de Residencias Profesionales ', style: 'titulo', alignment: 'center', bold: true, colSpan: 2 }, '', { image: __dirname + '/../public/img/tec_Logo.png', width: 45, height: 45, alignment: 'center', rowSpan: 2 }],
                                    ['', { text: 'Referencia a la Norma ISO 9001:2008  7.5.1', alignment: 'center', colSpan: 2, style: 'subtitulo' }, '', ''],
                                    [{ text: 'Revisión 2', alignment: 'center', style: 'min' }, { text: 'Código: ITCHILPO-AC-PO-007-01', alignment: 'center', bold: true, style: 'min' }, { text: 'Fecha de aplicación: 16-junio-2011', alignment: 'center', style: 'min' }, { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', style: 'min' }]
                                ]
                            }
                        }

                    ]
                }

            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO\nDIVISIÓN DE ESTUDIOS PROFESIONALES\nRESIDENCIAS PROFESIONALES ', style: 'normal', bold: true }
                    ]
                },
                {
                    alignment: 'justify',
                    width: '*',
                    margin: [0, 20, 0, 0],
                    columns: [
                        {
                            alignment: 'justify',
                            text: [
                                { text: 'Lugar     ', style: 'subtitulo' },
                                { text: 'Chilpancingo de los Bravo, Guerrero', style: 'subtitulo', decoration: 'underline' },
                                { text: '            Fecha     ', style: 'subtitulo' },
                                { text: `           ${moment().format('LL')}          `, style: 'subtitulo', decoration: 'underline' }
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    columns: [
                        {
                            alignment: 'justify',
                            text: [
                                { text: 'C.', style: 'subtitulo' },
                                { text: `${division_estudios.docentes[0].titulo} ${division_estudios.docentes[0].nombre} ${division_estudios.docentes[0].ap_paterno} ${division_estudios.docentes[0].ap_materno}`, style: 'titulo', decoration: 'underline', bold: true },
                                { text: '\nJefe de la Div. de Estudios Profesionales', style: 'titulo' },
                            ]
                        },
                        {
                            alignment: 'justify',
                            text: [
                                { text: `AT'N: C. `, style: 'subtitulo' },
                                { text: coordinadorCarrera, style: 'titulo', decoration: 'underline', bold: true },
                                { text: `\nCoord. de la Carrera de  `, style: 'titulo' },
                                { text: `${anteproyecto.alumno.carrera.nombre}`, style: 'titulo', decoration: 'underline', bold: true }
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    columns: [
                        {
                            width: 200,
                            table: {
                                widths: [180],
                                body: [
                                    [{ text: 'NOMBRE DEL PROYECTO:', alignment: 'center', style: 'titulo', bold: true, fillColor: '#e3e3e3' }]
                                ]
                            }
                        },
                        {
                            width: 323,
                            table: {
                                widths: [323],
                                body: [
                                    [{ text: `${anteproyecto.nombre}`, style: 'relleno', alignment: 'justify' }]
                                ]
                            }
                        }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    columns: [
                        {
                            width: 140,
                            table: {
                                widths: [120],
                                body: [
                                    [{ text: 'OPCIÓN ELEGIDA:', alignment: 'center', style: 'titulo', bold: true, fillColor: '#e3e3e3' }]
                                ]
                            }
                        },
                        {
                            columns: [
                                {
                                    margin: [5, 0, 5, 0],
                                    table: {
                                        widths: ['*', 10],
                                        body: [
                                            [{ text: `Banco de proyectos`, style: 'min', alignment: 'center' }, { text: `${anteproyecto.origen == 'Banco de proyectos' ? 'X' : ''}`, bold: true, style: 'min' }]
                                        ]
                                    }
                                },
                                {
                                    margin: [5, 0, 5, 0],
                                    table: {

                                        widths: ['*', 10],
                                        body: [
                                            [{ text: `Propuesta propia`, style: 'min', alignment: 'center' }, { text: `${anteproyecto.origen == 'Propuesta propia' ? 'X' : ''}`, bold: true, style: 'min' }]
                                        ]
                                    }
                                },
                                {
                                    margin: [5, 0, 0, 0],
                                    table: {
                                        widths: ['*', 10],
                                        body: [
                                            [{ text: `Trabajador`, style: 'min', alignment: 'center' }, { text: `${anteproyecto.origen == 'Trabajador' ? 'X' : ''}`, bold: true, style: 'min' }]
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    columns: [
                        {
                            width: 200,
                            table: {
                                widths: [180],
                                body: [
                                    [{ text: 'PERIODO PROYECTADO:', alignment: 'center', style: 'titulo', bold: true, fillColor: '#e3e3e3' }]
                                ]
                            }
                        },
                        {
                            width: ['*'],
                            table: {
                                widths: [200, 95, 10],
                                body: [
                                    [{ text: `${anteproyecto.periodo.periodo} ${anteproyecto.periodo.ciclo}`, style: 'min', alignment: 'left' }, { text: 'Número de residentes', style: 'min' }, { text: numeroColaboradores, style: 'min' }]
                                ]
                            }
                        }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    text: 'Datos de la empresa',
                    style: 'subtitulo',
                    bold: true
                },
                {
                    table: {
                        widths: [100, '*', '*', '*', '*', '*'],
                        body: [
                            [{ text: 'Nombre:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.nombre}`, style: 'subtitulo', colSpan: 5 }, '', '', '', ''],
                            [{ text: 'Giro, Ramo o Sector:', style: 'subtitulo' }, { text: `Industrial (${anteproyecto.asesor_externo.empresa.clasificacion == 'industrial' ? 'X' : ' '})  Servicios (${anteproyecto.asesor_externo.empresa.clasificacion == 'servicios' ? 'X' : ' '})  Otro (${anteproyecto.asesor_externo.empresa.clasificacion == 'otro' ? 'X' : ' '})  \nPúblico (${anteproyecto.asesor_externo.empresa.clasificacion == 'público' ? 'X' : ' '})  Privado (${anteproyecto.asesor_externo.empresa.clasificacion == 'privado' ? 'X' : ''})`, style: 'min', colSpan: 3, alignment: 'center' }, '', '', { text: 'R.F.C.', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.rfc}`, style: 'min' }],
                            [{ text: 'Domicilio:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.domicilio}`, style: 'subtitulo', colSpan: 5 }, '', '', '', ''],
                            [{ text: 'Colonia:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.colonia}`, style: 'subtitulo' }, { text: `C.P.`, style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.codigo_postal}`, style: 'subtitulo' }, { text: `Fax`, style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.fax}`, style: 'subtitulo' }],
                            [{ text: 'Misión de la empresa:\n\n\n', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.mision}`, style: 'subtitulo', colSpan: 5 }, '', '', '', ''],
                            [{ text: 'Nombre del titular\n de la empresa:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.titular.titulo} ${anteproyecto.asesor_externo.empresa.titular.nombre}`, style: 'subtitulo', colSpan: 2 }, '', { text: 'Puesto:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.titular.puesto}`, style: 'subtitulo', colSpan: 2 }, ''],
                            [{ text: 'Nombre del Asesor\n Externo:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.nombre}`, style: 'subtitulo', colSpan: 2 }, '', { text: 'Puesto:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.puesto}`, style: 'subtitulo', colSpan: 2 }, ''],
                            [{ text: 'Nombre de la persona que\n firmará el acuerdo de trabajo.\nEstudiante-Escuela-Empresa:', style: 'subtitulo', colSpan: 2 }, '', { text: `${anteproyecto.asesor_externo.empresa.representante_legal.titulo} ${anteproyecto.asesor_externo.empresa.representante_legal.nombre}`, style: 'subtitulo', }, { text: 'Puesto:', style: 'subtitulo' }, { text: `${anteproyecto.asesor_externo.empresa.representante_legal.puesto}`, style: 'subtitulo', colSpan: 2 }, ''],
                        ]
                    }
                },
                {
                    margin: [0, 20, 0, 0],
                    text: 'Datos del Residente',
                    style: 'subtitulo',
                    bold: true,
                    pageBreak: 'before'
                },
                {
                    table: {
                        widths: [100, '*', '*', '*', '*'],
                        body: [
                            [{ text: 'Nombre:', style: 'subtitulo' }, { text: `${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`, style: 'subtitulo', colSpan: 4 }, '', '', ''],
                            [{ text: 'Carrera:', style: 'subtitulo' }, { text: `${anteproyecto.alumno.carrera.nombre}`, style: 'subtitulo', colSpan: 2 }, '', { text: 'No. de\n control:', style: 'subtitulo', fillColor: '#e3e3e3' }, { text: `${anteproyecto.alumno.no_control}`, style: 'subtitulo' }],
                            [{ text: 'Domicilio:', style: 'subtitulo' }, { text: `${anteproyecto.alumno.domicilio}`, style: 'subtitulo', colSpan: 4 }, '', '', ''],
                            [{ text: 'E-mail:', style: 'subtitulo', rowSpan: 2 }, { text: `${anteproyecto.alumno.usuario.correo}`, style: 'subtitulo', colSpan: 2, rowSpan: 2 }, { text: '', rowSpan: 2 }, { text: 'Para Seguridad\n Social acudir', style: 'subtitulo', rowSpan: 2 }, { text: `${anteproyecto.alumno.seguro.nombre}(X)`, style: 'subtitulo', fillColor: '#e3e3e3' }],
                            ['', '', '', '', { text: `No. : ${anteproyecto.alumno.no_seguro}`, style: 'subtitulo' }],
                            [{ text: 'Ciudad:', style: 'subtitulo' }, { text: `${anteproyecto.alumno.ciudad}`, style: 'subtitulo', colSpan: 2 }, '', { text: 'Teléfono\n (no. celular):', style: 'subtitulo', fillColor: '#e3e3e3' }, { text: `${anteproyecto.alumno.numero_celular}`, style: 'subtitulo' }],


                        ]
                    }
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    text: `                             Firma del estudiante                             `,
                    decoration: 'overline'
                }
            ],
            styles: {
                titulo: {
                    fontSize: 12,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
        //esto sirve para generarla en pdf
        // var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(fs.createWriteStream(`storeFiles/solicitudes/${anteproyecto.alumno.no_control}-${anteproyecto.periodo.periodo}-${anteproyecto.periodo.ciclo}.pdf`));
        // pdfDoc.end();
    },

    generarReporteSituacionResidente: (alumno, anteproyecto, seguimiento_proyectos, res) => {
        // console.log(alumno.anteproyecto.proyecto)
        const currentDate = moment().format('YYYY-MM-DD');
        var index = 0;
        var content_table = seguimiento_proyectos.filter(function (seguimiento) { return currentDate > seguimiento.seguimiento.fecha_final; })
            .map(function (seguimiento) {
                return [
                    { text: `${(index += 1)}`, style: 'row_table' },
                    { text: `${seguimiento.estado_seguimiento}`, style: 'row_table' },
                    { text: `${seguimiento.seguimiento.fecha_final}`, style: 'row_table' },

                ]
            });

        content_table.unshift([
            { text: 'No. seguimiento', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Estado', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'fecha de entrega', alignment: 'center', rowSpan: 1, style: 'header_table' },

        ])

        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 5, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `SUBDIRECCIÓN ACADÉMICA\n`.toUpperCase(), style: 'subtitulo', bold: true },
                        { text: `DIVISIÓN DE ESTUDIOS PROFESIONALES\n\n\n`.toUpperCase(), style: 'subtitulo', bold: true },
                        { text: `${alumno.carrera.nombre}`.toUpperCase(), style: 'titulo', bold: true }

                    ]
                },

                {
                    margin: [0, 30, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Reporte individual`, style: 'subtitulo' },

                    ]
                },
                {
                    margin: [0, -5, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Fecha de reporte:`, style: 'subtitulo' },
                        { text: ` ${moment().format('LL')} `, style: 'subtitulo', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 5, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [

                        { text: `Situación de residente: `, style: 'subtitulo' }

                    ]

                }
                ,
                {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [30, 100, 130, '*', 130],
                        body: [
                            [{ text: `NP.`, style: 'header_table', alignment: 'center', }, { text: `No. de control`, style: 'header_table', alignment: 'center' }, { text: `Nombre`, style: 'header_table', alignment: 'center' }, { text: `Anteproyecto`, style: 'header_table', alignment: 'center' }, { text: `Lugar de residencia`, style: 'header_table', alignment: 'center' }]
                            , [{ text: `1`, style: 'min' }, { text: `${alumno.no_control}`, style: 'min' }, { text: `${alumno.nombre} ${alumno.ap_paterno} ${alumno.ap_materno}`, style: 'min' }, { text: `${anteproyecto.nombre}`, style: 'min' }, { text: `${anteproyecto.asesor_externo.empresa.nombre}`, style: 'min' }],
                        ]
                    }
                }, {
                    margin: [0, 5, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [

                        { text: `Seguimientos: `, style: 'subtitulo' }

                    ]

                }
                , {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [130, 130, 130],
                        body:
                            content_table

                    }
                },
                {
                    margin: [0, 100, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `  ${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}  `, style: 'subtitulo', decoration: 'underline' }
                        , { text: `\nAsesor interno`, style: 'subtitulo' }


                    ]
                },
            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }




        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();

    }, generarListaDeConveniosIndifinidos: (empresas, res) => {
        var content_table = empresas.map((empresa, index) => {
            return [
                { text: `${(index += 1)}`, style: 'row_table' },
                { text: `${empresa.nombre}`, style: 'row_table' },
                { text: `Indifinido`, style: 'row_table' },

            ]
        });
        content_table.unshift([
            { text: 'No. Convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Nombre de empresa', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Tiempo de convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },


        ])

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `CONVENIOS DE TIEMPO  INDIFINIDO`.toUpperCase(), style: 'subtitulo', bold: true }

                    ]
                }, {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [80, '*', 100],
                        body: content_table

                    }
                },


            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    , generarListaDeConveniosVigentes: (convenios, res) => {
        var content_table = convenios.map((convenio, index) => {
            return [
                { text: `${(index += 1)}`, style: 'row_table' },
                { text: `${convenio.empresa.nombre}`, style: 'row_table' },
                { text: `${convenio.fecha_inicial}`, style: 'row_table' },
                { text: `${convenio.fecha_final}`, style: 'row_table' },
            ]
        });
        content_table.unshift([
            { text: 'No. Convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Nombre de empresa', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de inicio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de termino', alignment: 'center', rowSpan: 1, style: 'header_table' },

        ])

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `CONVENIOS TEMPORALES`.toUpperCase(), style: 'subtitulo', bold: true }

                    ]
                }, {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [80, '*', 100, 100],
                        body: content_table

                    }
                },


            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }, generarListaDeConveniosTerminados: (convenios, res) => {
        var content_table = convenios.map((convenio, index) => {
            return [
                { text: `${(index += 1)}`, style: 'row_table' },
                { text: `${convenio.empresa.nombre}`, style: 'row_table' },
                { text: `${convenio.fecha_inicial}`, style: 'row_table' },
                { text: `${convenio.fecha_final}`, style: 'row_table' },
            ]
        });
        content_table.unshift([
            { text: 'No. Convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Nombre de empresa', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de inicio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de termino', alignment: 'center', rowSpan: 1, style: 'header_table' },

        ])

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `CONVENIOS TERMINADOS`.toUpperCase(), style: 'subtitulo', bold: true }

                    ]
                }, {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [80, '*', 100, 100],
                        body: content_table

                    }
                },


            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    , generarListaDeConveniosTodos: (convenios, res) => {
        var content_table = convenios.map((convenio, index) => {
            return [
                { text: `${(index += 1)}`, style: 'row_table' },
                { text: `${convenio.empresa.nombre}`, style: 'row_table' },
                { text: `${convenio.fecha_inicial}`, style: 'row_table' },
                { text: `${convenio.fecha_final}`, style: 'row_table' },
                { text: `${convenio.convenio ? 'Vigente' : 'Terminado'}`, style: 'row_table' },
            ]
        });
        content_table.unshift([
            { text: 'No. Convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Nombre de empresa', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de inicio', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Fecha de termino', alignment: 'center', rowSpan: 1, style: 'header_table' },
            { text: 'Estado del convenio', alignment: 'center', rowSpan: 1, style: 'header_table' },

        ])

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `TODOS LOS CONVENIOS`.toUpperCase(), style: 'subtitulo', bold: true }

                    ]
                }, {
                    margin: [0, 10, 0, 0],
                    table: {

                        widths: [80, '*', 100, 100, 100],
                        body: content_table

                    }
                },


            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    ,
    generarPortadaDeProyecto: (anteproyecto, division_estudios, colaborador, res) => {
        var colaboradores = colaborador.map((alumno, key) => {
            return [
                {
                    margin: [0, 5, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `${alumno.colaboradores.nombre} ${alumno.colaboradores.ap_paterno} ${alumno.colaboradores.ap_materno}`.toUpperCase(), style: 'titulo_nombre', bold: true },
                    ]
                }, {
                    margin: [0, -15, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `No.control: `, style: 'titulo_nombre' },
                        { text: `${alumno.colaboradores.no_control}  `, style: 'titulo_nombre', bold: true }
                    ]
                }

            ]
        });
        var asesorinterno = "";
        try {

            asesorinterno = `${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}`.toUpperCase()


        } catch (error) {
            asesorinterno = ""
        }

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'subtitulo', bold: true }
                    ]

                }

            },
            content: [
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `PROGRAMA EDUCATIVO:${anteproyecto.alumno.carrera.nombre}`.toUpperCase(), style: 'min', bold: true }

                    ]
                },
                {
                    margin: [0, 40, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: "ANTEPROYECTO DE RESIDENCIA PROFESIONAL\n\n", style: 'titulo', bold: true },
                        { text: `Periodo: ${anteproyecto.periodo.periodo} ${anteproyecto.periodo.ciclo}`, style: 'subtitulo', bold: true }
                    ]
                },
                {
                    margin: [0, 80, 0, 0],
                    alignment: 'justify',
                    width: '*',
                    text: [
                        { text: `${anteproyecto.nombre}`, style: 'titulo_nombre', bold: true },

                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Residentes:`, style: 'subtitulo' },

                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`.toUpperCase(), style: 'titulo_nombre', bold: true },

                    ],
                },

                {
                    margin: [0, -15, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: ` No.control: `, style: 'titulo_nombre' },
                        { text: `${anteproyecto.alumno.no_control}  `, style: 'titulo_nombre', bold: true }

                    ]

                }, {
                    columns: [
                        colaboradores
                    ]
                },
                {

                    margin: [0, 120, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{ text: `Asesor interno:`, style: 'subtitulo', alignment: 'left', }, { text: `Asesor externo:`, style: 'subtitulo', alignment: 'left' }],
                            [{ text: asesorinterno, style: 'titulo_nombre', bold: true, alignment: 'left' }, { text: `${anteproyecto.asesor_externo.nombre}`.toUpperCase(), style: 'titulo_nombre', bold: true, alignment: 'left' }]
                        ]
                    },
                    layout: 'noBorders'


                },
                {
                    margin: [0, 40, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [

                        { text: `Chilpancingo, Gro., a ${moment().format('LL')} `, style: 'subtitulo' }

                    ]

                }

            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    }, generarCartaPresentacion: (anteproyecto, division_estudios, coordinador, folio, res) => {
        var numero = "";
        if (parseInt(folio.numero_de_folio) < 10) {
            numero = "00" + folio.numero_de_folio;
        } else if (parseInt(folio.numero_de_folio) > 9 && parseInt(folio.numero_de_folio) < 100) {
            numero = "0" + folio.numero_de_folio;
        } else {
            numero = folio.numero_de_folio;
        }
        console.log('---------------', folio.numero_de_folio, "-------")
        var asesorinterno = "";
        try {

            asesorinterno = `${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}`.toUpperCase()


        } catch (error) {
            asesorinterno = ""
        }

        var docDefinition = {

            pageSize: 'A4',
            pageOrientation: 'LETTER',
            pageMargins: [40, 100, 40, 60],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: [70, '*', '*', 70],
                                body: [
                                    [{ image: __dirname + '/../public/img/tecnologicos.png', width: 40, height: 45, alignment: 'center', rowSpan: 2 }, { text: 'Carta de presentación y agradecimiento de Residencias Profesionales.', style: 'titulo', alignment: 'center', bold: true, colSpan: 2 }, '', { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 45, alignment: 'center', rowSpan: 2 }],
                                    ['', { text: 'Referencia a la Norma ISO 9001:2008  7.5.1', alignment: 'center', colSpan: 2, style: 'min' }, '', ''],
                                    [{ text: 'Revisión 2', alignment: 'center', style: 'min' }, { text: 'Código: ITCHILPO-AC-PO-007-04', alignment: 'center', bold: true, style: 'min' }, { text: 'Fecha de aplicación: 16-junio-2011', alignment: 'center', style: 'min' }, { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', style: 'min' }]
                                ]
                            }
                        }

                    ]
                }

            },
            content: [
                {

                    margin: [100, 20, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{ text: `Departamento: `, style: 'min', bold: true, alignment: 'right', }, { text: division_estudios.nombre.toUpperCase(), style: 'min', alignment: 'left' }],
                            [{ text: `         No. Oficio:`, style: 'min', bold: true, alignment: 'right' }, { text: `12DIT0002E / DGTYV / ${numero} / ${anteproyecto.periodo.ciclo}`, style: 'min', bold: true, alignment: 'left' }]

                        ]
                    },
                    layout: 'noBorders'


                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `ASUNTO: PRESENTACIÓN DEL ESTUDIANTE Y AGRADECIMIENTO `, style: 'min', bold: true },


                    ]
                }, {

                    margin: [350, 20, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: `Chilpancingo, Gro., ${moment().format('LL')}`, style: 'min', bold: true },


                    ]


                }, {

                    margin: [0, 20, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{ text: `${coordinador.representante_legal.titulo}${coordinador.representante_legal.nombre}.`.toLocaleUpperCase(), style: 'min', bold: true, alignment: 'left' }],
                            [{ text: `${coordinador.representante_legal.puesto}.`.toLocaleUpperCase(), style: 'min', bold: true, alignment: 'left' }],
                            [{ text: `${coordinador.nombre}.`.toLocaleUpperCase(), style: 'min', bold: true, alignment: 'left' }],
                            [{ text: `PRESENTE`.toLocaleUpperCase(), style: 'header_table', bold: true, alignment: 'left' }]
                        ]
                    },
                    layout: 'noBorders'


                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `El Instituto Tecnológico de Chilpancingo, tiene a bien presentar a sus finas atenciones al C.${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}, con número de control ${anteproyecto.alumno.no_control} de la carrera ${anteproyecto.alumno.carrera.nombre}, quien desea desarrollar en ese organismo el proyecto de Residencias Profesionales, denominado ${anteproyecto.nombre} cubriendo un total de 500 horas, en un período de cuatro a seis meses.`, style: 'normal' },


                    ]
                }, {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        {
                            text: `Es importante hacer de su conocimiento que todos los estudiantes que se encuentran inscritos en esta institución
                        cuentan con un seguro contra accidentes personales con la empresa Axa Seguros, según póliza No. ${anteproyecto.alumno.no_seguro}
                        e inscripción en el ${anteproyecto.alumno.seguro.nombre}.`, style: 'normal'
                        },


                    ]
                }, {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        {
                            text: `Así mismo, hacemos patente nuestro sincero agradecimiento por su buena disposición y colaboración para que
                        nuestros estudiantes, aún estando en proceso de formación, desarrollen un proyecto de trabajo profesional,
                        donde puedan aplicar el conocimiento y el trabajo en el campo de acción en el que se desenvolverán como
                        futuros profesionistas` , style: 'normal'
                        },


                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        {
                            text: `Al vernos favorecidos con su participación en nuestro objetivo, sólo nos resta manifestarle la seguridad de
                        nuestra más atenta y distinguida consideración.` , style: 'normal'
                        },


                    ]
                },

                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `A T E N T A M E N T E\n"CREAR TECNOLOGÍA ES FORJAR LIBERTAD"`, style: 'normal', bold: true },


                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 25, 0, 0],
                    text: [
                        { text: `______________________________________________________\n`, style: 'normal' },
                        { text: `${division_estudios.docentes[0].titulo} ${division_estudios.docentes[0].nombre} ${division_estudios.docentes[0].ap_paterno} ${division_estudios.docentes[0].ap_materno}`, style: 'titulo', bold: true },
                        { text: '\nJEFE DEL DEPARTAMENTO DE GESTIÓN TECNOLÓGICA\nY VINCULACIÓN DEL I.T. DE CHILPANCINGO ', style: 'titulo', bold: true },



                    ]
                }, {
                    alignment: 'center',
                    width: '*',
                    margin: [0, 25, 0, 0],
                    text: [
                        { text: `Este documento sólo es válido con el sello y firma del responsable`, style: 'firma' },



                    ]
                },



            ],
            styles: {
                titulo: {
                    fontSize: 11,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 11,
                },
                min: {
                    fontSize: 9
                }, normal: {
                    fontSize: 10
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 9,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoDeCancelacion: (cancelacion, res) => {
        // console.log(cancelacion.alumno.carrera.departamento.docentes[0].nombre)
        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 40, 40, 50],
            content: [
                {
                    alignment: 'right',
                    width: '*',
                    text: [
                        { text: 'Asunto: ', style: 'normal' },
                        { text: 'Cancelación de proyecto de residencia y nueva \nasignación de anteproyecto de residencia profesional', style: 'normal', bold: true }
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: `Chilpancingo, Gro., ${moment().format('LL')}.`,
                    style: 'normal'
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: `${cancelacion.alumno.carrera.departamento.docentes[0].titulo} ${cancelacion.alumno.carrera.departamento.docentes[0].nombre} ${cancelacion.alumno.carrera.departamento.docentes[0].ap_paterno} ${cancelacion.alumno.carrera.departamento.docentes[0].ap_materno} \nJefe de departamento de ${cancelacion.alumno.carrera.departamento.nombre}\nPRESENTE`,
                    style: 'normal',
                    bold: true
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'justify',
                    width: '*',
                    text: [
                        { text: `El que subscribe `, style: 'normal' },
                        { text: `${cancelacion.asesor_interno.titulo} ${cancelacion.asesor_interno.nombre} ${cancelacion.asesor_interno.ap_paterno} ${cancelacion.asesor_interno.ap_materno}`, style: 'normal', bold: true },
                        { text: `, catedrático de este instituto y asesor interno ${cancelacion.alumno.sexo === 'H' ? 'del' : 'de la'} estudiante residente `, style: 'normal' },
                        { text: `C. ${cancelacion.alumno.nombre} ${cancelacion.alumno.ap_paterno} ${cancelacion.alumno.ap_materno} `, style: 'normal', bold: true },
                        { text: `con numero de control `, style: 'normal' },
                        { text: `${cancelacion.alumno.no_control}`, style: 'normal', bold: true },
                        { text: `, de la carrera `, style: 'normal' },
                        { text: `${cancelacion.alumno.carrera.nombre} `, style: 'normal', bold: true },
                        { text: `quien tiene asignado el proyecto denominado: `, style: 'normal' },
                        { text: `"${cancelacion.nombre_proyecto}",`, style: 'normal', bold: true },
                        { text: ` en el periodo `, style: 'normal' },
                        { text: `${cancelacion.periodo.periodo} ${cancelacion.periodo.ciclo}.`, style: 'normal', bold: true },
                        { text: `\n\nCon base en ello; me permito notificar y solicitar a usted. Que el estudiante ya citado no podrá concluir su residencia profesional en el periodo que le correspondió, debido a que le se le presentaron los siguientes percances:`, style: 'normal', bold: true },
                        { text: `\n\t- ${cancelacion.justificacion}`, style: 'normal' },
                        { text: `\n\nPor lo que solicito a usted de no existir inconveniente alguno, el gestionar ante el comité académico en coordinación con el departamento de la división de estudio profesionales, la cancelación de la residencia descrita y la autorización de un nuevo anteproyecto de residencia profesional para que pueda concluir su carrera satisfactoriamente.`, style: 'normal', bold: true },
                        { text: `\n\nEn base a lo antes expuesto y esperando contar con su apoyo para llevar a cabo la cancelación y asignación de residencia profesional, quedo de usted.`, style: 'normal' },
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: `Atentamente`,
                    style: 'normal'
                },
                {
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `\n\n       ${cancelacion.asesor_interno.titulo} ${cancelacion.asesor_interno.nombre} ${cancelacion.asesor_interno.ap_paterno} ${cancelacion.asesor_interno.ap_materno}       `, style: 'normal', decoration: 'overline' },
                        { text: '\n       Asesor interno       ', style: 'normal' }
                    ]

                }
            ],
            styles: {
                normal: {
                    fontSize: 12,
                    lineHeight: 1.5
                }
            }

        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarCartaLiberacionAsesorInterno: (proyecto, res) => {
        // console.log('ALV', proyecto.anteproyecto.periodo.carrera.departamento.docentes[0].nombre)
        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 80, 40, 100],
            content: [
                {
                    alignment: 'right',
                    width: '*',
                    text: `Chilpancingo, Gro., ${moment().format('LL')}.`,
                    style: 'normal'
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 50, 0, 0],
                    text: [
                        { text: `${proyecto.anteproyecto.periodo.carrera.departamento.docentes[0].titulo} ${proyecto.anteproyecto.periodo.carrera.departamento.docentes[0].nombre} ${proyecto.anteproyecto.periodo.carrera.departamento.docentes[0].ap_paterno} ${proyecto.anteproyecto.periodo.carrera.departamento.docentes[0].ap_materno}`.toUpperCase(), style: 'normal', bold: true },
                        { text: `\nJEFE DEL DEPARTAMENTO DE ${proyecto.anteproyecto.periodo.carrera.departamento.nombre}`.toUpperCase(), style: 'normal', bold: true },
                        { text: `\nINSTITUTO TECNOLÓGICO DE CHILPANCINGO\nPRESENTE`.toUpperCase(), style: 'normal', bold: true }
                    ]
                },
                {
                    alignment: 'justify',
                    width: '*',
                    margin: [0, 20, 0, 0],
                    text: [
                        { text: `Por este medio comunico a usted, que el Proyecto de Residencia Profesional denominado "${proyecto.anteproyecto.nombre}", realizado por ${proyecto.anteproyecto.alumno.sexo === 'H' ? 'el' : 'la'} estudiante ${proyecto.anteproyecto.alumno.nombre} ${proyecto.anteproyecto.alumno.ap_paterno} ${proyecto.anteproyecto.alumno.ap_materno} , No. control ${proyecto.anteproyecto.alumno.no_control}, del programa educativo de ${proyecto.anteproyecto.periodo.carrera.nombre}, del que fungí como Asesor interno; fue desarrollado en tiempo y forma de acuerdo a lo establecido en su programa de actividades.`, style: 'normal' },
                        { text: `\nPor lo anterior, una vez que ha sido revisado y avalado en informe técnico final del proyecto de residencia profesional mencionado, se da por concluido el proyecto quedando liberado ${proyecto.anteproyecto.alumno.sexo === 'H' ? 'el' : 'la'} estudiante que en el intervino.`, style: 'normal' },
                        { text: `\n\nSin otro particular por el momento, reciba un cordial saludo.`, style: 'normal' }
                    ]
                },
                {
                    alignment: 'center',
                    width: '*',
                    margin: [0, 20, 0, 0],
                    text: [
                        { text: 'Atentamente', style: 'normal' },
                        { text: `\n\n\n\n       ${proyecto.anteproyecto.asesor_interno.titulo} ${proyecto.anteproyecto.asesor_interno.nombre} ${proyecto.anteproyecto.asesor_interno.ap_paterno} ${proyecto.anteproyecto.asesor_interno.ap_materno}       `, style: 'normal', decoration: 'overline' },
                        { text: '\n       Asesor interno       ', style: 'normal' }
                    ]
                }
            ],
            styles: {
                normal: {
                    fontSize: 12,
                    lineHeight: 1.5
                }
            }
        }

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarCartaLiberacionAsesorExterno: (proyecto, depto_vinculacion, res) => {
        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 80, 40, 100],
            content: [
                {
                    alignment: 'right',
                    width: '*',
                    text: `Chilpancingo, Gro., ${moment().format('LL')}.`,
                    style: 'normal'
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 50, 0, 0],
                    text: [
                        { text: `${depto_vinculacion.docentes[0].titulo} ${depto_vinculacion.docentes[0].nombre} ${depto_vinculacion.docentes[0].ap_paterno} ${depto_vinculacion.docentes[0].ap_materno}`.toUpperCase(), style: 'normal', bold: true },
                        { text: `\nJEFE DEL DEPARTAMENTO DE GESTIÓN TECNOLÓGICA Y VINCULACIÓN`.toUpperCase(), style: 'normal', bold: true },
                        { text: `\nINSTITUTO TECNOLÓGICO DE CHILPANCINGO\nPRESENTE`.toUpperCase(), style: 'normal', bold: true }
                    ]
                },
                {
                    alignment: 'justify',
                    width: '*',
                    margin: [0, 50, 0, 0],
                    text: [
                        { text: `Por este condicto le comunico, que ${proyecto.anteproyecto.alumno.sexo === 'H' ? 'el' : 'la'} estudiante del programa educativo de ${proyecto.anteproyecto.periodo.carrera.nombre} del Instituto Tecnológico de Chilpancingo `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.nombre} ${proyecto.anteproyecto.alumno.ap_paterno} ${proyecto.anteproyecto.alumno.ap_materno} `, style: 'normal', bold: true },
                        { text: `No. de control `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.no_control}, `, style: 'normal', bold: true },
                        { text: `concluyo el Proyecto de Residencia Profesional denominado: `, style: 'normal' },
                        { text: `"${proyecto.anteproyecto.nombre}", `, style: 'normal', bold: true },
                        { text: `cubriendo un total de 500 horas, en el período comprendido del ${moment(proyecto.anteproyecto.periodo.fecha_inicio, 'YYYY-MM-DD').format('LL')} al ${moment(proyecto.anteproyecto.periodo.fecha_fin, 'YYYY-MM-DD').format('LL')}.`, style: 'normal' },
                        { text: `\n\n\nHago de su conocimiento lo anterior, una vez que se ha recibido de ${proyecto.anteproyecto.alumno.sexo === 'H' ? 'el' : 'la'} estudiante el Informe Técnico del Proyecto de Residencia Profesional, en esta institución en la que fungí como asesor de dicho proyecto.`, style: 'normal' },
                        { text: `\n\nSin mas por el momemento, reciba un cordial saludo.`, style: 'normal' }
                    ]
                },
                {
                    alignment: 'center',
                    width: '*',
                    margin: [0, 50, 0, 0],
                    text: [
                        { text: 'Atentamente', style: 'normal' },
                        { text: `\n\n\n\n    ${proyecto.anteproyecto.asesor_externo.nombre}    `, style: 'normal', decoration: 'overline' }
                    ]
                }
            ],
            styles: {
                normal: {
                    fontSize: 10,
                    lineHeight: 1.5
                }
            }
        }

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoEvaluacionAnexoIII: (proyecto, res) => {
        // evaluacion asesor externo
        var content_table = [];
        var calificacion_final = 0;
        proyecto.evaluacion_asesor_externo.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            content_table.push([
                { text: `${(index + 1)}.- ${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
        })
        content_table.unshift([{ text: 'Criterios a evaluar', style: 'normal', alignment: 'center', bold: true }, { text: 'A\nValor', style: 'normal', alignment: 'center' }, { text: 'B\nEvaluación', style: 'normal', alignment: 'center' }])
        content_table.unshift([{ fillColor: '#d7d9db', text: 'Evaluación asesor externo', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])
        content_table.unshift([{ text: 'En qué medida el Residente cumple con lo siguiente:', style: 'normal', alignment: 'center', bold: true, colSpan: 3 }, '', ''])
        content_table.push([{
            text: [
                { text: 'OBSERVACIONES:\n', style: 'normal', bold: true },
                { text: `${proyecto.evaluacion_asesor_externo.observaciones}`, style: 'normal', alignment: 'left' }
            ], colSpan: 3
        }, '', ''])

        // evaluacion asesor interno
        content_table.push([{ fillColor: '#d7d9db', text: 'Evaluación asesor interno', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])

        proyecto.evaluacion_asesor_interno.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            content_table.push([
                { text: `${(index + 1)}.- ${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
        })
        content_table.push([{
            text: [
                { text: 'OBSERVACIONES:\n', style: 'normal', bold: true },
                { text: `${proyecto.evaluacion_asesor_interno.observaciones}`, style: 'normal', alignment: 'left' }
            ], colSpan: 3
        }, '', ''])

        content_table.push([{ text: 'CALIFICACIÓN FINAL\n', style: 'normal', bold: true, colSpan: 2, alignment: 'center' }, '', { text: `${calificacion_final}`, style: 'normal', alignment: 'center' }])
        content_table.push([{
            text: [
                { text: 'NIVEL DE DESEMPEÑO:\n', style: 'normal', bold: true, alignment: 'center' },
                { text: `${nivelDeDesempenio(calificacion_final)}`, style: 'normal', alignment: 'center' }
            ], colSpan: 3
        }, '', ''])


        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 120, 40, 100],
            background: [
                {
                    margin: [0, 250, 0, 0],
                    image: __dirname + '/../public/img/escudo.png',
                    width: 400,
                    height: 400,
                    alignment: 'center'
                }
            ],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 70, alignment: 'left', }, { margin: [0, 25, 0, 0], alignment: 'right', text: [{ text: 'TECNOLÓGICO NACIONAL DE MEXICO\n', bold: true, style: 'header_tecnm' }, { text: 'Instituto Tecnológico de Chilpancingo', bold: true, style: 'header_itch' }] }],
                                    [{ text: '“2015, Año del Generalísimo José María Morelos y Pavón”', alignment: 'center', style: 'header_bottom', colSpan: 2 }]
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `Anexo III \n Formato de evaluación`
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Nombre del residente: `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.nombre}  ${proyecto.anteproyecto.alumno.ap_paterno}  ${proyecto.anteproyecto.alumno.ap_materno}`, style: 'normal', decoration: 'underline' },

                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Número de control: `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.no_control}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Nombre del proyecto: `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.nombre}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Carrera: `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.periodo.carrera.nombre}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Periodo de realización de la Residencia Profesional: `, style: 'normal' },
                        { text: `${proyecto.anteproyecto.periodo.periodo} ${proyecto.anteproyecto.periodo.ciclo}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: content_table
                    }
                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        alignment: 'center',
                        body: [
                            [{ alignment: 'center', style: 'normal', text: `           ${proyecto.anteproyecto.asesor_interno.titulo} ${proyecto.anteproyecto.asesor_interno.nombre} ${proyecto.anteproyecto.asesor_interno.ap_paterno} ${proyecto.anteproyecto.asesor_interno.ap_materno}           `, decoration: 'underline' }, { alignment: 'center', text: `           ${proyecto.anteproyecto.asesor_externo.nombre}           `, style: 'normal', decoration: 'underline' }],
                            [{ alignment: 'center', text: 'Nombre y firma del asesor interno', style: 'normal' }, { alignment: 'center', text: 'Nombre y firma del asesor externo', style: 'normal' }],
                        ]
                    },
                    layout: 'noBorders'
                },
            ],
            footer: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: [40, '*', 40, 40, 40],
                                body: [
                                    [
                                        { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 40 },
                                        {
                                            alignment: 'center', text: [
                                                { text: 'Av. José Francisco Ruíz Massieu No. 5, Colonia Villa Moderna, C.P.  39090 Chilpancingo, Guerrero.', style: 'footer_text' },
                                                { text: '\nTeléfono: (747) 48 01022, Tel/Fax: 47 2 10 14 ', style: 'footer_text' },
                                                { text: 'www.itchilpancingo.edu.mx', link: 'http://www.itchilpancingo.edu.mx', style: 'link_footer' },
                                                { text: ', email: ', style: 'footer_text' },
                                                { text: 'itchilpancingo@hotmail.com', style: 'link_footer' },
                                                { text: '\nFacebook: ', style: 'footer_text' },
                                                { text: 'Tecnológico de Chilpancingo Comunicación', link: 'https://www.facebook.com/Tecnológico-de-Chilpancingo-Comunicación-131577620223301/', decoration: 'underline', style: 'link_footer' }

                                            ]
                                        },
                                        { image: __dirname + '/../public/img/footer_2.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_3.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_4.png', width: 40, height: 40 },


                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            styles: {
                normal: {
                    fontSize: 10
                },
                header_tecnm: {
                    color: '#bababa',
                    fontSize: 12
                },
                header_itch: {
                    color: '#bababa',
                    fontSize: 11
                },
                header_bottom: {
                    color: '#bababa',
                    fontSize: 9
                },
                footer_text: {
                    color: '#bababa',
                    fontSize: 7.5
                },
                link_footer: {
                    color: '#0b24fb',
                    fontSize: 7.5
                }
            }
        };
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoDeEvaluacionDeResidenciaAnexoXXX: (proyecto, res) => {
        // evaluacion asesor externo
        var evaluacion_asesor_interno = [], evaluacion_asesor_externo = [];
        var calificacion_final = 0;
        var calificacion_total = 0;
        var promedio = 0;
        proyecto.evaluacion_asesor_externo.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            evaluacion_asesor_externo.push([
                { text: `${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_total += criterio_evaluacion.ref_criterio.valor_max;
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
        })
        evaluacion_asesor_externo.unshift([{ text: 'Criterios a evaluar', style: 'normal', alignment: 'center', bold: true }, { text: 'Valor', style: 'normal', alignment: 'center' }, { text: 'Evaluación', style: 'normal', alignment: 'center' }])
        evaluacion_asesor_externo.unshift([{ text: 'En qué medida el Residente cumple con lo siguiente', style: 'normal', alignment: 'center', bold: true, colSpan: 3 }, '', ''])
        evaluacion_asesor_externo.unshift([{ fillColor: '#d7d9db', text: 'Evaluación asesor externo', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])
        evaluacion_asesor_externo.push([{ text: 'Calificación total\n', style: 'normal', bold: true, alignment: 'right' }, { text: `${calificacion_total}`, style: 'normal', alignment: 'center' }, { text: `${calificacion_final}`, style: 'normal', alignment: 'center' }])
        // evaluacion asesor interno
        promedio += calificacion_final;
        calificacion_final = 0;
        calificacion_total = 0;
        evaluacion_asesor_interno.push([{ fillColor: '#d7d9db', text: 'Evaluación asesor interno', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])
        evaluacion_asesor_interno.push([{ text: 'En qué medida el Residente cumple con lo siguiente', style: 'normal', alignment: 'center', bold: true, colSpan: 3 }, '', ''])
        evaluacion_asesor_interno.push([{ text: 'Criterios a evaluar', style: 'normal', alignment: 'center', bold: true }, { text: 'Valor', style: 'normal', alignment: 'center' }, { text: 'Evaluación', style: 'normal', alignment: 'center' }]);

        proyecto.evaluacion_asesor_interno.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            evaluacion_asesor_interno.push([
                { text: `${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
            calificacion_total += criterio_evaluacion.ref_criterio.valor_max;
        })
        evaluacion_asesor_interno.push([{ text: 'Calificación total\n', style: 'normal', bold: true, alignment: 'right' }, { text: `${calificacion_total}`, style: 'normal', alignment: 'center' }, { text: `${calificacion_final}`, style: 'normal', alignment: 'center' }])
        promedio += calificacion_final;
        promedio = (promedio / 2);

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 110, 40, 80],
            background: [
                {
                    margin: [0, 250, 0, 0],
                    image: __dirname + '/../public/img/escudo.png',
                    width: 400,
                    height: 400,
                    alignment: 'center'
                }
            ],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 70, alignment: 'left', }, { margin: [0, 25, 0, 0], alignment: 'right', text: [{ text: 'TECNOLÓGICO NACIONAL DE MEXICO\n', bold: true, style: 'header_tecnm' }, { text: 'Instituto Tecnológico de Chilpancingo', bold: true, style: 'header_itch' }] }],
                                    [{ text: '“2015, Año del Generalísimo José María Morelos y Pavón”', alignment: 'center', style: 'header_bottom', colSpan: 2 }]
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `ANEXO XXX. FORMATO DE EVALUACIÓN DE REPORTE DE RESIDENCIA PROFESIONAL`,
                    style: '_normal'
                },
                {
                    margin: [0, 15, 0, 0],
                    columns: [
                        {
                            alignment: 'left',
                            width: '*',
                            text: [
                                { text: `Nombre del residente: `, style: '_normal', },
                                { text: `     ${proyecto.anteproyecto.alumno.nombre}  ${proyecto.anteproyecto.alumno.ap_paterno}  ${proyecto.anteproyecto.alumno.ap_materno}     `, style: '_normal', decoration: 'underline' },

                            ]
                        },
                        {
                            alignment: 'right',
                            width: '*',
                            text: [
                                { text: ` Número de control: `, style: '_normal' },
                                { text: `     ${proyecto.anteproyecto.alumno.no_control}     `, style: '_normal', decoration: 'underline' },
                            ]
                        }
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Programa educativo: `, style: '_normal' },
                        { text: `${proyecto.anteproyecto.periodo.carrera.nombre}`, style: '_normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Periodo de realización de la Residencia Profesional: `, style: '_normal' },
                        { text: `${proyecto.anteproyecto.periodo.periodo} ${proyecto.anteproyecto.periodo.ciclo}`, style: '_normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Calificación parcial (promedio de ambas evaluaciones): `, style: '_normal' },
                        { text: `${promedio}`, style: '_normal', decoration: 'underline' },
                    ]
                },
                {
                    margin: [0, 15, 0, 0],
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: evaluacion_asesor_externo
                    }
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 5, 0, 0],
                    text: [
                        { text: `Observaciones: `, style: 'normal', bold: true },
                        { text: `${proyecto.evaluacion_asesor_externo.observaciones}`, style: 'normal', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [{ text: [{ text: `\n   ${proyecto.anteproyecto.asesor_externo.nombre}    `, style: 'normal', decoration: 'underline' }, { text: `\nNombre y firma del asesor externo`, style: 'normal' }], style: 'normal', alignment: 'center' }, { text: `Sello de la empresa, organismo o dependencia`, style: 'normal', alignment: 'center' }, { text: `Fecha de evaluación\n ${moment(proyecto.evaluacion_asesor_externo.createdAt).utc().format('LL')}`, style: 'normal', alignment: 'center' }]
                        ]
                    }
                },
                {
                    margin: [0, 20, 0, 0],
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: evaluacion_asesor_interno
                    }
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Observaciones: `, style: 'normal', bold: true },
                        { text: `${proyecto.evaluacion_asesor_interno.observaciones}`, style: 'normal', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 15, 0, 0],
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [{ text: [{ text: `\n   ${proyecto.anteproyecto.asesor_interno.titulo} ${proyecto.anteproyecto.asesor_interno.nombre} ${proyecto.anteproyecto.asesor_interno.ap_paterno} ${proyecto.anteproyecto.asesor_interno.ap_materno}   `, style: 'normal', decoration: 'underline' }, { text: `\nNombre y firma del asesor interno`, style: 'normal' }], style: 'normal', alignment: 'center' }, { text: `Sello de la empresa, organismo o dependencia`, style: 'normal', alignment: 'center' }, { text: `Fecha de evaluación\n ${moment(proyecto.evaluacion_asesor_interno.createdAt).utc().format('LL')}`, style: 'normal', alignment: 'center' }]
                        ]
                    }
                }


            ],
            footer: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: [40, '*', 40, 40, 40],
                                body: [
                                    [
                                        { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 40 },
                                        {
                                            alignment: 'center', text: [
                                                { text: 'Av. José Francisco Ruíz Massieu No. 5, Colonia Villa Moderna, C.P.  39090 Chilpancingo, Guerrero.', style: 'footer_text' },
                                                { text: '\nTeléfono: (747) 48 01022, Tel/Fax: 47 2 10 14 ', style: 'footer_text' },
                                                { text: 'www.itchilpancingo.edu.mx', link: 'http://www.itchilpancingo.edu.mx', style: 'link_footer' },
                                                { text: ', email: ', style: 'footer_text' },
                                                { text: 'itchilpancingo@hotmail.com', style: 'link_footer' },
                                                { text: '\nFacebook: ', style: 'footer_text' },
                                                { text: 'Tecnológico de Chilpancingo Comunicación', link: 'https://www.facebook.com/Tecnológico-de-Chilpancingo-Comunicación-131577620223301/', decoration: 'underline', style: 'link_footer' }

                                            ]
                                        },
                                        { image: __dirname + '/../public/img/footer_2.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_3.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_4.png', width: 40, height: 40 },


                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            styles: {
                _normal: {
                    fontSize: 10
                },
                normal: {
                    fontSize: 8
                },
                header_tecnm: {
                    color: '#bababa',
                    fontSize: 12
                },
                header_itch: {
                    color: '#bababa',
                    fontSize: 11
                },
                header_bottom: {
                    color: '#bababa',
                    fontSize: 9
                },
                footer_text: {
                    color: '#bababa',
                    fontSize: 7.5
                },
                link_footer: {
                    color: '#0b24fb',
                    fontSize: 7.5
                }
            }

        }

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoEvaluacionDeSeguimientoAnexoXXIX: (seguimiento, res) => {
        // evaluacion asesor externo
        var evaluacion_asesor_interno = [], evaluacion_asesor_externo = [];
        var calificacion_final = 0;
        var calificacion_total = 0;
        var promedio = 0;
        seguimiento.evaluacion_asesor_externo.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            evaluacion_asesor_externo.push([
                { text: `${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_total += criterio_evaluacion.ref_criterio.valor_max;
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
        })
        evaluacion_asesor_externo.unshift([{ text: 'Criterios a evaluar', style: 'normal', alignment: 'center', bold: true }, { text: 'Valor', style: 'normal', alignment: 'center' }, { text: 'Evaluación', style: 'normal', alignment: 'center' }])
        evaluacion_asesor_externo.unshift([{ text: 'En qué medida el Residente cumple con lo siguiente', style: 'normal', alignment: 'center', bold: true, colSpan: 3 }, '', ''])
        evaluacion_asesor_externo.unshift([{ fillColor: '#d7d9db', text: 'Evaluación asesor externo', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])
        evaluacion_asesor_externo.push([{ text: 'Calificación total\n', style: 'normal', bold: true, alignment: 'right' }, { text: `${calificacion_total}`, style: 'normal', alignment: 'center' }, { text: `${calificacion_final}`, style: 'normal', alignment: 'center' }])

        // evaluacion asesor interno
        promedio += calificacion_final;
        calificacion_final = 0;
        calificacion_total = 0;
        evaluacion_asesor_interno.push([{ fillColor: '#d7d9db', text: 'Evaluación asesor interno', style: 'normal', bold: true, alignment: 'center', colSpan: 3 }, '', ''])
        evaluacion_asesor_interno.push([{ text: 'En qué medida el Residente cumple con lo siguiente', style: 'normal', alignment: 'center', bold: true, colSpan: 3 }, '', ''])
        evaluacion_asesor_interno.push([{ text: 'Criterios a evaluar', style: 'normal', alignment: 'center', bold: true }, { text: 'Valor', style: 'normal', alignment: 'center' }, { text: 'Evaluación', style: 'normal', alignment: 'center' }]);

        seguimiento.evaluacion_asesor_interno.criterios_de_evaluacion.map((criterio_evaluacion, index) => {
            evaluacion_asesor_interno.push([
                { text: `${criterio_evaluacion.ref_criterio.descripcion}`, style: 'normal', alignment: 'left' },
                { text: `${criterio_evaluacion.ref_criterio.valor_max}`, style: 'normal', alignment: 'center' },
                { text: `${criterio_evaluacion.valor_de_evaluacion}`, style: 'normal', alignment: 'center' }
            ])
            calificacion_final += criterio_evaluacion.valor_de_evaluacion;
            calificacion_total += criterio_evaluacion.ref_criterio.valor_max;
        })
        evaluacion_asesor_interno.push([{ text: 'Calificación total\n', style: 'normal', bold: true, alignment: 'right' }, { text: `${calificacion_total}`, style: 'normal', alignment: 'center' }, { text: `${calificacion_final}`, style: 'normal', alignment: 'center' }])
        promedio += calificacion_final;
        promedio = (promedio / 2);

        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 110, 40, 80],
            background: [
                {
                    margin: [0, 250, 0, 0],
                    image: __dirname + '/../public/img/escudo.png',
                    width: 400,
                    height: 400,
                    alignment: 'center'
                }
            ],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 70, alignment: 'left', }, { margin: [0, 25, 0, 0], alignment: 'right', text: [{ text: 'TECNOLÓGICO NACIONAL DE MEXICO\n', bold: true, style: 'header_tecnm' }, { text: 'Instituto Tecnológico de Chilpancingo', bold: true, style: 'header_itch' }] }],
                                    [{ text: '“2015, Año del Generalísimo José María Morelos y Pavón”', alignment: 'center', style: 'header_bottom', colSpan: 2 }]
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `ANEXO XXIX. FORMATO DE EVALUACIÓN Y SEGUIMIENTO DE RESIDENCIA PROFESIONAL`,
                    style: 'normal'
                },
                {
                    width: '*',
                    margin: [0, 15, 0, 0],
                    columns: [
                        {
                            alignment: 'left',
                            text: [
                                { text: `Nombre del residente: `, style: 'normal' },
                                { text: `    ${seguimiento.proyecto.anteproyecto.alumno.nombre}  ${seguimiento.proyecto.anteproyecto.alumno.ap_paterno}  ${seguimiento.proyecto.anteproyecto.alumno.ap_materno}    `, style: 'normal', decoration: 'underline' },

                            ]
                        },
                        {
                            alignment: 'right',
                            text: [
                                { text: ` Número de control: `, style: 'normal' },
                                { text: `   ${seguimiento.proyecto.anteproyecto.alumno.no_control}   `, style: 'normal', decoration: 'underline' },

                            ]
                        },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Nombre del proyecto: `, style: 'normal' },
                        { text: `${seguimiento.proyecto.anteproyecto.nombre}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Programa educativo: `, style: 'normal' },
                        { text: `${seguimiento.proyecto.anteproyecto.periodo.carrera.nombre}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Periodo de realización de la Residencia Profesional: `, style: 'normal' },
                        { text: `${seguimiento.proyecto.anteproyecto.periodo.periodo} ${seguimiento.proyecto.anteproyecto.periodo.ciclo}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Calificación parcial (promedio de ambas evaluaciones): `, style: 'normal' },
                        { text: `${promedio}`, style: 'normal', decoration: 'underline' },
                    ]
                },
                {
                    margin: [0, 15, 0, 0],
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: evaluacion_asesor_externo
                    }
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 5, 0, 0],
                    text: [
                        { text: `Observaciones: `, style: 'normal', bold: true },
                        { text: `${seguimiento.evaluacion_asesor_externo.observaciones}`, style: 'normal', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [{ text: [{ text: `\n   ${seguimiento.proyecto.anteproyecto.asesor_externo.nombre}    `, style: 'normal', decoration: 'underline' }, { text: `\nNombre y firma del asesor externo`, style: 'normal' }], style: 'normal', alignment: 'center' }, { text: `Sello de la empresa, organismo o dependencia`, style: 'normal', alignment: 'center' }, { text: `Fecha de evaluación\n ${moment(seguimiento.evaluacion_asesor_externo.createdAt).utc().format('LL')}`, style: 'normal', alignment: 'center' }]
                        ]
                    }
                },
                {
                    margin: [0, 20, 0, 0],
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        body: evaluacion_asesor_interno
                    }
                },
                {
                    alignment: 'left',
                    width: '*',
                    margin: [0, 10, 0, 0],
                    text: [
                        { text: `Observaciones: `, style: 'normal', bold: true },
                        { text: `${seguimiento.evaluacion_asesor_interno.observaciones}`, style: 'normal', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 15, 0, 0],
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [{ text: [{ text: `\n   ${seguimiento.proyecto.anteproyecto.asesor_interno.titulo} ${seguimiento.proyecto.anteproyecto.asesor_interno.nombre} ${seguimiento.proyecto.anteproyecto.asesor_interno.ap_paterno} ${seguimiento.proyecto.anteproyecto.asesor_interno.ap_materno}   `, style: 'normal', decoration: 'underline' }, { text: `\nNombre y firma del asesor interno`, style: 'normal' }], style: 'normal', alignment: 'center' }, { text: `Sello de la empresa, organismo o dependencia`, style: 'normal', alignment: 'center' }, { text: `Fecha de evaluación\n ${moment(seguimiento.evaluacion_asesor_interno.createdAt).utc().format('LL')}`, style: 'normal', alignment: 'center' }]
                        ]
                    }
                }
            ],
            footer: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: [40, '*', 40, 40, 40],
                                body: [
                                    [
                                        { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 40 },
                                        {
                                            alignment: 'center', text: [
                                                { text: 'Av. José Francisco Ruíz Massieu No. 5, Colonia Villa Moderna, C.P.  39090 Chilpancingo, Guerrero.', style: 'footer_text' },
                                                { text: '\nTeléfono: (747) 48 01022, Tel/Fax: 47 2 10 14 ', style: 'footer_text' },
                                                { text: 'www.itchilpancingo.edu.mx', link: 'http://www.itchilpancingo.edu.mx', style: 'link_footer' },
                                                { text: ', email: ', style: 'footer_text' },
                                                { text: 'itchilpancingo@hotmail.com', style: 'link_footer' },
                                                { text: '\nFacebook: ', style: 'footer_text' },
                                                { text: 'Tecnológico de Chilpancingo Comunicación', link: 'https://www.facebook.com/Tecnológico-de-Chilpancingo-Comunicación-131577620223301/', decoration: 'underline', style: 'link_footer' }

                                            ]
                                        },
                                        { image: __dirname + '/../public/img/footer_2.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_3.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_4.png', width: 40, height: 40 },


                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            styles: {
                normal: {
                    fontSize: 8
                },
                header_tecnm: {
                    color: '#bababa',
                    fontSize: 12
                },
                header_itch: {
                    color: '#bababa',
                    fontSize: 11
                },
                header_bottom: {
                    color: '#bababa',
                    fontSize: 9
                },
                footer_text: {
                    color: '#bababa',
                    fontSize: 7.5
                },
                link_footer: {
                    color: '#0b24fb',
                    fontSize: 7.5
                }
            }
        };
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoAsesoria: (asesoria, res) => {
        var asesor_interno = `      ${asesoria.proyecto.anteproyecto.asesor_interno.titulo} ${asesoria.proyecto.anteproyecto.asesor_interno.nombre} ${asesoria.proyecto.anteproyecto.asesor_interno.ap_materno} ${asesoria.proyecto.anteproyecto.asesor_interno.ap_materno}      `;
        var residente = `      ${asesoria.proyecto.anteproyecto.alumno.nombre} ${asesoria.proyecto.anteproyecto.alumno.ap_paterno} ${asesoria.proyecto.anteproyecto.alumno.ap_materno}      `;
        var docDefinition = {
            background: [
                {
                    margin: [0, 250, 0, 0],
                    image: __dirname + '/../public/img/escudo.png',
                    width: 400,
                    height: 400,
                    alignment: 'center'
                }
            ],
            pageSize: 'A4',
            pageMargins: [40, 150, 40, 100],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 70, alignment: 'left', }, { margin: [0, 25, 0, 0], alignment: 'right', text: [{ text: 'TECNOLÓGICO NACIONAL DE MEXICO\n', bold: true, style: 'header_tecnm' }, { text: 'Instituto Tecnológico de Chilpancingo', bold: true, style: 'header_itch' }] }],
                                    [{ text: '“2015, Año del Generalísimo José María Morelos y Pavón”', alignment: 'center', style: 'header_bottom', colSpan: 2 }]
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            footer: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: [40, '*', 40, 40, 40],
                                body: [
                                    [
                                        { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 40 },
                                        {
                                            alignment: 'center', text: [
                                                { text: 'Av. José Francisco Ruíz Massieu No. 5, Colonia Villa Moderna, C.P.  39090 Chilpancingo, Guerrero.', style: 'footer_text' },
                                                { text: '\nTeléfono: (747) 48 01022, Tel/Fax: 47 2 10 14 ', style: 'footer_text' },
                                                { text: 'www.itchilpancingo.edu.mx', link: 'http://www.itchilpancingo.edu.mx', style: 'link_footer' },
                                                { text: ', email: ', style: 'footer_text' },
                                                { text: 'itchilpancingo@hotmail.com', style: 'link_footer' },
                                                { text: '\nFacebook: ', style: 'footer_text' },
                                                { text: 'Tecnológico de Chilpancingo Comunicación', link: 'https://www.facebook.com/Tecnológico-de-Chilpancingo-Comunicación-131577620223301/', decoration: 'underline', style: 'link_footer' }

                                            ]
                                        },
                                        { image: __dirname + '/../public/img/footer_2.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_3.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_4.png', width: 40, height: 40 },


                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `Anexo V \n Formato de registro de asesoría`
                },
                {
                    margin: [0, 50, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: `Chilpancingo, Guerrero. A ${moment(asesoria.fecha, 'YYYY-MM-DD').format('LL')}`,
                    decoration: 'underline',
                    style: 'normal'
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Departamento Académico: ', style: 'normal' },
                        { text: asesoria.proyecto.anteproyecto.periodo.carrera.departamento.nombre, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Nombre del Residente: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.alumno.nombre} ${asesoria.proyecto.anteproyecto.alumno.ap_paterno} ${asesoria.proyecto.anteproyecto.alumno.ap_materno} `, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'justify',
                    width: '*',
                    text: [
                        { text: 'Número de Control: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.alumno.no_control}`, style: 'normal', decoration: 'underline' },
                        { text: ' Carrera: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.periodo.carrera.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Nombre del Proyecto: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Periodo de realización de residencia profesional: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.periodo.periodo} ${asesoria.proyecto.anteproyecto.periodo.ciclo}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Empresa, organismo o dependencia: ', style: 'normal' },
                        { text: `${asesoria.proyecto.anteproyecto.asesor_externo.empresa.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Asesoría número: ', style: 'normal' },
                        { text: `${asesoria.id}`, style: 'normal', decoration: 'underline' },
                        { text: ' Tipo de asesoría: ', style: 'normal' },
                        { text: `${asesoria.tipo}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Temas a asesorar: ', style: 'normal' },
                        { text: `${asesoria.temas_a_asesorar}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Solución recomendada: ', style: 'normal' },
                        { text: `${asesoria.soluciones_recomendadas.map(solucion => `${solucion.solucion} `)}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 100, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        alignment: 'center',
                        body: [
                            [{ alignment: 'center', style: 'normal', text: asesor_interno, decoration: 'overline' }, { alignment: 'center', text: residente, style: 'normal', decoration: 'overline' }],
                            [{ alignment: 'center', text: 'Asesor interno', style: 'normal' }, { alignment: 'center', text: 'Residente', style: 'normal' }],
                        ]
                    },
                    layout: 'noBorders'
                },


            ],
            styles: {
                normal: {
                    fontSize: 11.5
                },
                header_tecnm: {
                    color: '#bababa',
                    fontSize: 12
                },
                header_itch: {
                    color: '#bababa',
                    fontSize: 11
                },
                header_bottom: {
                    color: '#bababa',
                    fontSize: 9
                },
                footer_text: {
                    color: '#bababa',
                    fontSize: 7.5
                },
                link_footer: {
                    color: '#0b24fb',
                    fontSize: 7.5
                }
            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarDictamen: (periodo, subdirector) => {

        var content_table = periodo.anteproyectos.map((anteproyecto, index) => {
            return [
                { text: `${(index + 1)}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.no_control}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.nombre} ${anteproyecto.alumno.ap_paterno} ${anteproyecto.alumno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.alumno.sexo}`, style: 'row_table' },
                { text: `${anteproyecto.nombre}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_externo.empresa.titular.nombre} \n ${anteproyecto.asesor_externo.empresa.titular.puesto}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_interno.titulo} ${anteproyecto.asesor_interno.nombre} ${anteproyecto.asesor_interno.ap_paterno} ${anteproyecto.asesor_interno.ap_materno}`, style: 'row_table' },
                { text: `${anteproyecto.asesor_externo.nombre}`, style: 'row_table' },
                { text: `${anteproyecto.dictamen.toUpperCase()}`, style: 'row_table' },
                { text: `${moment(anteproyecto.updatedAt, "YYYY-MM-DD HH:mm:ss").format('DD-MMMM-YYYY')}`, style: 'row_table' }
            ]
        });
        content_table.unshift(['', '', '', '', '', '', { text: 'INTERNO', alignment: 'center', style: 'header_table' }, { text: 'EXTERNO', alignment: 'center', style: 'header_table' }, '', ''])
        content_table.unshift([{ text: 'NUM.', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'CONTROL', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'NOMBRE DEL ESTUDIANTE', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'S', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'ANTEPROYECTO', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'NOMBRE Y CARGO DEL TITULAR DE LA EMPRESA', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'ASESOR', alignment: 'center', colSpan: 2, style: 'header_table' }, '', { text: 'DICTAMEN', alignment: 'center', rowSpan: 2, style: 'header_table' }, { text: 'FECHA DE DICTAMEN', alignment: 'center', rowSpan: 2, style: 'header_table' }])


        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: [100, '*', '*', 100],
                                body: [
                                    [{ image: __dirname + '/../public/img/tecnologicos.png', width: 80, height: 45, alignment: 'center', rowSpan: 2 }, { text: 'Dictamen de Anteproyecto de Residencias Profesionales', style: 'titulo', alignment: 'center', bold: true, colSpan: 2 }, '', { image: __dirname + '/../public/img/tec_Logo.png', width: 45, height: 45, alignment: 'center', rowSpan: 2 }],
                                    ['', { text: 'Referencia a la Norma ISO 9001:2008  7.5.1', alignment: 'center', colSpan: 2, style: 'subtitulo' }, '', ''],
                                    [{ text: 'Revisión 2', alignment: 'center', style: 'min' }, { text: 'Código: ITCHILPO-AC-PO-007-04', alignment: 'center', bold: true, style: 'min' }, { text: 'Fecha de aplicación: 16-junio-2011', alignment: 'center', style: 'min' }, { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', style: 'min' }]
                                ]
                            }
                        }

                    ]
                }

            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `INSTITUTO TECNOLÓGICO DE CHILPANCINGO \n DEPARTAMENTO DE ${periodo.carrera.departamento.nombre.toUpperCase()}`
                },
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    margin: [0, 10, 0, 20],
                    text: 'DICTAMEN DE ANTEPROYECTOS DE RESIDENCIAS PROFESIONALES'
                }, {
                    alignment: 'justify',
                    margin: [20, 0, 20, 20],
                    columns: [
                        {
                            margin: [0, 22, 0, 0],
                            text: [
                                { text: 'CARRERA: ', bold: true },
                                { text: `${periodo.carrera.nombre.toUpperCase()}`, bold: true, decoration: 'underline' }
                            ],
                        },
                        {
                            margin: [180, 0, 0, 0],
                            table: {
                                widths: 'auto',
                                body: [
                                    [{ text: 'SEMESTRE', bold: true, alignment: 'center', rowSpan: 2 }, { text: 'FEB-JUN', alignment: 'center', fillColor: (periodo.periodo === 'FEBRERO-JUNIO') ? '#d7d9db' : '' }, { text: (periodo.periodo === 'FEBRERO-JUNIO') ? 'X' : '', alignment: 'center', fillColor: (periodo.periodo === 'FEBRERO-JUNIO') ? '#d7d9db' : '' }],
                                    ['', { text: 'AGO-DIC', alignment: 'center', fillColor: (periodo.periodo === 'AGOSTO-DICIEMBRE') ? '#d7d9db' : '' }, { text: (periodo.periodo === 'AGOSTO-DICIEMBRE') ? 'X' : '', alignment: 'center', fillColor: (periodo.periodo === 'AGOSTO-DICIEMBRE') ? '#d7d9db' : '' }]

                                ]
                            }
                        },
                    ]
                },
                {
                    table: {
                        headerRows: 2,
                        widths: [30, 50, 70, 5, '*', 70, 70, 70, 70, 70],
                        body: content_table
                    }
                },
                {
                    margin: [0, 50, 0, 0],
                    columns: [
                        {
                            text: [
                                { text: (periodo.carrera.docentes_carreras) ? `${periodo.carrera.docentes_carreras[0].docente.titulo} ${periodo.carrera.docentes_carreras[0].docente.nombre} ${periodo.carrera.docentes_carreras[0].docente.ap_paterno} ${periodo.carrera.docentes_carreras[0].docente.ap_materno}` : '', style: 'firma', bold: true },
                                { text: '\nNOMBRE Y FIRMA DEL PRESIDENTE DE ACADEMIA', style: 'firma' }
                            ]
                        },
                        {
                            text: [
                                { text: (periodo.carrera.departamento.docentes) ? `${periodo.carrera.departamento.docentes[0].titulo} ${periodo.carrera.departamento.docentes[0].nombre} ${periodo.carrera.departamento.docentes[0].ap_materno} ${periodo.carrera.departamento.docentes[0].ap_paterno}` : '', style: 'firma', bold: true },
                                { text: '\nNOMBRE Y FIRMA DEL JEFE DEL DEPTO. ACADEMICO', style: 'firma' }
                            ]
                        },
                        {
                            text: [
                                { text: (subdirector) ? `${subdirector.titulo} ${subdirector.nombre} ${subdirector.ap_materno} ${subdirector.ap_paterno}` : '', style: 'firma', bold: true },
                                { text: '\nNOMBRE Y FIRMA DEL SUBDIRECTOR ACADEMICO \nVo. Bo.', style: 'firma' }
                            ]
                        }
                    ]
                }

            ],
            styles: {
                titulo: {
                    fontSize: 12,
                },
                subititulo: {
                    fontSize: 10,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(`storeFiles/dictamenes/${periodo.id}-${periodo.periodo}-${periodo.ciclo}.pdf`));
        pdfDoc.end();
    },
    generarPlanDeTrabajo: (proyecto, plan, res) => {
        //console.log("respuetsa"+res)
        //console.log("Proyecto"+JSON.stringify(proyecto))
        //console.log("Proyecto"+JSON.stringify(plan))
        var actividades_generales = [];
        var subactividades = [];
        var tareas = [];
        var horas=0;

        plan.map((actividad_general, index) => {
            actividades_generales.push([{ text: '-', fillColor: '#dedede' }, { text: '-', fillColor: '#dedede', }, { text: '-', fillColor: '#dedede', }, { text: '-', fillColor: '#dedede', }, { text: '-', fillColor: '#dedede', }]);

            actividades_generales.push([{ text: "Actividad general: ", alignment: 'left', style: 'header_bottom', bold: true }
                , { text: actividad_general.id_orden + ".- " + actividad_general.actividad, alignment: 'left', style: 'header_bottom', colSpan: 4 },]
            );
            actividades_generales.push([{ text: "Objetivo: ", alignment: 'left', style: 'header_bottom', bold: true },
            { text: actividad_general.objetivo, alignment: 'left', style: 'header_bottom', colSpan: 4 }]
            );
            actividades_generales.push([{ text: "Entregable: ", alignment: 'left', style: 'header_bottom', bold: true },
            { text: actividad_general.entregable, alignment: 'left', style: 'header_bottom', colSpan: 4 }]
            );


            actividades_generales.push([{ text: "Subactividades", alignment: 'left', style: 'header_bottom', bold: true, colSpan: 5 }]
            );
            actividades_generales.push([{ text: "Subactividad (s)", alignment: 'left', style: 'header_bottom', bold: true },
            { text: "Tarea (s)", alignment: 'left', style: 'header_bottom', bold: true },
            { text: "Horas", alignment: 'left', style: 'header_bottom', bold: true },
            { text: "Entregable", alignment: 'left', style: 'header_bottom', bold: true },
            { text: "Fecha entrega", alignment: 'left', style: 'header_bottom', bold: true }]
            );

            actividad_general.subactividades.map((subactividad, index) => {
                var row = [];
                var numRow = 0;
                
                subactividad.tareas.map((tarea, index) => {
                    row.push({ text: tarea.id_orden + ".- " + tarea.tarea, alignment: 'left', style: 'header_bottom' }, { text: tarea.horas, alignment: 'left', style: 'header_bottom', }, { text: tarea.entregable, alignment: 'left', style: 'header_bottom', }, { text: tarea.fecha_entrega, alignment: 'left', style: 'header_bottom', }
                    )
                    numRow += 1
                    horas+=tarea.horas;
                })
                console.log(subactividad.id_orden + " " + subactividad.actividad + "---------------------------numrow---------------" + numRow)

                if (numRow === 0) {
                    //entra a esta opcion si subactividad no tiene ninguna tarea  asignada
                    actividades_generales.push([{ text: subactividad.id_orden + ".- " + subactividad.actividad, alignment: 'left', style: 'header_bottom' }, { text: "Ups no tiene tareas asignadas revisar plan de trabajo en el sistema", alignment: 'left', style: 'header_bottom', colSpan: 4 }]);
                } else if (numRow === 1) {
                    //entra a esta opcion si la subactividad tienen solo una tarea asignada
                    row.unshift({ text: subactividad.id_orden + ".- " + subactividad.actividad, alignment: 'left', style: 'header_bottom' });
                    actividades_generales.push(row);
                } else if (numRow > 1) {

                    //entra en esta opcion si la subactividad tiene mas de una tareas asignada   
                    row.unshift({ text: subactividad.id_orden + ".- " + subactividad.actividad, alignment: 'left', style: 'header_bottom', rowSpan: numRow });
                    actividades_generales.push([row[0], row[1], row[2], row[3], row[4]]);
                    var contador = 1;
                    var num = 4;
                    while (contador != numRow) {
                        var primero = [];
                        primero.push({}, row[num + 1], row[num + 2], row[num + 3], row[num + 4])
                        actividades_generales.push(primero);
                        contador++
                        num += 4;
                    }

                }
            })
        })
        actividades_generales.push([{ text: "Total de horas: ", alignment: 'left', style: 'header_bottom', bold: true },
            { text: horas, alignment: 'left', style: 'header_bottom', colSpan: 4 }]
            );
        var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 125, 40, 50],
            header: () => {
                return {
                    margin: [40, 45, 40, 20],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: 'TECNOLÓGICO NACIONAL DE MÉXICO\n', style: 'titulo', bold: true },
                        { text: 'INSTITUTO TECNOLÓGICO DE CHILPANCINGO', style: 'titulo', bold: true },

                    ]

                }

            },
            content: [
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'center',
                    width: '*',
                    text: [
                        { text: `Periodo: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.periodo.periodo, style: 'subtitulo' },
                        { text: `         Año: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.periodo.ciclo, style: 'subtitulo' }

                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Nombre del proyecto: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.nombre, style: 'subtitulo' },
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Objetivo general del proyecto: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.objetivo_general, style: 'subtitulo' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Nombre del residente: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno, style: 'subtitulo' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Nombre del asesor interno: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_interno.titulo + " " + proyecto.anteproyecto.asesor_interno.nombre + " " + proyecto.anteproyecto.asesor_interno.ap_paterno + " " + proyecto.anteproyecto.asesor_interno.ap_materno, style: 'subtitulo' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Nombre del asesor externo: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_externo.nombre, style: 'subtitulo' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Empresa: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_externo.empresa.nombre, style: 'subtitulo' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    table: {
                        style: 'row_table',
                        width: '*',
                        headerRows: 0,
                        body: actividades_generales
                    }
                }, {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `Lugar y Fecha: Chilpancingo Gro. A  ` + `${moment().format('LL')} `, style: 'subtitulo', },
                    ]
                },
                {
                    margin: [0, 30, 0, 0],
                    table: {
                        widths: ['*', '*', '*'],
                        alignment: 'center',
                        body: [
                            [{ alignment: 'center', style: 'firma', text: proyecto.anteproyecto.asesor_interno.titulo + " " + proyecto.anteproyecto.asesor_interno.nombre + " " + proyecto.anteproyecto.asesor_interno.ap_paterno + " " + proyecto.anteproyecto.asesor_interno.ap_materno, decoration: 'underline' },
                            { alignment: 'center', text: proyecto.anteproyecto.asesor_externo.nombre, style: 'firma', decoration: 'underline' },
                            { alignment: 'center', style: 'firma', text: proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno, decoration: 'underline' }
                            ],
                            [{ alignment: 'center', text: 'Asesor Interno', style: 'firma' },
                            { alignment: 'center', text: 'Asesor Externo', style: 'firma' },
                            { alignment: 'center', text: 'Residente', style: 'firma' }],
                        ]
                    },
                    layout: 'noBorders'
                },


            ],
            styles: {
                titulo: {
                    fontSize: 16,
                },
                titulo_nombre: {
                    fontSize: 13,
                },
                subtitulo: {
                    fontSize: 12,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                },
                relleno: {
                    fontSize: 12
                },




            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },

    generarCronograma: (proyecto, plan, res) => {

        var tablaCronograma = []
        var tem = []
        var contador = 1;
        var nombreJefeDepartamento;
        tem.push({ text: "ACTIVIDAD", style: 'row_table' }, {})
        while (contador != 21) {
            tem.push({ text: contador, style: 'row_table' })
            contador++
        }
        tablaCronograma.push(tem)
        let contadorSeguimientos = 1;
        var seguimientos = new Array();
        proyecto.anteproyecto.periodo.seguimientos.map((seguimiento) => {
            seguimientos.push(seguimiento.fecha_inicial)

        })
        var contadorSemanas = 1;
        var fechaSemanaComparar = 0;
        plan.map((actividad_general) => {

            actividad_general.subactividades.map((subactividad) => {
                subactividad.tareas.map((tarea) => {
                    var tem = []
                    tem.push({ text: tarea.id_orden + ".-" + tarea.tarea, style: 'row_table', rowSpan: 2 }, { text: "P", style: 'row_table' })
                    if (tarea.fecha_entrega > fechaSemanaComparar) {
                        contadorSemanas++
                    }

                    if (tarea.fecha_entrega <= seguimientos[0]) {
                        //primer seguimiento
                        var contador = 1;
                        while (contador != 21) {
                            if (contadorSemanas == contador) {
                                tem.push({ text: " ", fillColor: "#FFFF00", style: 'row_table' })
                            } else {
                                tem.push({ text: " ", style: 'row_table' })
                            }
                            contador++
                        }

                        tablaCronograma.push(tem)
                        var tem2 = []
                        var contador = 1;
                        tem2.push({ text: " ", style: 'row_table' }, { text: "R", style: 'row_table' })
                        while (contador != 21) {
                            tem2.push({ text: " ", style: 'row_table' })
                            contador++
                        }

                        tablaCronograma.push(tem2)

                    } else if (tarea.fecha_entrega > seguimientos[0] && tarea.fecha_entrega <= seguimientos[1]) {
                        //segundo seguimiento

                        var contador = 1;
                        while (contador != 21) {
                            if (contadorSemanas == contador) {
                                tem.push({ text: " ", fillColor: "#088A08", style: 'row_table' })
                            } else {
                                tem.push({ text: " ", style: 'row_table' })
                            }
                            contador++
                        }

                        tablaCronograma.push(tem)
                        var tem2 = []
                        var contador = 1;
                        tem2.push({ text: " ", style: 'row_table' }, { text: "R", style: 'row_table' })
                        while (contador != 21) {
                            tem2.push({ text: " ", style: 'row_table' })
                            contador++
                        }

                        tablaCronograma.push(tem2)


                    } else if (tarea.fecha_entrega > seguimientos[1]) {
                        //tercer  seguimiento

                        var contador = 1;
                        while (contador != 21) {
                            if (contadorSemanas == contador) {
                                tem.push({ text: " ", fillColor: "#0404B4", style: 'row_table' })

                            } else {
                                tem.push({ text: " ", style: 'row_table' })

                            }
                            contador++
                        }

                        tablaCronograma.push(tem)
                        var tem2 = []
                        var contador = 1;
                        tem2.push({ text: " ", style: 'row_table' }, { text: "R", style: 'row_table' })
                        while (contador != 21) {
                            tem2.push({ text: " ", style: 'row_table' })
                            contador++
                        }

                        tablaCronograma.push(tem2)


                    }

                    fechaSemanaComparar = tarea.fecha_entrega
                })
            })
        })

        proyecto.anteproyecto.periodo.carrera.departamento.docentes.map((docente) => {
            nombreJefeDepartamento = docente.titulo + " " + docente.nombre + " " + docente.ap_paterno + " " + docente.ap_paterno

        })

        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 100, 40, 60],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 20],
                    columns: [
                        {
                            table: {
                                widths: [100, '*', '*', 100],
                                body: [
                                    [{ image: __dirname + '/../public/img/tecnologicos.png', width: 80, height: 45, alignment: 'center', rowSpan: 2 }, { text: 'SEGUIMIENTO DE PROYECTO DE RESIDENCIAS PROFESIONALES', style: 'titulo', alignment: 'center', bold: true, colSpan: 2 }, '', { image: __dirname + '/../public/img/tec_Logo.png', width: 45, height: 45, alignment: 'center', rowSpan: 2 }],
                                    ['', { text: 'Referencia a la Norma ISO 9001:2008  7.5.1', alignment: 'center', colSpan: 2, style: 'subtitulo' }, '', ''],
                                    [{ text: 'Revisión 2', alignment: 'center', style: 'min' }, { text: 'Código: ITCHILPO-AC-PO-007-04', alignment: 'center', bold: true, style: 'min' }, { text: 'Fecha de aplicación: 16-junio-2011', alignment: 'center', style: 'min' }, { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', style: 'min' }]
                                ]
                            }
                        }

                    ]
                }

            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `INSTITUTO TECNOLÓGICO DE CHILPANCINGO \n SUBDIRECCIÓN ACADÉMICA \n DEPARTAMENTO DE ${proyecto.anteproyecto.periodo.carrera.departamento.nombre.toUpperCase()}`
                },
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    margin: [0, 10, 0, 20],
                    text: 'SEGUIMIENTO DE PROYECTO DE RESIDENCIAS PROFESIONALES'
                },
                {
                    table: {
                        headerRows: 0,
                        body: [
                            [{ alignment: 'left', style: 'subtitulo', text: "ESTUDIANTE: ", bold: true }, { alignment: 'left', style: 'subtitulo', text: proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno, decoration: 'underline' },
                            { alignment: 'left', style: 'subtitulo', text: "No. DE CONTROL: ", bold: true }, { alignment: 'left', text: proyecto.anteproyecto.alumno.no_control, style: 'subtitulo', decoration: 'underline' },
                            ]

                        ]
                    }, layout: 'noBorders'
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `NOMBRE DEL PROYECTO: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.nombre, style: 'subtitulo', decoration: 'underline' },
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `EMPRESA: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_externo.empresa.nombre, style: 'subtitulo', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `ASESOR EXTERNO: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_externo.nombre, style: 'subtitulo', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `ASESOR INTERNO: `, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.asesor_interno.titulo + " " + proyecto.anteproyecto.asesor_interno.nombre + " " + proyecto.anteproyecto.asesor_interno.ap_paterno + " " + proyecto.anteproyecto.asesor_interno.ap_materno, style: 'subtitulo', decoration: 'underline' }
                    ]
                },
                {
                    margin: [0, 10, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: `PERIODO  DE REALIZACIÓN:`, style: 'subtitulo', bold: true },
                        { text: proyecto.anteproyecto.periodo.periodo, style: 'subtitulo', decoration: 'underline' },
                    ]
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    table: {
                        headerRows: 0,
                        widths: [300, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                        body: tablaCronograma

                    }
                },
                {

                    alignment: 'left',
                    table: {
                        widths: [300, '*', '*', '*', '*', '*'],
                        headerRows: 0,
                        body: [
                           
                        [{ text: "Observaciones", style: 'subititulo' }, {}, {}, {}, {}, {}],
                        [{ text: proyecto.anteproyecto.asesor_interno.titulo + " " + proyecto.anteproyecto.asesor_interno.nombre + " " + proyecto.anteproyecto.asesor_interno.ap_paterno + " " + proyecto.anteproyecto.asesor_interno.ap_materno + "\nAsesor interno", style: 'subtitulo' }, {}, {}, {}, {}, {}],
                        [{ text: proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno + "\nEstudiante", style: 'subititulo' }, {}, {}, {}, {}, {}],
                        [{ text: nombreJefeDepartamento + "\nJefe Depto.", style: 'subititulo' }, {}, {}, {}, {}, {}]
                        ]

                    }
                }


            ],
            styles: {
                titulo: {
                    fontSize: 12,
                },
                subititulo: {
                    fontSize: 10,
                },
                min: {
                    fontSize: 9
                },
                header_table: {
                    fontSize: 10,
                    bold: true
                },
                row_table: {
                    fontSize: 9,
                    alignment: 'center'
                },
                firma: {
                    fontSize: 10,
                    color: '#505962',
                    alignment: 'center'
                }


            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },
    generarFormatoRevisionSemanal: (proyecto, numero_semana, plan, res) => {
        let tareas = []
        let observaciones = []

        plan.map((actividad) => {
            actividad.subactividades.map((subactividad) => {
                subactividad.tareas.map((tarea) => {
                    // se obtiene la diferencia de dias
                    let fecha_actual = moment(moment().format('YYYY-MM-DD'))
                    let operacionFechas = moment(tarea.updatedAt).diff(fecha_actual, 'days')

                    if (operacionFechas >= 0 && operacionFechas < 6) {
                        tareas.push({
                            tarea: tarea.tarea,
                            id_orden: tarea.id_orden,
                            fecha_entrega: tarea.fecha_entrega
                        })
                    }
                    tarea.observaciones.map((observacion) => {
                        if (observacion.tipo_observacion === "revision_semanal" && observacion.estado === false) {
                            observaciones.push({
                                observacion: observacion.observacion,
                                estado: observacion.estado,
                                tarea: tarea.tarea,
                                id_orden_tarea: tarea.id_orden
                            })
                        }

                    })
                })
            })
        })
        // se filtran las observaciones
        observaciones = observaciones.filter((observacion) => !observacion.estado);



        var docDefinition = {
            background: [
                {
                    margin: [0, 250, 0, 0],
                    image: __dirname + '/../public/img/escudo.png',
                    width: 400,
                    height: 400,
                    alignment: 'center'
                }
            ],
            pageSize: 'A4',
            pageMargins: [40, 150, 40, 100],
            header: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: ['*', '*'],
                                body: [
                                    [{ image: __dirname + '/../public/img/sep-tec.png', width: 200, height: 70, alignment: 'left', }, { margin: [0, 25, 0, 0], alignment: 'right', text: [{ text: 'TECNOLÓGICO NACIONAL DE MEXICO\n', bold: true, style: 'header_tecnm' }, { text: 'Instituto Tecnológico de Chilpancingo', bold: true, style: 'header_itch' }] }],
                                    [{ text: '“2015, Año del Generalísimo José María Morelos y Pavón”', alignment: 'center', style: 'header_bottom', colSpan: 2 }]
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            footer: (currentPage, pageCount) => {
                return {
                    margin: [40, 20, 40, 0],
                    alignment: 'justify',
                    columns: [
                        {
                            table: {
                                widths: [40, '*', 40, 40, 40],
                                body: [
                                    [
                                        { image: __dirname + '/../public/img/tec_Logo.png', width: 40, height: 40 },
                                        {
                                            alignment: 'center', text: [
                                                { text: 'Av. José Francisco Ruíz Massieu No. 5, Colonia Villa Moderna, C.P.  39090 Chilpancingo, Guerrero.', style: 'footer_text' },
                                                { text: '\nTeléfono: (747) 48 01022, Tel/Fax: 47 2 10 14 ', style: 'footer_text' },
                                                { text: 'www.itchilpancingo.edu.mx', link: 'http://www.itchilpancingo.edu.mx', style: 'link_footer' },
                                                { text: ', email: ', style: 'footer_text' },
                                                { text: 'itchilpancingo@hotmail.com', style: 'link_footer' },
                                                { text: '\nFacebook: ', style: 'footer_text' },
                                                { text: 'Tecnológico de Chilpancingo Comunicación', link: 'https://www.facebook.com/Tecnológico-de-Chilpancingo-Comunicación-131577620223301/', decoration: 'underline', style: 'link_footer' }

                                            ]
                                        },
                                        { image: __dirname + '/../public/img/footer_2.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_3.png', width: 40, height: 40 },
                                        { image: __dirname + '/../public/img/footer_4.png', width: 40, height: 40 },


                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }


                    ]
                }
            },
            content: [
                {
                    alignment: 'center',
                    width: '*',
                    bold: true,
                    text: `Anexo V \n Formato de registro de asesoría`
                },
                {
                    margin: [0, 50, 0, 0],
                    alignment: 'right',
                    width: '*',
                    text: `Chilpancingo, Guerrero. A ${moment().format('LL')}`,
                    decoration: 'underline',
                    style: 'normal'
                },
                {
                    margin: [0, 20, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Departamento Académico: ', style: 'normal' },
                        { text: proyecto.anteproyecto.periodo.carrera.departamento.nombre.toUpperCase(), style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Nombre del Residente: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.nombre} ${proyecto.anteproyecto.alumno.ap_paterno} ${proyecto.anteproyecto.alumno.ap_materno} `, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'justify',
                    width: '*',
                    text: [
                        { text: 'Número de Control: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.alumno.no_control}`, style: 'normal', decoration: 'underline' },
                        { text: ' Carrera: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.periodo.carrera.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Nombre del Proyecto: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Periodo de realización de residencia profesional: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.periodo.periodo} ${proyecto.anteproyecto.periodo.ciclo}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Empresa, organismo o dependencia: ', style: 'normal' },
                        { text: `${proyecto.anteproyecto.asesor_externo.empresa.nombre}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Asesoría número: ', style: 'normal' },
                        { text: numero_semana, style: 'normal', decoration: 'underline' },
                        { text: ' Tipo de asesoría: ', style: 'normal' },
                        { text: "Ordinaria", style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Temas a asesorar: ', style: 'normal' },
                        { text: `${tareas.map(tarea => `${tarea.fecha_entrega + ": " + tarea.id_orden + ".-" + tarea.tarea + "\n"} `)}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 15, 0, 0],
                    alignment: 'left',
                    width: '*',
                    text: [
                        { text: 'Solución recomendada: ', style: 'normal' },
                        { text: `${observaciones.map(observacion => `${observacion.id_orden_tarea + ".-" + observacion.observacion} ` + "\n")}`, style: 'normal', decoration: 'underline' },
                    ],
                },
                {
                    margin: [0, 100, 0, 0],
                    table: {
                        widths: ['*', '*'],
                        alignment: 'center',
                        body: [
                            [{ alignment: 'center', style: 'normal', text: proyecto.anteproyecto.asesor_interno.titulo + " " + proyecto.anteproyecto.asesor_interno.nombre + " " + proyecto.anteproyecto.asesor_interno.ap_paterno + " " + proyecto.anteproyecto.asesor_interno.ap_materno, decoration: 'overline' },
                            { alignment: 'center', text: proyecto.anteproyecto.alumno.nombre + " " + proyecto.anteproyecto.alumno.ap_paterno + " " + proyecto.anteproyecto.alumno.ap_materno, style: 'normal', decoration: 'overline' }],
                            [{ alignment: 'center', text: 'Asesor interno', style: 'normal' }, { alignment: 'center', text: 'Residente', style: 'normal' }],
                        ]
                    },
                    layout: 'noBorders'
                },


            ],
            styles: {
                normal: {
                    fontSize: 11.5
                },
                header_tecnm: {
                    color: '#bababa',
                    fontSize: 12
                },
                header_itch: {
                    color: '#bababa',
                    fontSize: 11
                },
                header_bottom: {
                    color: '#bababa',
                    fontSize: 9
                },
                footer_text: {
                    color: '#bababa',
                    fontSize: 7.5
                },
                link_footer: {
                    color: '#0b24fb',
                    fontSize: 7.5
                }
            }
        }
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    },


}
