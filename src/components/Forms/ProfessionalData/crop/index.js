import React, {useState, useRef, useCallback, useEffect} from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
import styled from 'styled-components';
import { ButtonForm } from '../../../Dashboard/Components/Form/comp';
import { ModalNormal } from '../../../Modal/Modal';
import { useUploadSignature } from '../../../../services/hooks/set/useUploadSignature';
import { useAuth } from '../../../../context/AuthContext';


const Input = styled.input`
  margin-right: auto;
  width: 100%;
  margin: 0px 10px 10px 0;
  padding: 20px;
  border: 2px dashed ${({ theme }) => theme.palette.background.line};
  border-radius: 10px;
`;

export function CropSignature({ setSignatureURL, cropRef, handleOnClose, open}) {

  const cropConfig =  {
    unit: 'px', // default, can be 'px' or '%'
    x: 0,
    y: 0,
    height: 60,
    width: 200,
  }
  const { currentUser } = useAuth()

  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState(cropConfig);
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  // const [signatureFile, setSignatureFile] = useState(null);

  const uploadSignature = useUploadSignature()


  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const onCropChange = (newCrop) => {
    cropRef.current = newCrop
    setCrop(newCrop)
  }

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  // const handleCroppedImage = async () => {
  //   const croppedImg = await getCroppedImg(image, crop, fileName);
  //   console.log(croppedImg)
  // }

// const src = 'https://firebasestorage.googleapis.com/v0/b/reconecta-dev.appspot.com/o/profile%2F7qxxF86PE1W1AzK4xzIEB5jLyhE3?alt=media&token=45926c3e-2f2b-4fe1-8065-3812c83a005c';

  // const imageStyle = {
  //   objectFit: 'cover',
  //   // height:60,
  // }

  // const onInputFileChange = async (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     if (event.target.files[0].size > 2 * 10 ** 6)
  //       return notification.error({
  //         message: 'Sua imagem não pode ser maior que 2 MB',
  //       });

  //       // const url = await uploadSignature.mutateAsync({
  //       //   imageFile:event.target.files[0],
  //       //   id:currentUser.uid
  //       // });

  //       // setSignatureURL(url)
  //       setSignatureFile(event.target.files[0])
  //   }
  // };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onClose = () => {
    handleOnClose()
    imgRef.current = null;
    previewCanvasRef.current = null;
    setCrop(cropConfig)
    setCompletedCrop(null)
    setUpImg('')
  };

  async function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(
      async (blob) => {
        // const previewUrl = window.URL.createObjectURL(blob);
        // console.log(`previewUrl`, previewUrl)
        // const anchor = document.createElement('a');
        // anchor.download = 'cropPreview.png';
        // anchor.href = URL.createObjectURL(blob);
        // anchor.click();

        // window.URL.revokeObjectURL(previewUrl);
        const url = await uploadSignature.mutateAsync({
          imageFile:blob,
          id:currentUser.uid
        });

        setSignatureURL(url)
        onClose()
      },
      'image/png',
      1
    );
  }


  return(
    <ModalNormal
      open={open}
      onClose={onClose}
      title="Adicionar Assinatura"
      padding={false}
      icon={false}
    >
      {/* <div style={{display:'flex',width:'100%',}}>
        <button
          type="button"
          disabled={!completedCrop?.width || !completedCrop?.height}
          onClick={() =>
            generateDownload(previewCanvasRef.current, completedCrop)
          }
        >
          Download cropped image
        </button>
      </div> */}
      <div style={{display:'flex',width:'100%',minWidth:450,marginBottom:10}}>
        <ReactCrop
          src={upImg?upImg:''}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={newCrop => onCropChange(newCrop)}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />
      </div>
      <Input
        accept="image/*"
        type="file"
        id="avatar"
        onChange={onSelectFile}
      />
      <div style={{display:'flex',width:'100%',display:'none'}}>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0)
          }}
        />
      </div>
      <div style={{ width: '100%' }}>
          <ButtonForm
            primary
            type="submit"
            loading={uploadSignature.isLoading}
            onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}
          >
          Adicionar
        </ButtonForm>
      </div>
    </ModalNormal>
  )
}
