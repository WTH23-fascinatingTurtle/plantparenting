# Plant Parenting
Created as part of the **SUTD What The Hack 2023 Hackathon**  
Developed by Ethan Chew, Alfred Kang, Emmanuel Rafol and Jerick Seng.

Link to the Hackathon Devpost: https://devpost.com/software/plantparenting


## Inspiration
We wanted to promote sustainability in Singapore and globally and decided to make it easier for homeowners to grow their own sustainable gardens. Many people want to own a mini garden at home but do not know how to care for their plants. Through their research online, they will try various methods to care for them, but in the process, they may waste resources and time and possibly kill the plant.

## What it does
PlantParenting uses a suite of sensors built into a plant pot, allowing real-time monitoring of the plant's statistics. It currently only supports auto plant watering and light as a prototype, but this would be expanded to other features like pH balancing. Now, statistics like light intensity, air moisture, humidity and temperature are captured by our sensor suite. However, as we expand out of the prototype stage, the number of parameters to be captured will be increased. In addition, we allow for real-time monitoring of the plant's parameters through a Web Application, allowing users to have manual control over their plant, for instance, watering it and increasing the light intensity from anywhere in the world. Additionally, the device will be able to adjust the adjust their catering protocols based on the location like avoiding watering the plant before a rainy weather and dispensing away excess water.

## How we built it
A suite of sensors (temperature, humidity, light intensity, soil moisture) are built into the plant pot. These sensors are connected to the ESP32 Microcontroller, which determines the conditions for auto-watering. The microcontroller uses the WiFi chip to upload the sensor data onto a MongoDB Database in real-time (every 5 seconds). As a prototype, a unique identifier is given to every plant pot to identify the user's plant. This unique identifier can be entered into our Web Application, which is built using Next.js and hosted on Vercel, where the user can view their plant's parameters from anywhere in the world. The backend application programming interface is created with express.js and hosted on Google Cloud Run.

## What's next for PlantParenting
In the future, PlantParenting will increase its suite of sensors to cover the soil's pH and more. More automated features will also be added, such as the auto-balancing of pH levels. We aim to design the plant pot better so that it does not look so bulky and aesthetically pleasing. Planned technologies like the touchscreen LCD panel will also be added to the pot for the user to view parameters and activate manual functions. We also aim to improve the user experience by adding onboarding features.

For the plans of scaling PlantParenting in to a business, we aim to make it affordable to the average Singaporean plant enthusiast and market it as a small and effective device capable of taking care of a plant for them. In a potential industrial scale, we can envision the product being a useful add on for vertical farm companies in Singapore to optimize plant growth and even use the data to make better produce and enable Singapore to be nation that is self-sufficient in feeding its own population

## Technologies Used
1. Web Application built using the MERN (MongoDB, Express.js, React.js, Next.js) Stack, hosted with Vercel and Google Cloud Run
2. ESP32-S3 Microcontroller and Sensor Suite (LDR, Moisture, Temperature and Humidity)
