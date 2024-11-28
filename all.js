// 請代入自己的網址路徑
const apiPath = "s870012";
const token = "YbxNJmnGfkhXeFYtNStcfh2GrfW2";
const baseUrl ="https://livejs-api.hexschool.io/";
const customerApi =`${baseUrl}api/livejs/v1/customer/${apiPath}`;

let productData = [];
// 取得產品列表
function getProductList() {
  axios.get(`${customerApi}/products`).
    then(function (response) {
      productData = response.data.products;
      renderProductList();
    })
    .catch(function(error){
      console.log(error.response.data)
    })
}
getProductList();

// 渲染產品
const productWrap = document.querySelector(".productWrap");
function renderProductList (){
  let str='';
  productData.forEach(function(item){
    str +=`<li class="productCard">
                <h4 class="productType">${item.category}</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">${item.origin_price}</del>
                <p class="nowPrice">${item.price}</p>
            </li>`;
  })
  productWrap.innerHTML = str;
}

// filter
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", function(e){
  let str='';
  productData.forEach(function(item){
    if(e.target.value == item.category){
      str +=`<li class="productCard">
                <h4 class="productType">${item.category}</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">${item.origin_price}</del>
                <p class="nowPrice">${item.price}</p>
            </li>`;
    }else if(e.target.value == "全部"){
      str +=`<li class="productCard" >
              <h4 class="productType">${item.category}</h4>
              <img src="${item.images}" alt="">
              <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
              <h3>${item.title}</h3>
              <del class="originPrice">${item.origin_price}</del>
              <p class="nowPrice">${item.price}</p>
            </li>`
    }
  productWrap.innerHTML = str;
  })
})


let cartsData = [];
let cartFinalTotal = 0;
// 取得購物車列表
function getCartList() {
  axios.get(`${customerApi}/carts`)
  .then(function (response) {
      cartsData = response.data.carts;
      cartFinalTotal = response.data.finalTotal; 
      renderCartList();
    })
  .catch(function(error){
    console.log(error);
  })
}
getCartList();

// 渲染購物車
const cartBody = document.querySelector('.cartBody');
const cartTotal = document.querySelector('.cartTotal');
function renderCartList(){
  let str='';
  cartsData.forEach(function(item){
    str+=`<tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>NT$${item.product.origin_price}</td>
                        <td >
                          <button class="material-icons remove" data-id="${item.id}" data-Num="${item.quantity}">remove</button>
                          <span>${item.quantity}</span>
                          <button class="material-icons add" data-id="${item.id}" data-Num="${item.quantity}">add</button>
                        </td>
                        <td>NT$${item.product.price}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons" id="discardItemBtn" data-id="${item.id}">
                                clear
                            </a>
                        </td>
                    </tr>`;
  });
  cartBody.innerHTML = str;
  cartTotal.innerHTML = `NT$${cartFinalTotal}`;
}

// 加入購物車
function addCartItem(id) {
  let Num = 0 ;
  cartsData.forEach(function(item){
    if(item.product.id == id){
      Num = item.quantity;
    }
  })
  const data = {
    "data": {
      "productId": id,
      "quantity": Num+1
    }
  }
  axios.post(`${customerApi}/carts`, data)
  .then(function () {
    getCartList();
  })
  .catch(function(error){
    console.log(error.response.data);
  })
}
productWrap.addEventListener('click',function(e){
  e.preventDefault();
  if(e.target.classList.contains('addCardBtn')){
    const productId = e.target.getAttribute('data-id');
    addCartItem(productId)
  }
})

// 清除購物車內全部產品
const discardAllBtn = document.querySelector(".discardAllBtn");
function deleteAllCartList() {
  axios.delete(`${customerApi}/carts`)
  .then(function(response){
    getCartList();
  })
  .catch(function(error){
    console.log(error);
  }) 
}

discardAllBtn.addEventListener('click',function(e){
  e.preventDefault();
  if(cartsData.length == 0){
    alert("購物車裡沒有商品")
    return;
  }
  const yes = window.confirm("您確定要移除所有商品?")
  if(yes == true){
    deleteAllCartList();
  }
})

// 刪除購物車內特定產品
function deleteCartItem(id) {
  axios.delete(`${customerApi}/carts/${id}`)
  .then(function () {
    getCartList();
  })
  .catch(function(error){
    console.log(error);
  })
}

//調整購物車數量
function adjustCartItemNum(id,Num){
  const data = {
    "data":{
      "id":id,
      "quantity":Num
    }
  }
  axios.patch(`${customerApi}/carts`, data)
  .then(function(){
    getCartList();
  })
  .catch(function(error){
    console.log(error);
  })
}

cartBody.addEventListener('click', function(e){
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id")
  let cartNums = e.target.getAttribute("data-Num");
  if(e.target.getAttribute("id") === "discardItemBtn"){  
    deleteCartItem(cartId);
  }else if(e.target.getAttribute("class") === "material-icons remove"){
    cartNums--;
    if(cartNums < 1){
      const yes = window.confirm("您確定要移除該商品?")
      if(yes){
        deleteCartItem(cartId);
      }
      return;
    }
    adjustCartItemNum(cartId, cartNums);
  }else if(e.target.getAttribute("class") === "material-icons add"){
    cartNums++
    adjustCartItemNum(cartId, cartNums);
  }
})

// 送出購買訂單
let orderData = {
  "data":{
    "user":{
      "name":"",
      "tel":"",
      "email":"",
      "address":"",
      "payment":""
    }
  }
};
function createOrder() {
  axios.post(`${customerApi}/orders`, orderData)
  .then(function () {
    
  })
  .catch(function(error){
    console.log(error.response.data);
  })
}
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', function(e){
  e.preventDefault();
  const orderInfo = document.querySelector('.orderInfo-form');
  const customerName = document.querySelector('#customerName');
  const customerPhone = document.querySelector('#customerPhone');
  const customerEmail = document.querySelector('#customerEmail');
  const customerAddress = document.querySelector('#customerAddress');
  const tradeWay = document.querySelector('#tradeWay');
  if(customerName.value == '' || customerPhone.value == '' || customerEmail.value == '' || customerAddress.value == ''){
    alert("請輸入正確資訊");
    return;
  }else if(cartsData.length == 0){
    alert("購物車並無商品");
    return;
  }
  orderData.data.user.name = customerName.value;
  orderData.data.user.tel = customerPhone.value;
  orderData.data.user.email = customerEmail.value;
  orderData.data.user.address = customerAddress.value;
  orderData.data.user.payment = tradeWay.value;
  createOrder();
  deleteAllCartList();
  orderInfo.reset();
})

function init(){
  getProductList();
  getCartList();
}
init();