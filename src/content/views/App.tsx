export const App: React.FC = () => {
  function handleClick() {
    // document.body.style.opacity = "0";
  }

  return (
    <div className="fixed right-2 bottom-2">
      <button className="btn btn-info" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
};
