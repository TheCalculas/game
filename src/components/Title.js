import "./Title.css";

// assets
import Mario from "../assets/cysec.gif";

const Title = () => {
  return (
    <div className="title-container">
      <img src={Mario} alt="" className="mario-logo" />
      <h1 className="title">CySec Jump</h1>
    </div>
  );
};
export default Title;
