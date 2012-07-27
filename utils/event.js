
//****   EVENT INTERFACE ****//
/*var Event = function (sender) {
    this._sender = sender;
    this._listeners = [];
};*/

function Event(sender) {
    this._sender = sender;
    this._listeners = [];
};

 
Event.prototype = {
    addEventListener : function (listener) {
        return this._listeners.push(listener)-1; //return index of array
    },
    removeEventListener : function (index) {
    	this._listeners.splice(index,1);
    },
    /** Puesto por ralonso para el naranjoma, cambiar en el futuro **/
    attach : function (listener) {
        this._listeners.push(listener);
    },

    notify : function (args) {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](this._sender, args);
        }
    }
};
