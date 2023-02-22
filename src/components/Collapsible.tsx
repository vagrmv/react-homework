import { useToggle } from "../misc/Hooks";
import Blacklist from "./Blacklist";
import Settings from "./Settings";

export default function Collapsible() {
    const [isVisible, toggleVisibility] = useToggle(false);

    return (
        <div className='collapsible'>
            <button className='collapsible__btn' onClick={toggleVisibility}>Настройки</button>
            {isVisible && <div className='collapsible__box'>
                <Settings />
                <hr />
                <Blacklist />
            </div>}
        </div>
    );
}