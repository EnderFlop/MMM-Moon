Module.register("MMM-Moon", {
  defaults:{
    category: "Astronomy",
    appId: "",
    appSecret: "",
    lat: 41.657,
    lon: 91.534,
    timezone: "America/Chicago",
    reloadInterval: 60 * 60 * 1000 // ms (1 hour)
  },
  content:"",

  start () {
    setInterval(() => {
      this.getContent();
    }, this.config.reloadInterval);
  },
  getDom () {
    const outerDiv = document.createElement("div");
    if (this.config.appId == "" || this.config.appSecret == "") {  
      outerDiv.innerText = "MMM-Moon needs an appId and appSecret from AstronomyAPI. See the README."
    } else if (this.content) {
      const img = document.createElement("img");
      img.src = this.content;
      outerDiv.appendChild(img);
    } else {
      outerDiv.innerText = "MMM-Moon: No image!";
    }
    return outerDiv;
  },
  notificationReceived (notification) {
    if (notification === "ALL_MODULES_STARTED") {
      this.getContent();
    }
  },

  async getContent () {
    const auth = btoa(this.config.appId + ":" + this.config.appSecret) //base64 encoding AstronomyAPI appId and appSecret for the HTTP auth.
    const date = new Date().toLocaleDateString("en-CA", {timeZone: this.config.timezone});
    const url = "https://api.astronomyapi.com/api/v2/studio/moon-phase";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + auth
      },
      body: JSON.stringify({
        format: "png",
        style: {
          moonStyle: "default",

          backgroundStyle: "stars",
          backgroundColor: "white",
          headingColor: "white",
          textColor: "white"
        },
        observer: {
          latitude: this.config.lat,
          longitude: this.config.lon,
          date: date
        },
        view: {
          type: "portrait-simple"
        }
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const imageUrl = data.data.imageUrl;
      Log.log(`MMM-Moon: Returning imageUrl: ${imageUrl}`);

      this.content = imageUrl;
      this.updateDom(1000);
    } catch (error) {
      Log.error("MMM-Moon - Error:", error);
    }
  }

});
