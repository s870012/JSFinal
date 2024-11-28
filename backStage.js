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
                            <a href="#" id="orderStatus" data-id="${item.id}" data-paid="${item.paid}">${item.paid == true ? "已處理" : "未處理"}</a>
                        </td>
                        <td>
                            <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
                        </td>
                    </tr>`
    })
    orderList.innerHTML = str;
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
    .then( () =>{
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
    }else if(e.target.getAttribute("data-paid") == "false"){
        const paid = true;
        adjustOrderList(orderId, paid);
    }else if(e.target.getAttribute("data-paid") == "true"){
        let yes = window.confirm("請確認是否更改狀態")
        if( yes== true){
            const paid = false;
            adjustOrderList(orderId, paid);
        }
    }
})

let init = ()=>{
    getOrderList();
}
init();

let chartData = [];

let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});