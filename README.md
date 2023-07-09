
# MMM-Moon

Display a picture of the current moon phase along with moonrise and moonset times on your MagicMirror²!

## How it works

Add the module to your MagicMirror² like any other module, then add the "lat", "lon", and "timezone" parameters to your configuration file! The app calls the AstronomyAPI and gets an image with your parameters, then throws it onto your mirror!

## Screenshots

![Sample Picture One](./imgs/moon_pic1.png)

## Preconditions

* MagicMirror² instance
* Node.js version >= 19
* npm

## Installation

Just clone the module into your MagicMirror’s modules folder:

```bash
git clone https://github.com/EnderFlop/MMM-Moon
cd MMM-Moon
```

## Updating

Updating is as easy as navigating to the module’s folder, pull the latest version from GitHub and install.

```bash
git pull
```

## Configuration

| Option | Description |
| ------ | ----------- |
| `lat` | The latitude of your location<br>**Type:** `number`<br>**Example:** `20.545`<br>**Default value:** `41.657` <br>|
| `lon` | The longitude of your location<br>**Type:** `number`<br>**Example:** `-67.420`<br>**Default value:** `91.534` <br>|
| `timezone` | Your timezone in TZ database format<br>**Type:** `string` <br>**Example:** `Europe/Paris` <br>**Default value:** `America/Chicago`<br>**Note:** You can find a [list of all TZ timezones here.](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

Here is an example for an entry in `config.js`:

```js
    {
      module: "MMM-Moon",
      position: "top_left",
      config: {
        lat: 20.545,
        lon: -67.420,
        timezone: "Europe/Paris"
      }
    },
```
