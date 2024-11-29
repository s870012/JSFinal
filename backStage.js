const apiPath = "s870012";
const token = "YbxNJmnGfkhXeFYtNStcfh2GrfW2";
const baseUrl ="https://livejs-api.hexschool.io/";
const orederApi =`${baseUrl}api/livejs/v1/admin/${apiPath}`
const config = {
    headers: {
      'Authorization': token
    }
  }
const date = new Date()

//取得訂單資料
let orderDataList = [];
let getOrderList = () => {
  axios.get(`${orederApi}/orders`, config)  
  .then(response=>{
    orderDataList = response.data.orders;
    renderOrderList();
    renderChart();
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
                        <td>${date.toLocaleDateString()}</td>
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

// 渲染C3資料
let chartData = [];
let renderChart = () => {
    let ary = [];
    let obj = {};
    orderDataList.forEach(item =>{
        for( let i=0; i<item.products.length;i++){
            ary.push(item.products[i])
        }
    })

    ary.forEach(item =>{
        if(obj[item.title] == undefined){
            obj[item.title] = 1;
        }else if (obj[item.title] !== undefined){
            obj[item.title] ++;
        }
    })

    let title = Object.keys(obj)
    title.forEach(item=>{
        let arySec =[];
        arySec.push(item);
        arySec.push(obj[item])
        chartData.push(arySec)
    })
    
    // C3圖表設定
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: chartData,
            color:{
                pattern:['#DACBFF','#9D7FEA','#5434A7','#301E5F']
            }
        },
    });
}

let init = ()=>{
    getOrderList();
}
init();


