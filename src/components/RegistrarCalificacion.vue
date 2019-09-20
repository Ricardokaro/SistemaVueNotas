<template >   
  <v-container grid-list-md text-xs-center class="pa-4 white"> 
    <v-layout row  wrap>
      <v-flex xs6 sm6 md6>       
            <v-select
              :items="anioescolares"
              v-model="idanio_escolar"
              @change="ListarCursosDocente"
              label="Anio escolar"
            ></v-select>
      </v-flex> 
      <v-flex v-show = "cursos.length > 0" xs6 sm6 md6> 
            <v-select            
              :items="cursos"
              v-model="idcurso" 
              @change="listarMateriaDocente"             
              label="Curso"
            ></v-select>
      </v-flex> 
      <v-flex v-show = "materias.length > 0" xs6 sm6 md6> 
            <v-select            
              :items="materias"
              v-model="idmateria" 
              @change="listaPeridoEscolar"             
              label="Materia"
            ></v-select>
      </v-flex>    
      <v-flex v-show = "periodos.length > 0" xs6 sm6 md6> 
            <v-select            
              :items="periodos"
              v-model="idperiodo"
              @change="listarEstudiantesSinCalificacion"              
              label="Perio Escolar"
            ></v-select>
      </v-flex>    
      <v-flex xs12 sm12 md12>      
        <v-toolbar flat color="white">        
          <v-toolbar-title>Calificar Estudiantes</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>               
        </v-toolbar>
        <v-data-table :headers="headers" :items="estudiantes" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-md-left">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>            
            </td>
            <td class="text-md-left">{{ props.item.estudiante }}</td>
            <td class="text-md-left"> 
              <v-text-field
                type ="number"
                v-model="props.item.calificacion"
                label="Calificacion"                
              ></v-text-field> 
            </td>          
            <td class="text-md-left">
              <v-text-field
                v-model="props.item.observacion"
                label="Observacion"                
              ></v-text-field> 
            </td>
            <td class="text-md-left">
              <div v-if="props.item.estado == 'Matriculado'">
                <span class="blue--text">Matriculado</span>
              </div>
              <div v-else>
                <span class="red--text">No Matriculado</span>
              </div>                         
            </td>
            <td class="text-md-center">
                <v-btn color="success" @click="calificarItem(props.item)">Calificar</v-btn>        
            </td>                                     
          </template>
          <template v-slot:no-data>
            <v-btn color="danger" >Resetear</v-btn>
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
              estudiantes: [],
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                 
                  { text: 'Estdiante', value: 'estudiante' },
                  { text: 'Calificacion', value: 'calificacion' },
                  { text: 'Observacion', value: 'observacion', sortable: false },
                  { text: 'Estado', value: 'estado', sortable: false },
                  { text: 'Accion', value: 'accion', sortable: false }                 
              ],
              search: '',              
              editedIndex: -1,             
              id: '',
              idmateria: '',
              materias: [],
              idperiodo: '',
              periodos: [],
              idestudiante:'',
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
          },

          mostrarBotonAsignar(){
            var mostrar = true;
            if(this.idanio_escolar.length == 0 || this.idcurso.length == 0){
              mostrar = false;
            }
            return mostrar;
          },

          desabilitarMateria(){
            var mostrar = false;
            if(this.editedIndex === -1){
               mostrar = true; 
            }
            return mostrar;
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
            let me=this;
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

          ListarCursosDocente(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            me.cursos = [];
            me.materias=[];
            me.periodos=[];
            var cursosArray = [];         
            axios.post('api/Cursoxmateriaxdocentes/ListarCursosDocente', {
              'idanio_escolar': me.idanio_escolar,
              'iddocente': this.$store.state.usuario.idusuario 
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

          listarMateriaDocente(){
            if(this.idcurso > 0){
              let me=this;            
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              me.materias = [];
              me.idperiodo = ''; 
              me.estudiantes = [];             
              var materiasArray = [];
              axios.post('api/Cursoxmateriaxdocentes/ListarMateriaDocente',{
                'idanio_escolar': me.idanio_escolar,
                'idcurso': me.idcurso,
                'iddocente': this.$store.state.usuario.idusuario
              }, configuration).then(function(response){                
                  materiasArray = response.data;
                  console.log(materiasArray);
                  materiasArray.map(function(x){
                      me.materias.push({ text: x.nombre, value: x.idmateria })
                  });
              }).catch(function(error){
                  console.log(error);
              });
            }
          },

          listaPeridoEscolar(){
            if(this.idanio_escolar > 0){
              let me=this;            
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              me.periodos = [];
              var periodosArray = [];
              axios.post('api/Periodoescolares/ListarPeriodoxAnio',{
                'idanio_escolar': me.idanio_escolar,
                'idcurso': me.idcurso,
                'idmateria': me.idmateria                
              }, configuration).then(function(response){                
                  periodosArray = response.data;
                  console.log(periodosArray);
                  periodosArray.map(function(x){
                      me.periodos.push({ text: x.nombre, value: x.idperiodo })
                  });
              }).catch(function(error){
                  console.log(error);
              });
            }

          },

          listarEstudiantesSinCalificacion(){
            let me=this;            
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};
            me.estudiantes = [];
            axios.post('api/Aniocursados/ListarEstudiantesSinCalificacion', {
              'idanio_escolar': me.idanio_escolar,             
              'idcurso': me.idcurso,
              'idmateria': me.idmateria,
              'idperiodo': me.idperiodo             
            },configuration).then(function(response){               
               me.estudiantes = response.data;
               console.log(response.data);               
            }).catch(function(error){
                console.log(error);
            });
          },
          
          editItem (item) {
              this.id = item.id;
              this.iddocente = item.iddocente;
              this.idmateria = item.idmateria;   
              this.intensidad_horaria = item.intensidad_horaria;        
              this.editedIndex = 1;  
              this.dialog = true
          },
          
          calificarItem(item){
              this.idestudiante = item.idestudiante,
              this.calificacion = item.calificacion,
              this.observacion = item.observacion
              this.guardar();
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

          guardar () {
              /*if(this.validar()){
                return;    
              }*/
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              if (this.editedIndex > -1) {
                  //codigo para editar                  
                   let me = this;                                  
                   axios.put('api/Cursoxmateriaxdocentes/Actualizar',{
                   'id': me.id,
                   'iddocente': me.iddocente,
                   'intensidad_horaria': me.intensidad_horaria                  
                 },configuration).then(function(response){
                    me.close();
                    me.listarMateriaDocentexCursoxAnioescolar();
                    me.limpiar();                                      
                 }).catch(function(error){
                    console.log(error);
                 });

              } else {
                 //codigo para guardar
                 let me = this;                
                 axios.post('api/Calificaciones/Crear',{
                   'idanio_escolar': me.idanio_escolar,
                   'idcurso': me.idcurso,
                   'idmateria': me.idmateria,
                   'idperiodo': me.idperiodo,
                   'idestudiante': me.idestudiante,
                   'calificacion': me.calificacion,
                   'observacion': me.observacion
                 },configuration).then(function(response){
                    //me.close();
                    //me.listarMateriaDocentexCursoxAnioescolar();
                    me.listarEstudiantesSinCalificacion();
                    console.log("todo salio Bien");                    
                 }).catch(function(error){
                    console.log(error);
                 });
              }            
          },        
          
          validar(){
              let me = this;
              me.valida = 0;              
              me.validaMensaje = [];              
              
              if(this.editedIndex < 1){
                
                me.cursoxmateriaxdocentes.map(function(x){
                  if(x.idmateria == me.idmateria){                    
                    me.validaMensaje.push("-> La materia ya ha Sido asignada a este curso");
                  }
                });

                if(me.idmateria == null || me.idmateria.length == 0){
                  me.validaMensaje.push("-> Debe asignar una materia al curso");
                }
              }              

              if(me.iddocente == null || me.iddocente.length == 0){
                me.validaMensaje.push("-> Debe asignar un docente al curso");
              }            

              if(me.intensidad_horaria == null || me.intensidad_horaria.length==0){
                me.validaMensaje.push("-> Debe Agregar intensidad horaria");
              }             

              if(me.validaMensaje.length){
                  me.valida = 1;                
              }
              return me.valida;
          }          
      }
  }
</script>



