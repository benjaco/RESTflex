/**
 * Created by Benjaco on 12-01-2016.
 */

var REST = {
    defaults:{
        "readOnCreated": true,
        "successGetHeader": 200,
        "successPostHeader": 201,
        "successDeleteHeader": 204,
        "successPutHeader": 200,
        "variable_converter": function(data){
            return data;
        },
        "list_converter": function(data){
            data = JSON.parse(data);
            if(data===false) {
                return false;
            }
            var out = {items:[], id:[]};
            if( typeof data !== "object") {
                return false;
            }
            for (var i = 0; i < data.length; i++) {
                if(typeof data[i].id !== "undefined") {
                    out.id[data[i].id]=out.items.push(data[i])-1;

                    //out.items[data[i].id] = data[i];
                    //out.order.push(data[i].id);
                }else {
                    return false;
                }
            }
            return out;
        }
    }
};