export default function Bar({ barID, barEnabled, handleBarClick }) {
    const barSelected = () => barEnabled ? "selected" : "";

    return (
        <div className={`bar bar-${barID} ${barSelected()}`} onClick={handleBarClick}>
            {barID}
        </div>
    );
}