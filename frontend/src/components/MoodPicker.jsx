const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '🤔', label: 'Thinking' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🥳', label: 'Excited' },
    { emoji: '😰', label: 'Anxious' },
];

export default function MoodPicker({ selected, onSelect }) {
    return (
        <div className="mood-picker" id="mood-picker">
            {MOODS.map((mood) => (
                <button
                    key={mood.emoji}
                    type="button"
                    className={`mood-option ${selected === mood.emoji ? 'selected' : ''}`}
                    onClick={() => onSelect(mood.emoji)}
                    id={`mood-${mood.label.toLowerCase()}`}
                >
                    <span className="mood-emoji">{mood.emoji}</span>
                    {mood.label}
                </button>
            ))}
        </div>
    );
}
