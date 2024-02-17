const http = require("http");
const fs = require("fs");
const request = require("requests");

const indexTemplate = fs.readFileSync("index.html", "utf-8");
const styleCss = fs.readFileSync("style.css", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
  
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    request(
      // "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=6294ea19523bdfdab1550ca1935915d5"
      "https://api.openweathermap.org/data/2.5/weather?q=Noida,IN&units=metric&appid=6294ea19523bdfdab1550ca1935915d5"
   
      )  
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        console.log(arrData);
        const realTimeData = arrData
          .map((val) => replaceVal(indexTemplate, val))
          .join("");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
      })
      .on("end", () => {
        // End the response when the data is fully received
        res.end();
      })
      .on("error", (err) => {
        console.error("Error in request:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      });
  } else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(styleCss);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 2000;
const HOST = "127.0.0.1";

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}/`);
});
