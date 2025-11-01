
const Info = ({ info, titleFontSize }) => {
  return (
    <>
      {info.map((item, index) => (
        <div key={index}>
          <div style={{ fontSize: `${titleFontSize}px` }}>{item.infoTitle}</div>
          <div>{item.infoDescription}</div>
          {item.subInfo && (
            <Info info={item.subInfo} titleFontSize={titleFontSize - 4} />
          )}
        </div>
      ))}
    </>
  );
};

export default Info;
