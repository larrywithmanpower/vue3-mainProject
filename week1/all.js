// DOM
const productTitle = document.querySelector('.js-productTitle');
const orginPrice = document.querySelector('.js-orginPrice');
const sellingPrice = document.querySelector('.js-sellingPrice');
const createBtn = document.querySelector('.js-createBtn');
const delAllBtn = document.querySelector('.js-delAllBtn');
const productList = document.querySelector('.js-productList');
const renderCount = document.querySelector('.js-renderCount');

// data
let data = [];

// methods
// create
createBtn.addEventListener('click', createProduct);
function createProduct() {
    let productName = productTitle.value.trim();
    let productOriginPrice = orginPrice.value;
    let productSellingPrice = sellingPrice.value;
    if (productTitle.value.trim() == '') {
        alert('請輸入產品標題');
        return;
    }
    const timeStamp = Math.floor(Date.now());
    let obj = {
        id: timeStamp,
        productName,
        productOriginPrice,
        productSellingPrice,
        isOpen: false
    };
    data.push(obj);
    productTitle.value = '';
    orginPrice.value = '';
    sellingPrice.value = '';
    render();  
};
// delAll
delAllBtn.addEventListener('click', delAllProduct);
function delAllProduct() {
    data = [];

    render();
}
// status and remove
productList.addEventListener('click', openControl);
function openControl(e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (action == 'status') {
        data.forEach((item, index) => {
            if (id == item.id) {
                item.isOpen = !item.isOpen;
            };
        });
    } else if (action === 'remove') {
        data.forEach((item, index) => {
            if (id == item.id) {
                data.splice(index, 1);
            };
        });
    }
    render(); //忘記render，所以畫面一直不會變化...
}

// render
function render() {
    let str = '';
    data.forEach((item, index) => {
        str +=
            `
        <tr class="${item.isOpen ? 'bg-primary text-white' : ''}">
            <th scope="row">${item.productName}</th>
            <td>${item.productOriginPrice}</td>
            <td>${item.productSellingPrice}</td>
            <td width="20%">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="${item.id}" data-action="status" ${item.isOpen ? 'checked': ''}  data-id="${item.id}">
                    <label class="form-check-label" for="${item.id}" data-id="${item.id}">${item.isOpen  ? '啟用' : '未啟用'}</label>
                </div>
            </td>
            <td><button type="button" class="btn btn-sm btn-danger" data-id="${item.id}" data-action="remove">刪除</button></td>
        </tr>
        `
    });
    productList.innerHTML = str;

    let count = data.length;
    renderCount.textContent = `目前有${count}項產品`
};