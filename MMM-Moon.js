Module.register("MMM-Moon", {
  defaults: {
    lat: 41.657,
    lon: 91.534,
    timezone: "America/Chicago",
    reloadInterval: 60 * 60 * 1000 // ms (1 hour)
  },
  content: "",

  start () {
    setInterval(() => {
      this.getContent();
    }, this.config.reloadInterval);
  },
  getDom () {
    const outerDiv = document.createElement("div");
    if (this.content) {
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
    const date = new Date().toLocaleDateString("en-CA", {timeZone: this.config.timezone});
    const url = "https://api.astronomyapi.com/api/v2/studio/moon-phase";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic MjAyNDY3ODAtNjU2MS00NGJkLWJhMTctNzliOGJlMzgxMjY2OjNlNzdjYjRjYjg1M2VjMDRjZDI2NzU3ZjEzM2M2YzE0NTBmNDE0NDJkMTFhYzFhNTE4ZTIwZTM1MThlNWFkZjQxZGIxYzU0YTc0NjBiOTdkNGQxMGE0NGYzMDYwNTAzZjAzNzcyMWRkNmIwYTQzZWRiZmVkNWJmNDY1ODRiNjA1N2U0ODhkMWUxNjNmZDg1OTlhMGUzNGI3MGI4M2I0YzhlMDQ5OGI1ZWFlNTUwYjI2NDg3ZWQ5ODEwMDJmNzViMTA1NzQwZTY3YjBkOTVhZjhkYmI5ODNjNDgxNDk5MDg0"
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
