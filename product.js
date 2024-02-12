import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = "https://vue3-course-api.hexschool.io/v2/";
const api_path = "sana-teashop";

const app = createApp({
  data() {
    return {
      tempProduct: {
        imagesUrl: [], //多圖使用
      },
      products: {},
      modalProduct: null,
      modalDele: null,
      isNew: false,
    };
  },

  mounted() {
    //取得token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexschoolToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAdmin();
    this.getProduct();
    //彈跳視窗
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    this.modalDele = new bootstrap.Modal(this.$refs.delProductModal);
  },

  methods: {
    checkAdmin() {
      const checkApi = `${site}/api/user/check`;
      axios
        .post(checkApi)
        .then(() => {
          this.getProduct();
        })
        .catch((e) => {
          console.log("error", e);
          alert("尚未登入");
          window.location = "index.html";
        });
    },

    getProduct() {
      const api = `${site}api/${api_path}/admin/products/all`;
      axios.get(api).then((res) => {
        this.products = res.data.products;
      });
    },

    openModal(status, product) {
      if (status === "create") {
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        };
      } else {
        this.isNew = false;
        this.tempProduct = { ...product };
        //當原本沒有圖片時，imagesUrl不是陣列 ->會導致無法顯示"新增按鈕"
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = []
        }
      }

      this.modalProduct.show();
    },
    deleModal(product) {
      this.modalDele.show();
      this.tempProduct = { ...product };
    },

    updateProduct() {
      //新增
      let api = `${site}api/${api_path}/admin/product`;
      let method = "post";
      //更新
      if (!this.isNew) {
        console.log("edit");
        api = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
        console.log("edit", api, method);
      }

      axios[method](api, { data: this.tempProduct }).then((res) => {       
        this.getProduct();
        this.modalProduct.hide();
        this.tempProduct = {};
      });
    },

    deleProduct() {
      const api = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(api).then((res) => {
        this.getProduct();
        this.modalDele.hide();
        this.tempProduct = {};
      });
    },
  },
});
app.mount("#app");
