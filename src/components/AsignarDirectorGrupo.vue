<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Asignar Director de grupo</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Asignar Director</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <v-select
                      :items="anioescolares"
                      v-model="idanio_escolar"
                      label="Anio Escolar"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-select
                      :items="cursos"
                      v-model="idcurso"
                      label="Curso"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-select
                      :items="docentes"
                      v-model="iddocente"
                      label="Docente"
                    ></v-select>
                  </v-flex>                 
                  <v-flex xs12 sm12 md12 v-show="valida">
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
        <v-dialog v-model="existeDirector" max-width="290px">
            <v-card>              
              <v-card-title class="headline">Docente asignado</v-card-title>
              <v-card-text>
                  Ya ha sido asignado un director a este curso O el docente ya ha sido asignado como director 
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="modalBuscarDocente">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table :headers="headers" :items="directores" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>           
          </td>
          <td>{{ props.item.anio_escolar }}</td>
          <td>{{ props.item.curso }}</td>
          <td>{{ props.item.docente }}</td>                  
        </template>
        <template v-slot:no-data>
          <v-btn color="danger" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from "axios";
  export default {             
      data(){
          return{
              directores:[],
              idanio_escolar:'',
              anioescolares:[],
              idcurso:'',
              cursos:[],
              iddocente:'',
              docentes:[],              
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                  
                  { text: 'Año escolar', value: 'anio_escolar' },                  
                  { text: 'Curso', value: 'curso', sortable: false },                                   
                  { text: 'Docente', value: 'docente', sortable: false }              
              ],
              search: '',              
              editedIndex: -1,             
              id: '',              
              valida: 0,
              validaMensaje: [],              
              adNombre: '',
              adId: '',
              existeDirector:false
          }
      },
      computed: {
          formTitle () {
              return this.editedIndex === -1 ? 'Nuevo Director' : 'Editar Materia'
          }        
      },

      watch: {
          dialog (val) {
              val || this.close()
          }
      },

      created () {          
          this.listar();
          this.selectAnioEscolares();
          this.selectCursos();
          this.selectDocentes();
      },
      methods:{          
          listar(){  
            let me=this; 
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};         
            axios.get('api/Directores/Listar', configuration).then(function(response){               
               me.directores = response.data;
               console.log(response.data);
            }).catch(function(error){
                console.log(error);
            });      
          },          

          editItem (item) {
              this.id = item.iddirector;
              this.idanio_escolar = item.idanio_escolar;
              this.iddocente = item.iddocente;
              this.idcurso = item.idcurso;               
              this.editedIndex = 1;  
              this.dialog = true
          },

          selectAnioEscolares(){  
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var anioescolaresArray = [];         
            axios.get('api/Anioescolares/Select', configuration).then(function(response){               
               anioescolaresArray = response.data;
               console.log(anioescolaresArray);
               anioescolaresArray.map(function(x){
                   me.anioescolares.push({ text: x.nombre, value: x.idanio_escolar })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          selectCursos(){  
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

          selectDocentes(){  
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

         
          modalBuscarDocente(){
            this.existeDirector = false;
          },

          close () {
              this.dialog = false;             
              this.limpiar();
          },

          limpiar(){
              this.id="";
              this.iddocente=""; 
              this.idcurso="";
              this.idanio_escolar="";             
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
                   axios.put('api/Materias/Actualizar',{
                   'idmateria': me.id,
                   'nombre': me.nombre                   
                 },configuration).then(function(response){
                    me.close();
                    me.listar();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });

              } else {
                 //codigo para guardar
                 let me = this;
                 axios.post('api/Directores/Crear',{
                   'iddocente': me.iddocente,
                   'idcurso': me.idcurso,
                   'idanio_escolar': me.idanio_escolar                   
                 },configuration).then(function(response){
                    console.log(response.data);
                    if(response.data.mensaje == true){
                       me.existeDirector = true;
                    }                   
                    me.close();
                    me.listar();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });
              }            
          },
          
          validar(){
              this.valida=0;
              this.validaMensaje=[];
              if(this.idanio_escolar.length != null){
                  this.validaMensaje.push("debe seleccionar un año escolar")
              }
              if(this.iddocente.length != null){
                  this.validaMensaje.push("debe seleccionar un docente")
              }
              if(this.idcurso.length != null){
                  this.validaMensaje.push("debe seleccionar un curso")
              }
              if(this.validaMensaje.length){
                  this.valida = 1;
              }
              return this.valida;
          }        
      }
  }
</script>



