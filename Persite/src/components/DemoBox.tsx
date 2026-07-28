type DemoBoxProps = {
  label?: string;
};

export default function DemoBox({
  label = '[ raytracer demo — under construction ]',
}: DemoBoxProps) {
  return (
    <div className="demo-box">
      <span className="demo-box-label">{label}</span>
    </div>
  );
}
