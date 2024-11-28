const apiPath = "s870012";
const token = "YbxNJmnGfkhXeFYtNStcfh2GrfW2";
const baseUrl ="https://livejs-api.hexschool.io/";
const orederApi =`${baseUrl}api/livejs/v1/admin/${apiPath}`
const config = {
    headers: {
      'Authorization': token
    }
  }

//取得訂單資料
let orderDataList = [];
let getOrderList = () => {
  axios.get(`${orederApi}/orders`, config)  
  .then(response=>{
    orderDataList = response.data.orders;
    renderOrderList();
  })
  .catch(err => {
    console.log(err);
  })
}

// 渲染訂單資料
let status = "未處理";
const orderList = document.querySelector('.orderList');
let renderOrderList = ()=>{
    let str='';
    orderDataList.forEach(function(item,index){
        str += `<tr>
                        <td>${item.createdAt}</td>
                        <td>
                            <p>${item.user.name}</p>
                            <p>${item.user.tel}</p>
                        </td>
                        <td>${item.user.address}</td>
                        <td>${item.user.email}</td>
                        <td>
                            <p>${item.products[0].title}</p>
                        </td>
                        <td>2021/03/08</td>
                        <td class="orderStatus" >
                            <a href="#" id="orderStatus" data-id="${item.id}" data-paid="${item.paid}">${status}</a>
                        </td>
                        <td>
                            <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
                        </td>
                    </tr>`
    })
    orderList.innerHTML = str;
    console.log(orderDataList);
}

// 刪除所有訂單資料
let deleteAllOrderList = ()=>{
    axios.delete(`${orederApi}/orders`, config)
    .then( () =>{
        getOrderList();
    })
    .catch(err => {
        console.log(err.response.data);
    })
}

const discardAllBtn = document.querySelector(".discardAllBtn")
discardAllBtn.addEventListener("click", e =>{
    e.preventDefault();
    deleteAllOrderList();
})

// 刪除特定訂單資料
let deleteOrderListItem = (id) =>{
    axios.delete(`${orederApi}/orders/${id}`, config)
    .then( () =>{
        getOrderList();
    })
    .catch(err =>{
        console.log(err);
    })
}

// 調整訂單狀態
let adjustOrderList = (orderId, paid) =>{
    let data = {
        "data": {
          "id": orderId,
          "paid": paid
        }
      };
    axios.put(`${orederApi}/orders`, data, config)
    .then( (res) =>{
        console.log(res);
        getOrderList();
    })
    .catch( err => {
        console.log(err.response);
    })
}


orderList.addEventListener("click", e => {
    const orderId = e.target.getAttribute("data-id");
    if(e.target.getAttribute("value") == "刪除"){
        deleteOrderListItem(orderId);
    }else if(e.target.getAttribute("id") == "orderStatus" && e.target.getAttribute("data-paid") == "false"){
        status = "已處理";
        const paid = true;
        adjustOrderList(orderId, paid);
    }else if (e.target.getAttribute("id") == "orderStatus" && e.target.getAttribute("data-paid") == "true" ){
        alert("請確定款項是否付款");
        status = "未處理"
        const paid = false;
        adjustOrderList(orderId, paid);
    }
})

let init = ()=>{
    getOrderList();
}
init();

