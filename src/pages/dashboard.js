import { Inter } from "next/font/google"
import axios from "axios"
import Head from 'next/head';
import { useEffect, useState } from "react"
import ToastMessage from "@/components/ToastMessage";

const inter = Inter({ subsets: ['latin'] })



export default function Dashboard({ plantKey }) {
    const [ plant, setPlant ] = useState({})
    const [ plantStatus, setPlantStatus ] = useState(['Hello this is a status test 0', 'Hello this is a status test 1', 'Hello this is a status test 2', 'Hello this is a status test 3', 'Hello this is a status test 4'])
    const [ toastMessage, setToastMessage ] = useState("")

    // Custom Control Variables
    const [ waterVol, setWaterVol ] = useState(0)
    const [ toggleLight, setToggleLight ] = useState(false)

    useEffect(() => {
        const getData = async (plantKey) => {
            try {
                const response = await axios.get(`https://plantparenting-o6blkvgghq-an.a.run.app/api/plants?id=${plantKey}`)

                if (response.status === 200) {
                    setPlant(response.data.plants[0])
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

    return (
        <div className={`h-full w-full absolute ${inter.className} bg-backgroundred`}>
            <Head>
                <link rel="stylesheet" href="/styles.css" />
            </Head>
            {toastMessage !== "" ? <ToastMessage message={toastMessage} sendToParent={dataFromToast}/> : <></>}
            <div className="p-10">
                <div className="flex relative flex w-full flex-row pb-10">
                    <h1 className="text-title font-extrabold text-5xl">{plant.name}</h1>
                    <div className="ml-auto space-x-3">
                        <button className="bg-secondary rounded-lg">
                            <img src="/gear.png" alt="Settings" className="settings-icon p-2" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-rows-4 grid-flow-col gap-4">
                    {/* Plant Information */}
                    <div className="row-span-2 bg-primary shadow-md rounded-lg p-3">
                        <h2 className="font-bold text-2xl pb-2">Plant Status</h2>
                        {plantStatus.map((status) => (
                            <p key={status}>{status}</p>
                        ))}
                    </div>
                    <div className="row-span-2 bg-primary shadow-md rounded-lg p-3">
                        <h2 className="font-bold text-2xl pb-2">Manual Controls</h2>
                        <label class="relative inline-flex items-center mr-5 cursor-pointer pb-3">
                            <input type="checkbox" value="" class="sr-only peer" onChange={submitLight} checked={plant.controls.light} />
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            <span class="ml-3 text-base font-medium text-white ">Light</span>
                        </label>
                        
                        <div class="custom-number-input w-32">
                            <label for="custom-input-number" class="w-full text-white text-base font-medium">Add Water (in ml)</label>
                            <div className="grid grid-rows-1 grid-flow-col gap-4">
                                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    <button data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none" onClick={decrementNum}>
                                        <span class="m-auto text-2xl font-thin">−</span>
                                    </button>
                                    <input type="number" class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none" name="custom-input-number" value={waterVol} onChange={(e) => {setWaterVol(int(e.target.value))}}></input>
                                    <button data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer" onClick={incrementNum}>
                                        <span class="m-auto text-2xl font-thin">+</span>
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
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg">

                    </div>
                    <div className="row-span-2 col-span-2 bg-primary shadow-md rounded-lg">

                    </div>
                </div>
            </div>
        </div>
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