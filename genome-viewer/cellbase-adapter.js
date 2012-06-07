function CellBaseAdapter(args){
	this.host = null;
	this.gzip = true;
	
	if (args != null){
		if(args.host != null){
			this.host = args.host;
		}
		if(args.species != null){
			this.species = args.species;
		}
		if(args.category != null){
			this.category = args.category;
		}
		if(args.subCategory != null){
			this.subCategory = args.subCategory;
		}
		if(args.resource != null){
			this.resource = args.resource;
		}
		if(args.featureCache != null){
			var argsFeatureCache = args.featureCache;
		}
	}
	this.featureCache =  new FeatureCache(argsFeatureCache);
	this.onGetData = new Event();
};

CellBaseAdapter.prototype.getData = function(region){
	var _this = this;

	var firstChunk = this.featureCache._getChunk(region.start);
	var lastChunk = this.featureCache._getChunk(region.end);
	var cellBaseManager = new CellBaseManager(this.species,{host: this.host});

	cellBaseManager.success.addEventListener(function(sender,data){
		var queryList = [];
//		console.log(data.query.length);
		for(var i = 0; i < data.query.length; i++) {
			var splitDots = data.query[i].split(":");
			var splitDash = splitDots[1].split("-");
			queryList.push({chromosome:splitDots[0],start:splitDash[0],end:splitDash[1]});
		}
//		console.log(_this.featureCache.cache);


		for(var i = 0; i < data.result.length; i++) {
			_this.featureCache.putChunk(data.result[i], queryList[i]);
			var key = queryList[i].chromosome+":"+_this.featureCache._getChunk(queryList[i].start);
			_this.onGetData.notify(_this.featureCache.getFeaturesByChunk(key));
		}
	});

	var querys = [];
	for(var i=firstChunk; i<=lastChunk; i++){
		var key = region.chromosome+":"+i;
		if(this.featureCache.cache[key] == null) {
			var chunkStart = parseInt(i * this.featureCache.chunkSize);
			var chunkEnd = parseInt((i * this.featureCache.chunkSize) + this.featureCache.chunkSize-1);
			var query = region.chromosome+":"+chunkStart+"-"+chunkEnd;
			querys.push(query);
		}else{
			this.onGetData.notify(this.featureCache.getFeaturesByChunk(key));
		}
	}

	if(querys.length > 0){
		cellBaseManager.get(this.category, this.subCategory, querys, this.resource);
	}
};

//CellBaseAdapter.prototype.getDataOLD = function(region){
	//var _this = this;
	//
	//var features = _this.featureCache.get(region, true);
	//
	//if(features == null){
		//var cellBaseManager = new CellBaseManager(this.species,{host: this.host});
		//cellBaseManager.success.addEventListener(function(sender,data){
//			check if is an array of arrays or an array of objects
			//if(data.length > 0){
				//if(data[0].constructor == Object){ 
					//_this.featureCache.put(data,region);
				//}
				//else{
					//for(var i = 0; i < data.length; i++) {
						//_this.featureCache.put(data[i],region);
					//}
				//}
			//}else{
				//_this.featureCache.put(data,region);
			//}
			//_this.onGetData.notify(_this.featureCache.get(region, true));
		//});
//
//
		//var chunkRegion = this.featureCache.getChunkRegion(region);
		//var query = region.chromosome+":"+chunkRegion.start+"-"+chunkRegion.end;
//		var query = region.chromosome+":"+region.start+"-"+region.end;
		//cellBaseManager.get(this.category, this.subCategory, query, this.resource);
		//
	//}else{
//		_this.onGetData.notify(features);
	//}
//};
