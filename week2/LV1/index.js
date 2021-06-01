const productList = document.querySelector('#productList');
const productCount = document.querySelector('#productCount');
const logBtn = document.querySelector('#logBtn');

const app = {
    data: {
        apiPath: 'larry',
        apiUrl: 'https://vue3-course-api.hexschool.io/',
        products: [],
        token: ''
    },
    getData() {
        const url = `${this.data.apiUrl}api/${this.data.apiPath}/products`;
        axios.get(url)
            .then((res) => {
                this.data.products = res.data.products;
                console.log(this.data.products);
                this.render();
            })
    },
    render() {
        let str = '';
        this.data.products.forEach((item, index) => {
            console.log(item);
            str +=
                `
            <div class="card">
                <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text d-flex justify-content-between align-itmes-center">
                        <del><small class="text-muted">原價 $${item.origin_price}</small></del>
                        <strong class="text-danger ml-auto h3 mb-0">特價 $${item.price}</strong>
                    </p>
                </div>
            </div>
            `
        })
        productList.innerHTML = str;
        productCount.textContent = this.data.products.length;
    },
    // 研究區塊
    // checked() {
    //     const url = `${this.data.apiUrl}/api/user/check`;
    //     this.data.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    //     axios.defaults.headers.common['Authorization'] = this.data.token;
        
    //     axios.post(url)
    //     .then((res) => {
    //         console.log(res); 
    //         // success: false, message: "您所查看的API不存在 >_<" ???
    //         if (res.data.success) {
    //             alert(res.data.message);
    //             window.location = 'productList.html';
    //         } else {
    //             alert(res.data.message);
    //         }
    //     })
    // },
    created() {
        this.getData();
        // this.checked();
    }
}

app.created();