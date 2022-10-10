import { useEffect, useState } from "react";

import Bars from "./Bars.js";
import Preview from "./Preview.js";

export default function Sequencer({ toneObject, toneTransport, tonePart }) {
    let initialSequence = [];

    for (let bar = 1; bar <= 16; bar++) {
        initialSequence.push({
            barID: bar,
            barEnabled: false,
            // barEnabled: bar % 2 === 1 ? true : false, // Pre-fill every second bar for testing
        });
    }

    const [sequence, setSequence] = useState(initialSequence);
    const [previewing, setPreviewing] = useState(false);

    useEffect(() => {
        tonePart.clear();
        toneTransport.cancel();

        sequence.filter(bar => bar.barEnabled).forEach(bar => {
            tonePart.add((bar.barID - 1) / 4, "C3"); // Plays an C note on 3rd octave 0.25s apart
        });

        toneTransport.schedule(time => {
            setPreviewing(false);
            console.log("Preview stopped automatically.");
        }, 16 / 4);
    });

    return (
        <>
            <div className="sequencer">
                <Bars
                    sequence={sequence}
                    setSequence={setSequence}
                    toneObject={toneObject}
                />
            </div>
            <h4>Play Multiple Bars From Sequence</h4>
            <p>
                <Preview
                    previewing={previewing}
                    setPreviewing={setPreviewing}
                    toneObject={toneObject}
                    toneTransport={toneTransport}
                />
            </p>
        </>
    );
}