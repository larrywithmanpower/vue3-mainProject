
const app = Vue.createApp({
    data() {
        return {
            // api info
            apiPath: 'larry',
            apiUrl: 'https://vue3-course-api.hexschool.io',
            // modal
            productModal: '',
            deleteModal: '',
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
        }
    },
    methods: {
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;

            axios.get(url) 
                .then((res) => {
                    // ! 以success來判斷是否取資料成功
                    if (res.data.success) {
                        this.products = res.data.products;
                        console.log(this.products);
                    } else {
                        // ! 取失敗用message告知失敗問題
                        alert(res.data.message);
                    }                
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        openModal(isNew, itemObj) {    
            // ! 嘗試使用switch
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imagesUrl: []
                    };
                    this.isNew = true;
                    productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = {...itemObj};
                    this.isNew = false;
                    productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = {...itemObj};
                    deleteModal.show();
                    break;
            }
        },
        // ! 這段仍不太熟悉
        updateProduct() {
            if (this.isNew) {
                this.products.push({
                    id: Date.now(),
                    ...this.tempProduct
                });
                this.tempProduct = {
                    imagesUrl: []
                };
                productModal.hide();
            } else {
                const index = this.products.findIndex((item) => item.id === this.tempProduct.id);
                this.products[index] = this.tempProduct;
                productModal.hide();
            }
        },
        deleteProduct() {
            // ? 陣列splice搭配findIndex
            this.products.splice(this.products.findIndex((item) => item.id === this.tempProduct.id), 1);
            deleteModal.hide();
        },
        // ? 不知道這目前有什麼功用，因為多圖新增按鈕功用不大
        addImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        deleteModal = new bootstrap.Modal(document.querySelector('#delProductModal'));

        // !  一定要取出token= =
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        // 啟動，完成後開始操控html進行渲染
        this.getData();
    },
    created() {
        console.log('共存');
    },
}).mount('#app');