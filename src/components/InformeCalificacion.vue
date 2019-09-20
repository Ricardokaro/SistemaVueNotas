<template >   
  <v-container grid-list-md text-xs-center class="pa-4 white"> 
    <v-layout row  wrap>
      <v-flex xs6 sm6 md6>       
            <v-select
              :items="anioescolares"
              v-model="idanio_escolar"
              @change="ListarCursos"
              label="Anio escolar"
            ></v-select>
      </v-flex> 
      <v-flex v-show = "cursos.length > 0" xs6 sm6 md6> 
            <v-select            
              :items="cursos"
              v-model="idcurso" 
              @change="listaMaterias"             
              label="Cursos"
            ></v-select>
      </v-flex>
      <v-flex v-show = "materias.length > 0" xs6 sm6 md6> 
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
          <v-toolbar-title>Informe de Calificaciones</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>               
        </v-toolbar>
        <v-data-table :headers="headers" :items="calificaciones" :search="search" class="elevation-1">
          <template v-slot:items="props">
              <td class="text-md-left">
                {{ props.item.estudiante }}
              </td>
                <td v-if="typeof props.item.listadoCalificaciones[0] !== 'undefined'" class="text-md-left" >
                  {{ props.item.listadoCalificaciones[0].calificacion }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>              
                <td v-if="typeof props.item.listadoCalificaciones[0] !== 'undefined'" class="text-md-left">
                  {{ (props.item.listadoCalificaciones[0].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[0].calificacion  }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>
                <td v-if="typeof props.item.listadoCalificaciones[1] !== 'undefined'" class="text-md-left" >
                  {{ props.item.listadoCalificaciones[1].calificacion }}
                </td> 
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>             
                <td v-if="typeof props.item.listadoCalificaciones[1] !== 'undefined'" class="text-md-left">
                  {{ (props.item.listadoCalificaciones[1].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[1].calificacion  }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>
                <td v-if="typeof props.item.listadoCalificaciones[2] !== 'undefined'" class="text-md-left" >
                  {{ props.item.listadoCalificaciones[2].calificacion }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>              
                <td v-if="typeof props.item.listadoCalificaciones[2] !== 'undefined'" class="text-md-left">
                  {{ (props.item.listadoCalificaciones[2].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[2].calificacion  }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>        
                <td v-if="typeof props.item.listadoCalificaciones[3] !== 'undefined'" class="text-md-left" >
                  {{ props.item.listadoCalificaciones[3].calificacion }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>              
                <td v-if="typeof props.item.listadoCalificaciones[3] !== 'undefined'" class="text-md-left">
                  {{ (props.item.listadoCalificaciones[3].periodoescolar.porcentaje/100) * props.item.listadoCalificaciones[3].calificacion  }}
                </td>
                <td v-else class="text-md-left" >
                  {{ 0 }}
                </td>
                <td>
                  {{ mostrarAcumulado(props.item.listadoCalificaciones) }}
                </td>  
                     
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
  export default {             
      data(){
          return{
              calificaciones:[],
              anioescolares: [],
              idanio_escolar: '',
              cursos: [],
              idcurso: '',
              idestudiante:'',
              estudiantes: [],
              dialog: false,
              headers: [
                  { text: 'Estudiante', value: 'estudiante' },                  
                  { text: '1°P', value: 'periodo1' },
                  { text: '25%', value: 'ponderado1' },                  
                  { text: '2°P', value: 'periodo2' },
                  { text: '25%', value: 'ponderado2' },                  
                  { text: '3°P', value: 'periodo3' },
                  { text: '25%', value: 'ponderado3' },                  
                  { text: '4°P', value: 'periodo4' },
                  { text: '25%', value: 'ponderado4' },                  
                  { text: 'Acumulado', value: 'acumulado' }                 
              ],
              search: '',              
              editedIndex: -1,             
              id: '',
              idmateria: '',
              materias: [],
              idperiodo: '',
              periodos: [],              
              calificacion: '',
              observacion: '',
              intensidad_horaria: '',             
              valida: 0,
              validaMensaje: [],
              adModal: 0,
              adAccion: 0,
              adNombre: '',
              adId: ''
          }
      },
      computed: {
          formTitle () {
              return this.editedIndex === -1 ? 'Nueva Carga Academica' : 'Editar Carga Academica'
          }    
      },

      watch: {
          dialog (val) {
              val || this.close()
          }
      },

      created () {          
          this.listarAnioEscolar();
      },
      methods:{ 
          listarAnioEscolar(){
            let me = this;            
            let header = { "Authorization" : "Bearer " + this.$store.state.token };
            let configuration = {headers : header};             
            var anioescolarArray = [];         
            axios.get('api/Anioescolares/Select', configuration).then(function(response){               
               anioescolarArray = response.data;
               console.log(anioescolarArray);
               anioescolarArray.map(function(x){
                   me.anioescolares.push({ text: x.nombre, value: x.idanio_escolar })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          ListarCursos(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            this.cursos=[];
            this.idcurso='';
            this.materias=[];
            this.idmateria='';
            this.calificaciones=[];
            var cursosArray = [];         
            axios.post('api/Cursoxmateriaxdocentes/ListarCursosDocente',{
              'idanio_escolar': me.idanio_escolar,
              'iddocente': me.$store.state.usuario.idusuario
            },configuration).then(function(response){               
               cursosArray = response.data;
               console.log(cursosArray);
               cursosArray.map(function(x){
                   me.cursos.push({ text: x.curso, value: x.idcurso })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          listaMaterias(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};
            this.materias=[]; 
            this.idmateria='';
            this.calificaciones=[];
            var meteriasArray = [];         
            axios.post('api/Cursoxmateriaxdocentes/ListarMateriaDocente',{
              'idanio_escolar': this.idanio_escolar,
              'idcurso': this.idcurso,
              'iddocente': this.$store.state.usuario.idusuario
            },configuration).then(function(response){               
               meteriasArray = response.data;
               console.log(meteriasArray);
               meteriasArray.map(function(x){
                   me.materias.push({ text: x.nombre, value: x.idmateria })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },        

          listaCalificaciones(){            
              let me=this;            
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              axios.post('api/Calificaciones/Listar',{
                'idanio_escolar': me.idanio_escolar,
                'idcurso': me.idcurso,
                'idmateria': me.idmateria,
                'iddocente' : this.$store.state.usuario.idusuario                
              }, configuration).then(function(response){                
                  me.calificaciones = response.data;                    
                  console.log(me.calificaciones);
              }).catch(function(error){
                  console.log(error);
              });
          },

          mostrarAcumulado(){

          },

          close () {
              this.dialog = false;             
              this.limpiar();
          },

          limpiar(){
              this.id="";
              this.iddocente="";
              this.idmateria= "";
              this.intensidad_horaria= "";              
              this.editedIndex=-1;
          },
          
          mostrarAcumulado(calificaciones){              
             var acumulado = 0;
              if(calificaciones.length > 0){                               
                  for (let j = 0; j < calificaciones.length; j++) {                    
                    acumulado += (calificaciones[j].periodoescolar.porcentaje/100)*calificaciones[j].calificacion;                    
                  }
              }              
              return acumulado;
          }   
      }
  }
</script>



