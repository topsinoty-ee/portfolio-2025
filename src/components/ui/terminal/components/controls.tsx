export function Controls() {
  return (
    <div className="flex gap-2">
      {["destructive", "secondary", "primary"].map((color) => (
        <div key={color} className={`size-3 rounded-full bg-${color}`} />
      ))}
    </div>
  );
}
