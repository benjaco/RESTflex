/**
 * Created by Bejamco on 12-01-2016.
 */

var REST_notifyer = {
    funcLoaded: {},
    funcUpdate: {},
    funcAdd: {},
    funcDelete: {},

    onLoaded: function(name, func){
        if(this.funcLoaded[name]) {
            this.funcLoaded[name].push(func)
        }else {
            this.funcLoaded[name] = [func]
        }
    },
    onUpdate: function(name, func){
        if(this.funcUpdate[name]) {
            this.funcUpdate[name].push(func)
        }else {
            this.funcUpdate[name] = [func]
        }

    },
    onAdd: function(name, func){
        if(this.funcAdd[name]) {
            this.funcAdd[name].push(func)
        }else {
            this.funcAdd[name] = [func]
        }

    },
    onDelete: function(name, func){
        if(this.funcDelete[name]) {
            this.funcDelete[name].push(func)
        }else {
            this.funcDelete[name] = [func]
        }
    },
    emitLoaded: function(name){
        if(this.funcLoaded[name]) {
            for(var i = 0; i<this.funcLoaded[name].length; i++){
                this.funcLoaded[name][i]();
            }
        }
    },
    emitUpdate: function(name, data){
        if(this.funcUpdate[name]) {
            for(var i = 0; i<this.funcUpdate[name].length; i++){
                this.funcUpdate[name][i](data);
            }
        }

    },
    emitAdd: function(name, data){
        if(this.funcAdd[name]) {
            for(var i = 0; i<this.funcAdd[name].length; i++){
                this.funcAdd[name][i](data);
            }
        }

    },
    emitDelete: function(name, data){
        if(this.funcDelete[name]) {
            for(var i = 0; i<this.funcDelete[name].length; i++){
                this.funcDelete[name][i](data);
            }
        }
    }
};