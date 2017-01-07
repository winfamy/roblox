import request from "request";

class Catalog {
    constructor() {}

    getPage(data) {
        var parsed = '?';
        for(var i = 0; i < Object.keys(data).length; i++) 
            parsed += `&${Object.keys(data)[i]}=${data[Object.keys(data)[i]]}`;
        console.log(parsed);
    }

    getImage(asset_id) {
        return new Promise((resolve, reject) => {
            request.get(`https://www.roblox.com/thumbnail/asset?assetId=${asset_id}&thumbnailFormatId=254&width=420&height=420`, (err, resp, body) => {
                resolve( body.match(/class='' src='(.*)' \/>/)[1] );
            });
        });
    }
}

module.exports = Catalog;