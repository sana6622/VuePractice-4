import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = "https://ec-course-api.hexschool.io/v2";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {
   
  },
  methods: {
    login() {
      const api = "https://vue3-course-api.hexschool.io/v2/admin/signin";
      axios.post(api, this.user)      
      .then((res) => {
        const { token, expired } = res.data;
        document.cookie = `hexschoolToken=${token}; expires=${new Date(expired)}`;

        //換頁
        window.location = "product.html";

      })
      .catch(error=>{
        alert('登入失敗')
      })
    },
    
  },
});
app.mount("#app");
