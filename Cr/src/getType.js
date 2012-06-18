function getType(obj){
    var type = typeof obj;
    if(type === 'object'){
        if(obj===null) return 'null';
        else if(obj.window==obj) return 'window'; //window
        else if(obj.nodeName) return (obj.nodeName+'').replace('#',''); //document/element
        else if(!obj.constructor) return 'unknown';
        //to_s ΪObject.prototype.toString
        else return to_s.call(obj).slice(8,-1).toLowerCase();
    }
    return type;
}