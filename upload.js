import request from "request";
import fs from "fs";
import conv from "binstring";
import zlib from "zlib";

class UploadManager {
    constructor(r) {
        this.ROBLOX = r;
    }
    
    get_decal(asset_id) {
        return new Promise((resolve, reject) => {
            var gunzip = zlib.createGunzip();
            var buffer = [];
            var image = fs.createWriteStream(`clothes/${asset_id}`);
            var stream = request.get(`https://www.roblox.com/asset/?id=${asset_id}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0',
                    'Host': 'www.roblox.com',
                    'Cookie': 'RBXEventTrackerV2=CreateDate=1/1/2017 5:34:23 PM&rbxid=183092079&browserid=5755051723; GuestData=UserID=-368115110; RBXMarketing=FirstHomePageVisit=1; __utma=200924205.549727097.1480054580.1483308015.1483310135.11; __utmz=200924205.1483297425.9.6.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __gads=ID=3484ca990ebe0c35:T=1480054786:S=ALNI_MZ5Uhqli20zqKRH9cp_9cmWDhZFGw; RBXSource=rbx_acquisition_time=12/27/2016 4:13:48 PM&rbx_acquisition_referrer=&rbx_medium=Direct&rbx_source=&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1;',
                    'Upgrade-Insecure-Requests': "1",
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': "gzip, deflate, br",
                    'Connection': "keep-alive"
                }
            }).pipe( gunzip );

            gunzip.on('data', (data) => {
                buffer.push(data.toString());
            });
            gunzip.on('end', () => {
                var string = buffer.join('');
                var id = string.split('?id=')[1].split('</url>')[0];
                resolve(id);
            });
        });
    }

    download(asset_id) {
        return new Promise((resolve, reject) => {
            var gunzip = zlib.createGunzip();
            var buffer = [];
            var image = fs.createWriteStream(`clothes/${asset_id}.png`);
            var stream = request.get(`https://www.roblox.com/asset/?id=${asset_id}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0',
                    'Host': 'www.roblox.com',
                    'Cookie': 'RBXEventTrackerV2=CreateDate=1/1/2017 5:34:23 PM&rbxid=183092079&browserid=5755051723; GuestData=UserID=-368115110; RBXMarketing=FirstHomePageVisit=1; __utma=200924205.549727097.1480054580.1483308015.1483310135.11; __utmz=200924205.1483297425.9.6.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __gads=ID=3484ca990ebe0c35:T=1480054786:S=ALNI_MZ5Uhqli20zqKRH9cp_9cmWDhZFGw; RBXSource=rbx_acquisition_time=12/27/2016 4:13:48 PM&rbx_acquisition_referrer=&rbx_medium=Direct&rbx_source=&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1;',
                    'Upgrade-Insecure-Requests': "1",
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': "gzip, deflate, br",
                    'Connection': "keep-alive"
                }
            }).pipe( gunzip );

            gunzip.on('data', (data) => {
                image.write(data);
            });
            gunzip.on('end', () => {
                console.log(image.toString());
            });
        });      
    }

    upload(asset_id, group_id) {
        request.get('https://www.roblox.com/my/groups.aspx', {
            jar: this.ROBLOX.jar
        }, (err, resp, body) => {
            //console.log(body.split('name="__RequestVerificationToken" type="hidden" value="'));
            var RV = body.split('name="__RequestVerificationToken" type="hidden" value="')[1].split('"')[0];
            var data = {
                __RequestVerificationToken: RV,
                assetTypeId: 11,
                isOggUploadEnabled: 'True',
                groupId: 2721638,
                onVerificationPage: 'False',
                file: fs.createReadStream(__dirname + `/../clothes/${asset_id}.png`),
                name: 'Just a random tshirt'
            };
            var req = request.post({
                url: 'https://www.roblox.com/build/upload',
                formData: data,
                jar: this.ROBLOX.jar
            }, function(err, resp, body) {
                console.log(err);
                console.log(resp.statusCode);
            });
        });
        //var form = request.form();
    }
}

module.exports = UploadManager;