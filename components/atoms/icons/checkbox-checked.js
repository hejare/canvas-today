import theSvg from "../svgs/checkbox-checked.svg";

console.log(theSvg);
// eslint-disable-next-line @next/next/no-img-element
const CheckboxChecked = () => <img src={theSvg.src} alt="Checked" />;

export default CheckboxChecked;
