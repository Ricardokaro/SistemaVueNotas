<template >
  <v-container grid-list-md text-xs-center class="pa-4 white">
    <v-layout row wrap>
      <v-flex xs6 sm6 md6>
        <v-select
          :items="anioescolares"
          v-model="idanio_escolar"
          @change="ListarCursos"
          label="Anio escolar"
        ></v-select>
      </v-flex>
      <v-flex v-show="cursos.length > 0" xs6 sm6 md6>
        <v-select :items="cursos" v-model="idcurso" @change="listaMaterias" label="Cursos"></v-select>
      </v-flex>
      <v-flex v-show="materias.length > 0" xs6 sm6 md6>
        <v-select
          :items="materias"
          v-model="idmateria"
          @change="listaCalificaciones"
          label="Materias"
        ></v-select>
      </v-flex>

      <!--<v-flex xs6 sm6 md6> 
            <v-select            
              :items="estudiantes"
              v-model="idestudiante" 
              @change="listaCalificaciones"             
              label="Estudiantes"
            ></v-select>
      </v-flex>-->
      <v-flex xs12 sm12 md12>
        <v-toolbar flat color="white">
          <v-btn @click="mostrarInforme()"><v-icon>print</v-icon></v-btn>
          <v-toolbar-title>Informe de Calificaciones</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            class="text-xs-center"
            v-model="search"
            append-icon="search"
            label="Búsqueda"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="informeModal">
            <v-card>
              <v-card-text>
                <v-btn>
                  <v-icon>print</v-icon>
                </v-btn>
                <div id="informe">
                  <header>
                    <div id="logoColegio">
                      <img src="data:image/jpeg;base64,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" id="imagen" />
                    </div>
                    <div id="datos">
                      <p id="encabezado">
                        <b>REPÚBLICA DE COLOMBIA</b>
                        <br/>
                        <b>DEPARTAMENTO DEL MAGDALENA</b>
                        <br />
                        <b>INSTITUCIÓN EDUCATIVA TÉCNICA DEPARTAMENTAL DE NUEVA GRANADA</b>
                        <br />
                        <b>Creado por Decreto N° 405 de Noviembre 15 de 2002</b>
                        <br />
                        <b>Aprobado por Resolución N° 072 de Febrero 3 de 2014</b> 
                        <br />
                        <b>Nueva Granada Magdalena</b>
                        <br/>
                        <b>DANE: 247460002471 - NIT: 819001275-4</b>
                      </p>
                    </div>
                    <div id="logoPais">
                      <img src="data:image/jpeg;base64,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" id="imagen">
                    </div>
                  </header>
                  <br/>
                  <section>
                    <div>
                      <table id="facliente">
                        <tbody>
                          <tr>
                            <td id="cliente">
                              <strong>Docente: </strong> {{ this.$store.state.usuario.nombre }}
                              <br /> 
                              <strong>Materia: </strong> {{ this.nombreMateriaModal }}
                              <br />
                              <strong>Curso: </strong> {{  }}                             
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <br/>
                  <section>
                    <div>
                      <table id="facarticulo">
                        <thead>
                          <tr id="fa">
                            <th>ESTUDIANTE</th>
                            <th>1P</th>
                            <th>25%</th>
                            <th>2P</th>
                            <th>25%</th>
                            <th>3P</th>
                            <th>25%</th>
                            <th>4P</th>
                            <th>25%</th>
                            <th>ACUMULADO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="text-align:center;">Karina lopez cardona</td>
                            <td style="text-align:center;">10</td>
                            <td style="text-align:center;">2,5</td>
                            <td style="text-align:center;">10</td>
                            <td style="text-align:center;">2,5</td>
                            <td style="text-align:center;">10</td>
                            <td style="text-align:center;">2,5</td>
                            <td style="text-align:center;">10</td>
                            <td style="text-align:center;">2,5</td>
                            <td style="text-align:center;">10</td>
                          </tr>
                        </tbody>                        
                      </table>
                    </div>
                  </section>
                  <br/>
                  <br/>
                  <footer>
                    <div id="gracias">
                      <p>
                        <b>Gracias por su compra!</b>
                      </p>
                    </div>
                  </footer>
                </div>
                <v-btn flat @click="ocultarInforme()">Cancelar</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="calificaciones"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td class="text-md-left">{{ props.item.estudiante }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[0] !== 'undefined'"
              class="text-md-left"
            >{{ props.item.listadoCalificaciones[0].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[0] !== 'undefined'"
              class="text-md-left"
            >{{ (props.item.listadoCalificaciones[0].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[0].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[1] !== 'undefined'"
              class="text-md-left"
            >{{ props.item.listadoCalificaciones[1].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[1] !== 'undefined'"
              class="text-md-left"
            >{{ (props.item.listadoCalificaciones[1].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[1].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[2] !== 'undefined'"
              class="text-md-left"
            >{{ props.item.listadoCalificaciones[2].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[2] !== 'undefined'"
              class="text-md-left"
            >{{ (props.item.listadoCalificaciones[2].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[2].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[3] !== 'undefined'"
              class="text-md-left"
            >{{ props.item.listadoCalificaciones[3].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td
              v-if="typeof props.item.listadoCalificaciones[3] !== 'undefined'"
              class="text-md-left"
            >{{ (props.item.listadoCalificaciones[3].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[3].calificacion }}</td>
            <td v-else class="text-md-left">{{ 0 }}</td>
            <td>{{ mostrarAcumulado(props.item.listadoCalificaciones) }}</td>
          </template>
          <template v-slot:no-data>
            <v-btn color="danger">Resetear</v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from "axios";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      calificaciones: [],
      anioescolares: [],
      idanio_escolar: "",
      cursos: [],
      idcurso: "",      
      idestudiante: "",
      estudiantes: [],
      dialog: false,
      headers: [
        { text: "Estudiante", value: "estudiante" },
        { text: "1°P", value: "periodo1" },
        { text: "25%", value: "ponderado1" },
        { text: "2°P", value: "periodo2" },
        { text: "25%", value: "ponderado2" },
        { text: "3°P", value: "periodo3" },
        { text: "25%", value: "ponderado3" },
        { text: "4°P", value: "periodo4" },
        { text: "25%", value: "ponderado4" },
        { text: "Acumulado", value: "acumulado" }
      ],
      search: "",
      editedIndex: -1,
      id: "",
      idmateria: "",
      materias: [],      
      idperiodo: "",
      periodos: [],
      calificacion: "",
      observacion: "",
      intensidad_horaria: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      informeModal: 0
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Carga Academica"
        : "Editar Carga Academica";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listarAnioEscolar();
  },
  methods: {

    mostrarInforme(){
      this.informeModal = 1;
      this.nombreMateriaModal = this.seleccionarMateria()
    },

    ocultarInforme(){
      this.informeModal = 0;
    },

    listarAnioEscolar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuration = { headers: header };
      var anioescolarArray = [];
      axios
        .get("api/Anioescolares/Select", configuration)
        .then(function(response) {
          anioescolarArray = response.data;
          console.log(anioescolarArray);
          anioescolarArray.map(function(x) {
            me.anioescolares.push({ text: x.nombre, value: x.idanio_escolar });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    ListarCursos() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuration = { headers: header };
      this.cursos = [];
      this.idcurso = "";
      this.materias = [];
      this.idmateria = "";
      this.calificaciones = [];
      var cursosArray = [];
      axios
        .post(
          "api/Cursoxmateriaxdocentes/ListarCursosDocente",
          {
            idanio_escolar: me.idanio_escolar,
            iddocente: me.$store.state.usuario.idusuario
          },
          configuration
        )
        .then(function(response) {
          cursosArray = response.data;
          console.log(cursosArray);
          cursosArray.map(function(x) {
            me.cursos.push({ text: x.curso, value: x.idcurso });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    listaMaterias() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuration = { headers: header };
      this.materias = [];
      this.idmateria = "";
      this.calificaciones = [];
      var meteriasArray = [];
      axios
        .post(
          "api/Cursoxmateriaxdocentes/ListarMateriaDocente",
          {
            idanio_escolar: this.idanio_escolar,
            idcurso: this.idcurso,
            iddocente: this.$store.state.usuario.idusuario
          },
          configuration
        )
        .then(function(response) {
          meteriasArray = response.data;
          console.log(meteriasArray);
          meteriasArray.map(function(x) {
            me.materias.push({ text: x.nombre, value: x.idmateria });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    seleccionarMateria(){
      let me = this
      if(typeof me.materias.nombre != 'undefined'){
        var materia = me.materias.find(m => m.idmateria === me.idmateria) 
        return materia.nombre
      }
      return ' '
    },

    listaCalificaciones() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuration = { headers: header };
      axios
        .post(
          "api/Calificaciones/Listar",
          {
            idanio_escolar: me.idanio_escolar,
            idcurso: me.idcurso,
            idmateria: me.idmateria,
            iddocente: this.$store.state.usuario.idusuario
          },
          configuration
        )
        .then(function(response) {
          me.calificaciones = response.data;
          console.log(me.calificaciones);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    mostrarAcumulado() {},

    close() {
      this.dialog = false;
      this.limpiar();
    },

    limpiar() {
      this.id = "";
      this.iddocente = "";
      this.idmateria = "";
      this.intensidad_horaria = "";
      this.editedIndex = -1;
    },

    mostrarAcumulado(calificaciones) {
      var acumulado = 0;
      if (calificaciones.length > 0) {
        for (let j = 0; j < calificaciones.length; j++) {
          acumulado +=
            (calificaciones[j].periodoescolar.porcentaje / 100) *
            calificaciones[j].calificacion;
        }
      }
      return acumulado;
    }
  }
};
</script>
<style>
	    #informe {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logoColegio {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
        #imagen {
            width: 100px;
        }

        #logoPais {
           float: right;
           margin-left: 2%;
           margin-right: 2%;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 2%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
        }

        #facarticulo thead {
            padding: 20px;
            background: #2183E3;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
    </style>


