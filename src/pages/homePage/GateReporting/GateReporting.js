import React, { useEffect, useState } from 'react';
import './GateReporting.css';

const GateReporting = () => {

    const [truckId, setTruckId] = useState('');
    const [entryTime, setEntryTime] = useState('');

    useEffect(() => {
        // Fetch truck number data
        fetchTruckNumbers();

        // Fetch entry time data
        fetchEntryTime();
    }, []);

    const fetchTruckNumbers = async () => {
        try {
            const response = await fetch(
                'http://43.205.91.117:8000/api/trucks_inside/',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer <your-token>', // Replace <your-token> with the actual token
                    },
                }
            );
            const data = await response.json();
            const truckId = data.trucks_inside[0].truck_id;
            setTruckId(truckId);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEntryTime = async () => {
        try {
            const response = await fetch(
                'http://43.205.91.117:8000/api/trucks_inside/',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer <your-token>', // Replace <your-token> with the actual token
                    },
                }
            );
            const data = await response.json();
            const entryTime = data.trucks_inside[0].entry_time;
            setEntryTime(entryTime);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="wrapper">
                <center>
                    <img
                        src="https://mybucketwarehouse.s3.ap-south-1.amazonaws.com/logo.jpg"
                        width="70%"
                        height="70%"
                        className="cl1"
                    />
                </center>

                <center>
                    <h1>Gate Reporting</h1>
                </center>

                <div className="gfg">
                    <h3 className="oval">
                        <br />
                        Truck Number:
                        <div id="truck-id">{truckId}</div>
                        <br />
                        <br />
                        <div id="entry-time">{entryTime}</div>
                        <br />
                        <br />
                    </h3>
                    <center>
                        <center>
                            <h1>Gate In Status</h1>
                        </center>
                        <div className="gfg">
                            <h3 className="oval">
                                <br />
                                Sent to TMS for approval
                                <br />
                            </h3>
                        </div>

                        <a href="trucksinside.html">
                            <button className="button">Submit</button>
                        </a>
                    </center>
                </div>
            </div>
        </>
    );
}

export default GateReporting;