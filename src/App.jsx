import { useEffect, useRef, useState } from "react";
import images from "./data/images.json";
import "./css/App.css";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { Alert, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown, faEraser } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [currentImg, setCurrentImg] = useState(0);
  const [textChanged, setTextChanged] = useState(false);
  const [imageText, setImageText] = useState(images[currentImg].text);
  const [showAlert, setShowAlert] = useState(false);
  const [alertErrorText, setErrorText] = useState(null);
  const imageAreaRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    return handleAlert(false);
  }, []);

  const handleChangeImage = (value) => {
    setCurrentImg(value);
    if (!textChanged) {
      setImageText(images[value].text);
      textInputRef.current.value = images[value].text;
    }
  };

  const handleChangeText = (text) => {
    setImageText(text);
    setTextChanged(true);
  };

  const resetImageText = () => {
    setImageText(images[currentImg].text);
    textInputRef.current.value = images[currentImg].text;
    setTextChanged(false);
  };

  const handleDownloadImage = () => {
    if (imageText.length > 0) {
      htmlToImage
        .toPng(imageAreaRef.current)
        .then((dataUrl) => {
          download(dataUrl, `loa-meme-${Date.now()}.png`);
        })
        .catch(function (error) {
          handleAlert(
            true,
            `이미지 다운로드 중 오류가 발생하였습니다.\n${error}`
          );
          setTimeout(() => {
            handleAlert(false);
          }, "3000");
        });
    } else {
      handleAlert(true, "텍스트를 입력해주세요.");
      setTimeout(() => {
        handleAlert(false);
      }, "3000");
    }
  };

  const handleAlert = (boolean, text) => {
    setShowAlert(boolean);
    if (boolean) {
      setErrorText(text);
    } else {
      setErrorText(null);
    }
  };

  const ErrorAlert = () => {
    return (
      <Alert
        variant="danger"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
        onClose={() => setShowAlert(false)}
        dismissible
      >
        {alertErrorText}
      </Alert>
    );
  };

  return (
    <div className="appMain">
      {showAlert ? <ErrorAlert /> : null}
      <div className="appTitle">로스트아크 짤 생성기</div>
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
      </div>
      <div ref={imageAreaRef} className="imageArea">
        <img src={images[currentImg].src} />
        <div className="imageText">{imageText}</div>
      </div>
      <div className="optionArea">
        <div className="optionInput">
          <div className="optionLabel">텍스트 입력</div>
          <div className="optionText">
            <Form.Control
              type="text"
              ref={textInputRef}
              defaultValue={imageText}
              onChange={(e) => handleChangeText(e.target.value)}
            />
          </div>
        </div>
        <div className="buttonArea">
          <Button variant="primary" onClick={() => handleDownloadImage()}>
            <FontAwesomeIcon icon={faCloudArrowDown} />
            &nbsp;다운로드
          </Button>
          <Button variant="danger" onClick={() => resetImageText()}>
            <FontAwesomeIcon icon={faEraser} />
            &nbsp;내용 초기화
          </Button>
        </div>
      </div>
      <div className="appFooter">Made by 김뷰엘 with 💖</div>
    </div>
  );
}

export default App;
