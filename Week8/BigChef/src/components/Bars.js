import Bar from "./Bar.js";

import { guitar } from "../data/instruments.js";

export default function Bars({ sequence, setSequence, toneObject }) {
    function sortSequence(bar, otherBar) {
        if (bar.barID < otherBar.barID) {
            return -1;
        }
        if (bar.barID > otherBar.barID) {
            return 1;
        }
        return 0;
    }

    function handleBarClick(bar) {
        const now = toneObject.now();
        guitar.triggerAttackRelease("C3", "8n", now);
        let filteredSequence = sequence.filter((_bar) => _bar.barID !== bar.barID);
        setSequence([...filteredSequence, { ...bar, barEnabled: !bar.barEnabled }]);
    }

    return sequence.sort(sortSequence).map(bar => (
        <Bar key={bar.barID} {...bar} handleBarClick={() => handleBarClick(bar)} />
    ));
}