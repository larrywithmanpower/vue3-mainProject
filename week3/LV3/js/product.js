
const app = Vue.createApp({
    data() {
        return {
            // apiinfo
            apiPath: 'larry',
            apiUrl: 'https://vue3-course-api.hexschool.io',
            token: '',
            // products
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            // modal
            productModal: '',
            delProductModal: '',
            errDataModal: '',
            errLoginModal: '',
            successModal: '',
            // new edit del
            isNew: false,
            // message
            message: ''
        }
    },
    methods: {
        // getData
        getData(page=1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            // axios
            axios.get(url)
                .then((res) => {
                    if (res.data.success) {
                        this.products = res.data.products;
                        // console.log(this.products);
                    } else {
                        errDataModal.show();
                    }
                }).catch((err) => {
                    // ! 補上catch
                    console.log(err);
                })
        },
        // openModal
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imagesUrl: []
                    };
                    this.isNew = true;
                    productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = {
                        imagesUrl: [],
                        ...item
                    };
                    this.isNew = false;
                    productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = {...item};
                    this.isNew = true;
                    delProductModal.show();
                    break;
            }
        },
        // undateProduct including adding and editing
        updateProdcut() {
            // ? for new product
            if (this.isNew === true) {
                const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
                // ! 帶入資訊時忘記加上data物件
                axios.post(url, {data: this.tempProduct})
                    .then((res) => {
                        if (res.data.success) {
                            this.getMessage(res);
                            this.getData();
                            successModal.show();
                        } else {
                            // console.log(res);
                            this.getMessage(res);
                            errDataModal.show();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                // ! 建議：新增產品，若表單未填妥按下送出會先關掉 modal 才跳 alert 。這邊可以不用關閉 modal。 
                // productModal.hide();                
            } else {
                // ? edit product
                const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                axios.put(url, {data: this.tempProduct})
                    .then((res) => {
                        if (res.data.success) {
                            this.getMessage(res);
                            this.getData();
                            successModal.show();
                        } else {
                            this.getMessage(res);
                            errDataModal.show();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                productModal.hide();
            }
        },
        // deleteProduct
        deleteProduct() {
            const url =`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getMessage(res);
                        this.getData();
                        successModal.show();
                    }  else {
                        this.getMessage(res);
                        errDataModal.show();
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            delProductModal.hide();
        },
        // logout
        logout() {
            const url = `${this.apiUrl}/logout`;
            axios.post(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getMessage(res);
                        this.tempProduct = {
                            imagesUrl: []
                        }
                        // ! 清空token與products，要跟登入頁輸入參數名稱要相同，不能多也不能少
                        this.token = document.cookie = `myToken=; expires=;`;
                        this.products = [];
                        successModal.show();
                        setTimeout(() => {
                            window.location = 'index.html';
                        }, 1500);                     
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },        
        // ! 方便刪圖片
        removeImages() {
            if (this.tempProduct.imagesUrl.length) {
                this.tempProduct.imagesUrl.pop();
            } else {
                if (this.tempProduct.imageUrl) {
                    this.tempProduct.imageUrl = '';
                }
            }
        },
        getMessage(res) {
            this.message = res.data.message.toString();
        }
    },
    mounted() {
        // modal get
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
        errLoginModal = new bootstrap.Modal(document.querySelector('#errLoginModal'));
        errDataModal = new bootstrap.Modal(document.querySelector('#errDataModal'));
        successModal = new bootstrap.Modal(document.querySelector('#successModal'));
        // ! 取出token
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // ! 判斷是否登入(參考範例)
        if (this.token === '') {
            errLoginModal.show();
            // back to login page after 2s
            setTimeout(() => {
                window.location = 'index.html';
            }, 2000)
        }
        axios.defaults.headers.common['Authorization'] = this.token;
        // ! 啟動
        this.getData();
    }
}).mount('#app');