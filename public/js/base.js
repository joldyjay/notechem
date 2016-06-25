var jsonServ = {
	send: function(o){
		var self = {};
		this.url = o.url;
		this.para = o.para;
		this.para['rad'] = Math.random();

		/*for(var key in this.para) {
			alert(key + ':' + this.para[key]);
		}*/
		if(o.type) {
			$.ajax({
				url: this.url,
				type: 'post',
				data: this.para,
				cache: false,
				dataType: 'json',
				success: function(data){
					o.callback(eval('(' + data + ')'));
				},
				error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);  
                }
			});
		}else {
			$.ajax({
				url: this.url,
				type: 'get',
				data: this.para,
				cache: false,
				dataType: 'json',
				success: function(data){
					if(data == '' || data == null) {
						data = '{message:"无法查询到数据"}';
					}
					o.callback(eval('(' + data + ')'));
				},
				error: function(jqXHR, textStatus, errorThrown){
                    alert('error ' + textStatus + " " + errorThrown);
                }
			});
		}
	}
};
var removeNull = function(obj) {
	if(obj == null || obj == 'null') {
		return '';
	}else {
		return obj;
	}
};

var concatStr = function(obj, anotherobj, str) {
	var r;
	if(obj == null || anotherobj == null) {
		r = this.removeNull(obj) + this.removeNull(anotherobj);
	}else {
		r = obj + str + anotherobj;
	}
	return r;
}

var strTrim = function(value) {
	return value.replace(/(^\s*)|(\s*$)/g, "");
}