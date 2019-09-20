<template >   
  <v-container grid-list-md text-xs-center class="pa-4 white"> 
    <v-layout row  wrap>
      <v-flex xs6 sm6 md6>       
            <v-select
              :items="anioescolares"
              v-model="idanio_escolar"
              @change="listarMateriaDocentexCursoxAnioescolar"
              label="Anio escolar"
            ></v-select>
      </v-flex> 
      <v-flex xs6 sm6 md6> 
            <v-select            
              :items="cursos"
              v-model="idcurso"
              @change="listarMateriaDocentexCursoxAnioescolar"
              label="Curso"
            ></v-select>
      </v-flex>    
      <v-flex xs12 sm12 md12>      
        <v-toolbar flat color="white">        
          <v-toolbar-title>Asignar carga academica</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn v-show="mostrarBotonAsignar" color="primary" dark class="mb-2" v-on="on">Asignar</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>                                     
                    <v-flex xs12 sm6 md6>
                        <v-select
                        :items="docentes"
                        v-model="iddocente"
                        label="Docente"
                      ></v-select>
                    </v-flex>
                     <v-flex xs12 sm6 md6 v-if="desabilitarMateria">
                        <v-select
                        :items="materias"
                        v-model="idmateria"
                        label="Materia"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6 v-else>
                        <v-select
                        :items="materias"
                        v-model="idmateria"
                        label="Materia"
                        disabled
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field type="number" v-model="intensidad_horaria" label="Intensidad horaria"></v-text-field>
                    </v-flex>                    
                    <v-flex xs12 sm6 md6 v-show="valida">
                      <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                    </v-flex>                                    
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>       
        </v-toolbar>
        <v-data-table :headers="headers" :items="cursoxmateriaxdocentes" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-md-left">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>            
            </td>
            <td class="text-md-left">{{ props.item.docente }}</td>
            <td class="text-md-left">{{ props.item.materia }}</td>          
            <td class="text-md-left">{{ props.item.intensidad_horaria }}</td>
            <td class="text-md-left">
              <div v-if="props.item.estado">
                <span class="blue--text">Activo</span>
              </div>
              <div v-else>
                <span class="red--text">Inactivo</span>
              </div>                         
            </td>                                     
          </template>
          <template v-slot:no-data>
            <v-btn color="danger" @click="listarMateriaDocentexCursoxAnioescolar">Resetear</v-btn>
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
              cursoxmateriaxdocentes:[],
              anioescolares: [],
              idanio_escolar: '',
              cursos: [],
              idcurso: '',
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                 
                  { text: 'Docente', value: 'docente' },
                  { text: 'Materia', value: 'materia' },
                  { text: 'Intensidad horaria', value: 'intensidad_horaria', sortable: false },
                  { text: 'Estado', value: 'estado', sortable: false }                 
              ],
              search: '',              
              editedIndex: -1,             
              id: '',             
              iddocente: '',
              docentes: [],
              idmateria: '',
              materias: [],
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
          this.listarCursos();
          this.SelectDocentes();
          this.SelectMaterias();          
         
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

          listarCursos(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var cursosArray = [];         
            axios.get('api/Cursos/Select', configuration).then(function(response){               
               cursosArray = response.data;
               console.log(cursosArray);
               cursosArray.map(function(x){
                   me.cursos.push({ text: x.nombre, value: x.idcurso })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          listarMateriaDocentexCursoxAnioescolar(){
            if(this.idcurso > 0){
              let me=this;            
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              axios.post('api/Cursoxmateriaxdocentes/Listar',{
                'idanio_escolar': me.idanio_escolar,
                'idcurso': me.idcurso
              }, configuration).then(function(response){
                me.cursoxmateriaxdocentes = response.data
              }).catch(function(error){
                  console.log(error);
              });
            }
          },

          SelectDocentes(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var docentesArray = [];         
            axios.get('api/Usuarios/SelectDocentes', configuration).then(function(response){               
               docentesArray = response.data;
               console.log(docentesArray);
               docentesArray.map(function(x){
                   me.docentes.push({ text: x.nombre, value: x.iddocente })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          SelectMaterias(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var materiasArray = [];         
            axios.get('api/Materias/SelectMaterias', configuration).then(function(response){               
               materiasArray = response.data;
               console.log(materiasArray);
               materiasArray.map(function(x){
                   me.materias.push({ text: x.nombre, value: x.idmateria })
               });
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
              if(this.validar()){
                return;    
              }
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
                 axios.post('api/Cursoxmateriaxdocentes/Crear',{
                   'idcurso': me.idcurso,
                   'idmateria': me.idmateria,
                   'iddocente': me.iddocente,
                   'idanio_escolar': me.idanio_escolar,
                   'intensidad_horaria': me.intensidad_horaria                   
                 },configuration).then(function(response){
                    me.close();
                    me.listarMateriaDocentexCursoxAnioescolar();
                    me.limpiar();                    
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



