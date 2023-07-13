import "./Footer.css";

const Footer = () => {
  return (
    <div className="copyright">
      Copyright © {new Date().getFullYear()}{" "}
      <a
        href="https://mnit.ac.in/"
        target="_blank"
        rel="noreferrer"
        className="copyright-link"
      >
        DevDynamos
      </a>
    </div>
  );
};
export default Footer;
