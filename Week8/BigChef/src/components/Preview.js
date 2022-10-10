export default function Preview({ previewing, setPreviewing, toneObject, toneTransport }) {
    function handleButtonClick() {
        toneObject.start();
        toneTransport.stop();

        if (previewing) {
            setPreviewing(false);
            console.log("Preview stopped manually.");
        } else {
            setPreviewing(true);
            console.log("Preview started.");
            toneTransport.start();
        }
    }

    return <button onClick={handleButtonClick}>{previewing ? "Stop Previewing" : "Preview"}</button>;
}