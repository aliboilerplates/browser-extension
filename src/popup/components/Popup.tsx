import { Button } from "@/components/ui/button";

export const Popup: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-red-700">
        Hello, Chrome Extension!
        <Button className="cursor-pointer">Click Me</Button>
      </h1>
    </div>
  );
};
