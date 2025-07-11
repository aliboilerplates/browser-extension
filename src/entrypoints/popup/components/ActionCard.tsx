type ActionCardProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
};

export const ActionCard = ({
  label,
  icon,
  onClick,
  color,
}: ActionCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-3 shadow-md text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 ${color}`}
    >
      <div className="bg-white bg-opacity-20 p-2 rounded-full">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
