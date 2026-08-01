// 모바일 FAB — 연필 아이콘 클릭 시 일정 입력
import './AddScheduleFab.css';

interface AddScheduleFabProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddScheduleFab({ onClick, disabled }: AddScheduleFabProps) {
  return (
    <button
      type="button"
      className="add-schedule-fab"
      onClick={onClick}
      disabled={disabled}
      aria-label="일정 추가"
    >
      <img src="/pencil-icon.png" alt="" className="fab-icon" />
    </button>
  );
}
