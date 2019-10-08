<template>
  <v-app id="inspire">
    <v-navigation-drawer 
    v-model="drawer" 
    :clipped="$vuetify.breakpoint.lgAndUp" 
    fixed 
    app
    v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esDocente || esEstudiante">
          <v-list-tile :to="{ name:'home' }">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Inicio</v-list-tile-title>
          </v-list-tile>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Administrar
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name:'anioescolares' }">
              <v-list-tile-action>
                <v-icon>calendar_today</v-icon>  
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Año Escolar
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name:'periodoescolares' }">
              <v-list-tile-action>
                <v-icon>calendar_today</v-icon>
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Periodo Escolar
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name:'cursos' }">
              <v-list-tile-action>
                <v-icon>account_balance</v-icon>
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Curso
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile :to="{ name:'areas' }">
              <v-list-tile-action>
                <v-icon>assignment</v-icon>
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Area
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile> 
            <v-list-tile :to="{ name:'materias' }">
              <v-list-tile-action>
                <v-icon>assignment</v-icon>
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Materia
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    Docente
                  </v-list-tile-title>
                </v-list-tile-content>                
            </v-list-tile>

              <v-list-tile :to="{ name:'registrardocente' }">
                <v-list-tile-action>
                  <v-icon>person_add</v-icon>
                </v-list-tile-action>            
                <v-list-tile-content>
                  <v-list-tile-title>
                    Registrar
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile :to="{ name:'asignardocentecursomaterias' }">
                <v-list-tile-action>
                  <v-icon>assignment_turned_in</v-icon>
                </v-list-tile-action>            
                <v-list-tile-content>
                  <v-list-tile-title>
                    Asignar carga academica
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile> 

               <v-list-tile :to="{ name:'asignardirectorgrupo' }">
                <v-list-tile-action>
                  <v-icon>assignment_ind</v-icon>
                </v-list-tile-action>            
                <v-list-tile-content>
                  <v-list-tile-title>
                    Asignar Director de Grupo
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>                  
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    Estudiante
                  </v-list-tile-title>
                </v-list-tile-content>                
            </v-list-tile>

              <v-list-tile :to="{ name:'registrarestudiante' }">
                <v-list-tile-action>
                  <v-icon>person_add</v-icon>
                </v-list-tile-action>            
                <v-list-tile-content>
                  <v-list-tile-title>
                    Registrar
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile :to="{ name:'aniocursados' }">
                <v-list-tile-action>
                  <v-icon>calendar_today</v-icon>
                </v-list-tile-action>            
                <v-list-tile-content>
                  <v-list-tile-title>
                    Matricular
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>              
          </v-list-group>
        </template>
        <template v-if="esDocente">
          <v-list-group>
            
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Calificaciones
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name:'registrarcalificaciones' }">
              <v-list-tile-action>
                <v-icon>format_list_numbered</v-icon>
              </v-list-tile-action>           
              <v-list-tile-content>
                <v-list-tile-title>
                  Registrar Calificacion
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>  

              <v-list-tile :to="{ name:'informecalificaciones' }">
                <v-list-tile-action>
                  <v-icon>format_list_numbered</v-icon>
                </v-list-tile-action>              
              <v-list-tile-content>
                <v-list-tile-title>
                  Informe Calificaciones
                </v-list-tile-title>
              </v-list-tile-content> 
            </v-list-tile> 

             <v-list-tile :to="{ name:'informedirectores' }">
                <v-list-tile-action>
                  <v-icon>record_voice_over</v-icon>
                </v-list-tile-action>              
              <v-list-tile-content>
                <v-list-tile-title>
                   Informe Director
                </v-list-tile-title>
              </v-list-tile-content> 
            </v-list-tile>

          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Accesos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile :to="{ name:'roles' }">
              <v-list-tile-action>
                <v-icon>table_chart</v-icon>
              </v-list-tile-action>            
              <v-list-tile-content>
                <v-list-tile-title>
                  Roles
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

              <v-list-tile :to="{ name:'usuarios' }">
                <v-list-tile-action>
                  <v-icon>perm_identity</v-icon>
                </v-list-tile-action>             
                <v-list-tile-content>
                  <v-list-tile-title>
                    Usuarios
                  </v-list-tile-title>
                </v-list-tile-content> 
              </v-list-tile> 
          </v-list-group>
        </template>      
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="primary" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Sistema de notas</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="salir" v-if="logueado" icon>
        <v-icon>logout</v-icon> Salir
      </v-btn>
       <v-btn :to = "{name: 'login'}" v-else icon>
        <v-icon>apps</v-icon> Login
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view/>
          </v-slide-y-transition>
      </v-container>
      <v-footer dark height="auto">
        <v-layout justify-center>
          <v-flex text-xs-center>
            <v-card flat tile color="primary" class="white--text">
              <v-card-text class="white--text pt-0">
                Sistema de Notas  - Ricardo 2019
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-footer>    
    </v-content>  
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: null
    };
  },
  computed: {
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador'
    },
    esDocente(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Docente'
    },
    esEstudiante(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Estudiante'
    }

  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir")
    }
  }
};
</script>
