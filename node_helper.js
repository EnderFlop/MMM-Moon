const http = require("https");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  init(){
		console.log("init module helper "+this.name);
	},

	start() {
		console.log(`Starting module helper: ${this.name}`);
	},

	stop(){
		console.log(`Stopping module helper: ${this.name}`);
  },

	socketNotificationReceived(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload
		}
		// module wants content from api
		else if(notification === "getcontent") {
			 this.getcontent(payload)
		}
  },

  getcontent(settings){
    let self = this
    const options = {
        "method": "POST",
        "hostname": "api.astronomyapi.com",
        "port": null,
        "path": "/api/v2/studio/moon-phase",
        "headers": {
          "Authorization": "Basic MjAyNDY3ODAtNjU2MS00NGJkLWJhMTctNzliOGJlMzgxMjY2OjNlNzdjYjRjYjg1M2VjMDRjZDI2NzU3ZjEzM2M2YzE0NTBmNDE0NDJkMTFhYzFhNTE4ZTIwZTM1MThlNWFkZjQxZGIxYzU0YTc0NjBiOTdkNGQxMGE0NGYzMDYwNTAzZjAzNzcyMWRkNmIwYTQzZWRiZmVkNWJmNDY1ODRiNjA1N2U0ODhkMWUxNjNmZDg1OTlhMGUzNGI3MGI4M2I0YzhlMDQ5OGI1ZWFlNTUwYjI2NDg3ZWQ5ODEwMDJmNzViMTA1NzQwZTY3YjBkOTVhZjhkYmI5ODNjNDgxNDk5MDg0"
        }
      };
      

    
    const req = http.request(options, function (res) {
      const chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const imageUrl = JSON.parse(body.toString())["data"]["imageUrl"];
        console.log(`returning imageUrl, ${imageUrl}`)
        self.sendSocketNotification("node_data", imageUrl)
        console.log("send complete")
      });
    });

    const d = new Date()
    const timezoneD = new Date(d.toLocaleDateString("en-US", {timeZone: settings.timezone}))
    const finalDate = timezoneD.getFullYear() + "-" + ("0" + (timezoneD.getMonth()+1)).slice(-2) + "-" + ("0" + timezoneD.getDate()).slice(-2)
    
    body = {
      "format": "png",
      "style": {
        "moonStyle": "default",

        "backgroundStyle": "stars",
        "backgroundColor": "white",
        "headingColor": "white",
        "textColor": "white"
      },
      "observer": {
        "latitude": settings.lat,
        "longitude": settings.lon,
        "date": finalDate
      },
      "view": {
        "type": "portrait-simple"
      }
    }
    
    req.write(JSON.stringify(body));
    req.end();
  },
})
