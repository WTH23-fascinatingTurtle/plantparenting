import { Inter } from "next/font/google"
import axios from "axios"
import Head from 'next/head';
import { useEffect, useState } from "react"
import ToastMessage from "@/components/ToastMessage";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard({ plantKey }) {
    const [ plant, setPlant ] = useState({
        "name": "",
        "species": "",
        "hash": "",
        "realtime": [],
        "controls": {
            "light": false,
            "waterVol": 0
        }
    })
    const [ plantStatus, setPlantStatus ] = useState(['Hello this is a status test 0', 'Hello this is a status test 1', 'Hello this is a status test 2', 'Hello this is a status test 3', 'Hello this is a status test 4'])
    const [ toastMessage, setToastMessage ] = useState("")

    // Custom Control Variables
    const [ waterVol, setWaterVol ] = useState(0)

    // Data for Graph
    const [ graphTime, setGraphTime ] = useState([])
    const [ graphTemp, setGraphTemp ] = useState([])
    const [ graphHumid, setGraphHumid ] = useState([])
    const [ graphMoist, setGraphMoist ] = useState([])
    const [ graphLight, setGraphLight ] = useState([])

    let humid = {
        data: {
          labels: graphTime,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(231, 213, 203,1.0)",
            borderColor: "rgba(231, 213, 203,0.1)",
            data: graphHumid
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes: [{ticks: {min: (Math.min(...graphHumid)-500), max: (Math.max(...graphHumid)+500)}}],
          }
        }
      }
    
    let temp = {
        data: {
          labels: graphTime,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(231, 213, 203,1.0)",
            borderColor: "rgba(231, 213, 203,0.1)",
            data: graphTemp
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes: [{ticks: {min: (Math.min(...graphTemp)-5), max:(Math.max(...graphTemp)+5)}}],
          }
        }
      }

    let moist = {
        data: {
          labels: graphTime,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(231, 213, 203,1.0)",
            borderColor: "rgba(231, 213, 203,0.1)",
            data: graphMoist
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes: [{ticks: {min: (Math.min(...graphMoist)-500), max: (Math.max(...graphMoist)+500)}}],
          }
        }
      }

    let light = {
        data: {
          labels: graphTime,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(231, 213, 203,1.0)",
            borderColor: "rgba(231, 213, 203,0.1)",
            data: graphLight
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes: [{ticks: {min: (Math.min(...graphLight)-500), max: (Math.max(...graphLight)+500)}}],
          }
        }
      }

    useEffect(() => {
        const getData = async (plantKey) => {
            try {
                const response = await axios.get(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants?id=${plantKey}`)
                
                if (response.status === 200) {
                    setPlant(response.data.plants[0])
                    prepareGraphData()
                }
            } catch (err) {
                console.error(err)
            }
        }

        const getPlantStatus = () => {
            // TODO: Determine conditions for plant status
            setPlantStatus([]) // Reset the Status
            // TEMP!!!
            let temp = []
            for (let i = 0; i < 5; i++) {
                temp.push(`Hello this is a status test ${i}`)
            }
            setPlantStatus(temp)
        }

        getData(plantKey)
        // DEBUG: REMOVE LATER
        plant.realtime = [['Sat Aug 26 2023 21:41:34 GMT+0800 (Singapore Standard Time)',29.6,2076,1078,1276],['Sat Aug 26 2023 21:41:44 GMT+0800 (Singapore Standard Time)',31.7,1780,974,2016],['Sat Aug 26 2023 21:41:54 GMT+0800 (Singapore Standard Time)',28.7,1543,1256,2176],['Sat Aug 26 2023 21:42:04 GMT+0800 (Singapore Standard Time)',29.6,2276,978,1576],['Sat Aug 26 2023 21:42:14 GMT+0800 (Singapore Standard Time)',32.7,1690,994,816],['Sat Aug 26 2023 21:42:24 GMT+0800 (Singapore Standard Time)',31.4,1770,674,2365]]
        
        getPlantStatus()

        // TODO: Uncomment this later lol

        // const interval = setInterval(() => {
        //     getData(plantKey)
        // }, 5000)

        // return () => {
        //     clearInterval(interval);
        // };
    }, [])

    // Number Stepper Functions
    const incrementNum = (e) => {
        e.preventDefault()

        setWaterVol(waterVol + 1)
    }

    const decrementNum = (e) => {
        e.preventDefault()

        if (waterVol - 1 >= 0) {
            setWaterVol(waterVol - 1)
        } else {
            setWaterVol(0)
        }
    }

    const submitWaterVol = async (e) => {
        e.preventDefault()

        axios.put(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants`, {
            "id": plantKey,
            "update": {
                "controls": {
                    "volWater": waterVol,
                    "light": plant.controls.light
                }
            }
        }).then(function (res) {
            setToastMessage(`Adding ${waterVol}ml of water to ${plant.name}!`)
        })
    }

    const submitLight = async (e) => {
        e.preventDefault()

        plant.controls.light = !plant.controls.light
        axios.put(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants`, {
            "id": plantKey,
            "update": {
                "controls": {
                    "light": !plant.controls.light,
                    "volWater": plant.controls.volWater
                }
            }
        }).then(function (res) {
            if (plant.controls.light) {
                setToastMessage(`Turning the light on!`)
            } else {
                setToastMessage(`Turning the light off!`)
            }
        })
    }

    const dataFromToast = (data) => {
        setToastMessage(data)
    }

    // Prepare data for graph
    const prepareGraphData = () => {
        const data = plant.realtime
        let modifiedData = []

        // If the data is more than length 50 (5min max), get the last 5 mins only
        if (data.length > 50) {
            modifiedData = data.slice(-50)
        } else {
            modifiedData = data
        }

         // Reset data
        setGraphTime([])
        setGraphTemp([])
        setGraphHumid([])
        setGraphMoist([])
        setGraphLight([])
    
        let gTime = []
        let gTemp = []
        let gHumid = []
        let gMoist = []
        let gLight = []
        for (let i = 0; i < modifiedData.length; i++) {
            // [timestamp, temp, humidity, moisture, pH, light]

            // Set the Data
            gTime.push(modifiedData[i][0].split(" ")[4])
            gTemp.push(modifiedData[i][1])
            gHumid.push(modifiedData[i][2])
            gMoist.push(modifiedData[i][3])
            gLight.push(modifiedData[i][4])
        }
        setGraphTime(gTime)
        setGraphTemp(gTemp)
        setGraphHumid(gHumid)
        setGraphMoist(gMoist)
        setGraphLight(gLight)
    }

    return (
        <main className={`${inter.className} bg-backgroundred`}>
            <Head>
                <link rel="stylesheet" href="/styles.css" />
            </Head>
            {toastMessage !== "" ? <ToastMessage message={toastMessage} sendToParent={dataFromToast}/> : <></>}
            <div className="p-10">
                <div className="flex relative flex w-full flex-row pb-10">
                    <h1 className="text-title font-extrabold text-5xl">{plant.name}</h1>
                    <div className="ml-auto space-x-3">
                        <Link href="/settings">
                            <button className="bg-secondary rounded-lg">
                                <img src="/gear.png" alt="Settings" className="settings-icon p-2" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-rows-6 grid-flow-col gap-4">
                    {/* Plant Information */}
                    <div className="row-span-2 bg-primary shadow-md rounded-lg p-3">
                        <h2 className="font-bold text-2xl pb-2">Plant Status</h2>
                        {plantStatus.map((status) => (
                            <p key={status}>{status}</p>
                        ))}
                    </div>
                    <div className="row-span-2 bg-primary shadow-md rounded-lg p-3">
                        <h2 className="font-bold text-2xl pb-2">Manual Controls</h2>
                        <label className="relative inline-flex items-center mr-5 cursor-pointer pb-3">
                            <input type="checkbox" value="" className="sr-only peer" onChange={submitLight} checked={plant.controls.light} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-base font-medium text-white ">Light</span>
                        </label>
                        
                        <div className="custom-number-input w-32">
                            <label for="custom-input-number" className="w-full text-white text-base font-medium">Add Water (in ml)</label>
                            <div className="grid grid-rows-1 grid-flow-col gap-4">
                                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    <button data-action="decrement" className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none" onClick={decrementNum}>
                                        <span className="m-auto text-2xl font-thin">−</span>
                                    </button>
                                    <input type="number" className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none" name="custom-input-number" value={waterVol} onChange={(e) => {setWaterVol(int(e.target.value))}}></input>
                                    <button data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer" onClick={incrementNum}>
                                        <span className="m-auto text-2xl font-thin">+</span>
                                    </button>
                                </div>
                                <div className="row-span-2 mt-1">
                                    <button className="p-2 pr-4 pl-4 bg-secondary rounded-lg" onClick={submitWaterVol}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Graphs */}
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg max-w-xl p-2">
                        <Line options={temp.options} data={temp.data} />
                    </div>
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg max-w-xl p-2">
                        <Line options={humid.options} data={humid.data} />

                    </div>
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg max-w-xl p-2">
                        <Line options={light.options} data={light.data} />

                    </div>
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg max-w-xl p-2">
                        <Line options={moist.options} data={moist.data} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export async function getServerSideProps({ req, res }) {
    const plantKey = req.headers.cookie
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('plantKey='))
    ?.split('=')[1] || '';		
    if (plantKey === undefined) {
        console.error("Plant Key returned undefined");
    }

    return {
        props: {
            plantKey
        }
    }
}