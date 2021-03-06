/**
 * Orders.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      orderId: {
          type: 'string',
          unique: true,
      },
      orderDate: {
          type: 'string',
          required: false,
      },
      items: {
          type: 'json',
          columnType: 'array',
          allowNull: false,
      },
      totalPrice: {
          type: 'number',
          allowNull: false,
      },
      couponsApplied: {
          type: 'string',
          allowNull: true,
          required: false,
      },
      discount: {
          type: 'number',
          allowNull: true,
          defaultsTo: 0,
          required: false,
      },
      finalPrice: {
          type: 'number',
          allowNull: false,
      },
      paymentMode: {
          type: 'string',
          allowNull: false,
          defaultsTo: 'COD',
          // required: true,
      },
      paymentID: {
          type: 'string',
          allowNull: false,
      },
      /*
      * Order Status:
      * * * OrderPlaced
      * * * Delivered
      * * * Rejected
      * */
      orderStatus: {
          type: 'string',
          allowNull: false,
          defaultsTo: 'Order Placed',
          required: false,
      },
      userName: {
          type: 'string',
          allowNull: false,
          required: true,
      },
      userMobileNo: {
          type: 'string',
          allowNull: false,
          required: true,
      }
  },

consolidateOrders: async (startDate,endDate,dateSelected) => {
    let orderItems = await Orders.find({ orderStatus: 'OrderPlaced' });
    if(dateSelected!=='no'){
        var orderItems1=[];
        orderItems.map((orders)=>{
        if(orders.createdAt>=startDate&&orders.createdAt<=endDate){
            orderItems1.push(orders);
        }
    })
    orderItems=orderItems1;
    }
    let items = [];
    orderItems.map((orderItem) => {
        orderItem.items.map((item) => {
            items.push(item);
        });
    });
    let groupedItems = _.groupBy(items, 'product-category');
    let consolidatedItems = [];
    Object.keys(groupedItems).map((key) => {
        let tempArr = [];
        groupedItems[key].map((item) => {
            if(tempArr.length === 0) {
                tempArr.push(item);
            } else {
                let flag = 0;
                tempArr.map((tempItem) => {
                    if(tempItem['product-id'] === item['product-id']) {
                        flag = 1;
                        var tempQuantity= parseInt(tempItem['product-quantity']);
                        var itemQuantity= parseInt(item['product-quantity']);
                        tempQuantity=tempQuantity+itemQuantity;
                        tempItem['product-quantity']=tempQuantity;
                    }
                });
                if(flag === 0) {
                    tempArr.push(item);
                }
            }
        });
        groupedItems[key] = tempArr;
    });
    return groupedItems;
}
};

