Module.register("MMM-Moon", {
  defaults:{
    category: "Astronomy",
    lat: 41.657,
    lon: 91.534,
  },
  content:"",

  start: function() {},
  getDom: function() {
    var outerDiv = document.createElement("div")
    if (this.content) {
      var img = document.createElement("img")
      img.src = this.content
      outerDiv.appendChild(img)
    } else {
      outerDiv.innerText = "No image!"
    }
    return outerDiv
  },
  notificationReceived: function(notification, payload) {
    Log.log("notification recieved: " + notification)
    if (notification == "ALL_MODULES_STARTED") {
      this.sendSocketNotification("getcontent", this.config)
    }
  },
  socketNotificationReceived: function(notification, payload) {
    console.log("recieved socket notification: " + notification)
    if (notification == "node_data") {
      Log.log("data received back from helper")
      this.content = payload
      Log.log(payload)
      this.updateDom(1)
    }
  },
})