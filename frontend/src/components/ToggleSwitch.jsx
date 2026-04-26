export default function ToggleSwitch({ checked, onChange, label, id = 'toggle-public' }) {
    return (
        <div className="toggle-container">
            <span className="toggle-label">{label || (checked ? '🌍 Public' : '🔒 Private')}</span>
            <label className="toggle-switch" id={id}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
            </label>
        </div>
    );
}
