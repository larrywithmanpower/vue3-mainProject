const productList = document.querySelector('#productList');
const productCount = document.querySelector('#productCount');
const logoutBtn = document.querySelector('#logoutBtn');

const app = {
    data: {
        apiUrl: 'https://vue3-course-api.hexschool.io',
        apiPath: 'larry',
        products: [],
        token: '',
    },
    getProduct() {
        const url = `${this.data.apiUrl}/api/${this.data.apiPath}/admin/products`;
        axios.get(url)
            .then((res) => {
                // 判斷資料是否成功取得
                if (res.data.success) {
                    this.data.products = res.data.products;
                    // console.log(this.data.products);
                    this.render();
                } else {
                    alert(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },
    render() {
        let str = '';
        this.data.products.forEach((item, index) => {
            str +=
                `
            <tr>
                <td>${item.title}</td>
                
                <td width="120">
                    ${item.origin_price}
                </td>
                <td width="120">
                    <img src="${item.imageUrl}" alt="${item.title}" class="img-thumbnail">
                </td>
                <td width="120">
                    ${item.price}
                </td>
                <td width="100">                   
                    <span class="text-success">${item.is_enabled ? "啟用" : "未啟用"}</span>
                </div>
                </td>
                <td width="120">
                    <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn"
                        data-action="remove" data-id="${item.id}"> 刪除 </button>
                </td>
            </tr>
            `
        })
        productList.innerHTML = str;
        productCount.textContent = this.data.products.length;
    },
    delProduct() {
        productList.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action == 'remove') {
                const id = e.target.dataset.id;
                const url = `${this.data.apiUrl}/api/${this.data.apiPath}/admin/product/${id}`;
                axios.delete(url)
                    .then((res) => {
                        // console.log(res);
                        alert(res.data.message);
                        this.getProduct();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
    },
    logout() {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = `${this.data.apiUrl}/logout`;
            axios.post(url)
                .then((res) => {
                    // * 消除cookie
                    document.cookie = `hexToken=; expires=; path=/`;
                    this.data.products = [];
                    alert(res.data.message)
                    window.location = './index.html';
                    // ? 回上一頁商品列表都會出現??清空products也是會跑出來 => 接到正確API即便出現商品列表也無法刪除!!
                })
                .catch((err) => {
                    console.log(err);
                })
        })
    },
    created() {
        // ! 一定要取出cookies，不然不給你使用一些功能，如刪除
        this.data.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = this.data.token;
        this.getProduct();
        this.delProduct();
        this.logout();
    }
}

app.created();