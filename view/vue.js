var vm = new Vue({
    el: '#app',
    data: {
      status:"signup",
      users: [],
      newUser: {
        name: '',
        surname: '',
        email: '',
        password: '',
        iban:''
      },
      currentUser: '',
      errorMessage: null,
    },
    methods: {
      allUser() {
        this.$http.get(`http://localhost:3001`)
          .then(response => {
            console.log({Users: response.body});
            this.users = response.body
          })
      },
      signup() {
        this.$http.post(`http://localhost:3001/signup`, this.newUser)
          .then(response => {
            console.log({SignUp: response.body});
            this.newUser = '';
          })
          .catch(err=>{
            this.errorMessage = err.body.message;
            console.log(err);
          })
      },
  
      login() {
        this.$http.post(`http://localhost:3001/login`, { email: this.newUser.email, password: this.newUser.password })
          .then((response, err) => {
            console.log({MioToken : response.body});
            this.newUser = '';
            localStorage.setItem('token', response.body.token);
            this.me();
          })
          .catch(err=>{
            this.errorMessage = err.body.message;
            this.newUser = '';
            console.log(err);
          })
  
      },
      me() {
        this.$http.get(`http://localhost:3001/me?token=${localStorage.getItem('token')}`)
          .then(response => {
            console.log({Me: response.body});
            this.currentUser = response.body
  
          })
      },
     
  
      logout() {
          this.currentUser = null;
          localStorage.removeItem('token');
      }
  
  
  
    },
    created() {
     
      if (localStorage.getItem('token')) {
        this.tokenMe = localStorage.getItem('token')
        this.me()
        this.allUser()
      }
  
    }
  })