import { useEffect, useRef, useState } from "react";
import images from "./data/images.json";
import "./css/App.css";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown, faEraser } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [currentImg, setCurrentImg] = useState(0);
  const [imageText, setImageText] = useState(images[currentImg].text);
  const textInputRef = useRef(null);

  useEffect(() => {
    resetImageText();
  }, [currentImg]);

  const handleChangeImage = (value) => {
    setCurrentImg(value);
  };

  const resetImageText = () => {
    setImageText(images[currentImg].text);
    textInputRef.current.value = images[currentImg].text;
  };

  const handleDownloadImage = () => {
    htmlToImage
      .toPng(document.getElementById("imageArea"))
      .then((dataUrl) => {
        download(dataUrl, `loa-meme-${Date.now()}.png`);
      })
      .catch(function (error) {
        console.error("다운로드 중 오류 발생", error);
      });
  };

  return (
    <div className="App">
      <div className="appTitle">로스트아크 짤 생성기</div>
      <div>&nbsp;</div>
      <div id="imageArea" className="imageArea">
        <img src={images[currentImg].src} width="720px" height="405px" />
        <div className="imageText">{imageText}</div>
      </div>
      <div>&nbsp;</div>
      <div className="optionArea">
        <Form.Select
          defaultValue={currentImg}
          onChange={(e) => handleChangeImage(e.target.value)}
        >
          {images.map((el, idx) => (
            <option key={idx} value={el.id}>
              {el.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          type="text"
          ref={textInputRef}
          defaultValue={imageText}
          onChange={(e) => setImageText(e.target.value)}
        />
        <Button variant="primary" onClick={() => handleDownloadImage()}>
          <FontAwesomeIcon icon={faCloudArrowDown} />
        </Button>
        <Button variant="danger" onClick={() => resetImageText()}>
          <FontAwesomeIcon icon={faEraser} />
        </Button>
      </div>
      <div className="appFooter">Made by 김뷰엘 with 💖</div>
    </div>
  );
}

export default App;
